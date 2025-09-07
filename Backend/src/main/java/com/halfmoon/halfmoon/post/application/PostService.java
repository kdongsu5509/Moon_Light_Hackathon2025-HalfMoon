package com.halfmoon.halfmoon.post.application;

import com.halfmoon.halfmoon.post.domain.Comment;
import com.halfmoon.halfmoon.post.domain.CommentLike;
import com.halfmoon.halfmoon.post.domain.Post;
import com.halfmoon.halfmoon.post.domain.PostLike;
import com.halfmoon.halfmoon.post.infra.CommentJpaRepository;
import com.halfmoon.halfmoon.post.infra.CommentLikeJpaRepository;
import com.halfmoon.halfmoon.post.infra.PostJpaRepository;
import com.halfmoon.halfmoon.post.infra.PostLikeJpaRepository;
import com.halfmoon.halfmoon.post.presentation.dto.request.PostRequestDto;
import com.halfmoon.halfmoon.post.presentation.dto.response.CommentResponseDto;
import com.halfmoon.halfmoon.post.presentation.dto.response.PostResponseDto;
import com.halfmoon.halfmoon.post.presentation.dto.response.PostWithCommentResponseDto;
import com.halfmoon.halfmoon.security.domain.User;
import com.halfmoon.halfmoon.security.domain.UserRepository;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Service
@RequiredArgsConstructor
public class PostService {

    private final UserRepository userRepository;
    private final PostJpaRepository postRepository;
    private final PostLikeJpaRepository postLikeRepository;
    private final CommentJpaRepository commentJpaRepository;
    private final CommentLikeJpaRepository commentLikeRepository;
    private final CommentLikeJpaRepository commentLikeJpaRepository;

    public List<PostResponseDto> getAllPosts(String userEmail) {
        List<PostLike> myPostLikes = postLikeRepository.findByUserEmail(userEmail);
        List<Post> allPosts = postRepository.findAll();
        return toDto(allPosts, myPostLikes);
    }

    private List<PostResponseDto> toDto(List<Post> posts, List<PostLike> myPostLikes) {

        return posts.stream()
                .map(post -> {
                    boolean likedByMe = myPostLikes.stream()
                            .anyMatch(like -> like.getPost().getId().equals(post.getId()));
                    return toDto(post, likedByMe);
                })
                .toList();
    }

    private PostResponseDto toDto(Post post, boolean likedByMe) {
        return new PostResponseDto(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getUser().getNickName(),
                post.getCreatedAt(),
                post.getViewCount(),
                post.getLikeCount(),
                post.getCommentCount(),
                likedByMe
        );
    }

    public UUID createPost(String userEmail, PostRequestDto request) {
        User user = userRepository.findByEmail(userEmail).orElseThrow(
                () -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + userEmail)
        );

        Post post = Post.create(request.title(), request.content(), user);
        Post save = postRepository.save(post);

        return save.getId();
    }

    public PostWithCommentResponseDto getPostWithComment(String userEmail, UUID postId) {
        //1. 게시글 조회
        Post post = postRepository.findById(postId).orElseThrow(
                () -> new IllegalArgumentException("게시글을 찾을 수 없습니다: " + postId)
        );

        //2. 조회수 증가
        post.incrementViewCount();

        //3. 관련 댓글 모두 조회
        List<Comment> allComments = commentJpaRepository.findByPostId(postId);
        List<CommentLike> myLikeList = commentLikeJpaRepository.findByUserEmail(userEmail);
        List<CommentResponseDto> commentDtos = toCommentResponseDto(allComments, myLikeList);

        //4. 상세 게시글 응답 생성
        boolean likedByMe = postLikeRepository.findByUserEmailAndPostId(userEmail, postId).isPresent();
        return new PostWithCommentResponseDto(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getUser().getNickName(),
                post.getCreatedAt(),
                post.getViewCount(),
                post.getLikeCount(),
                post.getCommentCount(),
                likedByMe,
                commentDtos
        );
    }

    private List<CommentResponseDto> toCommentResponseDto(List<Comment> allComments, List<CommentLike> myLikeList) {
        return allComments.stream()
                .map(comment -> {
                    boolean isLiked = myLikeList.stream()
                            .anyMatch(like -> like.getId().equals(comment.getId()));
                    return new CommentResponseDto(
                            comment.getId(),
                            comment.getContent(),
                            comment.getUser().getNickName(),
                            comment.getCreatedAt(),
                            comment.getLikeCount(),
                            isLiked
                    );
                })
                .toList();
    }

    public void likePost(String username, UUID postId) {
        Post post = postRepository.findById(postId).orElseThrow(
                () -> new IllegalArgumentException("게시글을 찾을 수 없습니다: " + postId)
        );
        User user = userRepository.findByEmail(username).orElseThrow(
                () -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + username)
        );

        boolean alreadyLiked = postLikeRepository.findByUserEmailAndPostId(username, postId).isPresent();

        if (alreadyLiked) {
            //취소하기
            PostLike existingLike = postLikeRepository.findByUserEmailAndPostId(username, postId).get();
            postLikeRepository.delete(existingLike);
            post.decrementLikeCount();
            return;
        }

        PostLike postLike = PostLike.create(user, post);
        postLikeRepository.save(postLike);
        post.incrementLikeCount();
    }
}
