package com.halfmoon.halfmoon.user.application;

import com.halfmoon.halfmoon.security.domain.UserRepository;
import com.halfmoon.halfmoon.user.domain.Record;
import com.halfmoon.halfmoon.user.infra.MontlyGoalJpaRepository;
import com.halfmoon.halfmoon.user.infra.RecordJpaRepository;
import com.halfmoon.halfmoon.user.persentation.dto.response.RecordResponseDto;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class RecordServcie {

    private final UserRepository userRepository;
    private final RecordJpaRepository recordJpaRepository;
    private final MontlyGoalJpaRepository montlyGoalJpaRepository;

    public RecordResponseDto getMyRecord(String userEmail) {

        // 학습한 단어, 완료한 대화, 연속 학습일만 존재
        Record record = recordJpaRepository.findRecordByUserEmail(userEmail).orElseThrow(
                () -> new IllegalArgumentException("기록이 존재하지 않습니다.")
        );

        //UserId 가져오기
        UUID id = userRepository.findByEmail(userEmail).orElseThrow(
                () -> new IllegalArgumentException("유저가 존재하지 않습니다.")
        ).getId();

        int monthValue = LocalDateTime.now().getMonthValue();
        int year = LocalDateTime.now().getYear();
        // 월 -> year + monthValue

        String month = year + "-" + monthValue;

        //순위를 구해보자! -> 전체 유저 수, 나보다 학습한 단어가 많은 유저 수 -> 동적 쿼리가 나가야하네ㅠㅠ
        Long userRank = montlyGoalJpaRepository.getUserRank(
                id,
                month
        );

        return new RecordResponseDto(
                record.getWordCnt(),
                record.getTalkCnt(),
                record.getContinueDay(),
                userRank
        );
    }
}
