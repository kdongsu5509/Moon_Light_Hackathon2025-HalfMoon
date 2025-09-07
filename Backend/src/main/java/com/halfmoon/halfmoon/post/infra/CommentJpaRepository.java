package com.halfmoon.halfmoon.post.infra;

import com.halfmoon.halfmoon.post.domain.Comment;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentJpaRepository extends JpaRepository<Comment, UUID> {
    List<Comment> findByPostId(UUID postId);
}
