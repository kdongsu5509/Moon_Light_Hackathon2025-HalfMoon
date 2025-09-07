package com.halfmoon.halfmoon.user.dto;

public record UserInfoResponseDto(
        String email,
        String userName,
        String profileImageUrl
) {
}
