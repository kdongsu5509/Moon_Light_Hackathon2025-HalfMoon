package com.halfmoon.halfmoon.security.infra;

import com.halfmoon.halfmoon.security.domain.JwtEntity;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

@Component
@Repository
public interface JwtJpaRepository extends JpaRepository<JwtEntity, UUID> {

    void deleteByEmail(String email);

    Optional<JwtEntity> findJwtEntityByEmail(String email);

    Optional<JwtEntity> findJwtByAccessToken(String accessToken);

    Optional<JwtEntity> findJwtByRefreshToken(String refreshToken);
}
