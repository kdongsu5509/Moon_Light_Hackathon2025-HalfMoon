package com.halfmoon.halfmoon.study.dto.resp;

import java.util.List;

public record CompletionRateResponse(
        List<SubjectCompletionRateDto> subjectCompletionRates
) {
}
