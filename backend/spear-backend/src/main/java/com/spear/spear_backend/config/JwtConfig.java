package com.spear.spear_backend.config;

import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.util.UUID;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;

@Configuration
public class JwtConfig {

    private final RSAKey rsaKey;

    public JwtConfig() {
        // Generate the RSA key pair during initialization
        KeyPair keyPair = generateRsaKey();
        RSAPublicKey publicKey = (RSAPublicKey) keyPair.getPublic();
        RSAPrivateKey privateKey = (RSAPrivateKey) keyPair.getPrivate();
        this.rsaKey = new RSAKey.Builder(publicKey)
            .privateKey(privateKey)
            .keyID(UUID.randomUUID().toString())
            .build();
    }

    @Bean
    @Primary
    public JwtDecoder appJwtDecoder() {
        try {
            return NimbusJwtDecoder.withPublicKey(
                rsaKey.toRSAPublicKey()
            ).build();
        } catch (Exception e) {
            throw new RuntimeException("Failed to create JWT decoder", e);
        }
    }

    @Bean
    public JwtEncoder jwtEncoder() {
        JWKSource<SecurityContext> jwkSource = new ImmutableJWKSet<>(
            new JWKSet(rsaKey)
        );
        return new NimbusJwtEncoder(jwkSource);
    }

    private KeyPair generateRsaKey() {
        try {
            KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance(
                "RSA"
            );
            keyPairGenerator.initialize(2048);
            return keyPairGenerator.generateKeyPair();
        } catch (Exception e) {
            throw new IllegalStateException(
                "Failed to generate RSA key pair",
                e
            );
        }
    }
}
