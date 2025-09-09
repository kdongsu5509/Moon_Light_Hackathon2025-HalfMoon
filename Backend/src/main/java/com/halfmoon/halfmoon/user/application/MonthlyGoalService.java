package com.halfmoon.halfmoon.user.application;

import com.halfmoon.halfmoon.security.domain.User;
import com.halfmoon.halfmoon.security.domain.UserRepository;
import com.halfmoon.halfmoon.user.domain.MonthlyGoal;
import com.halfmoon.halfmoon.user.infra.MontlyGoalJpaRepository;
import com.halfmoon.halfmoon.user.persentation.dto.request.MonthlyGoalRequestDto;
import com.halfmoon.halfmoon.user.persentation.dto.response.MontlyGoalResponseDto;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class MonthlyGoalService {

    private final MontlyGoalJpaRepository goalRepository;
    private final UserRepository userRepository;

    public MontlyGoalResponseDto getUserMontlyGoal(String userEmail) {
        Optional<MonthlyGoal> findGoal = goalRepository.findMonthlyGoalByUserEmail(userEmail);

        if (findGoal.isEmpty()) {
            throw new IllegalArgumentException("No monthly goal found for user: " + userEmail);
        }

        return toDto(findGoal.get());
    }

    private MontlyGoalResponseDto toDto(MonthlyGoal goal) {
        return new MontlyGoalResponseDto(
                goal.getTargetMonth(),
                goal.getGoalPoints(),
                goal.getCurrentPoints()
        );
    }

    public UUID setUserMontlyGoal(String username, MonthlyGoalRequestDto req) {
        Optional<User> user = userRepository.findByEmail(username);
        if (user.isEmpty()) {
            throw new IllegalArgumentException("User not found: " + username);
        }

        MonthlyGoal build = MonthlyGoal.builder()
                .user(user.get())
                .month(req.month())
                .goalPoints(req.goal())
                .build();

        MonthlyGoal savedGoal = goalRepository.save(build);
        return savedGoal.getId();
    }

    public void deleteUserMonthlyGoal(String userEmail) {
        Optional<MonthlyGoal> findGoal = goalRepository.findMonthlyGoalByUserEmail(userEmail);

        if (findGoal.isEmpty()) {
            throw new IllegalArgumentException("No monthly goal found for user: " + userEmail);
        }

        goalRepository.delete(findGoal.get());
    }
}
