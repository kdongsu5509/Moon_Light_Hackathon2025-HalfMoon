package com.halfmoon.halfmoon.user.application;

import com.halfmoon.halfmoon.security.domain.UserRepository;
import com.halfmoon.halfmoon.user.domain.StudyRecord;
import com.halfmoon.halfmoon.user.infra.MontlyGoalJpaRepository;
import com.halfmoon.halfmoon.user.infra.StudyRecordJpaRepository;
import com.halfmoon.halfmoon.user.persentation.dto.response.StudyRecordResponseDto;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class StudyRecordServcie {

    private final UserRepository userRepository;
    private final StudyRecordJpaRepository studyRecordJpaRepository;
    private final MontlyGoalJpaRepository montlyGoalJpaRepository;

    public StudyRecordResponseDto getMyStudyRecord(String userEmail) {

        // 학습한 단어, 완료한 대화, 연속 학습일만 존재
        StudyRecord studyRecord = studyRecordJpaRepository.findRecordByUserEmail(userEmail).orElseThrow(
                () -> new IllegalArgumentException("기록이 존재하지 않습니다.")
        );

        //UserId 가져오기
        UUID id = studyRecord.getUser().getId();

        int monthValue = LocalDateTime.now().getMonthValue();
        int year = LocalDateTime.now().getYear();

        String month = year + "-" + monthValue;
        //순위를 구해보자! -> 전체 유저 수, 나보다 학습한 단어가 많은 유저 수 -> 동적 쿼리가 나가야하네ㅠㅠ
        Long userRank = montlyGoalJpaRepository.getUserRank(
                id,
                month
        );

        return new StudyRecordResponseDto(
                studyRecord.getWordCnt(),
                studyRecord.getTalkCnt(),
                studyRecord.getContinueDay(),
                userRank
        );
    }
}
