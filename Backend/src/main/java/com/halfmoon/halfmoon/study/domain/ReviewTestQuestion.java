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
public class ReviewTestQuestion {
    @Id
    @GeneratedValue(strategy = UUID)
    private UUID id;

    private String questionId; // 문제 고유 ID
    private String type; // 문제 유형 (multiple, fill)
    private String question; // 문제 내용
    private String correctAnswer; // 정답
    private String explanation; // 해설
    private String image; // 이모지/이미지
    private String originalSentence; // 원본 문장
    
    private LocalDateTime createdAt; // 생성 시간
    
    @ManyToOne
    private ReviewTestSession reviewTestSession; // 연관된 복습 시험 세션

    public static ReviewTestQuestion create(String questionId, String type, String question, 
                                          String correctAnswer, String explanation, String image, 
                                          String originalSentence, ReviewTestSession session) {
        ReviewTestQuestion reviewTestQuestion = new ReviewTestQuestion();
        reviewTestQuestion.questionId = questionId;
        reviewTestQuestion.type = type;
        reviewTestQuestion.question = question;
        reviewTestQuestion.correctAnswer = correctAnswer;
        reviewTestQuestion.explanation = explanation;
        reviewTestQuestion.image = image;
        reviewTestQuestion.originalSentence = originalSentence;
        reviewTestQuestion.reviewTestSession = session;
        reviewTestQuestion.createdAt = LocalDateTime.now();
        return reviewTestQuestion;
    }
}
