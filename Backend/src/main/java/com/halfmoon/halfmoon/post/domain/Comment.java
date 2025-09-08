package com.halfmoon.halfmoon.post.domain;

import static jakarta.persistence.FetchType.LAZY;

import com.halfmoon.halfmoon.global.domain.BaseEntity;
import com.halfmoon.halfmoon.security.domain.User;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Comment extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String content;

    private Long likeCount;

    @ManyToOne(fetch = LAZY)
    private Post post;

    @ManyToOne(fetch = LAZY)
    private User user;

    public static Comment of(String content, Post post, User user) {
        Comment comment = new Comment();
        comment.content = content;
        comment.post = post;
        comment.user = user;
        comment.likeCount = 0L;
        return comment;
    }

    public void decrementLikeCount() {
        this.likeCount--;
    }

    public void incrementLikeCount() {
        this.likeCount++;
    }
}
