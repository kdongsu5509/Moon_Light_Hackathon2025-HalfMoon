package com.halfmoon.halfmoon.study.application;

import com.halfmoon.halfmoon.security.domain.KoreanLevel;
import com.halfmoon.halfmoon.security.domain.NativeLanguage;
import com.halfmoon.halfmoon.security.domain.User;
import com.halfmoon.halfmoon.security.domain.UserRepository;
import com.halfmoon.halfmoon.study.dto.req.ConversationContinueRequest;
import com.halfmoon.halfmoon.study.dto.req.ConversationContinueVoiceRequest;
import com.halfmoon.halfmoon.study.dto.req.ConversationStartRequest;
import com.halfmoon.halfmoon.study.dto.req.Subject;
import com.halfmoon.halfmoon.study.dto.resp.ConversationStartResponse;
import com.halfmoon.halfmoon.user.domain.StudyRecord;
import com.halfmoon.halfmoon.user.infra.StudyRecordJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.memory.MessageWindowChatMemory;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class ChatService {

    private final TranscriptionService transcriptionService;
    private final OpenAiChatModel chatModel;
    private final UserRepository userRepository;
    private final StudyRecordJpaRepository studyRecordJpaRepository;

    public ConversationStartResponse startConversation(String username, ConversationStartRequest request) {
        User user = userRepository.findByEmail(username).orElseThrow(
                () -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + username)
        );

        ChatMemory chatMemory = MessageWindowChatMemory.builder().build();

        // 프롬프트 생성
        Integer age = user.getAge();
        String nickName = user.getNickName();
        KoreanLevel koreanLevel = user.getKoreanLevel();
        NativeLanguage nativeLanguage = user.getNativeLanguage();
        Subject subject = request.subject();

        String firstMessageToStartRolePlay = """
                 안녕하세요, 나는 %d살이고, 내 닉네임은 %s 이야.
                 나의 한국어 수준은 %s 이고, 모국어는 %s 이야.
                
                나는 지금부터 너와 %s에 대해 롤플레이를 하고 싶어.
                
                나의 한국어 수준과 모국어, 그리고 나이대를 고려해서 역할 놀이를 시작하자.
                """;
        String firstMessage = String.format(firstMessageToStartRolePlay, age, nickName, koreanLevel, nativeLanguage,
                subject);

        String conversationId = ChatMemoryLocalStorage.generateLengthThreeConversationId();
        UserMessage userMessage = new UserMessage(firstMessage);
        chatMemory.add(conversationId, userMessage);
        ChatResponse response = chatModel.call(new Prompt(chatMemory.get(conversationId)));
        chatMemory.add(conversationId, response.getResult().getOutput());

        ChatMemoryLocalStorage.putChatMemory(conversationId, chatMemory);

        return new ConversationStartResponse(conversationId);
    }

    public String continueConversation(ConversationContinueRequest req) {
        ChatMemory chatMemory = ChatMemoryLocalStorage.getChatMemory(req.conversationId());
        if (chatMemory == null) {
            throw new IllegalArgumentException("유효하지 않은 conversationId 입니다: " + req.conversationId());
        }

        String userMessageContent = req.userInput();
        UserMessage userMessage = new UserMessage(userMessageContent);
        chatMemory.add(req.conversationId(), userMessage);
        ChatResponse response = chatModel.call(new Prompt(chatMemory.get(req.conversationId())));
        chatMemory.add(req.conversationId(), response.getResult().getOutput());

        return response.getResult().getOutput().getText();
    }

    public String continueConversationWithVoice(ConversationContinueVoiceRequest req) {
        ChatMemory chatMemory = ChatMemoryLocalStorage.getChatMemory(req.conversationId());
        if (chatMemory == null) {
            throw new IllegalArgumentException("유효하지 않은 conversationId 입니다: " + req.conversationId());
        }

        //음성 -> 텍스트 변환
        String textFromAudio = transcriptionService.convertAudioToText(req.audioData());

        chatMemory.add(req.conversationId(), new UserMessage(textFromAudio));
        ChatResponse response = chatModel.call(new Prompt(chatMemory.get(req.conversationId())));
        chatMemory.add(req.conversationId(), response.getResult().getOutput());

        return response.getResult().getOutput().getText();
    }

    public void deleteConversation(String userEmail, String conversationId) {
        StudyRecord studyRecord = studyRecordJpaRepository.findRecordByUserEmail(userEmail).orElseThrow(
                () -> new IllegalArgumentException("사용자 학습 기록을 찾을 수 없습니다: " + userEmail)
        );

        studyRecord.incrementFinishedConversationCount();

        ChatMemoryLocalStorage.removeChatMemory(conversationId);
    }
}
