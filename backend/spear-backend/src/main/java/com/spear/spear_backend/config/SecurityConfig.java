package com.spear.spear_backend.config;

import io.github.cdimascio.dotenv.Dotenv;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimValidator;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtIssuerValidator;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
        throws Exception {
        http
            .csrf()
            .disable() // For API-based authentication, typically CSRF is disabled
            .authorizeHttpRequests(authorize ->
                authorize
                    .requestMatchers("/api/poems")
                    .permitAll() // Make poems endpoint public, important for testing right now
                    .requestMatchers("/api/auth/google")
                    .permitAll() // The endpoint to receive tokens from app
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

    // @Bean("appJwtDecoder")
    // public JwtDecoder jwtDecoder() {
    //     // For your application's own JWTs
    //     return NimbusJwtDecoder.withJwkSetUri(
    //         "https://www.googleapis.com/oauth2/v3/certs"
    //     ).build();
    // }

    @Bean("googleJwtDecoder")
    public JwtDecoder googleJwtDecoder() {
        String jwkSetUri = "https://www.googleapis.com/oauth2/v3/certs";
        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withJwkSetUri(
            jwkSetUri
        ).build();

        // Configure the decoder to expect Google's issuer
        OAuth2TokenValidator<Jwt> withIssuer = new JwtIssuerValidator(
            "https://accounts.google.com"
        );

        // Add the audience validator as well - this is important for Google tokens
        OAuth2TokenValidator<Jwt> withAudience = new JwtClaimValidator<
            List<String>
        >(
            "aud",
            aud ->
                aud != null &&
                aud.contains(
                    "626922748349-0s14cl1sdp1qdh6oeriotd97pa52ra3u.apps.googleusercontent.com"
                )
        ); //hard coded in, dont forget to fix

        // Combine validators
        OAuth2TokenValidator<Jwt> validator =
            new DelegatingOAuth2TokenValidator<>(withIssuer, withAudience);

        // Use the validator
        jwtDecoder.setJwtValidator(validator);

        return jwtDecoder;
    }
}
