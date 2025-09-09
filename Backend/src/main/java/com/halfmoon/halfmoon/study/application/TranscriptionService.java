package com.halfmoon.halfmoon.study.application;

import lombok.RequiredArgsConstructor;
import org.springframework.ai.audio.transcription.AudioTranscriptionPrompt;
import org.springframework.ai.audio.transcription.AudioTranscriptionResponse;
import org.springframework.ai.openai.OpenAiAudioTranscriptionModel;
import org.springframework.ai.openai.OpenAiAudioTranscriptionOptions;
import org.springframework.ai.openai.api.OpenAiAudioApi.TranscriptResponseFormat;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TranscriptionService {

    private final OpenAiAudioTranscriptionModel openAiAudioTranscriptionModel;

    public String convertAudioToText(byte[] audioData) {
        Resource audioResource = new ByteArrayResource(audioData);

        // 2. 음성 인식 옵션 설정
        OpenAiAudioTranscriptionOptions transcriptionOptions = OpenAiAudioTranscriptionOptions.builder()
                .responseFormat(TranscriptResponseFormat.TEXT)
                .temperature(0f)
                .language("ko") // 한국어 설정
                .build();

        AudioTranscriptionPrompt transcriptionPrompt = new AudioTranscriptionPrompt(audioResource,
                transcriptionOptions);

        AudioTranscriptionResponse response = openAiAudioTranscriptionModel.call(transcriptionPrompt);

        return response.getResult().getOutput();
    }
}