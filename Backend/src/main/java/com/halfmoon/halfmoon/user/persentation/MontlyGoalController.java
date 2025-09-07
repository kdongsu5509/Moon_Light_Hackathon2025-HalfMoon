package com.halfmoon.halfmoon.user.persentation;

import com.halfmoon.halfmoon.global.response.APIResponse;
import com.halfmoon.halfmoon.security.domain.CustomUserDetails;
import com.halfmoon.halfmoon.user.application.MonthlyGoalService;
import com.halfmoon.halfmoon.user.persentation.dto.request.MonthlyGoalRequestDto;
import com.halfmoon.halfmoon.user.persentation.dto.response.MontlyGoalResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "월별 목표 API", description = "사용자의 월별 목표(포인트) 설정, 조회, 삭제를 관리합니다.")
@Slf4j
@RestController
@RequestMapping("/api/my/goal")
@RequiredArgsConstructor
public class MontlyGoalController {

    private final MonthlyGoalService service;

    @Operation(summary = "월별 목표 조회", description = "로그인한 사용자의 현재 월 목표 달성 정보를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "성공적으로 목표를 조회했습니다.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = MontlyGoalResponseDto.class))),
            @ApiResponse(responseCode = "404", description = "해당 사용자의 목표를 찾을 수 없습니다."),
            @ApiResponse(responseCode = "401", description = "인증 실패")
    })
    @GetMapping
    public APIResponse<MontlyGoalResponseDto> getMonthlyGoal(
            @Parameter(hidden = true) @AuthenticationPrincipal CustomUserDetails user) {
        MontlyGoalResponseDto response = service.getUserMontlyGoal(user.getUsername());
        return APIResponse.success(response);
    }

    @Operation(summary = "월별 목표 설정", description = "로그인한 사용자의 월 목표 포인트를 설정합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "성공적으로 목표를 설정했습니다."),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 데이터입니다."),
            @ApiResponse(responseCode = "401", description = "인증 실패")
    })
    @PostMapping
    public APIResponse<UUID> setMontlyGoal(
            @Parameter(hidden = true) @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody(description = "설정할 월 목표 포인트", required = true, content = @Content(schema = @Schema(implementation = MonthlyGoalRequestDto.class)))
            @org.springframework.web.bind.annotation.RequestBody
            MonthlyGoalRequestDto req
    ) {
        UUID uuid = service.setUserMontlyGoal(user.getUsername(), req);
        return APIResponse.success(uuid);
    }

    @Operation(summary = "월별 목표 삭제", description = "로그인한 사용자의 현재 월 목표를 삭제합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "성공적으로 목표를 삭제했습니다."),
            @ApiResponse(responseCode = "401", description = "인증 실패")
    })
    @DeleteMapping
    public APIResponse<Void> deleteMontlyGoal(
            @Parameter(hidden = true) @AuthenticationPrincipal CustomUserDetails user) {
        service.deleteUserMonthlyGoal(user.getUsername());
        return APIResponse.success();
    }
}