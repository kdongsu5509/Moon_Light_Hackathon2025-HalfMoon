package com.halfmoon.halfmoon.security.infra;

import com.halfmoon.halfmoon.global.exception.CustomExceptions.UserException;
import com.halfmoon.halfmoon.global.exception.CustomExcpMsgs.USER_NOT_FOUND;
import com.halfmoon.halfmoon.security.domain.User;
import com.halfmoon.halfmoon.security.domain.UserRepository;
import java.util.Collection;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class UserRepositoryImpl implements UserRepository {

    private final UserJpaRepository UserJpaRepository;


    @Override
    public UUID save(User user) {
        return UserJpaRepository.save(user).getId();
    }

    @Override
    public Optional<User> findById(UUID id) {
        return UserJpaRepository.findById(id);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return UserJpaRepository.findByEmail(email);
    }

    @Override
    public void deleteById(UUID id) {
        if (!UserJpaRepository.existsById(id)) {
            throw new UserException(USER_NOT_FOUND.getMessage() + id);
        }
        UserJpaRepository.deleteById(id);
    }

    @Override
    public void update(User user) {
        if (!UserJpaRepository.existsById(user.getId())) {
            throw new UserException(USER_NOT_FOUND.getMessage() + user.getId());
        }
        UserJpaRepository.save(user);
    }

    @Override
    public Collection<User> findAll() {
        return UserJpaRepository.findAll();
    }

    @Override
    public Optional<User> findByUserName(String userName) {
        return UserJpaRepository.findByUserName(userName);
    }

    @Override
    public boolean existsByEmail(String email) {
        return UserJpaRepository.existsByEmail(email);
    }

    @Override
    public boolean existsByUserName(String userName) {
        return UserJpaRepository.existsByUserName(userName);
    }


}
