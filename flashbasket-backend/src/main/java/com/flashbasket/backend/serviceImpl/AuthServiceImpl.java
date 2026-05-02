package com.flashbasket.backend.serviceImpl;

import com.flashbasket.backend.dto.*;
import com.flashbasket.backend.model.User;
import com.flashbasket.backend.repository.UserRepository;
import com.flashbasket.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

@Autowired
private UserRepository userRepository;

@Override
public AuthResponse register(UserDTO dto) {

    if (userRepository.existsByEmail(dto.getEmail())) {
        throw new RuntimeException("User already exists");
    }

    User user = new User();
    user.setName(dto.getName());
    user.setEmail(dto.getEmail());
    user.setPassword(dto.getPassword());

    userRepository.save(user);

    return new AuthResponse("User Registered Successfully");
}

@Override
public AuthResponse login(AuthRequest request) {

    User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));

    if (!user.getPassword().equals(request.getPassword())) {
        throw new RuntimeException("Invalid password");
    }

    return new AuthResponse("Login Successful");
}

}
