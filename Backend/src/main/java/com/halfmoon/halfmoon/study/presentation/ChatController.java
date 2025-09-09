package com.halfmoon.halfmoon.study.presentation;

import com.halfmoon.halfmoon.global.response.APIResponse;
import com.halfmoon.halfmoon.security.domain.CustomUserDetails;
import com.halfmoon.halfmoon.study.application.ChatService;
import com.halfmoon.halfmoon.study.dto.req.ConversationContinueRequest;
import com.halfmoon.halfmoon.study.dto.req.ConversationContinueVoiceRequest;
import com.halfmoon.halfmoon.study.dto.req.ConversationStartRequest;
import com.halfmoon.halfmoon.study.dto.resp.ConversationStartResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(
        name = "대화 연습 API",
        description = "사용자와 AI 간의 대화 연습을 위한 API를 제공합니다."
)
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    //첫 대화를 시작할 때 사용하는 엔드포인트 -> 반환 : conversationId
    @GetMapping("/start")
    public APIResponse<ConversationStartResponse> startConversation(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody ConversationStartRequest request) {

        ConversationStartResponse conversationStartResponse = chatService.startConversation(userDetails.getUsername(),
                request);

        return APIResponse.success(conversationStartResponse);
    }

    //대화를 이어갈 때 사용하는 엔드포인트 -> 반환 : AI의 응답 메시지
    @PostMapping("/continue")
    public APIResponse<String> continueConversation(@RequestBody ConversationContinueRequest req) {

        String aiResponse = chatService.continueConversation(req);

        return APIResponse.success(aiResponse);
    }

    //음성을 전달하는 엔드포인트 -> 반환 : AI의 응답 메시지
    @PostMapping("/continue/voice")
    public APIResponse<String> continueConversationWithVoice(@RequestBody ConversationContinueVoiceRequest req) {

        String aiResponse = chatService.continueConversationWithVoice(req);

        return APIResponse.success(aiResponse);
    }
}
