package com.spear.spear_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
        throws Exception {
        http
            .authorizeHttpRequests(
                auth ->
                    auth
                        .requestMatchers("/api/**")
                        .authenticated() // Protect API routes
                        .anyRequest()
                        .permitAll() // Allow public access to everything else
            )
            .oauth2Login(
                oauth2 -> oauth2.defaultSuccessUrl("/api/auth/success", true) // Redirect after successful login
            )
            .logout(logout ->
                logout
                    .logoutUrl("/api/auth/logout") // Logout endpoint
                    .logoutSuccessUrl("/") // Redirect after logout
                    .invalidateHttpSession(true)
                    .deleteCookies("JSESSIONID")
            );

        return http.build();
    }
}
