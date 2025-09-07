package com.halfmoon.halfmoon.user.persentation.dto.request;

public record MonthlyGoalRequestDto(
        String month, // YYYY-MM format
        Long goal
) {
}
