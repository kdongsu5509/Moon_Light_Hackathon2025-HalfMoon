package com.halfmoon.halfmoon.post.domain;

import static jakarta.persistence.FetchType.LAZY;

import com.halfmoon.halfmoon.global.domain.BaseEntity;
import com.halfmoon.halfmoon.security.domain.User;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Post extends BaseEntity {
    @Id
    private UUID id;

    private String title;

    @Lob
    private String content;

    private Long viewCount;

    private Long likeCount;

    private Long commentCount;

    @ManyToOne(fetch = LAZY)
    private User user;

    private Post(String title, String content, User user) {
        this.id = UUID.randomUUID();
        this.title = title;
        this.content = content;
        this.user = user;
        this.viewCount = 0L;
        this.likeCount = 0L;
        this.commentCount = 0L;
    }

    public static Post create(String title, String content, User user) {
        return new Post(title, content, user);
    }

    public void incrementViewCount() {
        this.viewCount++;
    }

    public void incrementLikeCount() {
        this.likeCount++;
    }

    public void decrementLikeCount() {
        if (this.likeCount > 0) {
            this.likeCount--;
        }
    }
}
