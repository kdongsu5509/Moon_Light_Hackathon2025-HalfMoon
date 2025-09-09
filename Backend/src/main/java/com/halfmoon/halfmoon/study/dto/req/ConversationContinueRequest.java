package com.halfmoon.halfmoon.study.dto.req;

public record ConversationContinueRequest(
        String conversationId,
        String userInput
) {
}
