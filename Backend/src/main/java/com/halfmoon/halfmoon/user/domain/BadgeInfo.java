package com.halfmoon.halfmoon.user.domain;

public enum BadgeInfo {
    FIRST_STEP("첫 걸음", "첫 스터디 완료"),

    TALKING_BIGGINER("말하기 초보", "발음 연습 10회"),
    WORD_COLLECTOR("단어 수집가", "단어 50개 학습"),
    TALKING_MASTER("대화 달인", "대화 연습 20회"),
    SUNRISE_SPEAKER("Sunrise Speaker", "아침 9시 이전 학습"),
    COMMUNICATOR("의사소통왕", "게시판 글 10개 작성"),
    GOOD_PARTNER("도움이 되는 친구", "댓글 50개 이상 작성"),
    PERFECTISM("완벽 주의자", "모든 주제 완료"),
    KOREAN_MASTER("한국어 전문가", "고급 과정 완료"),
    CULTURE_EXPERT("문화 탐험가", "문화 컨텐츠 20개 학습"),
    MONTHLY_CHAMPION("이달의 챔피언", "월간 1위 달성");


    private final String title;
    private final String description;

    BadgeInfo(String title, String description) {
        this.title = title;
        this.description = description;
    }

}
