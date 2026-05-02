package com.flashbasket.backend.repository;

import com.flashbasket.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

```
// 🔹 Check if email exists (register validation)
boolean existsByEmail(String email);

// 🔹 Login
Optional<User> findByEmail(String email);

// 🔹 Search users by name (optional feature)
List<User> findByNameContainingIgnoreCase(String name);
```

}
