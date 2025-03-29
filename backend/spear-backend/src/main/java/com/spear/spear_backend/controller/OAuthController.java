package com.spear.spear_backend.controller;

import com.spear.spear_backend.model.User;
import com.spear.spear_backend.services.UserService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class OAuthController {

    private final UserService userService;

    public OAuthController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/oauth2/callback")
    public User oauth2Callback(OAuth2AuthenticationToken authentication) {
        String email = authentication.getPrincipal().getAttribute("email");
        String name = authentication.getPrincipal().getAttribute("name");
        String picture = authentication.getPrincipal().getAttribute("picture");
        String oauthProvider =
            authentication.getAuthorizedClientRegistrationId();
        String oauthProviderId = authentication
            .getPrincipal()
            .getAttribute("sub"); // Unique ID from OAuth provider

        // Register or update the user
        return userService.registerOrUpdateUser(
            oauthProvider,
            oauthProviderId,
            email,
            name,
            picture
        );
    }
}
