package com.halfmoon.halfmoon.post.presentation;

import com.halfmoon.halfmoon.global.response.APIResponse;
import com.halfmoon.halfmoon.post.application.PostService;
import com.halfmoon.halfmoon.post.presentation.dto.request.PostRequestDto;
import com.halfmoon.halfmoon.post.presentation.dto.response.PostResponseDto;
import com.halfmoon.halfmoon.post.presentation.dto.response.PostWithCommentResponseDto;
import com.halfmoon.halfmoon.security.domain.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/post")
@RequiredArgsConstructor
@Tag(name = "Post API", description = "게시글 관련 API")
public class PostController {

    private final PostService postService;

    @Operation(summary = "모든 게시글 조회", description = "전체 게시글 목록을 조회합니다.")
    @GetMapping("/all")
    public APIResponse<List<PostResponseDto>> getAllPosts(
            @Parameter(description = "사용자 정보 (인증 객체)", hidden = true)
            @AuthenticationPrincipal CustomUserDetails user) {
        List<PostResponseDto> posts = postService.getAllPosts(user.getUsername());
        return APIResponse.success(posts);
    }


    @Operation(summary = "특정 게시글 상세 조회", description = "특정 ID를 가진 게시글과 해당 댓글 목록을 함께 조회합니다.")
    @GetMapping("/{postId}")
    public APIResponse<PostWithCommentResponseDto> getPostById(
            @Parameter(description = "사용자 정보 (인증 객체)", hidden = true)
            @AuthenticationPrincipal CustomUserDetails user,
            @Parameter(description = "조회할 게시글의 ID (UUID)")
            @PathVariable UUID postId
    ) {
        PostWithCommentResponseDto post = postService.getPostWithComment(user.getUsername(), postId);
        return APIResponse.success(post);
    }


    @Operation(summary = "게시글 생성", description = "새로운 게시글을 생성합니다.")
    @PostMapping
    public APIResponse<UUID> createPost(
            @Parameter(description = "사용자 정보 (인증 객체)", hidden = true)
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "생성할 게시글의 내용")
            @RequestBody PostRequestDto request) {
        UUID postId = postService.createPost(userDetails.getUsername(), request);
        return APIResponse.success(postId);
    }


    @Operation(summary = "게시글 좋아요", description = "특정 게시글에 좋아요 또는 좋아요 취소를 수행합니다. 좋아요와 싫어요를 통합하여 처리합니다.")
    @PostMapping("/like/{postId}")
    public APIResponse<Void> likePost(
            @Parameter(description = "사용자 정보 (인증 객체)", hidden = true)
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Parameter(description = "좋아요를 누를 게시글의 ID (UUID)")
            @PathVariable UUID postId) {
        postService.likePost(userDetails.getUsername(), postId);
        return APIResponse.success();
    }


    @Operation(summary = "게시글 삭제", description = "특정 게시글을 삭제합니다.")
    @DeleteMapping("/{postId}")
    public APIResponse<Void> deletePost(
            @Parameter(description = "사용자 정보 (인증 객체)", hidden = true)
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Parameter(description = "삭제할 게시글의 ID (UUID)")
            @PathVariable UUID postId) {
        postService.deletePost(userDetails.getUsername(), postId);
        return APIResponse.success();
    }
}