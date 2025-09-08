package com.halfmoon.halfmoon.study.dto.resp;

import com.halfmoon.halfmoon.study.dto.req.Subject;

public record SubjectCompletionRateDto(
        Subject subject,
        double completionRate
) {
}
