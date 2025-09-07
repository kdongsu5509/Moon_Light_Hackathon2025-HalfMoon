package com.halfmoon.halfmoon.security.global.filter;

import com.halfmoon.halfmoon.security.application.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

@Slf4j
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String token = resolveToken(request);
        log.info("JWT 토큰 추출: {}", token);

        if (token != null) {
            log.info("JWT 토큰 검증 시작: {}", token);
            try {
                if (jwtService.validateAccessToken(token)) {
                    Authentication authentication = jwtService.getAuthentication(token);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    log.info("JWT 토큰 검증 성공: {}", token);
                }
            } catch (Exception e) {
                // 토큰 검증 과정에서 예외가 발생하면 인증 정보를 비워버립니다.
                SecurityContextHolder.clearContext();
                log.warn("JWT 토큰이 유효하지 않습니다. uri: {}, message: {}", request.getRequestURI(), e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }

    // 헤더에서 'Bearer ' 부분을 제거하고 순수 토큰만 반환하는 메서드. 토큰이 없으면 null 반환
    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}