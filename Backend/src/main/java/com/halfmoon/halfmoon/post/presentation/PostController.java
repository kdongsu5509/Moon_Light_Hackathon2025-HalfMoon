package com.halfmoon.halfmoon.post.presentation;

import com.halfmoon.halfmoon.global.response.APIResponse;
import com.halfmoon.halfmoon.post.application.PostService;
import com.halfmoon.halfmoon.post.presentation.dto.request.PostRequestDto;
import com.halfmoon.halfmoon.post.presentation.dto.response.PostResponseDto;
import com.halfmoon.halfmoon.post.presentation.dto.response.PostWithCommentResponseDto;
import com.halfmoon.halfmoon.security.domain.CustomUserDetails;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
public class PostController {

    private final PostService postService;

    @GetMapping("/all")
    public APIResponse<List<PostResponseDto>> getAllPosts(@AuthenticationPrincipal CustomUserDetails user) {
        List<PostResponseDto> posts = postService.getAllPosts(user.getUsername());
        return APIResponse.success(posts);
    }

    @GetMapping("/{postId}")
    public APIResponse<PostWithCommentResponseDto> getPostById(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable UUID postId
    ) {
        PostWithCommentResponseDto post = postService.getPostWithComment(user.getUsername(), postId);
        return APIResponse.success(post);
    }

    @PostMapping
    public APIResponse<UUID> createPost(@AuthenticationPrincipal CustomUserDetails userDetails,
                                        @RequestBody PostRequestDto request) {
        UUID postId = postService.createPost(userDetails.getUsername(), request);
        return APIResponse.success(postId);
    }

    //좋아요 와 싫어요 통합
    @PostMapping("/like/{postId}")
    public APIResponse<Void> likePost(@AuthenticationPrincipal CustomUserDetails userDetails,
                                      @PathVariable UUID postId) {
        postService.likePost(userDetails.getUsername(), postId);
        return APIResponse.success();
    }
}
