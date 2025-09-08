package com.halfmoon.halfmoon.study.presentation;

import com.halfmoon.halfmoon.global.response.APIResponse;
import com.halfmoon.halfmoon.security.domain.CustomUserDetails;
import com.halfmoon.halfmoon.study.application.SubjectStudyService;
import com.halfmoon.halfmoon.study.dto.req.SubjectStudyContenstRequestDto;
import com.halfmoon.halfmoon.study.dto.resp.SubjectStudyContentsResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
            description = "사용자가 선택한 주제에 따라 맞춤형 학습 콘텐츠를 생성합니다. 만약 기존 생성된 것이 있으면 그것을 재사용합니다."
    )
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "주제 및 레벨 정보",
            required = true,
            content = @io.swagger.v3.oas.annotations.media.Content(
                    mediaType = "application/json",
                    schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = SubjectStudyContenstRequestDto.class)
            )
    )
    @PostMapping("/start")
    public APIResponse<SubjectStudyContentsResponseDto> getSubjectStudyContents(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody @Validated SubjectStudyContenstRequestDto req
    ) {

        String userEmail = userDetails.getUsername(); // 인증된 사용자의 이메일 가져오기
        SubjectStudyContentsResponseDto subjectStudyContentsResponseDto = subjectStudyService.generateContents(
                userEmail, req);
        return APIResponse.success(subjectStudyContentsResponseDto);
    }

}
