package com.spear.spear_backend.services;

import com.spear.spear_backend.model.User;
import com.spear.spear_backend.repository.UserRepository;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User registerOrUpdateUser(
        String email,
        String name,
        String picture,
        String oauthProvider,
        String oauthProviderId
    ) {
        // Check if user already exists
        Optional<User> existingUser =
            userRepository.findByOauthProviderIdAndOauthProvider(
                oauthProviderId,
                oauthProvider
            );

        if (existingUser.isPresent()) {
            return existingUser.get(); // Return existing user if found
        } else {
            // Create a new user if not found
            User newUser = new User(
                email, // email
                name, // userName
                picture, // picture
                oauthProvider, // oauthProvider
                oauthProviderId // oauthProviderId
            );
            return userRepository.save(newUser);
        }
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
