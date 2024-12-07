package com.spear.spear_backend.controller;

import java.util.List;

import com.spear.spear_backend.dto.CreatePoemRequest;
import com.spear.spear_backend.model.Poem;
import com.spear.spear_backend.services.PoemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/poems")
public class PoemController {

    @Autowired
    private PoemService poemService;

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

