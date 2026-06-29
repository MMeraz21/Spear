package com.spear.spear_backend.controller;

import com.spear.spear_backend.model.User;
import com.spear.spear_backend.services.UserService;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
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
    private final JwtDecoder googleJwtDecoder;
    private final JwtEncoder jwtEncoder;

    @Autowired
    public OAuthController(
        UserService userService,
        @Qualifier("googleJwtDecoder") JwtDecoder googleJwtDecoder,
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
            System.out.println(
                "Received request with idToken: " +
                idToken.substring(0, 20) +
                "..."
            );

            // Validate the Google ID token
            Jwt googleJwt;
            try {
                googleJwt = googleJwtDecoder.decode(idToken);
                System.out.println("Successfully decoded token");
            } catch (Exception e) {
                System.err.println("Error decoding token: " + e.getMessage());
                e.printStackTrace();
                return ResponseEntity.badRequest()
                    .body("Invalid token: " + e.getMessage());
            }

            // Extract user details from the token
            String email = googleJwt.getClaimAsString("email");
            String name = googleJwt.getClaimAsString("name");
            String picture = googleJwt.getClaimAsString("picture");
            String oauthProviderId = googleJwt.getSubject();

            System.out.println("User email: " + email);
            System.out.println("User name: " + name);
            System.out.println(
                "User picture: " +
                (picture != null ? "provided" : "not provided")
            );
            System.out.println("User OAuth provider ID: " + oauthProviderId);

            // Register or update the user in your database
            User user = userService.registerOrUpdateUser(
                email,
                name,
                picture,
                "google",
                oauthProviderId
            );
            System.out.println("User NAME: " + user.getUserName());
            // Create your own JWT token for subsequent API calls
            String appToken = generateToken(user);

            // Return the token to the client
            Map<String, Object> response = new HashMap<>();
            response.put("token", appToken);
            response.put("user", user);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Authentication failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest()
                .body("Authentication failed: " + e.getMessage());
        }
    }

    private String generateToken(User user) {
        JwtClaimsSet claims = JwtClaimsSet.builder()
            .issuer("spear-app")
            .issuedAt(Instant.now())
            .expiresAt(Instant.now().plus(7, ChronoUnit.DAYS))
            .subject(user.getId().toString())
            .claim("email", user.getEmail())
            .claim("userName", user.getUserName()) //CHANGE HERE
            .build();

        return jwtEncoder
            .encode(JwtEncoderParameters.from(claims))
            .getTokenValue();
    }
}
