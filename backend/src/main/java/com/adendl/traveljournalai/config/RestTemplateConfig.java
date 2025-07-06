package com.adendl.traveljournalai.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;

@Configuration
public class RestTemplateConfig {

    @Bean
    public RestTemplate restTemplate() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        
        // Set timeout for connection establishment (5 minutes)
        factory.setConnectTimeout(300000);
        
        // Set timeout for reading response (10 minutes for OpenAI API calls)
        factory.setReadTimeout(600000);
        
        return new RestTemplate(factory);
    }
}