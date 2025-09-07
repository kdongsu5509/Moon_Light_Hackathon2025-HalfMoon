package com.halfmoon.halfmoon.global.filter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Enumeration;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

@Slf4j
@Component
@Order(Integer.MIN_VALUE) // 가능한 앞단에서 실행
public class LogFilter implements Filter {

    private static final String TRACE_ID_KEY = "traceId";
    private static final int MAX_BODY_LOG_LENGTH = 10_000; // 로그에 찍을 최대 바이트/문자 수
    private static final boolean USE_COLOR = true;          // 콘솔 색상 사용 여부

    // 색상 코드
    private static final String RESET = "\u001B[0m";
    private static final String DIM = "\u001B[2m";
    private static final String CYAN = "\u001B[36m";
    private static final String GREEN = "\u001B[32m";
    private static final String YELLOW = "\u001B[33m";
    private static final String RED = "\u001B[31m";
    private static final String BLUE = "\u001B[34m";
    private static final String MAGENTA = "\u001B[35m";

    private static final Set<String> SENSITIVE_HEADERS = Set.of(
            "authorization", "cookie", "set-cookie", "x-api-key"
    );

    private static final ObjectMapper PRETTY_MAPPER = new ObjectMapper()
            .enable(SerializationFeature.INDENT_OUTPUT);

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        String traceId = Optional.ofNullable(MDC.get(TRACE_ID_KEY))
                .orElse(UUID.randomUUID().toString());
        MDC.put(TRACE_ID_KEY, traceId);

        ContentCachingRequestWrapper request = new ContentCachingRequestWrapper((HttpServletRequest) req);
        ContentCachingResponseWrapper response = new ContentCachingResponseWrapper((HttpServletResponse) res);

