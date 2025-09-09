package com.halfmoon.halfmoon.study.infra;

import com.halfmoon.halfmoon.security.domain.User;
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
    
    // 사용자별 문장 조회 메서드 추가 (더 간단한 방법)
    List<Sentence> findByStudyContentSubjectAndStudyContentStudyLevelAndStudyContentUser(
            Subject subject, StudyLevel studyLevel, User user);
}
