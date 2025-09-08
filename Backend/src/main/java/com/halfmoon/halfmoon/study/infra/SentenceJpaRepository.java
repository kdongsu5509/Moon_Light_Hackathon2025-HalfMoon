package com.halfmoon.halfmoon.study.infra;

import com.halfmoon.halfmoon.study.domain.Sentence;
import com.halfmoon.halfmoon.study.dto.req.StudyLevel;
import com.halfmoon.halfmoon.study.dto.req.Subject;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SentenceJpaRepository extends JpaRepository<Sentence, UUID> {
    Collection<Sentence> findByStudyContentId(UUID id);

    UUID sentence(String sentence);

    List<Sentence> findByStudyContentSubjectAndStudyContentStudyLevel(Subject subject, StudyLevel studyLevel);
}
