package com.halfmoon.halfmoon.study.infra;

import static com.halfmoon.halfmoon.study.domain.QSentence.sentence1;
import static com.halfmoon.halfmoon.study.domain.QUserToStudyContent.userToStudyContent;

import com.halfmoon.halfmoon.security.domain.User;
import com.halfmoon.halfmoon.study.domain.Sentence;
import com.halfmoon.halfmoon.study.dto.req.StudyLevel;
import com.halfmoon.halfmoon.study.dto.req.Subject;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import java.util.List;

public class SentenceJpaRepositoryImpl implements SentenceQueryDslRepository {

    private EntityManager em;

    private JPAQueryFactory queryFactory;

    public SentenceJpaRepositoryImpl(EntityManager em) {
        this.em = em;
        this.queryFactory = new JPAQueryFactory(em);
    }


    @Override
    public List<Sentence> findBySubjectAndStudyLevel(Subject subject, StudyLevel studyLevel) {
        return queryFactory
                .selectFrom(sentence1)
                .join(sentence1.studyContent, userToStudyContent).fetchJoin()
                .where(sentence1.studyContent.subject.eq(subject)
                        .and(sentence1.studyContent.studyLevel.eq(studyLevel)))
                .fetch();
    }

    @Override
    public List<Sentence> findBySubjectAndStudyLevelAndUser(Subject subject,
                                                            StudyLevel studyLevel,
                                                            User user) {
        return queryFactory
                .selectFrom(sentence1)
                .join(sentence1.studyContent, userToStudyContent).fetchJoin()
                .where(sentence1.studyContent.subject.eq(subject)
                        .and(sentence1.studyContent.studyLevel.eq(studyLevel))
                        .and(sentence1.studyContent.user.eq(user)))
                .fetch();
    }
}
