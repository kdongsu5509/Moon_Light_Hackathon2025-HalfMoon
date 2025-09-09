package com.halfmoon.halfmoon.study.dto.resp;

import java.util.List;

public record ReviewTestResultDto(
    String testId,
    int totalQuestions,
    int correctAnswers,
    int score, // 백분율
    String grade, // A, B, C, D
    int earnedPoints,
    List<QuestionResult> questionResults
) {
    public record QuestionResult(
        String questionId,
        String question,
        String correctAnswer,
        String userAnswer,
        boolean isCorrect,
        String explanation
    ) {
    }
}



