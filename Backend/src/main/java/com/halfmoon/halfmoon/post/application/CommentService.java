package com.halfmoon.halfmoon.post.application;

import com.halfmoon.halfmoon.post.domain.Comment;
import com.halfmoon.halfmoon.post.domain.CommentLike;
import com.halfmoon.halfmoon.post.domain.Post;
import com.halfmoon.halfmoon.post.infra.CommentJpaRepository;
import com.halfmoon.halfmoon.post.infra.CommentLikeJpaRepository;
import com.halfmoon.halfmoon.post.infra.PostJpaRepository;
import com.halfmoon.halfmoon.post.presentation.dto.request.CommentRequestDto;
import com.halfmoon.halfmoon.post.presentation.dto.response.CommentResponseDto;
import com.halfmoon.halfmoon.security.domain.User;
import com.halfmoon.halfmoon.security.domain.UserRepository;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class CommentService {
    private final UserRepository userRepository;
    private final CommentJpaRepository commentJpaRepository;
    private final CommentLikeJpaRepository commentLikeJpaRepository;
    private final PostJpaRepository postJpaRepository;

    public List<CommentResponseDto> getCommentsByPost(String email, UUID postId) {
        // 1. 댓글 목록 조회
        List<Comment> comments = commentJpaRepository.findByPostId(postId);
        //2. 내가 좋아요 눌렀는지 여부 확인
        List<CommentLike> myLikeList = commentLikeJpaRepository.findByUserEmail(email);
        return toCommentResponseDto(comments, myLikeList);
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

    public void likeComment(String email, UUID commentId) {
        // 1. 댓글 조회
        Comment comment = commentJpaRepository.findById(commentId).orElseThrow(
                () -> new IllegalArgumentException("댓글을 찾을 수 없습니다: " + commentId)
        );

        User user = userRepository.findByEmail(email).orElseThrow(
                () -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + email)
        );

        boolean alreadyLiked = commentLikeJpaRepository.findByUserEmailAndCommentId(email, commentId).isPresent();

        if (alreadyLiked) {
            //취소하기
            CommentLike commentLike = commentLikeJpaRepository.findByUserEmailAndCommentId(email, commentId)
                    .orElseThrow(
                            () -> new IllegalArgumentException("좋아요를 찾을 수 없습니다: " + commentId)
                    );
            commentLikeJpaRepository.delete(commentLike);
            comment.decrementLikeCount();
            return;
        }

        CommentLike commentLike = CommentLike.create(user, comment);
        commentLikeJpaRepository.save(commentLike);
        comment.incrementLikeCount();
    }

    public void deleteComment(String email, UUID commentId) {
        Comment comment = commentJpaRepository.findById(commentId).orElseThrow(
                () -> new IllegalArgumentException("댓글을 찾을 수 없습니다: " + commentId)
        );

        if (!comment.getUser().getEmail().equals(email)) {
            throw new IllegalArgumentException("댓글 작성자만 삭제할 수 있습니다.");
        }

        commentJpaRepository.delete(comment);
    }

    public UUID createComment(String username, UUID postId, CommentRequestDto req) {
        User user = userRepository.findByEmail(username).orElseThrow(
                () -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + username)
        );

        Post post = postJpaRepository.findById(postId).orElseThrow(
                () -> new IllegalArgumentException("게시글을 찾을 수 없습니다: " + postId)
        );

        Comment comment = Comment.of(req.content(), post, user);
        Comment savedComment = commentJpaRepository.save(comment);
        return savedComment.getId();
    }
}
