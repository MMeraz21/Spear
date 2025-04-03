package com.spear.spear_backend.services;

import com.spear.spear_backend.model.Poem;
import com.spear.spear_backend.model.User;
import com.spear.spear_backend.repository.PoemRepository;
import com.spear.spear_backend.repository.UserRepository;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PoemRepository poemRepository;

    public UserService(
        UserRepository userRepository,
        PoemRepository poemRepository
    ) {
        this.userRepository = userRepository;
        this.poemRepository = poemRepository;
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

    public void likePoem(String userEmail, String poemId) {
        Optional<User> userOpt = userRepository.findByEmail(userEmail);
        Optional<Poem> poemOpt = poemRepository.findById(poemId);

        if (userOpt.isPresent() && poemOpt.isPresent()) {
            User user = userOpt.get();
            Poem poem = poemOpt.get();

            if (!user.getLikedPoems().contains(poem)) {
                user.likePoem(poem);
                poem.setLikes(poem.getLikes() + 1);
                userRepository.save(user);
                poemRepository.save(poem);
            }
        } else {
            throw new RuntimeException("User or Poem not found");
        }
    }

    public void unlikePoem(String userEmail, String poemId) {
        Optional<User> userOpt = userRepository.findByEmail(userEmail);
        Optional<Poem> poemOpt = poemRepository.findById(poemId);

        if (userOpt.isPresent() && poemOpt.isPresent()) {
            User user = userOpt.get();
            Poem poem = poemOpt.get();

            if (user.getLikedPoems().contains(poem)) {
                user.unlikePoem(poem);
                poem.setLikes(poem.getLikes() - 1);
                userRepository.save(user);
                poemRepository.save(poem);
            }
        } else {
            throw new RuntimeException("User or Poem not found");
        }
    }

    public Set<Poem> getLikedPoems(String userEmail) {
        return userRepository
            .findByEmail(userEmail)
            .map(User::getLikedPoems)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
