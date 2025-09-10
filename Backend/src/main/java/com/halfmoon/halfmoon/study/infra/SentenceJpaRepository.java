package com.halfmoon.halfmoon.study.infra;

import com.halfmoon.halfmoon.study.domain.Sentence;
import java.util.Collection;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SentenceJpaRepository extends JpaRepository<Sentence, UUID>, SentenceQueryDslRepository {
    Collection<Sentence> findByStudyContentId(UUID id);

    UUID sentence(String sentence);
}
