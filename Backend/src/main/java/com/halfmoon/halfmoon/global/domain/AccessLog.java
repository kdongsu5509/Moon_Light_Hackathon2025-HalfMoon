package com.halfmoon.halfmoon.global.domain;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder // 빌더 패턴 적용
public class AccessLog {

    private String traceId; // 요청 추적을 위한 ID
    private String method;
    private String uri;
    private String queryString;
    private String requestBody;
    private String responseBody;
    private Map<String, String> headers;
    private String userAgent;
    private String remoteIp;
    private int status;
    private String threadName;
    private LocalDateTime requestAt;
    private LocalDateTime responseAt;
    private long durationMs;

    public static String extractClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isEmpty()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    public static Map<String, String> extractHeaders(HttpServletRequest request) {
        Map<String, String> headerMap = new HashMap<>();
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            headerMap.put(headerName, request.getHeader(headerName));
        }
        return headerMap;
    }

    // 객체를 JSON 문자열로 변환 (로깅 시 사용)
    @Override
    public String toString() {
        try {
            return new ObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(this);
        } catch (Exception e) {
            return "Log JSON Parsing Error";
        }
    }
}