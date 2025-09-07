package com.halfmoon.halfmoon.user.domain;

import static lombok.AccessLevel.PROTECTED;

import com.halfmoon.halfmoon.security.domain.User;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = PROTECTED)
public class Record {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    Long wordCnt; // 학습한 단어 수
    Long talkCnt; // 완료한 대화 수
    Long continueDay; // 연속 학습 일수

    @OneToOne
    @JoinColumn(name = "user_id") // 외래 키 컬럼을 명시
    private User user;
}
