package com.halfmoon.halfmoon.user.persentation.dto.response;

public record StudyRecordResponseDto(
        Long wordCnt, // 학습한 단어 수
        Long talkCnt, // 완료한 대화 수
        Long continueDay, // 연속 학습 일수
        Long myRank // 나의 랭킹
) {
}
