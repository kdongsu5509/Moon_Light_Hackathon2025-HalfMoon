package com.halfmoon.halfmoon.study.presentation;

import com.halfmoon.halfmoon.global.response.APIResponse;
import com.halfmoon.halfmoon.security.domain.CustomUserDetails;
import com.halfmoon.halfmoon.study.application.ChatService;
import com.halfmoon.halfmoon.study.dto.req.ConversationContinueRequest;
import com.halfmoon.halfmoon.study.dto.req.ConversationContinueVoiceRequest;
import com.halfmoon.halfmoon.study.dto.req.ConversationStartRequest;
import com.halfmoon.halfmoon.study.dto.resp.ConversationStartResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@Tag(
        name = "대화 연습 API",
        description = "사용자와 AI 간의 대화 연습을 위한 API를 제공합니다."
)
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @Operation(
            summary = "대화 시작",
            description = "새로운 AI 대화를 시작하고 대화 ID를 반환합니다. 이 대화 ID로 대화를 이어갈 수 있습니다.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "성공적으로 대화가 시작되었으며 대화 ID를 반환합니다.",
                            content = @Content(schema = @Schema(implementation = ConversationStartResponse.class))
                    )
            }
    )
    @PostMapping("/start")
    public APIResponse<ConversationStartResponse> startConversation(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody ConversationStartRequest request) {

        ConversationStartResponse conversationStartResponse = chatService.startConversation(userDetails.getUsername(),
                request);

        return APIResponse.success(conversationStartResponse);
    }

    @Operation(
            summary = "텍스트 대화 이어가기",
            description = "기존 대화에 텍스트 메시지를 추가하고 AI의 응답을 반환합니다.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "AI의 텍스트 응답을 성공적으로 반환합니다."
                    )
            }
    )
    @PostMapping("/continue")
    public APIResponse<String> continueConversation(
            @RequestBody ConversationContinueRequest req) {
        log.info("Controller talk id: {}", req.talkId());
        log.info("Controller talk userInput: {}", req.userInput());
        String aiResponse = chatService.continueConversation(req);
        return APIResponse.success(aiResponse);
    }

    @Operation(
            summary = "음성 대화 이어가기",
            description = "음성 데이터를 서버로 전송하여 AI의 텍스트 응답을 받습니다.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "AI의 텍스트 응답을 성공적으로 반환합니다."
                    )
            }
    )
    @PostMapping("/continue/voice")
    public APIResponse<String> continueConversationWithVoice(
            @RequestBody ConversationContinueVoiceRequest req) {
        String aiResponse = chatService.continueConversationWithVoice(req);
        return APIResponse.success(aiResponse);
    }

    @PostMapping("/delete/{conversationId}")
    public APIResponse<Void> deleteConversation(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                @PathVariable String conversationId) {
        chatService.deleteConversation(userDetails.getUsername(), conversationId);
        return APIResponse.success();
    }
}
