package com.flashbasket.backend.serviceImpl;

import com.flashbasket.backend.dto.UserDTO;
import com.flashbasket.backend.model.User;
import com.flashbasket.backend.repository.UserRepository;
import com.flashbasket.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    // ➕ Create User
    @Override
    public UserDTO createUser(UserDTO dto) {

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("User already exists");
        }

        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());

        User saved = userRepository.save(user);

        UserDTO response = new UserDTO();
        response.setId(saved.getId());
        response.setName(saved.getName());
        response.setEmail(saved.getEmail());

        return response;
    }

    // 📥 Get User by ID
    @Override
    public UserDTO getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());

        return dto;
    }

    // 📋 Get All Users
    @Override
    public List<UserDTO> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(user -> {
                    UserDTO dto = new UserDTO();
                    dto.setId(user.getId());
                    dto.setName(user.getName());
                    dto.setEmail(user.getEmail());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // ❌ Delete User
    @Override
    public void deleteUser(Long id) {

        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }

        userRepository.deleteById(id);
    }

    // 💾 Save User
    @Override
    public UserDTO saveUser(UserDTO dto) {

        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());

        User saved = userRepository.save(user);

        UserDTO response = new UserDTO();
        response.setId(saved.getId());
        response.setName(saved.getName());
        response.setEmail(saved.getEmail());

        return response;
    }

    // 📧 Get User by Email
    @Override
    public UserDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());

        return dto;
    }
}