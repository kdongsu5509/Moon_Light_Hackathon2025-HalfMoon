package com.halfmoon.halfmoon.study.dto.resp;

import java.util.List;
import java.util.UUID;

public record SubjectStudyContentsResponseDto(
        UUID id,
        List<SubjectStudySentence> sentences
) {
}
