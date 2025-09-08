package com.halfmoon.halfmoon.study.application;

import com.halfmoon.halfmoon.security.domain.User;
import com.halfmoon.halfmoon.security.domain.UserRepository;
import com.halfmoon.halfmoon.study.aiResponse.AISubjectStudyContentsResponse;
import com.halfmoon.halfmoon.study.domain.Sentence;
import com.halfmoon.halfmoon.study.domain.UserToStudyContent;
import com.halfmoon.halfmoon.study.dto.req.SubjectStudyContenstRequestDto;
import com.halfmoon.halfmoon.study.dto.resp.SubjectStudyContentsResponseDto;
import com.halfmoon.halfmoon.study.dto.resp.SubjectStudySentence;
import com.halfmoon.halfmoon.study.infra.SentenceJpaRepository;
import com.halfmoon.halfmoon.study.infra.UserToStudyContentJpaRepository;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class SubjectStudyService {

    private final OpenAiChatModel chatModel;
    PromptMessage promptMessage = new PromptMessage(); // 프롬프트 메시지 관리 객체
    private final UserRepository userRepository; // 사용자 정보 접근 레포지토리
    private final UserToStudyContentJpaRepository userToStudyContentJpaRepository; // 사용자-학습내용 매핑 레포지토리
    private final SentenceJpaRepository sentenceJpaRepository; // 문장 정보 접근 레포지토리

    public SubjectStudyContentsResponseDto generateContents(String userEmail, SubjectStudyContenstRequestDto req) {
        //1. 사용자 정보 조회
        User user = userRepository.findByEmail(userEmail).orElseThrow(
                () -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + userEmail)
        );

        //2. 사용자 학습내용 매핑 레포지토리에 기록이 있는 지 확인.
        Optional<UserToStudyContent> userToStudyContent = userToStudyContentJpaRepository.findBySubjectAndStudyLevel(
                req.subject(), req.studyLevel());
        //3. 기록이 있으면, 해당 내용 리턴
        if (userToStudyContent.isPresent()) {
            return getSubjectStudyContentResponsedtoFromDB(userToStudyContent);

        } else { // 4. 기록이 없으면, OpenAI API 호출을 통해 내용 생성 -> DB 저장 -> 리턴 // TODO!!
            generateSubjectStudyContentsWithOpenAi(req, user);
            Optional<UserToStudyContent> newUserToStudyContent = userToStudyContentJpaRepository.findBySubjectAndStudyLevel(
                    req.subject(), req.studyLevel());
            if (newUserToStudyContent.isPresent()) {
                return getSubjectStudyContentResponsedtoFromDB(newUserToStudyContent);
            } else {
                throw new RuntimeException("학습 내용 생성에 실패했습니다. 다시 시도해주세요.");
            }
        }
    }

    private SubjectStudyContentsResponseDto getSubjectStudyContentResponsedtoFromDB(
            Optional<UserToStudyContent> userToStudyContent) {
        UserToStudyContent contents = userToStudyContent.get();
        Collection<Sentence> studySentences = sentenceJpaRepository.findByStudyContentId(contents.getId());
        if (studySentences.isEmpty()) {
            throw new RuntimeException("해당 학습 내용에 대한 문장이 존재하지 않습니다.");
        }

        List<SubjectStudySentence> list = studySentences.stream().map(
                this::toSubjectStudySentence
        ).toList();
        return new SubjectStudyContentsResponseDto(contents.getId(), list);
    }

    private void generateSubjectStudyContentsWithOpenAi(SubjectStudyContenstRequestDto req,
                                                        User user) {
        Map<String, Object> params = setPromptingParamsWithUserInfoAndSubjectAndLevel(req, user);
        AISubjectStudyContentsResponse entity = ChatClient.create(chatModel).prompt()
                .user(u -> u.text(
                        promptMessage.subjectStudyContentsCreatingPrompt
                ).params(params))
                .call()
                .entity(AISubjectStudyContentsResponse.class);

        // DB에 저장
        UserToStudyContent userToStudyContent = UserToStudyContent.of(req.subject(), req.studyLevel());
        UserToStudyContent save = userToStudyContentJpaRepository.save(userToStudyContent);

        assert entity != null;
        List<Sentence> list = entity.contents().stream()
                .map(sentence -> Sentence.create(sentence.sentence(), sentence.meaning(), sentence.newWordCount(),
                        save))
                .toList();
        sentenceJpaRepository.saveAll(list);
    }

    private static Map<String, Object> setPromptingParamsWithUserInfoAndSubjectAndLevel(
            SubjectStudyContenstRequestDto req, User user) {
        Map<String, Object> params = new HashMap<>();
        params.put("subject", req.subject());
        params.put("level", req.studyLevel());
        params.put("age", user.getAge());
        params.put("nativeLanguage", user.getNativeLanguage());
        params.put("koreanLevel", user.getKoreanLevel());
        return params;
    }

    private SubjectStudySentence toSubjectStudySentence(Sentence sentence) {
        return new SubjectStudySentence(
                sentence.getId(),
                sentence.getSentence(),
                sentence.getMeaning()
        );
    }
}
