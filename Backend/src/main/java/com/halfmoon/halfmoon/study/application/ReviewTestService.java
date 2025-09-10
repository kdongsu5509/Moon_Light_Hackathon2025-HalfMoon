package com.halfmoon.halfmoon.study.application;

import com.halfmoon.halfmoon.security.domain.User;
import com.halfmoon.halfmoon.security.domain.UserRepository;
import com.halfmoon.halfmoon.study.domain.ReviewTestAnswer;
import com.halfmoon.halfmoon.study.domain.ReviewTestQuestion;
import com.halfmoon.halfmoon.study.domain.ReviewTestSession;
import com.halfmoon.halfmoon.study.domain.Sentence;
import com.halfmoon.halfmoon.study.dto.req.ReviewTestAnswerDto;
import com.halfmoon.halfmoon.study.dto.req.ReviewTestRequestDto;
import com.halfmoon.halfmoon.study.dto.req.StudyLevel;
import com.halfmoon.halfmoon.study.dto.req.Subject;
import com.halfmoon.halfmoon.study.dto.resp.ReviewTestQuestionDto;
import com.halfmoon.halfmoon.study.dto.resp.ReviewTestResponseDto;
import com.halfmoon.halfmoon.study.dto.resp.ReviewTestResultDto;
import com.halfmoon.halfmoon.study.infra.ReviewTestAnswerJpaRepository;
import com.halfmoon.halfmoon.study.infra.ReviewTestQuestionJpaRepository;
import com.halfmoon.halfmoon.study.infra.ReviewTestSessionJpaRepository;
import com.halfmoon.halfmoon.study.infra.SentenceJpaRepository;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ReviewTestService {

    private final UserRepository userRepository;
    private final SentenceJpaRepository sentenceJpaRepository;
    private final ReviewTestSessionJpaRepository reviewTestSessionJpaRepository;
    private final ReviewTestQuestionJpaRepository reviewTestQuestionJpaRepository;
    private final ReviewTestAnswerJpaRepository reviewTestAnswerJpaRepository;

    public ReviewTestResponseDto generateReviewTest(String userEmail, ReviewTestRequestDto request) {
        // 1. 사용자 정보 조회
        User user = userRepository.findByEmail(userEmail).orElseThrow(
                () -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + userEmail)
        );

        // 2. 해당 사용자의 주제와 난이도의 학습 내용 조회
        Subject subject = request.subject();
        StudyLevel studyLevel = request.studyLevel();

        // 2단계: 사용자별 StudyContent 조회
        List<Sentence> learnedSentences = sentenceJpaRepository.findByStudyContentSubjectAndStudyContentStudyLevelAndStudyContentUser(
                subject, studyLevel, user);

        if (learnedSentences.isEmpty()) {
            throw new IllegalArgumentException("해당 주제의 학습 내용을 찾을 수 없습니다. 먼저 해당 주제를 학습해주세요.");
        }

        // 3. 학습한 문장들 조회 (이미 위에서 조회됨)
        log.info("=== 문장 조회 시작 ===");
        log.info("사용자: {}, 주제: {}, 난이도: {}", userEmail, subject, studyLevel);
        log.info("조회된 문장 수: {}", learnedSentences.size());
        log.info("조회된 문장들: {}", learnedSentences.stream().map(Sentence::getSentence).toList());

        // 문장 조회 시점에서도 랜덤화 적용
        Collections.shuffle(learnedSentences, new Random(System.currentTimeMillis()));

        // 4. 퀴즈 문제 생성
        log.info("학습한 문장 수: {}, 요청한 문제 수: {}", learnedSentences.size(), request.questionCount());
        List<ReviewTestQuestionDto> questions = generateQuestions(learnedSentences, request.questionCount());
        log.info("생성된 문제 수: {}", questions.size());
        log.info("생성된 문제들: {}", questions.stream().map(q -> q.question()).toList());

        // 5. 테스트 ID 생성 (UUID)
        String testId = UUID.randomUUID().toString();

        // 6. 복습 시험 세션 생성 및 저장
        ReviewTestSession session = ReviewTestSession.create(
                testId,
                questions.size(),
                10, // 10분 제한
                subject,
                studyLevel,
                user
        );
        ReviewTestSession savedSession = reviewTestSessionJpaRepository.save(session);

        // 7. 문제들을 데이터베이스에 저장
        List<ReviewTestQuestion> savedQuestions = new ArrayList<>();
        for (ReviewTestQuestionDto questionDto : questions) {
            ReviewTestQuestion question = ReviewTestQuestion.create(
                    questionDto.id(),
                    questionDto.type(),
                    questionDto.question(),
                    questionDto.correctAnswer(),
                    questionDto.explanation(),
                    questionDto.image(),
                    questionDto.originalSentence(),
                    savedSession
            );
            savedQuestions.add(reviewTestQuestionJpaRepository.save(question));
        }

        return new ReviewTestResponseDto(
                testId,
                questions,
                questions.size(),
                10 // 10분 제한
        );
    }

    public ReviewTestResultDto submitReviewTest(String userEmail, ReviewTestAnswerDto answerRequest) {
        // 1. 사용자 정보 조회
        userRepository.findByEmail(userEmail).orElseThrow(
                () -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + userEmail)
        );

        // 2. 복습 시험 세션 조회
        ReviewTestSession session = reviewTestSessionJpaRepository.findByTestId(answerRequest.testId())
                .orElseThrow(() -> new IllegalArgumentException("해당 테스트를 찾을 수 없습니다: " + answerRequest.testId()));

        // 3. 문제들 조회
        List<ReviewTestQuestion> questions = reviewTestQuestionJpaRepository.findByReviewTestSessionId(session.getId());
        Map<String, ReviewTestQuestion> questionMap = questions.stream()
                .collect(java.util.stream.Collectors.toMap(ReviewTestQuestion::getQuestionId, q -> q));

        // 4. 답안 채점 및 저장
        List<ReviewTestResultDto.QuestionResult> questionResults = new ArrayList<>();
        int correctCount = 0;
        List<ReviewTestAnswer> savedAnswers = new ArrayList<>();

        for (var answer : answerRequest.answers()) {
            ReviewTestQuestion question = questionMap.get(answer.questionId());
            if (question == null) {
                log.warn("문제를 찾을 수 없습니다: {}", answer.questionId());
                continue;
            }

            // 정답과 비교하여 채점
            boolean isCorrect = evaluateAnswer(question, answer.userAnswer());
            if (isCorrect) {
                correctCount++;
            }

            // 답안 저장
            ReviewTestAnswer reviewTestAnswer = ReviewTestAnswer.create(
                    answer.questionId(),
                    answer.userAnswer(),
                    isCorrect,
                    session
            );
            savedAnswers.add(reviewTestAnswerJpaRepository.save(reviewTestAnswer));

            // 결과 생성
            questionResults.add(new ReviewTestResultDto.QuestionResult(
                    answer.questionId(),
                    question.getQuestion(),
                    question.getCorrectAnswer(),
                    answer.userAnswer(),
                    isCorrect,
                    question.getExplanation()
            ));
        }

        // 5. 세션 완료 처리
        session.markAsCompleted();
        reviewTestSessionJpaRepository.save(session);

        // 6. 결과 계산
        int totalQuestions = answerRequest.answers().size();
        int score = totalQuestions > 0 ? (correctCount * 100) / totalQuestions : 0;
        String grade = calculateGrade(score);
        int earnedPoints = calculatePoints(score, totalQuestions);

        log.info("복습 시험 완료 - 사용자: {}, 점수: {}/{} ({}%), 등급: {}",
                userEmail, correctCount, totalQuestions, score, grade);

        return new ReviewTestResultDto(
                answerRequest.testId(),
                totalQuestions,
                correctCount,
                score,
                grade,
                earnedPoints,
                questionResults
        );
    }

    private List<ReviewTestQuestionDto> generateQuestions(List<Sentence> sentences, int questionCount) {
        List<ReviewTestQuestionDto> questions = new ArrayList<>();

        // 더 강력한 랜덤 시드 생성 (UUID + 시간 + 나노초 + 문장 내용)
        long uniqueSeed = UUID.randomUUID().toString().hashCode() +
                System.currentTimeMillis() +
                System.nanoTime() +
                sentences.hashCode() +
                sentences.stream().mapToInt(s -> s.getSentence().hashCode()).sum();
        Random random = new Random(uniqueSeed);

        // 문제 수를 학습한 문장 수로 제한
        int actualQuestionCount = Math.min(questionCount, sentences.size());

        // 문장을 랜덤하게 섞기
        List<Sentence> shuffledSentences = new ArrayList<>(sentences);
        Collections.shuffle(shuffledSentences, random);

        // 랜덤하게 문장 선택 (중복 없이)
        List<Sentence> selectedSentences = new ArrayList<>();
        Set<Integer> selectedIndices = new HashSet<>();

        while (selectedSentences.size() < actualQuestionCount && selectedIndices.size() < shuffledSentences.size()) {
            int randomIndex = random.nextInt(shuffledSentences.size());
            if (selectedIndices.add(randomIndex)) {
                selectedSentences.add(shuffledSentences.get(randomIndex));
            }
        }

        // 선택된 문장들을 다시 섞기 (추가 랜덤화)
        Collections.shuffle(selectedSentences, random);

        log.info("=== 복습 시험 문제 생성 ===");
        log.info("원본 문장 수: {}, 요청 문제 수: {}, 실제 선택 수: {}",
                sentences.size(), questionCount, selectedSentences.size());
        log.info("원본 문장들: {}", sentences.stream().map(Sentence::getSentence).toList());
        log.info("선택된 문장들: {}", selectedSentences.stream().map(Sentence::getSentence).toList());
        log.info("랜덤 시드: {}", uniqueSeed);

        for (int i = 0; i < selectedSentences.size(); i++) {
            Sentence sentence = selectedSentences.get(i);

            // 문제 유형을 랜덤하게 선택 (객관식 60%, 빈칸 채우기 40%)
            // 문장 내용과 인덱스를 고려한 더 나은 랜덤화
            double randomValue = random.nextDouble();
            // 문장 내용의 해시값을 추가로 고려
            double sentenceHash = Math.abs(sentence.getSentence().hashCode() % 100) / 100.0;
            double combinedRandom = (randomValue + sentenceHash) % 1.0;
            String questionType = combinedRandom < 0.6 ? "multiple" : "fill";

            // 고유한 문제 ID 생성 (UUID + 랜덤값 + 인덱스)
            String questionId = "q_" + UUID.randomUUID().toString().substring(0, 8) + "_" +
                    random.nextInt(10000) + "_" + (i + 1);

            ReviewTestQuestionDto question = createQuestion(sentence, questionType, questionId, random);
            questions.add(question);
        }

        return questions;
    }

    private ReviewTestQuestionDto createQuestion(Sentence sentence, String type, String questionId, Random random) {
        if ("multiple".equals(type)) {
            return createMultipleChoiceQuestion(questionId, sentence, random);
        } else {
            return createFillInTheBlankQuestion(questionId, sentence, random);
        }
    }

    private ReviewTestQuestionDto createMultipleChoiceQuestion(String questionId, Sentence sentence, Random random) {
        String originalSentence = sentence.getSentence();
        String meaning = sentence.getMeaning();

        // 다양한 문제 유형 생성
        String[] questionTypes = {
                "다음 문장의 의미는 무엇인가요?",
                "아래 문장이 의미하는 것은?",
                "이 문장의 올바른 해석은?",
                "다음 문장의 뜻은?",
                "아래 문장의 의미로 적절한 것은?",
                "이 문장이 전달하는 내용은?",
                "다음 문장을 해석하면?",
                "아래 문장의 핵심 의미는?",
                "이 문장이 표현하는 것은?",
                "다음 문장의 정확한 의미는?",
                "아래 문장이 말하고자 하는 것은?",
                "이 문장의 주된 내용은?",
                "다음 문장을 이해하면?",
                "아래 문장의 의미로 가장 적절한 것은?",
                "이 문장이 나타내는 것은?"
        };

        String questionTemplate = questionTypes[random.nextInt(questionTypes.length)];
        String question = String.format("%s\n\"%s\"", questionTemplate, originalSentence);

        // 선택지 생성 (정답 + 오답 3개)
        List<String> options = generateMultipleChoiceOptions(meaning, random);
        String correctAnswer = meaning;

        String explanation = String.format("정답은 \"%s\"입니다. 이 문장은 %s를 의미합니다.",
                meaning, originalSentence);

        return new ReviewTestQuestionDto(
                questionId,
                "multiple",
                question,
                options,
                correctAnswer,
                explanation,
                "📝",
                originalSentence
        );
    }

    private ReviewTestQuestionDto createFillInTheBlankQuestion(String questionId, Sentence sentence, Random random) {
        String originalSentence = sentence.getSentence();

        // 문장에서 핵심 단어를 빈칸으로 만들기
        String[] words = originalSentence.split(" ");
        if (words.length < 2) {
            // 단어가 너무 적으면 객관식으로 변경
            return createMultipleChoiceQuestion(questionId, sentence, random);
        }

        // 랜덤하게 빈칸으로 만들 단어 선택 (첫 번째나 마지막 단어는 피하기)
        int blankIndex;
        if (words.length <= 2) {
            blankIndex = random.nextInt(words.length);
        } else {
            blankIndex = random.nextInt(words.length - 2) + 1; // 중간 단어들 중에서 선택
        }
        String correctWord = words[blankIndex];

        // 빈칸이 있는 문장 생성
        StringBuilder questionBuilder = new StringBuilder();
        for (int i = 0; i < words.length; i++) {
            if (i == blankIndex) {
                questionBuilder.append("____");
            } else {
                questionBuilder.append(words[i]);
            }
            if (i < words.length - 1) {
                questionBuilder.append(" ");
            }
        }

        // 다양한 문제 템플릿
        String[] questionTemplates = {
                "빈칸에 들어갈 말은?",
                "빈칸을 채우세요:",
                "다음 문장의 빈칸에 알맞은 단어는?",
                "빈칸에 들어갈 적절한 단어는?",
                "문장을 완성하세요:",
                "빈칸에 들어갈 올바른 단어는?",
                "다음 문장의 빈칸을 채우세요:",
                "빈칸에 들어갈 적절한 말은?",
                "문장의 빈칸에 들어갈 단어는?",
                "빈칸을 완성하세요:",
                "다음 문장의 빈칸에 맞는 단어는?",
                "빈칸에 들어갈 정확한 단어는?",
                "문장을 완전하게 만들려면 빈칸에?",
                "빈칸에 들어갈 가장 적절한 말은?",
                "다음 문장의 빈칸을 완성하세요:"
        };

        String questionTemplate = questionTemplates[random.nextInt(questionTemplates.length)];
        String question = String.format("%s\n\"%s\"", questionTemplate, questionBuilder.toString());
        String explanation = String.format("정답은 \"%s\"입니다. 원래 문장: \"%s\"",
                correctWord, originalSentence);

        return new ReviewTestQuestionDto(
                questionId,
                "fill",
                question,
                null, // 빈칸 채우기는 선택지 없음
                correctWord,
                explanation,
                "✏️",
                originalSentence
        );
    }

    private List<String> generateMultipleChoiceOptions(String correctAnswer, Random random) {
        List<String> options = new ArrayList<>();
        options.add(correctAnswer);

        // 더 다양하고 현실적인 오답 선택지들
        String[] wrongAnswers = {
                "안녕하세요",
                "감사합니다",
                "죄송합니다",
                "네, 맞습니다",
                "아니요, 틀렸습니다",
                "모르겠습니다",
                "다시 말씀해 주세요",
                "이해했습니다",
                "잘 모르겠어요",
                "그렇지 않습니다",
                "맞지 않습니다",
                "틀렸습니다",
                "정확하지 않습니다",
                "다른 의미입니다",
                "잘못된 해석입니다",
                "좋은 아침입니다",
                "안녕히 가세요",
                "어떻게 지내세요?",
                "괜찮습니다",
                "문제없습니다",
                "도움이 필요합니다",
                "시간이 없습니다",
                "바쁩니다",
                "피곤합니다",
                "기쁩니다",
                "슬픕니다",
                "화가 납니다",
                "걱정됩니다",
                "놀랍습니다",
                "재미있습니다"
        };

        List<String> wrongOptions = new ArrayList<>(Arrays.asList(wrongAnswers));
        Collections.shuffle(wrongOptions, random);

        // 오답 3개 선택 (중복 제거)
        Set<String> selectedWrongAnswers = new HashSet<>();
        for (String wrongAnswer : wrongOptions) {
            if (selectedWrongAnswers.size() >= 3) {
                break;
            }
            if (!wrongAnswer.equals(correctAnswer) && selectedWrongAnswers.add(wrongAnswer)) {
                options.add(wrongAnswer);
            }
        }

        // 선택지가 4개 미만이면 추가 오답 생성
        while (options.size() < 4) {
            String additionalWrong = "오답 " + (random.nextInt(1000) + 1);
            if (!options.contains(additionalWrong)) {
                options.add(additionalWrong);
            } else {
                break;
            }
        }

        // 선택지 섞기 (정답 위치도 랜덤하게)
        Collections.shuffle(options, random);

        return options;
    }

    private boolean evaluateAnswer(ReviewTestQuestion question, String userAnswer) {
        if (userAnswer == null || userAnswer.trim().isEmpty()) {
            return false;
        }

        String correctAnswer = question.getCorrectAnswer();
        String trimmedUserAnswer = userAnswer.trim();
        String trimmedCorrectAnswer = correctAnswer.trim();

        // 대소문자 구분 없이 비교
        boolean isCorrect = trimmedUserAnswer.equalsIgnoreCase(trimmedCorrectAnswer);

        log.debug("답안 채점 - 문제: {}, 사용자 답안: '{}', 정답: '{}', 결과: {}",
                question.getQuestionId(), trimmedUserAnswer, trimmedCorrectAnswer, isCorrect);

        return isCorrect;
    }

    private String calculateGrade(int score) {
        if (score >= 90) {
            return "A";
        }
        if (score >= 80) {
            return "B";
        }
        if (score >= 70) {
            return "C";
        }
        return "D";
    }

    private int calculatePoints(int score, int totalQuestions) {
        // 점수에 비례하여 포인트 계산
        return (score * totalQuestions) / 10;
    }
}
