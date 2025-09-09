package com.halfmoon.halfmoon.study.dto.resp;

import java.util.List;

public record ReviewTestQuestionDto(
    String id,
    String type, // "multiple", "fill", "pronunciation"
    String question,
    List<String> options, // 객관식 선택지 (객관식인 경우만)
    String correctAnswer,
    String explanation,
    String image,
    String originalSentence // 원본 문장 (학습했던 문장)
) {
}



