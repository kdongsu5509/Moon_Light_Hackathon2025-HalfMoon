package com.halfmoon.halfmoon.security.application;

import com.halfmoon.halfmoon.security.domain.User;
import com.halfmoon.halfmoon.security.domain.UserRepository;
import com.halfmoon.halfmoon.security.presentation.dto.EmailRespDto;
import com.halfmoon.halfmoon.security.presentation.dto.UserDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final BCryptPasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    public void signUp(UserDto req) {
        userRepository.save(toUser(req));
    }

    private User toUser(UserDto req) {
        return User.builder()
                .email(req.email())
                .password(encodePassword(req.password()))
                .role("USER")
                .name(req.name())
                .nickName(req.nickname())
                .age(req.age())
                .koreanLevel(req.koreanLevel())
                .nativeLanguage(req.nativeLanguage())
                .build();
    }

    private String encodePassword(String password) {
        return passwordEncoder.encode(password);
    }

    public EmailRespDto isEmailUnique(String email) {
        boolean isExist = userRepository.existsByEmail(email.trim());
        return new EmailRespDto(!isExist);
    }
}
