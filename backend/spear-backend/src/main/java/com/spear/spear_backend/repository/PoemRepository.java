package com.spear.spear_backend.repository;

import com.spear.spear_backend.model.Poem;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface PoemRepository extends MongoRepository<Poem, String> {
Page<Poem> findByTitleContainingIgnoreCase(String title, Pageable pageable);
    Page<Poem> findByAuthorId(String authorId, Pageable pageable);
    Page<Poem> findByTagsIn(List<String> tags, Pageable pageable);
    Page<Poem> findByContentContainingIgnoreCase(String content, Pageable pageable);
}

