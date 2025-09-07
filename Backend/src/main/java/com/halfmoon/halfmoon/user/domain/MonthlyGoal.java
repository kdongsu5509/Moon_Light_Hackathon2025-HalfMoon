package com.halfmoon.halfmoon.user.domain;

import static jakarta.persistence.FetchType.LAZY;
import static lombok.AccessLevel.PROTECTED;

import com.halfmoon.halfmoon.security.domain.User;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import java.util.UUID;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = PROTECTED)
public class MonthlyGoal {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private Long goalPoints;
    private Long currentPoints;

    private String month; // Format: "YYYY-MM"

    @ManyToOne(fetch = LAZY)
    private User user;

    @Builder
    public static MonthlyGoal create(Long goalPoints, String month, User user) {
        return new MonthlyGoal(goalPoints, month, user);
    }

    private MonthlyGoal(Long goalPoints, String month, User user) {
        this.goalPoints = goalPoints;
        this.currentPoints = 0L;
        this.month = month;
        this.user = user;
    }

    public Long addToCurrentPoint(Long points) {
        this.currentPoints += points;
        return this.currentPoints;
    }
}
