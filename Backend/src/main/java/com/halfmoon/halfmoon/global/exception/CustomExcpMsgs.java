package com.halfmoon.halfmoon.global.exception;

import lombok.Getter;

@Getter
public enum CustomExcpMsgs {
    ALREADY_EXISTS("이미 존재하는 데이터입니다."),
    PIN_NOT_FOUND("해당 핀 정보를 찾을 수 없습니다."),
    PIN_UNAUTHORIZED("해당 핀에 대한 권한이 없습니다."),
    COMMENT_NOT_FOUND("해당 댓글 정보를 찾을 수 없습니다."),
    COMMENT_UNAUTHORIZED("해당 댓글에 대한 권한이 없습니다."),

    USER_NOT_FOUND("해당 유저 정보를 찾을 수 없습니다."),
    JWT_MISSED("JWT 토큰이 누락되었습니다."),
    JWT_INVALID("JWT 토큰이 유효하지 않습니다."),
    JWT_NOT_FOUND("JWT 토큰이 존재하지 않습니다."),
    JWT_EXPIRED("JWT 토큰이 만료되었습니다."),

    BOOKMARK_NOT_FOUND("해당 북마크 정보를 찾을 수 없습니다."),
    BOOKMARK_UNAUTHORIZED("해당 북마크에 대한 권한이 없습니다.");

    private final String message;

    CustomExcpMsgs(String message) {
        this.message = message;
    }
}
