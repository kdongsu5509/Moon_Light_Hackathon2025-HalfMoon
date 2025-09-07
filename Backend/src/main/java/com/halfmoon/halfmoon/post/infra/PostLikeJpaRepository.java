package com.halfmoon.halfmoon.post.infra;

import com.halfmoon.halfmoon.post.domain.PostLike;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostLikeJpaRepository extends JpaRepository<PostLike, UUID> {
    List<PostLike> findByUserEmail(String userEmail);

    Optional<PostLike> findByUserEmailAndPostId(String userEmail, UUID postId);
}
