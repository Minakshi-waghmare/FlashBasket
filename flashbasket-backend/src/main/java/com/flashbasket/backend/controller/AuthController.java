package com.flashbasket.backend.controller;

import com.flashbasket.backend.dto.AuthRequest;
import com.flashbasket.backend.dto.AuthResponse;
import com.flashbasket.backend.dto.UserDTO;
import com.flashbasket.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

@Autowired
private AuthService authService;

// Register API
@PostMapping("/register")
public AuthResponse register(@RequestBody UserDTO dto) {
    return authService.register(dto);
}

// Login API
@PostMapping("/login")
public AuthResponse login(@RequestBody AuthRequest request) {
    return authService.login(request);
}

}
