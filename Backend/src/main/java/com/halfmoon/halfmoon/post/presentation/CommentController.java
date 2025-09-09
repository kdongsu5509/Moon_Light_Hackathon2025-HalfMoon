package com.halfmoon.halfmoon.post.presentation;

import com.halfmoon.halfmoon.global.response.APIResponse;
import com.halfmoon.halfmoon.post.application.CommentService;
import com.halfmoon.halfmoon.post.presentation.dto.request.CommentRequestDto;
import com.halfmoon.halfmoon.post.presentation.dto.response.CommentResponseDto;
import com.halfmoon.halfmoon.security.domain.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
@Tag(name = "Comment API", description = "댓글 관리 API") // 컨트롤러 전체에 대한 태그
public class CommentController {

    private final CommentService service;

    @Operation(summary = "게시글의 모든 댓글 조회", description = "특정 게시글에 달린 모든 댓글을 조회합니다.")
    @GetMapping("/{postId}")
    public APIResponse<List<CommentResponseDto>> getCommentsByPost(
            @Parameter(description = "사용자 이메일 (인증 정보)", hidden = true) // 이 파라미터는 스웨거 문서에 숨김
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Parameter(description = "게시글 ID (UUID)")
            @PathVariable UUID postId) {
        List<CommentResponseDto> commentsByPost = service.getCommentsByPost(userDetails.getUsername(), postId);

        return APIResponse.success(commentsByPost);
    }

    @Operation(summary = "새로운 댓글 추가", description = "특정 게시글에 새로운 댓글을 추가합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "댓글이 성공적으로 추가됨"),
                    @ApiResponse(responseCode = "400", description = "잘못된 요청")
            })
    @PostMapping("/add/{postId}")
    public APIResponse<UUID> addComment(
            @Parameter(description = "사용자 정보 (인증 객체)", hidden = true)
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Parameter(description = "댓글 내용 및 관련 정보")
            @Validated CommentRequestDto req,
            @Parameter(description = "게시글 ID (UUID)")
            @PathVariable UUID postId) {
        UUID comment = service.createComment(userDetails.getUsername(), postId, req);
        return APIResponse.success(comment);
    }

    @Operation(summary = "댓글 좋아요", description = "특정 댓글에 '좋아요'를 누릅니다.")
    @PostMapping("/like/{commentId}")
    public APIResponse<Void> likeComment(
            @Parameter(description = "사용자 이메일 (인증 정보)", hidden = true)
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Parameter(description = "댓글 ID (UUID)")
            @PathVariable UUID commentId) {
        service.likeComment(userDetails.getUsername(), commentId);
        return APIResponse.success();
    }
}