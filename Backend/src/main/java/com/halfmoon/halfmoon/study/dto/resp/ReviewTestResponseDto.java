package com.halfmoon.halfmoon.study.dto.resp;

import java.util.List;

public record ReviewTestResponseDto(
    String testId,
    List<ReviewTestQuestionDto> questions,
    int totalQuestions,
    int timeLimitMinutes // 분 단위
) {
}



