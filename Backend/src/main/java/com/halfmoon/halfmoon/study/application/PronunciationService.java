package com.halfmoon.halfmoon.study.application;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * Gemini API를 사용하여 오디오 파일을 분석하고 평가를 담당하는 서비스입니다.
 * <p>
 * 1. 오디오 파일을 업로드할 곳의 URL을 요청합니다. 2. 오디오 파일을 업로드하고 해당 파일이 저장된 URL을 가져옵니다. 3. 업로드된 파일이 저장된 URL을 바탕으로 Gemini API에 요청을
 * 보냅니다.
 */


@Slf4j
@Service
@RequiredArgsConstructor
public class PronunciationService {

    @Value("${google.api.key}")
    private String GOOGLE_API_KEY;
    private final static String PROMPT_FILE = "prompt.txt";
    private final static String UPLOAD_URL_REQUEST_URL = "https://generativelanguage.googleapis.com/upload/v1beta/files";
    private final static String ANALYZE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

    public Integer geminiAnalyze(MultipartFile audio) throws IOException {

        final String rawPrompt = getPronunciationEvaluatePrompt();

        String mimeType = audio.getContentType() != null ? audio.getContentType() : null;
        String numBytes = String.valueOf(audio.getSize());

        String uploadUrl = getUploadUrl(numBytes, audio.getContentType());
        String fileUri = uploadFileAndReturnFileUrl(uploadUrl, numBytes, audio);

        log.info("GeminiAnalyze file: {}", fileUri);
        String prompt = String.format(rawPrompt, mimeType, fileUri); // 프롬프트에 오디오 파일 URL 포함

        log.info("GeminiAnalyze prompt: {}", prompt);
        int score = doGeminiAudioAnalyze(prompt);
        System.out.println("Score: " + score);
        return score;
    }

    private int doGeminiAudioAnalyze(String prompt) throws IOException {
        HttpURLConnection contentConn = getAnalyzeHttpURLConnection();
        sendRequestToGoogle(contentConn, prompt);

        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = new ObjectMapper().readTree(contentConn.getInputStream());

        String text = root.path("candidates")
                .get(0)
                .path("content")
                .path("parts")
                .get(0)
                .path("text")
                .asText();

        JsonNode innerJson = mapper.readTree(text);
        return innerJson.path("score").asInt();
    }

    private HttpURLConnection getAnalyzeHttpURLConnection() throws IOException {
        HttpURLConnection contentConn = (HttpURLConnection) URI.create(ANALYZE_URL).toURL().openConnection();
        contentConn.setRequestMethod("POST");
        contentConn.setRequestProperty("x-goog-api-key", GOOGLE_API_KEY);
        contentConn.setRequestProperty("Content-Type", "application/json");
        contentConn.setDoOutput(true);
        return contentConn;
    }

    private String getUploadUrl(String contentsLength, String mimeType) throws IOException {
        HttpURLConnection connection = getUploadUrlConnection(contentsLength, mimeType);

        String json = "{\"file\":{\"display_name\":\"AUDIO\"}}";
        sendRequestToGoogle(connection, json);

        return extractUploadUrlFromHeader(connection);
    }

    private static String extractUploadUrlFromHeader(HttpURLConnection connection) {
        return connection.getHeaderFields().entrySet().stream()
                .filter(e -> "x-goog-upload-url".equalsIgnoreCase(e.getKey()))
                .map(Map.Entry::getValue)
                .flatMap(List::stream)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Upload URL not found"));
    }


    private static void sendRequestToGoogle(HttpURLConnection startConn, String message) throws IOException {
        try (OutputStream os = startConn.getOutputStream()) {
            os.write(message.getBytes());
        }
    }

    private String uploadFileAndReturnFileUrl(String fileUploadPathUrl, String numBytes, MultipartFile audio)
            throws IOException {
        HttpURLConnection uploadConn = getFileUploadHttpURLConnection(fileUploadPathUrl, numBytes);

        try (OutputStream os = uploadConn.getOutputStream(); InputStream is = audio.getInputStream()) {
            byte[] buffer = new byte[8192];
            int bytesRead;
            while ((bytesRead = is.read(buffer)) != -1) {
                os.write(buffer, 0, bytesRead);
            }
        } catch (IOException e) {
            log.error("Error uploading file: {}", e.getMessage());
            throw new RuntimeException("File upload failed", e);
        }

        JsonNode fileJson = new ObjectMapper().readTree(uploadConn.getInputStream());
        return fileJson.path("file").path("uri").asText();
    }

    private String getPronunciationEvaluatePrompt() {
        try {
            StringBuilder sb = new StringBuilder();
            List<String> lines = getContentsFromFile();
            for (String line : lines) {
                sb.append(line);
            }
            return sb.toString();
        } catch (IOException e) {
            throw new RuntimeException("Error reading prompt txt file", e);
        }
    }

    private static List<String> getContentsFromFile() throws IOException {
        ClassPathResource resource = new ClassPathResource(PROMPT_FILE);
        Path path = Paths.get(resource.getURI());

        return Files.readAllLines(path);
    }

    private HttpURLConnection getUploadUrlConnection(String contentsLength, String mimeType) throws IOException {
        HttpURLConnection connection = (HttpURLConnection) URI.create(UPLOAD_URL_REQUEST_URL).toURL().openConnection();
        connection.setRequestProperty("x-goog-api-key", GOOGLE_API_KEY);
        connection.setRequestMethod("POST");
        connection.setRequestProperty("X-Goog-Upload-Protocol", "resumable");
        connection.setRequestProperty("X-Goog-Upload-Command", "start");
        connection.setRequestProperty("X-Goog-Upload-Header-Content-Length", contentsLength);
        connection.setRequestProperty("X-Goog-Upload-Header-Content-Type", mimeType);
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setDoOutput(true);
        return connection;
    }

    private static HttpURLConnection getFileUploadHttpURLConnection(String fileUploadPathUrl, String numBytes)
            throws IOException {
        HttpURLConnection connection = (HttpURLConnection) URI.create(fileUploadPathUrl).toURL().openConnection();
        connection.setRequestMethod("POST");
        connection.setRequestProperty("Content-Length", numBytes);
        connection.setRequestProperty("X-Goog-Upload-Offset", "0");
        connection.setRequestProperty("X-Goog-Upload-Command", "upload, finalize");
        connection.setDoOutput(true);
        return connection;
    }
}