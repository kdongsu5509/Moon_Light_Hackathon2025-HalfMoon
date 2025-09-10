package com.halfmoon.halfmoon.study.infra;

import com.halfmoon.halfmoon.study.domain.ReviewTestAnswer;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewTestAnswerJpaRepository extends JpaRepository<ReviewTestAnswer, UUID> {
    List<ReviewTestAnswer> findByReviewTestSessionId(UUID sessionId);
}
