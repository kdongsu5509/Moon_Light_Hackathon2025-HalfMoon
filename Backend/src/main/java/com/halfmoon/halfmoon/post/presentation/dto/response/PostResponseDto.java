package com.halfmoon.halfmoon.post.presentation.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record PostResponseDto(
        UUID postId,
        String title,
        String content,
        String creatorNickname,
        LocalDateTime createdAt,
        Long viewCount,
        Long likeCount,
        Long commentCount,
        Boolean isLiked
) {
}
