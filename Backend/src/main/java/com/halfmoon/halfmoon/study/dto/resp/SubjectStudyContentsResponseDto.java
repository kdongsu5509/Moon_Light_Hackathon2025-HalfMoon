package com.halfmoon.halfmoon.study.dto.resp;

import java.util.List;

public record SubjectStudyContentsResponseDto(
        List<SubjectStudySentence> sentences
) {
}
