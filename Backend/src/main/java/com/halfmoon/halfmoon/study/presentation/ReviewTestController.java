package com.halfmoon.halfmoon.study.presentation;

import com.halfmoon.halfmoon.global.response.APIResponse;
import com.halfmoon.halfmoon.study.application.ReviewTestService;
import com.halfmoon.halfmoon.study.dto.req.ReviewTestAnswerDto;
import com.halfmoon.halfmoon.study.dto.req.ReviewTestRequestDto;
import com.halfmoon.halfmoon.study.dto.resp.ReviewTestResponseDto;
import com.halfmoon.halfmoon.study.dto.resp.ReviewTestResultDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/study/review-test")
@RequiredArgsConstructor
@Tag(name = "복습 시험", description = "복습 시험 생성 및 제출 관련 API")
public class ReviewTestController {

    private final ReviewTestService reviewTestService;

    @Operation(summary = "복습 시험 생성", description = "주제, 난이도, 문제 수를 기반으로 복습 시험을 생성합니다.")
    @PostMapping("/generate")
    public APIResponse<ReviewTestResponseDto> generateReviewTest(
            @Valid @RequestBody ReviewTestRequestDto request,
            Authentication authentication) {

        String userEmail = authentication.getName();
        log.info("복습 시험 생성 요청 - 사용자: {}, 주제: {}, 난이도: {}, 문제 수: {}",
                userEmail, request.subject(), request.studyLevel(), request.questionCount());
        ReviewTestResponseDto response = reviewTestService.generateReviewTest(userEmail, request);
        return APIResponse.success(response);
    }

    @Operation(summary = "복습 시험 제출", description = "생성된 복습 시험의 답안을 제출하고 결과를 확인합니다.")
    @PostMapping("/submit")
    public APIResponse<ReviewTestResultDto> submitReviewTest(
            @Valid @RequestBody ReviewTestAnswerDto answerRequest,
            Authentication authentication) {

        String userEmail = authentication.getName();
        log.info("복습 시험 제출 - 사용자: {}, 테스트 ID: {}, 답안 수: {}",
                userEmail, answerRequest.testId(), answerRequest.answers().size());
        ReviewTestResultDto result = reviewTestService.submitReviewTest(userEmail, answerRequest);
        return APIResponse.success(result);
    }
}