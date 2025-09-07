package com.halfmoon.halfmoon.security.application;

import com.halfmoon.halfmoon.security.domain.JwtRepository;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtRefreshCleaner {

    private final JwtRepository jwtRepository;

    private static final long ONE_HOUR_MILLISECONDS = 60 * 60 * 1000L;

    @Scheduled(fixedRate = ONE_HOUR_MILLISECONDS)
    public void cleanExpiredJwts() {
        LocalDateTime now = LocalDateTime.now();
        log.info("만료된 refresh 토큰 정리 시작: {}", now);

        jwtRepository.findAll().forEach(jwt -> {
            boolean refreshExpired =
                    jwt.getRefreshTokenExpiredAt() == null || jwt.getRefreshTokenExpiredAt().isBefore(now);
            boolean accessExpired =
                    jwt.getAccessTokenExpiredAt() == null || jwt.getAccessTokenExpiredAt().isBefore(now);

            if (refreshExpired || accessExpired) {
                log.info("삭제 대상: {}", jwt.getEmail());
                jwtRepository.delete(jwt);
            } else {
                log.info("유효한 토큰: {}", jwt.getEmail());
            }
        });

        log.info("만료된 refresh 토큰 정리 완료");
    }

}
