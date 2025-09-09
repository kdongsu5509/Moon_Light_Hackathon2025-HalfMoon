package com.halfmoon.halfmoon.study.application;

import java.util.HashMap;
import java.util.Map;
import org.springframework.ai.chat.memory.ChatMemory;

public class ChatMemoryLocalStorage {

    public static Map<String, ChatMemory> chatMeories = new HashMap<>();

    private static Long conversationCount = 0L;

    public static ChatMemory getChatMemory(String conversationId) {
        return chatMeories.get(conversationId);
    }

    public static void putChatMemory(String conversationId, ChatMemory chatMemory) {
        chatMeories.put(conversationId, chatMemory);
    }

    public static void removeChatMemory(String conversationId) {
        chatMeories.remove(conversationId);
    }

    public static String generateLengthThreeConversationId() {
        conversationCount += 1;
        return String.format("%03d", conversationCount);
    }
}
