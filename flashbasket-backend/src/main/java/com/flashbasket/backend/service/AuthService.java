package com.flashbasket.backend.service;

import com.flashbasket.backend.dto.AuthRequest;
import com.flashbasket.backend.dto.AuthResponse;
import com.flashbasket.backend.dto.UserDTO;

public interface AuthService {
AuthResponse register(UserDTO dto);
AuthResponse login(AuthRequest request);
}
