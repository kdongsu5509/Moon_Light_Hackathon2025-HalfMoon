package com.halfmoon.halfmoon.post.presentation;

import com.halfmoon.halfmoon.global.response.APIResponse;
import com.halfmoon.halfmoon.post.application.CommentService;
import com.halfmoon.halfmoon.post.presentation.dto.response.CommentResponseDto;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService service;

    @GetMapping("/{postId}")
    public APIResponse<List<CommentResponseDto>> getCommentsByPost(@AuthenticationPrincipal String email, UUID postId) {
        List<CommentResponseDto> commentsByPost = service.getCommentsByPost(email, postId);

        return APIResponse.success(commentsByPost);
    }

    @PostMapping("/like/{commentId}")
    public APIResponse<Void> likeComment(@AuthenticationPrincipal String email, UUID commentId) {
        service.likeComment(email, commentId);
        return APIResponse.success();
    }
}
