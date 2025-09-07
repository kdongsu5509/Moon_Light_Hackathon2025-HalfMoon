package com.halfmoon.halfmoon.security.global.filter;

import static com.halfmoon.halfmoon.security.global.util.Properties.LOGIN_URL;

import com.halfmoon.halfmoon.global.util.JsonUtils;
import com.halfmoon.halfmoon.security.application.JwtService;
import com.halfmoon.halfmoon.security.domain.JwtResult;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@RequiredArgsConstructor
@Slf4j
public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    {
        setFilterProcessesUrl(LOGIN_URL);
    }

    // 로그인 시도.
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException {
        log.info("LoginFilter - attemptAuthentication called");
        UsernamePasswordAuthenticationToken authRequest = new UsernamePasswordAuthenticationToken(
                obtainUsername(request), obtainPassword(request), null
        );

        log.info("Attempting to authenticate: {},{}", obtainUsername(request), obtainPassword(request));

        // AuthenticationManager에게 인증 요청 위임.
        return authenticationManager.authenticate(authRequest);
    }

    // SUCCESS -> 로그인 정상 작동 후 JWT 발급 로직
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
                                            Authentication authResult) throws IOException {
        UserDetails user = (UserDetails) authResult.getPrincipal();
        JwtResult.Issue resDto = jwtService.issueJwtAuth(user.getUsername(),
                user.getAuthorities().iterator().next().getAuthority());

        log.info("login success : {}", JsonUtils.toJson(resDto));

        response.setStatus(HttpStatus.OK.value());
        response.getWriter().write(JsonUtils.toJson(resDto)); //우선 현재는 쿠키를 사용 X.
    }

    // 실패 시 -> 로그인 실패 RESPONSE를 반환.
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                              AuthenticationException failed) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json;charset=UTF-8");

        PrintWriter out = response.getWriter();
        String errorMsg = "Authentication failed: " + failed.getMessage();
        out.print("{\"error\": \"" + errorMsg + "\"}");

        out.flush();
    }
}
