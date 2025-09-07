package com.halfmoon.halfmoon.user.application;

import com.halfmoon.halfmoon.security.domain.UserRepository;
import com.halfmoon.halfmoon.user.dto.UserInfoResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class MyService {
    private final UserRepository userRepository;

    public UserInfoResponseDto getMyInfo(String userEmail) {
        log.info("내 정보 서비스 - 내 정보 조회 요청: userEmail={}", userEmail);
        throw new RuntimeException("Not Implemented");
    }
}
