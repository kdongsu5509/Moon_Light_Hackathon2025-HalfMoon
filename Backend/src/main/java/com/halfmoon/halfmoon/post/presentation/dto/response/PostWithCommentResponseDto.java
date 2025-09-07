package com.halfmoon.halfmoon.post.presentation.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record PostWithCommentResponseDto(
        UUID postId,
        String title,
        String content,
        String creatorNickname,
        LocalDateTime createdAt,
        Long viewCount,
        Long likeCount,
        Long commentCount,
        Boolean isLiked,
        List<CommentResponseDto> comments
) {
}
