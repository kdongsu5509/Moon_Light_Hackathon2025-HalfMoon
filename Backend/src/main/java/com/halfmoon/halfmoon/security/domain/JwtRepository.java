package com.halfmoon.halfmoon.security.domain;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface JwtRepository {
    JwtEntity save(JwtEntity jwtEntity);

    void deleteById(UUID id);

    void deleteByUserEmail(String userEmail);

    List<JwtEntity> findAll();

    Optional<JwtEntity> findJwtByUserEmail(String userEmail);

    void delete(JwtEntity jwtEntity);

    Optional<JwtEntity> findJwtByAccessToken(String accessToken);

    Optional<JwtEntity> findJwtByRefreshToken(String refreshToken);

}
