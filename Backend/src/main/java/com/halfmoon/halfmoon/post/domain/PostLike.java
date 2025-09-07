package com.halfmoon.halfmoon.post.domain;

import static jakarta.persistence.FetchType.LAZY;
import static jakarta.persistence.GenerationType.UUID;
import static lombok.AccessLevel.PROTECTED;

import com.halfmoon.halfmoon.security.domain.User;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = PROTECTED)
public class PostLike {
    @Id
    @GeneratedValue(strategy = UUID)
    private UUID id;

    @ManyToOne(fetch = LAZY)
    User user;

    @ManyToOne(fetch = LAZY)
    Post post;

    public static PostLike create(User user, Post post) {
        PostLike postLike = new PostLike();
        postLike.user = user;
        postLike.post = post;
        return postLike;
    }

}
