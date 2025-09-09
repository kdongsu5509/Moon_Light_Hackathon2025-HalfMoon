package com.halfmoon.halfmoon.study.presentation;

import com.halfmoon.halfmoon.global.response.APIResponse;
import com.halfmoon.halfmoon.study.application.ReviewTestService;
import com.halfmoon.halfmoon.study.dto.req.ReviewTestAnswerDto;
import com.halfmoon.halfmoon.study.dto.req.ReviewTestRequestDto;
import com.halfmoon.halfmoon.study.dto.resp.ReviewTestResponseDto;
import com.halfmoon.halfmoon.study.dto.resp.ReviewTestResultDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/study/review-test")
@RequiredArgsConstructor
public class ReviewTestController {

    private final ReviewTestService reviewTestService;

    @PostMapping("/generate")
    public ResponseEntity<APIResponse<ReviewTestResponseDto>> generateReviewTest(
            @Valid @RequestBody ReviewTestRequestDto request,
            Authentication authentication) {
        
        String userEmail = authentication.getName();
        log.info("복습 시험 생성 요청 - 사용자: {}, 주제: {}, 난이도: {}, 문제 수: {}", 
                userEmail, request.subject(), request.studyLevel(), request.questionCount());
        
        try {
            ReviewTestResponseDto response = reviewTestService.generateReviewTest(userEmail, request);
            return ResponseEntity.ok(APIResponse.success(response));
        } catch (Exception e) {
            log.error("복습 시험 생성 실패", e);
            return ResponseEntity.badRequest()
                    .body(APIResponse.fail(400, "복습 시험 생성에 실패했습니다: " + e.getMessage()));
        }
    }

    @PostMapping("/submit")
    public ResponseEntity<APIResponse<ReviewTestResultDto>> submitReviewTest(
            @Valid @RequestBody ReviewTestAnswerDto answerRequest,
            Authentication authentication) {
        
        String userEmail = authentication.getName();
        log.info("복습 시험 제출 - 사용자: {}, 테스트 ID: {}, 답안 수: {}", 
                userEmail, answerRequest.testId(), answerRequest.answers().size());
        
        try {
            ReviewTestResultDto result = reviewTestService.submitReviewTest(userEmail, answerRequest);
            return ResponseEntity.ok(APIResponse.success(result));
        } catch (Exception e) {
            log.error("복습 시험 제출 실패", e);
            return ResponseEntity.badRequest()
                    .body(APIResponse.fail(400, "복습 시험 제출에 실패했습니다: " + e.getMessage()));
        }
    }
}
