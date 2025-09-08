package com.halfmoon.halfmoon.study.presentation;

import com.halfmoon.halfmoon.global.response.APIResponse;
import com.halfmoon.halfmoon.security.domain.CustomUserDetails;
import com.halfmoon.halfmoon.study.application.SubjectStudyService;
import com.halfmoon.halfmoon.study.dto.req.StudyLevel;
import com.halfmoon.halfmoon.study.dto.req.SubjectStudyContenstRequestDto;
import com.halfmoon.halfmoon.study.dto.resp.CompletionRateResponse;
import com.halfmoon.halfmoon.study.dto.resp.SubjectStudyContentsResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(
        name = "주제별 학습 API",
        description = "주제별 학습 관련 API입니다."
)
@RestController
@RequestMapping("/api/subject")
@RequiredArgsConstructor
public class SubjectController {

    private final SubjectStudyService subjectStudyService;

    @Operation(
            summary = "주제 및 레벨별 학습 콘텐츠 생성",
            description = "사용자가 선택한 주제에 따라 맞춤형 학습 콘텐츠를 생성합니다. 만약 기존 생성된 것이 있으면 그것을 재사용합니다.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "학습 콘텐츠가 성공적으로 생성/조회되었습니다.",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = SubjectStudyContentsResponseDto.class)
                            )
                    )
            }
    )
    @RequestBody(
            description = "주제 및 레벨 정보",
            required = true,
            content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = SubjectStudyContenstRequestDto.class),
                    examples = @ExampleObject(
                            value = "{\"subject\": \"INTRODUCTION\", \"studyLevel\": \"LOW\"}"
                    )
            )
    )
    @PostMapping("/start")
    public APIResponse<SubjectStudyContentsResponseDto> getSubjectStudyContents(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @org.springframework.web.bind.annotation.RequestBody @Validated SubjectStudyContenstRequestDto req
    ) {
        String userEmail = userDetails.getUsername();
        SubjectStudyContentsResponseDto subjectStudyContentsResponseDto = subjectStudyService.generateContents(
                userEmail, req);
        return APIResponse.success(subjectStudyContentsResponseDto);
    }

    @Operation(
            summary = "학습 문장 완료 처리",
            description = "사용자가 학습한 문장을 완료 처리합니다.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "문장이 성공적으로 완료 처리되었습니다."
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "유효하지 않은 UUID 형식입니다."
                    )
            }
    )
    @PostMapping("/done/{sentenceId}")
    public APIResponse<Void> completeStudySentence(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable UUID sentenceId
    ) {
        subjectStudyService.completeStudySentence(userDetails.getUsername(), sentenceId);
        return APIResponse.success();
    }

    @Operation(
            summary = "난이도별 내 이수율 조회",
            description = "사용자가 선택한 난이도별(StudyLevel)로 각 주제의 완료율을 조회합니다.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "이수율 정보가 성공적으로 조회되었습니다.",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = CompletionRateResponse.class)
                            )
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "유효하지 않은 난이도입니다. (예: LOW, MID, HIGH 중 하나여야 함)."
                    )
            }
    )
    @GetMapping("/completion-rate/{studyLevel}")
    public APIResponse<CompletionRateResponse> getCompletionRate(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable StudyLevel studyLevel
    ) {
        CompletionRateResponse myCompletionRate = subjectStudyService.getMyCompletionRate(userDetails.getUsername(),
                studyLevel);
        return APIResponse.success(myCompletionRate);
    }
}