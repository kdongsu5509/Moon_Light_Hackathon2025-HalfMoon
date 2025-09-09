package com.halfmoon.halfmoon.study.domain;

import static jakarta.persistence.GenerationType.UUID;
import static lombok.AccessLevel.PROTECTED;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = PROTECTED)
public class ReviewTestAnswer {
    @Id
    @GeneratedValue(strategy = UUID)
    private UUID id;

    private String questionId; // 문제 ID
    private String userAnswer; // 사용자 답안
    private boolean isCorrect; // 정답 여부
    private LocalDateTime answeredAt; // 답안 제출 시간
    
    @ManyToOne
    private ReviewTestSession reviewTestSession; // 연관된 복습 시험 세션

    public static ReviewTestAnswer create(String questionId, String userAnswer, 
                                        boolean isCorrect, ReviewTestSession session) {
        ReviewTestAnswer answer = new ReviewTestAnswer();
        answer.questionId = questionId;
        answer.userAnswer = userAnswer;
        answer.isCorrect = isCorrect;
        answer.reviewTestSession = session;
        answer.answeredAt = LocalDateTime.now();
        return answer;
    }
}
