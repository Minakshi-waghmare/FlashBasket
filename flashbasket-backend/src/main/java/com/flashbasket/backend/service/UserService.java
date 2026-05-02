package com.flashbasket.backend.service;

import com.flashbasket.backend.dto.UserDTO;
import java.util.List;

public interface UserService {

UserDTO createUser(UserDTO dto);

UserDTO getUserById(Long id);

List<UserDTO> getAllUsers();

void deleteUser(Long id);

}
