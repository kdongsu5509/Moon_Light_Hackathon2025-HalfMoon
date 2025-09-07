package com.halfmoon.halfmoon.post.application;

import com.halfmoon.halfmoon.post.domain.Comment;
import com.halfmoon.halfmoon.post.domain.CommentLike;
import com.halfmoon.halfmoon.post.infra.CommentJpaRepository;
import com.halfmoon.halfmoon.post.infra.CommentLikeJpaRepository;
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
            CommentLike commentLike = commentLikeJpaRepository.findByUserEmailAndCommentId(email, commentId).get();
            commentLikeJpaRepository.delete(commentLike);
            comment.decrementLikeCount();
            return;
        }

        CommentLike commentLike = CommentLike.create(user, comment);
        commentLikeJpaRepository.save(commentLike);
        comment.incrementLikeCount();
    }
}
