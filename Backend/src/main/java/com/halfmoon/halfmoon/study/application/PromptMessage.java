package com.halfmoon.halfmoon.study.application;

import lombok.Getter;
import org.springframework.stereotype.Component;

@Getter
@Component
public class PromptMessage {
    String subjectStudyContentsCreatingPrompt = """
            당신은 한국어 학습을 돕는 챗봇입니다.
            사용자가 요청한 주제에 맞는 한국어 연습 어휘 15문장을 생성해주세요.
            각 문장은 100자 이내로 작성해 주세요.
            각 문장은 한국인들이 일상에서 자주 사용하는 표현으로 작성해 주세요.
            각 문장의 뜻을 사용자의 모국어로도 알려주세요.
            각 문장 별로 내가 새롭게 배운 단어들에 대해서도 알려주세요.
            
            주제 : {subject}
            난이도 : {level}
            사용자 나이 : {age}
            사용자의 모국어 : {nativeLanguage}
            사용자의 한국어 수준 : {koreanLevel}
            언어 : 한국어
            """;
}
