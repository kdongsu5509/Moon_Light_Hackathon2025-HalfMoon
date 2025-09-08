package com.halfmoon.halfmoon.study.presentation;

import com.halfmoon.halfmoon.global.response.APIResponse;
import com.halfmoon.halfmoon.study.application.PronunciationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotNull;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@Tag(
        name = "발음 평가 API",
        description = "발음 평가 관련 API입니다."
)
@RestController
@RequestMapping("/api/pron")
@RequiredArgsConstructor
public class PronunciationController {

    private final PronunciationService pronunciationService;

    @Operation(
            summary = "발음 평가",
            description = "사용자가 업로드한 오디오 파일을 분석하여 발음을 평가합니다. 1에서 10까지의 점수로 평가 결과를 반환합니다."
    )
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "오디오 파일 (MultipartFile)",
            required = true,
            content = @io.swagger.v3.oas.annotations.media.Content(
                    mediaType = "multipart/form-data",
                    schema = @io.swagger.v3.oas.annotations.media.Schema(type = "string", format = "binary")
            )
    )
    @ApiResponses(
            value = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "성공"),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청"),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "서버 오류")
            }
    )
    @PostMapping("/evaluate")
    public APIResponse<Integer> evaluatePronunciation(@NotNull @RequestBody MultipartFile audio) throws IOException {
        Integer score = pronunciationService.geminiAnalyze(audio);
        return APIResponse.success(score);
    }
}