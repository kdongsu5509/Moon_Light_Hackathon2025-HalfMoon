package com.halfmoon.halfmoon.study.dto.req;

public record ReviewTestRequestDto(
    String subject,
    String studyLevel,
    int questionCount // 생성할 문제 수
) {
}
