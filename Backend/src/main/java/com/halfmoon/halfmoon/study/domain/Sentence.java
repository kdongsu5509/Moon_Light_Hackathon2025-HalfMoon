package com.halfmoon.halfmoon.study.domain;

import static jakarta.persistence.FetchType.LAZY;
import static jakarta.persistence.GenerationType.UUID;
import static lombok.AccessLevel.PROTECTED;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = PROTECTED)
public class Sentence {
    @Id
    @GeneratedValue(strategy = UUID)
    private UUID id;

    private String sentence; // 문장
    private String meaning; // 문장의 뜻
    private Long newWordsCount; // 새롭게 배운 단어 수

    @ManyToOne(fetch = LAZY)
    private UserToStudyContent studyContent; // 연관된 StudyContent
}
