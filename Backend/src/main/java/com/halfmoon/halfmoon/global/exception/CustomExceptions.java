package com.halfmoon.halfmoon.global.exception;

import lombok.NoArgsConstructor;

@NoArgsConstructor(access = lombok.AccessLevel.PRIVATE)
public class CustomExceptions {
    public static class PinException extends RuntimeException {
        public PinException(String message) {
            super(message);
        }
    }

    public static class CommentException extends RuntimeException {
        public CommentException(String message) {
            super(message);
        }
    }

    public static class UserException extends RuntimeException {
        public UserException(String message) {
            super(message);
        }
    }

    public static class JwtException extends RuntimeException {
        public JwtException(String message) {
            super(message);
        }
    }
}
