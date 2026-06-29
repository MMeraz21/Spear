package com.spear.spear_backend.config;

import java.util.Arrays;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtIssuerValidator;
import org.springframework.security.oauth2.jwt.JwtTimestampValidator;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private static final String GOOGLE_CLIENT_ID =
        "626922748349-0s14cl1sdp1qdh6oeriotd97pa52ra3u.apps.googleusercontent.com";

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
        throws Exception {
        http
            .cors()
            .configurationSource(corsConfigurationSource())
            .and()
            .csrf()
            .disable()
            .authorizeHttpRequests(authorize ->
                authorize
                    .requestMatchers("/api/poems")
                    .permitAll()
                    .requestMatchers("/api/auth/**")
                    .permitAll()
                    .requestMatchers("/api/**")
                    .authenticated()
                    .anyRequest()
                    .permitAll()
            )
            .oauth2ResourceServer(oauth2 ->
                oauth2.jwt(jwt ->
                    jwt.jwtAuthenticationConverter(jwtAuthenticationConverter())
                )
            )
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("*")); // Or specify your domains
        configuration.setAllowedMethods(
            Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS")
        );
        configuration.setAllowedHeaders(
            Arrays.asList("Authorization", "Content-Type")
        );
        configuration.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source =
            new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter =
            new JwtGrantedAuthoritiesConverter();
        grantedAuthoritiesConverter.setAuthoritiesClaimName("roles");
        grantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");

        JwtAuthenticationConverter jwtAuthenticationConverter =
            new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(
            grantedAuthoritiesConverter
        );
        return jwtAuthenticationConverter;
    }

    @Bean("googleJwtDecoder")
    public JwtDecoder googleJwtDecoder() {
        String jwkSetUri = "https://www.googleapis.com/oauth2/v3/certs";
        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withJwkSetUri(
            jwkSetUri
        ).build();

        // Validator for Google's issuer
        OAuth2TokenValidator<Jwt> issuerValidator = new JwtIssuerValidator(
            "https://accounts.google.com"
        );

        // Validator for token timestamps (expiration and not before)
        OAuth2TokenValidator<Jwt> timestampValidator =
            new JwtTimestampValidator();

        // Custom validator for the audience claim
        OAuth2TokenValidator<Jwt> audienceValidator = new OAuth2TokenValidator<
            Jwt
        >() {
            @Override
            public OAuth2TokenValidatorResult validate(Jwt token) {
                if (token.getAudience().contains(GOOGLE_CLIENT_ID)) {
                    return OAuth2TokenValidatorResult.success();
                } else {
                    OAuth2Error error = new OAuth2Error(
                        "invalid_token",
                        "The required audience " +
                        GOOGLE_CLIENT_ID +
                        " is missing",
                        null
                    );
                    return OAuth2TokenValidatorResult.failure(error);
                }
            }
        };

        // Combine all validators
        OAuth2TokenValidator<Jwt> validator =
            new DelegatingOAuth2TokenValidator<>(
                issuerValidator,
                timestampValidator,
                audienceValidator
            );

        jwtDecoder.setJwtValidator(validator);
        return jwtDecoder;
    }
}
