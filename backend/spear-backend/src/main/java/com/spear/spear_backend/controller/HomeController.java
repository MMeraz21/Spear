package com.spear.spear_backend.controller; // or com.yourpackage.controller

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spear.spear_backend.model.Poem;
import com.spear.spear_backend.services.PoemService;

@RestController
@RequestMapping("/api")

public class HomeController {

    @GetMapping("/")
    public String home() {
        return "Hello, world!";
    }
    @Autowired
    private PoemService poemService;

    @GetMapping("/poems")
    public List<Poem> getAllPoems() {
        return poemService.getAllPoems();
    }
}


