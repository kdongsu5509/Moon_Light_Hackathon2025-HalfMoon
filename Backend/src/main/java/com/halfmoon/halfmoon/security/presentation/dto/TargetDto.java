package com.halfmoon.halfmoon.security.presentation.dto;

import jakarta.validation.constraints.NotNull;

public record TargetDto(
        @NotNull(message = "값은 필수입니다.")
        String target
) {
}
