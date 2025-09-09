package com.halfmoon.halfmoon.user.infra;

import com.halfmoon.halfmoon.user.domain.MonthlyGoal;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MontlyGoalJpaRepository extends JpaRepository<MonthlyGoal, UUID> {
    Optional<MonthlyGoal> findMonthlyGoalByUserEmail(String userEmail);

    @Query("SELECT COUNT(mg) + 1 FROM MonthlyGoal mg "
            + "WHERE mg.currentPoints > (SELECT mg2.currentPoints "
            + "                         FROM MonthlyGoal mg2 "
            + "                         WHERE mg2.user.id = :userId AND mg2.targetMonth = :month)")
    Long getUserRank(@Param("userId") UUID userId, @Param("month") String month);
}