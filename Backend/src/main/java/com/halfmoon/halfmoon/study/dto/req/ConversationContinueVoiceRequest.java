package com.halfmoon.halfmoon.study.dto.req;

public record ConversationContinueVoiceRequest(
        String conversationId,
        byte[] audioData
) {
}
