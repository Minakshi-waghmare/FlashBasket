package com.flashbasket.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())   // ✅ updated syntax
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()  // allow all APIs
            )
            .httpBasic(Customizer.withDefaults()); // optional

        return http.build();
    }
}