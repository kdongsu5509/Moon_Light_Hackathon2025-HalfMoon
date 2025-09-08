package com.halfmoon.halfmoon.user.infra;

import com.halfmoon.halfmoon.user.domain.StudyRecord;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudyRecordJpaRepository extends JpaRepository<StudyRecord, UUID> {
    Optional<StudyRecord> findRecordByUserEmail(String userEmail);
}
