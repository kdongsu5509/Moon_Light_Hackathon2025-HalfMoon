package com.halfmoon.halfmoon.security.domain;

import java.util.Collection;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository {

    //CRUD
    UUID save(User user);

    Optional<User> findById(UUID id);

    Optional<User> findByEmail(String email);

    void deleteById(UUID id);

    void update(User user);

    Collection<User> findAll();

    Optional<User> findByUserName(String userName);

    boolean existsByEmail(String email);

    boolean existsByUserName(String userName);
}
