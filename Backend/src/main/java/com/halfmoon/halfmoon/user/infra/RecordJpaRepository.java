package com.halfmoon.halfmoon.user.infra;

import com.halfmoon.halfmoon.user.domain.Record;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecordJpaRepository extends JpaRepository<Record, UUID> {
    Optional<Record> findRecordByUserEmail(String userEmail);
}
