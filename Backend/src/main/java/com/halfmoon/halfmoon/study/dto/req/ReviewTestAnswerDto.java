package com.halfmoon.halfmoon.study.dto.req;

import java.util.List;

public record ReviewTestAnswerDto(
    String testId,
    List<ReviewTestAnswer> answers
) {
    public record ReviewTestAnswer(
        String questionId,
        String userAnswer
    ) {
    }
}



