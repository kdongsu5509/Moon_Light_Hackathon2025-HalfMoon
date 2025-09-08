package com.halfmoon.halfmoon.security.presentation;

import com.halfmoon.halfmoon.security.application.JwtService;
import com.halfmoon.halfmoon.security.domain.JwtResult;
import com.halfmoon.halfmoon.security.presentation.dto.TokenReissueRequestDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(
        name = "인증",
        description = "인증 관련 API"
)
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtService jwtService;

    @Operation(
            summary = "Access/Refresh 재발급",
            description = "Request Body에 담긴 유효한 Refresh Token을 사용하여 새로운 Access Token과 Refresh Token을 발급받습니다."
    )
    @PostMapping(value = "/reissue", consumes = "application/json")
    public JwtResult.Issue reissue(
            @Validated @RequestBody TokenReissueRequestDto req) {
        return jwtService.reissueJwtToken(req.refreshToken());
    }
}