        long start = System.currentTimeMillis();
        try {
            chain.doFilter(request, response);
        } finally {
            long duration = System.currentTimeMillis() - start;
            try {
                // 요청/응답 로그는 body 캐시가 채워진 뒤(= chain 이후)에 찍어야 함
                logExchange(request, response, duration);
            } catch (Exception e) {
                log.warn("Failed to log request/response", e);
            } finally {
                response.copyBodyToResponse(); // 응답 바디 복사 필수
                MDC.remove(TRACE_ID_KEY);
            }
        }
    }

    private void logExchange(ContentCachingRequestWrapper request,
                             ContentCachingResponseWrapper response,
                             long durationMs) {

        String traceId = MDC.get(TRACE_ID_KEY);
        String method = request.getMethod();
        String uriWithQuery = buildUriWithQuery(request);

        String clientIp = getClientIp(request);
        String userAgent = Optional.ofNullable(request.getHeader("User-Agent")).orElse("-");
        String contentTypeReq = Optional.ofNullable(request.getContentType()).orElse("-");
        String contentTypeRes = Optional.ofNullable(response.getContentType()).orElse("-");

        String reqHeaders = headersToMultiline(request);
        String resHeaders = headersToMultiline(response);

        String bodyReq = readableBody(request.getContentAsByteArray(), safeCharset(request.getCharacterEncoding()));
        String bodyRes = readableBody(response.getContentAsByteArray(), safeCharset(response.getCharacterEncoding()));

        bodyReq = prettyIfJson(bodyReq, contentTypeReq);
        bodyRes = prettyIfJson(bodyRes, contentTypeRes);

        String statusColored = colorForStatus(response.getStatus(), String.valueOf(response.getStatus()));
        String durationStr = durationMs + " ms";

        String titleReq = colorize("📥 REQUEST", CYAN);
        String titleRes = colorize("📤 RESPONSE", GREEN);
        String now = ZonedDateTime.now().toString();

        String block =
                "\n========================= " + titleReq + " =========================" +
                        "\n" + label("TraceId") + traceId +
                        "\n" + label("When") + now +
                        "\n" + label("Remote") + clientIp +
                        "\n" + label("Method") + method +
                        "\n" + label("URI   ") + uriWithQuery +
                        "\n" + label("UA    ") + userAgent +
                        "\n" + label("CT    ") + contentTypeReq +
                        "\n" + label("Headers") + indent(reqHeaders) +
                        "\n" + label("Body   ") + indent(limit(bodyReq)) +
                        "\n---------------------------------------------------------------------" +
                        "\n========================= " + titleRes + " =========================" +
                        "\n" + label("TraceId") + traceId +
                        "\n" + label("Status") + statusColored +
                        "\n" + label("Time  ") + colorize(durationStr, MAGENTA) +
                        "\n" + label("CT    ") + contentTypeRes +
                        "\n" + label("Headers") + indent(resHeaders) +
                        "\n" + label("Body   ") + indent(limit(bodyRes)) +
                        "\n=====================================================================\n";

        log.info(block);
    }

    // ----- Helpers -----

    private String buildUriWithQuery(HttpServletRequest request) {
        String uri = request.getRequestURI();
        String query = request.getQueryString();
        if (query == null || query.isBlank()) {
            return uri;
        }
        return uri + "?" + query;
    }

    private String getClientIp(HttpServletRequest request) {
        String xff = request.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isBlank()) {
            // XFF는 "client, proxy1, proxy2" 형태
            return xff.split(",")[0].trim();
        }
        String realIp = request.getHeader("X-Real-IP");
        if (realIp != null && !realIp.isBlank()) {
            return realIp;
        }
        return request.getRemoteAddr();
    }

    private String headersToMultiline(HttpServletRequest request) {
        List<String> names = Collections.list(request.getHeaderNames());
        Collections.sort(names, String.CASE_INSENSITIVE_ORDER);
        return names.stream()
                .map(n -> n + ": " + maskIfSensitive(n, combineHeaderValues(request.getHeaders(n))))
                .collect(Collectors.joining("\n"));
    }

    private String headersToMultiline(HttpServletResponse response) {
        List<String> names = new ArrayList<>(response.getHeaderNames());
        Collections.sort(names, String.CASE_INSENSITIVE_ORDER);
        return names.stream()
                .map(n -> n + ": " + maskIfSensitive(n, String.join(", ", response.getHeaders(n))))
                .collect(Collectors.joining("\n"));
    }

    private String combineHeaderValues(Enumeration<String> values) {
        List<String> list = Collections.list(values);
        return String.join(", ", list);
    }

    private String maskIfSensitive(String headerName, String value) {
        if (headerName == null) {
            return value;
        }
        if (SENSITIVE_HEADERS.contains(headerName.toLowerCase(Locale.ROOT))) {
            return "***";
        }
        return value;
    }

    private String readableBody(byte[] content, String charset) {
        if (content == null || content.length == 0) {
            return "empty";
        }
        // 바이너리 가능성 간단 체크
        int nonPrintable = 0;
        for (int i = 0; i < Math.min(content.length, 512); i++) {
            byte b = content[i];
            if (b < 0x09) {
                nonPrintable++;
            }
        }
        if (nonPrintable > 10) {
            return "(binary or non-comment content)";
        }
        try {
            return new String(content, charset);
        } catch (UnsupportedEncodingException e) {
            return "(encoding error: " + charset + ")";
        }
    }

    private String safeCharset(String enc) {
        if (enc == null || enc.isBlank()) {
            return "UTF-8";
        }
        return enc;
    }

    private String limit(String text) {
        if (text == null) {
            return "empty";
        }
        if (text.length() <= MAX_BODY_LOG_LENGTH) {
            return text;
        }
        return text.substring(0, MAX_BODY_LOG_LENGTH) + "\n...(truncated " + (text.length() - MAX_BODY_LOG_LENGTH)
                + " chars)";
    }

    private String label(String key) {
        String k = switch (key) {
            case "TraceId" -> "▶ TraceId : ";
            case "When" -> "▶ When   : ";
            case "Remote" -> "▶ Remote : ";
            case "Method" -> "▶ Method : ";
            case "URI   " -> "▶ URI    : ";
            case "UA    " -> "▶ Agent  : ";
            case "CT    " -> "▶ CType  : ";
            case "Headers" -> "▶ Headers:";
            case "Body   " -> "▶ Body   :";
            case "Status" -> "▶ Status : ";
            case "Time  " -> "▶ Time   : ";
            default -> "▶ " + key + " : ";
        };
        return USE_COLOR ? DIM + k + RESET : k;
    }

    private String indent(String s) {
        if (s == null || s.isBlank()) {
            return " (none)";
        }
        return "\n    " + s.replace("\n", "\n    ");
    }

    private String colorize(String s, String color) {
        if (!USE_COLOR) {
            return s;
        }
        return color + s + RESET;
    }

    private String colorForStatus(int status, String s) {
        if (!USE_COLOR) {
            return s;
        }
        if (status >= 500) {
            return RED + s + RESET;
        }
        if (status >= 400) {
            return YELLOW + s + RESET;
        }
        if (status >= 300) {
            return BLUE + s + RESET;
        }
        return GREEN + s + RESET;
    }

    private String prettyIfJson(String body, String contentType) {
        if (body == null || body.isBlank()) {
            return body;
        }
        if (contentType == null) {
            return body;
        }
        String ct = contentType.toLowerCase(Locale.ROOT);
        if (!(ct.contains("application/json") || ct.contains("+json"))) {
            return body;
        }
        try {
            Object tree = PRETTY_MAPPER.readTree(body);
            return PRETTY_MAPPER.writeValueAsString(tree);
        } catch (JsonProcessingException ignored) {
            return body; // JSON 아님/파싱 실패 시 원문 유지
        }
    }
}
