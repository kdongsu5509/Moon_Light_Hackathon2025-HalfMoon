package com.halfmoon.halfmoon.post.infra;

import com.halfmoon.halfmoon.post.domain.CommentLike;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentLikeJpaRepository extends JpaRepository<CommentLike, UUID> {
    List<CommentLike> findByUserEmail(String userEmail);

    Optional<CommentLike> findByUserEmailAndCommentId(String email, UUID commentId);

    List<CommentLike> findByCommentId(UUID id);
}
