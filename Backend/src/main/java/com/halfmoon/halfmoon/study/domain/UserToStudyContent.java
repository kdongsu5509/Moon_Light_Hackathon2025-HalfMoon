package com.halfmoon.halfmoon.study.domain;

import static jakarta.persistence.FetchType.LAZY;
import static jakarta.persistence.GenerationType.UUID;
import static lombok.AccessLevel.PROTECTED;

import com.halfmoon.halfmoon.security.domain.User;
import com.halfmoon.halfmoon.study.dto.req.StudyLevel;
import com.halfmoon.halfmoon.study.dto.req.Subject;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
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

    @ManyToOne(fetch = LAZY)
    private User user;

    public static UserToStudyContent of(User user, Subject subject, StudyLevel studyLevel) {
        UserToStudyContent userToStudyContent = new UserToStudyContent();
        userToStudyContent.user = user;
        userToStudyContent.subject = subject;
        userToStudyContent.studyLevel = studyLevel;
        return userToStudyContent;
    }
}
