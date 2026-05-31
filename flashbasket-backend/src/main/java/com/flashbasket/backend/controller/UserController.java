package com.flashbasket.backend.controller;

import com.flashbasket.backend.dto.UserDTO;
import com.flashbasket.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    // Constructor Injection
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // CREATE USER
    @PostMapping
    public ResponseEntity<UserDTO> addUser(@RequestBody UserDTO dto) {

        UserDTO savedUser = userService.saveUser(dto);

        return ResponseEntity.ok(savedUser);
    }

    // GET ALL USERS
    @GetMapping
    public ResponseEntity<List<UserDTO>> getUsers() {

        return ResponseEntity.ok(userService.getAllUsers());
    }

    // GET USER BY EMAIL
    @GetMapping("/email/{email}")
    public ResponseEntity<UserDTO> getUserByEmail(@PathVariable String email) {
        return ResponseEntity.ok(userService.getUserByEmail(email));
    }
}