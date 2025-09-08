package com.halfmoon.halfmoon.study.domain;

import static jakarta.persistence.GenerationType.UUID;
import static lombok.AccessLevel.PROTECTED;

import com.halfmoon.halfmoon.study.dto.req.StudyLevel;
import com.halfmoon.halfmoon.study.dto.req.Subject;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = PROTECTED)
public class UserToStudyContent {

    @Id
    @GeneratedValue(strategy = UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    private Subject subject;

    @Enumerated(EnumType.STRING)
    private StudyLevel studyLevel;

    boolean isDone;

    public static UserToStudyContent of(Subject subject, StudyLevel studyLevel) {
        UserToStudyContent userToStudyContent = new UserToStudyContent();
        userToStudyContent.subject = subject;
        userToStudyContent.studyLevel = studyLevel;
        userToStudyContent.isDone = false;
        return userToStudyContent;
    }
}
