package com.halfmoon.halfmoon.security.presentation;

import com.dt.find_restaurant.security.application.JwtService;
import com.dt.find_restaurant.security.domain.JwtResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
    @PostMapping("/reissue")
    public JwtResult.Issue reissue(@Valid @NotEmpty(message = "리프레시 토큰 값은 필수입니다.") @RequestBody String refreshToken) {
        return jwtService.reissueJwtToken(refreshToken);
    }
}
