package com.halfmoon.halfmoon.global.response;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@Schema(
        description = "공통 APIResponse",
        title = "APIResponse",
        example = """
                {
                    "code": 200,
                    "message": "OK",
                    "data": {
                        // Your data here
                    }
                }
                """
)
public class APIResponse<T> {
    @Schema(description = "HTTP 상태 코드", example = "200")
    private final int code;
    @Schema(description = "응답 메시지", example = "OK")
    private final String message;

    @JsonInclude(NON_NULL)
    @Schema(description = "응답 데이터")
    private final T data;

    private APIResponse(int code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    public static <T> APIResponse<T> success(T data) {
        return new APIResponse<>(
                HttpStatus.OK.value(),
                HttpStatus.OK.getReasonPhrase(),
                data
        );
    }

    public static <T> APIResponse<T> success() {
        return success(null);
    }

    public static <T> APIResponse<T> fail(int code, String message) {
        return new APIResponse<>(code, message, null);
    }
}
