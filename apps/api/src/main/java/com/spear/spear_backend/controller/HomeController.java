package com.spear.spear_backend.controller; 

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequestMapping("/api")

public class HomeController {

    @GetMapping("/")
    public String home() {
        return "Hello, world!";
    }
    @GetMapping("/health")
    public String healthCheck(){
        return "API is up and running";
    }

}



