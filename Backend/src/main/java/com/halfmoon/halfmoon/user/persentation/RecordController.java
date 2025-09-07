package com.halfmoon.halfmoon.user.persentation;

import com.halfmoon.halfmoon.global.response.APIResponse;
import com.halfmoon.halfmoon.security.domain.CustomUserDetails;
import com.halfmoon.halfmoon.user.application.RecordServcie;
import com.halfmoon.halfmoon.user.persentation.dto.response.RecordResponseDto;
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
public class RecordController {

    private final RecordServcie recordService;

    @GetMapping
    public APIResponse<RecordResponseDto> getMyRecord(@AuthenticationPrincipal CustomUserDetails userDetails) {
        RecordResponseDto myRecord = recordService.getMyRecord(userDetails.getUsername());
        return APIResponse.success(myRecord);
    }
}
