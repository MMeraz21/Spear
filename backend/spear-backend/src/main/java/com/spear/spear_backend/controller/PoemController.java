package com.spear.spear_backend.controller;

import java.util.List;

import com.spear.spear_backend.dto.CreatePoemRequest;
import com.spear.spear_backend.model.Poem;
import com.spear.spear_backend.services.PoemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/poems")
public class PoemController {

    @Autowired
    private PoemService poemService;  //test

    @GetMapping("/{id}")   //just gets singular poem by id
    public ResponseEntity<Poem> getPoemById(@PathVariable String id) {
        Poem poem = poemService.getPoemById(id);
        if (poem == null) {
            return ResponseEntity.notFound().build();  // Return 404 if the poem is not found
        }
        return ResponseEntity.ok(poem);
    }

    @GetMapping("/author/{authorId}")
    public ResponseEntity<Page<Poem>> getPoemsByAuthorId(
            @PathVariable String authorId,
            @RequestParam(defaultValue = "0") int page,  // Default to page 0
            @RequestParam(defaultValue = "10") int size   // Default to size 10
    ) {
        Page<Poem> poems = poemService.getPoemsByAuthorId(authorId, page, size);
        if (poems.isEmpty()) {
            return ResponseEntity.notFound().build();  // Return 404 if no poems found
        }
        return ResponseEntity.ok(poems);  // Return the page of poems
    }

    @GetMapping("/search")  //search based on query params
    public Page<Poem> searchPoems(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String authorId,
            @RequestParam(required = false) List<String> tags,
            @RequestParam(required = false) String content,
            @RequestParam(defaultValue = "0") int page,  // Default to page 0
            @RequestParam(defaultValue = "10") int size   // Default to size 10
    ) {
        return poemService.searchPoems(title, authorId, tags, content, page, size);
    }

    @PostMapping
    public ResponseEntity<Poem> createPoem(@RequestBody CreatePoemRequest request) {
        Poem poem = new Poem();
        poem.setTitle(request.getTitle());
        poem.setContent(request.getContent());
        poem.setAuthorId(request.getAuthorId());
        poem.setTags(request.getTags());
        poem.setLanguage(request.getLanguage());

        Poem savedPoem = poemService.createPoem(poem);
        return ResponseEntity.ok(savedPoem);
    }

    @GetMapping
    public ResponseEntity<List<Poem>> getAllPoems() {
        List<Poem> poems = poemService.getAllPoems();
        return ResponseEntity.ok(poems);
    }
}

