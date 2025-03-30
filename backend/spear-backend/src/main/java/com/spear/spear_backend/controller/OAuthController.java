package com.spear.spear_backend.controller;

import com.spear.spear_backend.model.User;
import com.spear.spear_backend.services.UserService;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimValidator;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class OAuthController {

    private final UserService userService;

    @Autowired
    @Qualifier("googleJwtDecoder")
    private JwtDecoder googleJwtDecoder;

    private final JwtEncoder jwtEncoder; // For creating your app tokens

    public OAuthController(
        UserService userService,
        JwtDecoder googleJwtDecoder, // This will be injected from SecurityConfig
        JwtEncoder jwtEncoder
    ) {
        this.userService = userService;
        this.googleJwtDecoder = googleJwtDecoder;
        this.jwtEncoder = jwtEncoder;
    }

    @PostMapping("/api/auth/google")
    public ResponseEntity<?> authenticateWithGoogle(
        @RequestParam String idToken
    ) {
        try {
            Jwt googleJwt = null;
            // Validate the Google ID token
            System.out.println("googleJwtDecoder: " + googleJwtDecoder);
            System.out.println("Received request with idToken: " + idToken);
            try {
                System.out.println("Decoding token...");
                googleJwt = googleJwtDecoder.decode(idToken);
                System.out.println("Decoded token: " + googleJwt);
            } catch (Exception e) {
                System.err.println(
                    "Error while decoding token: " + e.getMessage()
                );
                e.printStackTrace();
            }

            // Extract user details from the token
            String email = googleJwt.getClaimAsString("email");
            String name = googleJwt.getClaimAsString("name");
            String picture = googleJwt.getClaimAsString("picture");
            String oauthProviderId = googleJwt.getSubject();

            System.out.println("User email: " + email);
            System.out.println("User name: " + name);
            System.out.println("User picture: " + picture);
            System.out.println("User OAuth provider ID: " + oauthProviderId);

            // Register or update the user in your database
            User user = userService.registerOrUpdateUser(
                "google",
                oauthProviderId,
                email,
                name,
                picture
            );

            // Create your own JWT token for subsequent API calls
            String appToken = generateToken(user);
            System.out.println("Sending token: " + appToken);

            // Return the token to the client
            Map<String, Object> response = new HashMap<>();
            response.put("token", appToken);
            response.put("user", user);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body("Invalid token: " + e.getMessage());
        }
    }

    private String generateToken(User user) {
        JwtClaimsSet claims = JwtClaimsSet.builder()
            .issuer("spear-app")
            .issuedAt(Instant.now())
            .expiresAt(Instant.now().plus(7, ChronoUnit.DAYS))
            .subject(user.getId().toString())
            .claim("email", user.getEmail())
            .claim("name", user.getUserName())
            .build();

        return jwtEncoder
            .encode(JwtEncoderParameters.from(claims))
            .getTokenValue();
    }
}
