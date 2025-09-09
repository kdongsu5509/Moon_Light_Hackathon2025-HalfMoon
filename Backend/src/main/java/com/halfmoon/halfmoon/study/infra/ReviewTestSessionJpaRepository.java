package com.halfmoon.halfmoon.study.infra;

import com.halfmoon.halfmoon.study.domain.ReviewTestSession;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewTestSessionJpaRepository extends JpaRepository<ReviewTestSession, UUID> {
    Optional<ReviewTestSession> findByTestId(String testId);
}
