package com.halfmoon.halfmoon.user.application;

import com.halfmoon.halfmoon.security.domain.User;
import com.halfmoon.halfmoon.security.domain.UserRepository;
import com.halfmoon.halfmoon.user.persentation.dto.response.UserNickNameDto;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class MyInfoService {
    private final UserRepository userRepository;

    public UserNickNameDto getMyNickname(String userEmail) {
        log.info("내 정보 서비스 - 내 정보 조회 요청: userEmail={}", userEmail);
        Optional<User> findUser = userRepository.findByEmail(userEmail);
        if (findUser.isEmpty()) {
            throw new RuntimeException("User not found with email: " + userEmail);
        }

        User user = findUser.get();
        return new UserNickNameDto(user.getNickName());
    }
}
