package com.halfmoon.halfmoon.study.dto.req;

import jakarta.validation.constraints.NotNull;

public record ConversationContinueRequest(
        @NotNull
        String talkId,
        String userInput
) {
}
