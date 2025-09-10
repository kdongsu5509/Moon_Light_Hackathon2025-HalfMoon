package com.halfmoon.halfmoon.study.dto.req;

public record ReviewTestRequestDto(
        Subject subject,
        StudyLevel studyLevel,
        int questionCount // 생성할 문제 수
) {
}
