package com.halfmoon.halfmoon.user.persentation;

import com.halfmoon.halfmoon.global.response.APIResponse;
import com.halfmoon.halfmoon.security.domain.CustomUserDetails;
import com.halfmoon.halfmoon.user.application.StudyRecordServcie;
import com.halfmoon.halfmoon.user.persentation.dto.response.StudyRecordResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "학습 기록 API", description = "사용자의 학습한 기록(단어 수, 대화 수, 연속 학습일, 순위 등을 관리합니다.")
@Slf4j
@RestController
@RequestMapping("/api/my/record")
@RequiredArgsConstructor
public class StudyRecordController {

    private final StudyRecordServcie recordService;

    @Operation(summary = "나의 학습 기록 조회", description = "로그인한 사용자의 학습 기록을 조회합니다.")
    @GetMapping
    public APIResponse<StudyRecordResponseDto> getMyRecord(
            @Parameter(description = "사용자 정보 (인증 객체)", hidden = true)
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        StudyRecordResponseDto myRecord = recordService.getMyStudyRecord(userDetails.getUsername());
        return APIResponse.success(myRecord);
    }
}