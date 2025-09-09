package com.halfmoon.halfmoon.study.presentation;

import com.halfmoon.halfmoon.global.response.APIResponse;
import com.halfmoon.halfmoon.study.application.TTSService;
import com.halfmoon.halfmoon.study.dto.req.AudioTextDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(
        name = "TTS API",
        description = "TTS(텍스트 음성 변환) 관련 API"
)
@RestController
@RequestMapping("/api/tts")
@RequiredArgsConstructor
public class TTSController {

    private final TTSService ttsService;

    @Operation(
            summary = "텍스트를 음성으로 변환",
            description = "주어진 텍스트를 음성 파일로 변환하여 반환합니다."
    )
    @PostMapping
    public APIResponse<byte[]> createAudio(@RequestBody AudioTextDto req) {
        byte[] audioFile = ttsService.convertTextToSpeech(req.text());
        return APIResponse.success(audioFile);
    }
}
