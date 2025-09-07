package com.halfmoon.halfmoon.user.persentation;

import com.halfmoon.halfmoon.global.response.APIResponse;
import com.halfmoon.halfmoon.security.domain.CustomUserDetails;
import com.halfmoon.halfmoon.user.application.MyInfoService;
import com.halfmoon.halfmoon.user.persentation.dto.response.UserNickNameDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(
        name = "내 정보",
        description = "내 정보 관련 API"
)
@Slf4j
@RequestMapping("/api/my/info")
@RestController
@RequiredArgsConstructor
public class MyInfoController {

    final MyInfoService service;

    @Operation(
            summary = "내 닉네임 조회",
            description = "인증된 사용자의 이메일을 기반으로 해당 사용자의 닉네임 정보를 조회합니다."
    )
    @ApiResponses(
            value = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "200",
                            description = "내 정보 조회 성공",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = UserNickNameDto.class)
                            )

                    ),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "401",
                            description = "인증 실패"
                    )
            }
    )
    @GetMapping("/nickname")
    public APIResponse<UserNickNameDto> myInfo(@AuthenticationPrincipal CustomUserDetails userDetails) {
        UserNickNameDto myInfo = service.getMyNickname(userDetails.getUsername());
        return APIResponse.success(myInfo);
    }
}
