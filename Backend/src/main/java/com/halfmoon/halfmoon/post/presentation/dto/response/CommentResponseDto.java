package com.halfmoon.halfmoon.post.presentation.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record CommentResponseDto(
        UUID id,
        String content,
        String creatorNickname,
        LocalDateTime createdAt,
        Long likeCount,
        Boolean isLiked
) {
}
