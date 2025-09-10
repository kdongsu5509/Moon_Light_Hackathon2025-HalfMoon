package com.halfmoon.halfmoon.study.infra;

import com.halfmoon.halfmoon.security.domain.User;
import com.halfmoon.halfmoon.study.domain.Sentence;
import com.halfmoon.halfmoon.study.dto.req.StudyLevel;
import com.halfmoon.halfmoon.study.dto.req.Subject;
import java.util.List;

public interface SentenceQueryDslRepository {

    List<Sentence> findBySubjectAndStudyLevel(Subject subject, StudyLevel studyLevel);

    List<Sentence> findBySubjectAndStudyLevelAndUser(
            Subject subject, StudyLevel studyLevel, User user);
}
