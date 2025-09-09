package com.halfmoon.halfmoon.study.domain;

import static jakarta.persistence.GenerationType.UUID;
import static lombok.AccessLevel.PROTECTED;

import com.halfmoon.halfmoon.security.domain.User;
import com.halfmoon.halfmoon.study.dto.req.StudyLevel;
import com.halfmoon.halfmoon.study.dto.req.Subject;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = PROTECTED)
public class ReviewTestSession {
    @Id
    @GeneratedValue(strategy = UUID)
    private UUID id;

    private String testId; // 테스트 고유 ID
    private int totalQuestions; // 문제 수
    private int timeLimitMinutes; // 시간 제한 (분)
    private LocalDateTime createdAt; // 생성 시간
    private LocalDateTime completedAt; // 완료 시간
    private boolean isCompleted; // 완료 여부
    
    @Enumerated(EnumType.STRING)
    private Subject subject; // 주제
    
    @Enumerated(EnumType.STRING)
    private StudyLevel studyLevel; // 난이도
    
    @ManyToOne
    private User user; // 사용자
    
    @OneToMany(mappedBy = "reviewTestSession")
    private List<ReviewTestQuestion> questions = new ArrayList<>(); // 문제들

    public static ReviewTestSession create(String testId, int totalQuestions, int timeLimitMinutes, 
                                         Subject subject, StudyLevel studyLevel, User user) {
        ReviewTestSession session = new ReviewTestSession();
        session.testId = testId;
        session.totalQuestions = totalQuestions;
        session.timeLimitMinutes = timeLimitMinutes;
        session.subject = subject;
        session.studyLevel = studyLevel;
        session.user = user;
        session.createdAt = LocalDateTime.now();
        session.isCompleted = false;
        return session;
    }
    
    public void markAsCompleted() {
        this.isCompleted = true;
        this.completedAt = LocalDateTime.now();
    }
}
