package com.spear.spear_backend.services;

import com.spear.spear_backend.model.Poem;
import com.spear.spear_backend.repository.PoemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PoemService {

    @Autowired
    private PoemRepository poemRepository;

    public List<Poem> getAllPoems() {
        // Fetch poems from MongoDB
        return poemRepository.findAll();
    }

    public Page<Poem> searchPoems(String title, String authorId, List<String> tags, String content, int page, int size) {
        // Create query filters based on provided search parameters
        PageRequest pageRequest = PageRequest.of(page,size);
        // Create query filters based on provided search parameters
        if (title != null && !title.isEmpty()) {
            return poemRepository.findByTitleContainingIgnoreCase(title, pageRequest);
        } else if (authorId != null && !authorId.isEmpty()) {
            return poemRepository.findByAuthorId(authorId, pageRequest);
        } else if (tags != null && !tags.isEmpty()) {
            return poemRepository.findByTagsIn(tags, pageRequest);
        } else if (content != null && !content.isEmpty()) {
            return poemRepository.findByContentContainingIgnoreCase(content, pageRequest);
        } else {
            return poemRepository.findAll(pageRequest); // Return all poems with pagination
        }
    }

    public Poem createPoem(Poem poem) {
        poem.setCreatedAt(LocalDateTime.now());
        poem.setUpdatedAt(LocalDateTime.now());
        poem.setLikes(0);
        poem.setShares(0);
        poem.setViews(0);
        poem.setCommentsCount(0);
        poem.setDeleted(false);
        return poemRepository.save(poem);
    }
}

