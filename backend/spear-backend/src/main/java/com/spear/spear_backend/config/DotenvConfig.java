package com.spear.spear_backend.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
public class DotenvConfig {

    private static final Logger logger = LoggerFactory.getLogger(DotenvConfig.class);

    @Bean
    public Dotenv dotenv() {
        logger.debug("Loading .env file..."); // Change from info to debug
        Dotenv dotenv = Dotenv.configure()
            .ignoreIfMissing()
            .load();
        return dotenv;
    }
    
    @Bean
    public String mongoUri(Dotenv dotenv) {
        logger.debug("MongoDB URI loaded"); // Only log that it's loaded, not the actual URI
        return dotenv.get("MONGODB_URI");
    }
}


