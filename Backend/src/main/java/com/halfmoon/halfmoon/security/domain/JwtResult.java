package com.halfmoon.halfmoon.security.domain;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class JwtResult {

    @Getter
    public static class Issue {
        private final String accessToken;
        private final String refreshToken;

        private Issue(String accessToken, String refreshToken) {
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
        }

        public static Issue of(String accessToken, String refreshToken) {
            return new Issue(accessToken, refreshToken);
        }
    }

}
