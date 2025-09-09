package com.halfmoon.halfmoon.study.application;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class ChatMemoryLocalStorage {

    static Map<String, ChatMemory> chatMemoryStorage = new ConcurrentHashMap<>();

    private static Long conversationCount = 0L;

    public static ChatMemory getChatMemory(String conversationId) {
        log.info("Getting chat memory for talkId: {}", conversationId);
        return chatMemoryStorage.get(conversationId);
    }

    public static void putChatMemory(String conversationId, ChatMemory chatMemory) {
        log.info("Putting chat memory for talkId: {}", conversationId);
        ChatMemoryLocalStorage.chatMemoryStorage.put(conversationId, chatMemory);
    }

    public static void removeChatMemory(String conversationId) {
        log.info("Removing chat memory for talkId: {}", conversationId);
        chatMemoryStorage.remove(conversationId);
    }

    public static String generateLengthThreeConversationId() {
        conversationCount += 1;
        log.info("Conversation count: {}", conversationCount);
        return String.format("%03d", conversationCount);
    }
}
