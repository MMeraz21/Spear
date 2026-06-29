package com.spear.spear_backend;

import com.spear.spear_backend.model.Poem;
import com.spear.spear_backend.repository.PoemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SpearBackendApplication implements CommandLineRunner {

    @Autowired
    private PoemRepository poemRepository;

    public static void main(String[] args) {
        SpringApplication.run(SpearBackendApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        // Test saving a Poem to MongoDB
        // Poem poem = new Poem();
        // poem.setTitle("The Raven");
        // poem.setContent("Once upon a midnight dreary, while I pondered, weak and weary...");

        // // Save the poem to MongoDB
        // poemRepository.save(poem);

        // // Retrieve and print out the poem
        // System.out.println("Saved poem: " + poemRepository.findById(poem.getId()).get().getTitle());
    }
}

