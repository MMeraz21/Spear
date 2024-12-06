package com.spear.spear_backend.services;

import com.spear.spear_backend.model.Poem;
import com.spear.spear_backend.repository.PoemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PoemService {

    @Autowired
    private PoemRepository poemRepository;

    public List<Poem> getAllPoems() {
        // Fetch poems from MongoDB
        return poemRepository.findAll();
    }
}

