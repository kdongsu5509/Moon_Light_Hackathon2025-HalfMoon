package com.halfmoon.halfmoon.security.infra;

import com.halfmoon.halfmoon.security.domain.JwtEntity;
import com.halfmoon.halfmoon.security.domain.JwtRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
@Slf4j
public class JwtRepositoryImpl implements JwtRepository {

    private final JwtJpaRepository jwtRepository;

    @Override
    public JwtEntity save(JwtEntity jwtEntity) {
        log.info("DB에 저장하는 Access 정보: {}", jwtEntity.getAccessToken());
        return jwtRepository.save(jwtEntity);
    }

    @Override
    public void deleteById(UUID id) {
        jwtRepository.deleteById(id);
    }

    @Override
    public void deleteByUserEmail(String userEmail) {
        jwtRepository.deleteByEmail(userEmail);
    }

    @Override
    public List<JwtEntity> findAll() {
        return jwtRepository.findAll();
    }

    @Override
    public Optional<JwtEntity> findJwtByUserEmail(String userEmail) {
        return jwtRepository.findJwtEntityByEmail(userEmail);
    }

    @Override
    public void delete(JwtEntity jwtEntity) {
        jwtRepository.delete(jwtEntity);
    }

    @Override
    public Optional<JwtEntity> findJwtByAccessToken(String accessToken) {
        return jwtRepository.findJwtByAccessToken(accessToken);
    }

    @Override
    public Optional<JwtEntity> findJwtByRefreshToken(String refreshToken) {
        return jwtRepository.findJwtByRefreshToken(refreshToken);
    }
}
