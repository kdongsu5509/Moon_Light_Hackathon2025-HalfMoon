package com.halfmoon.halfmoon.security.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Getter;

@Getter
@Entity
public class JwtEntity {

    public JwtEntity() {
    }

    public JwtEntity(
            String accessToken,
            String refreshToken,
            String email,
            LocalDateTime accessTokenExpiredAt,
            LocalDateTime refreshTokenExpiredAt
    ) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.email = email;
        this.accessTokenExpiredAt = accessTokenExpiredAt;
        this.refreshTokenExpiredAt = refreshTokenExpiredAt;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;
    String accessToken;
    String refreshToken;
    String email;
    LocalDateTime accessTokenExpiredAt;
    LocalDateTime refreshTokenExpiredAt;
}
