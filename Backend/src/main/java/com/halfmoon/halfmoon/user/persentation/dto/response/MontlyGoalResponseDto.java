package com.halfmoon.halfmoon.user.persentation.dto.response;

public record MontlyGoalResponseDto(
        String month,
        Long goalPoints,
        Long currentPoints
) {
}
