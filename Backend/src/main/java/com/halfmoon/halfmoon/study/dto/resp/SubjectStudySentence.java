package com.halfmoon.halfmoon.study.dto.resp;

import java.util.UUID;

public record SubjectStudySentence(
        UUID id,
        String sentence,
        String meaning
) {
}
