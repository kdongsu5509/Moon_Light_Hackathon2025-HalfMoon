package com.halfmoon.halfmoon.post.infra;

import com.halfmoon.halfmoon.post.domain.Post;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PostJpaRepository extends JpaRepository<Post, UUID> {
    @Override
    @Query("SELECT p FROM Post p JOIN FETCH p.user")
    List<Post> findAll();
}
