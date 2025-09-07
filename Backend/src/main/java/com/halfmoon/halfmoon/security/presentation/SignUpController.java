package com.halfmoon.halfmoon.security.presentation;

import com.halfmoon.halfmoon.global.response.APIResponse;
import com.halfmoon.halfmoon.security.application.UserService;
import com.halfmoon.halfmoon.security.presentation.dto.EmailReqDto;
import com.halfmoon.halfmoon.security.presentation.dto.EmailRespDto;
import com.halfmoon.halfmoon.security.presentation.dto.UserDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(
        name = "사용자",
        description = "사용자 관련 API"
)
@Slf4j
@RestController
@RequestMapping("/api/signup")
@RequiredArgsConstructor
public class SignUpController {

    private final UserService userService;

    @Operation(
            summary = "회원 가입",
            description = "새로운 사용자를 등록합니다. 요청 본문에 사용자 정보를 포함해야 합니다."
    )
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "회원 가입 요청 본문",
            required = true,
            content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = UserDto.class)
            )
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "회원 가입 성공"
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "잘못된 요청"
                    )
            }
    )
    @PostMapping
    public void signUp(@Validated @RequestBody UserDto req) {
        userService.signUp(req);
    }

    @Operation(
            summary = "이메일 중복 확인",
            description = "사용자가 입력한 이메일이 이미 존재하는지 확인합니다. 요청 본문에 이메일 정보를 포함해야 합니다."
    )
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "이메일 중복 확인 요청 본문",
            required = true,
            content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = EmailReqDto.class)
            )
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "이메일 중복 확인 성공",
                            content = @Content(schema = @Schema(implementation = EmailRespDto.class))
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "잘못된 요청"
                    )
            }
    )
    @PostMapping("/email-check")
    public APIResponse<EmailRespDto> isEmailUnique(@RequestBody EmailReqDto req) {
        EmailRespDto emailUnique = userService.isEmailUnique(req.email());
        return APIResponse.success(emailUnique);
    }
}
