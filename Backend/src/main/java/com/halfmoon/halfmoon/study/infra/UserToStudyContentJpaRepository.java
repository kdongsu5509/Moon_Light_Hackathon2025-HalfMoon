package com.halfmoon.halfmoon.study.infra;

import com.halfmoon.halfmoon.study.domain.UserToStudyContent;
import com.halfmoon.halfmoon.study.dto.req.StudyLevel;
import com.halfmoon.halfmoon.study.dto.req.Subject;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserToStudyContentJpaRepository extends JpaRepository<UserToStudyContent, UUID> {
    Optional<UserToStudyContent> findBySubjectAndStudyLevel(Subject subject, StudyLevel studyLevel);

    List<UserToStudyContent> findByUserEmailAndStudyLevel(String email, StudyLevel studyLevel);

}
