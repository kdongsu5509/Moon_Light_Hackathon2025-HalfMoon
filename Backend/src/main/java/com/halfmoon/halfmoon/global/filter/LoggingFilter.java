package com.halfmoon.halfmoon.global.filter;

import com.halfmoon.halfmoon.global.domain.AccessLog;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

@Slf4j
public class LoggingFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 0. 요청이 오면 가장 먼저 실행될 부분

        // 요청/응답을 캐싱 가능한 래퍼로 감싸기 (본문을 여러 번 읽기 위함)
        ContentCachingRequestWrapper wrappedRequest = new ContentCachingRequestWrapper(request);
        ContentCachingResponseWrapper wrappedResponse = new ContentCachingResponseWrapper(response);

        // 시작 시간 기록 및 추적 ID 생성
        LocalDateTime requestAt = LocalDateTime.now();
        String traceId = UUID.randomUUID().toString();
        MDC.put("traceId", traceId); // 로그에 추적 ID를 자동으로 포함시키기 위해 MDC 사용

        try {
            // 1. 다음 필터 또는 서블릿으로 요청 전달
            // 이 시점에 컨트롤러 로직이 실행되고 응답이 생성됨
            filterChain.doFilter(wrappedRequest, wrappedResponse);
        } finally {
            // 2. 응답이 클라이언트로 나가기 직전에 실행될 부분

            LocalDateTime responseAt = LocalDateTime.now();

            // AccessLog 객체 생성
            AccessLog accessLog = AccessLog.builder()
                    .traceId(traceId)
                    .requestAt(requestAt)
                    .responseAt(responseAt)
                    .durationMs(java.time.Duration.between(requestAt, responseAt).toMillis())
                    .threadName(Thread.currentThread().getName())
                    .method(wrappedRequest.getMethod())
                    .uri(wrappedRequest.getRequestURI())
                    .queryString(wrappedRequest.getQueryString())
                    .headers(AccessLog.extractHeaders(wrappedRequest))
                    .remoteIp(AccessLog.extractClientIp(wrappedRequest))
                    .userAgent(wrappedRequest.getHeader("User-Agent"))
                    .status(wrappedResponse.getStatus())
                    .requestBody(new String(wrappedRequest.getContentAsByteArray(), StandardCharsets.UTF_8))
                    .responseBody(new String(wrappedResponse.getContentAsByteArray(), StandardCharsets.UTF_8))
                    .build();

            log.info("{}", accessLog); // AccessLog 객체를 JSON 형식으로 로깅

            // 중요: 캐시에 저장된 응답 본문을 실제 응답 객체에 복사하여 클라이언트에게 전달
            wrappedResponse.copyBodyToResponse();
            MDC.clear(); // 현재 스레드의 MDC 정보 제거
        }
    }
}
