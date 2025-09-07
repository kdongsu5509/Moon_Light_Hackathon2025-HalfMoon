package com.halfmoon.halfmoon.user.infra;

import com.halfmoon.halfmoon.user.domain.MonthlyGoal;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MontlyGoalJpaRepository extends JpaRepository<MonthlyGoal, UUID> {
    Optional<MonthlyGoal> findMonthlyGoalByUserEmail(String userEmail);

    @Query(value = "SELECT COUNT(*) + 1 "
            + "FROM monthly_goal mg "
            + "WHERE mg.current_points > (SELECT mg2.current_points "
            + "                             FROM monthly_goal mg2 "
            + "                             WHERE mg2.user_id = :userId AND mg2.month = :month)",
            nativeQuery = true)
    Long getUserRank(@Param("userId") UUID userId, @Param("month") String month);
}