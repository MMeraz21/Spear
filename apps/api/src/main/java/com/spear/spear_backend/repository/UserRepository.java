package com.spear.spear_backend.repository;

import com.spear.spear_backend.model.User;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUserName(String userName);
    Optional<User> findByOauthProviderIdAndOauthProvider(
        String oauthProviderId,
        String oauthProvider
    );
}
