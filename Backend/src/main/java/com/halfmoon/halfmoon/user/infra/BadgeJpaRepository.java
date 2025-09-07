package com.halfmoon.halfmoon.user.infra;

import com.halfmoon.halfmoon.user.domain.Badge;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BadgeJpaRepository extends JpaRepository<Badge, UUID> {
}
