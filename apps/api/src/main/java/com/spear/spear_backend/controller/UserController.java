package com.spear.spear_backend.controller;

import com.spear.spear_backend.model.Poem;
import com.spear.spear_backend.services.UserService;
import java.util.Set;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PutMapping("/{email}/like/{poemId}")
    public void likePoem(
        @PathVariable String email,
        @PathVariable String poemId
    ) {
        userService.likePoem(email, poemId);
    }

    @PutMapping("/{email}/unlike/{poemId}")
    public void unlikePoem(
        @PathVariable String email,
        @PathVariable String poemId
    ) {
        userService.unlikePoem(email, poemId);
    }

    @GetMapping("/{email}/liked-poems")
    public Set<Poem> getLikedPoems(@PathVariable String email) {
        return userService.getLikedPoems(email);
    }
}
