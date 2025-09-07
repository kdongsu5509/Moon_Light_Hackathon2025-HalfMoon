package com.halfmoon.halfmoon.security.global.config;

import jakarta.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "white-list")
public class WhiteListProperties {
    private List<String> paths = new ArrayList<>();

    @PostConstruct
    public void init() {
        log.info("화이트리스트 경로들: {}", paths);
    }
}
