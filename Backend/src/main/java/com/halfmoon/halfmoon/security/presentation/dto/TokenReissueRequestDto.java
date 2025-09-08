package com.halfmoon.halfmoon.security.presentation.dto;

import jakarta.validation.constraints.NotBlank;

public record TokenReissueRequestDto(
        @NotBlank
        String refreshToken
) {
}
