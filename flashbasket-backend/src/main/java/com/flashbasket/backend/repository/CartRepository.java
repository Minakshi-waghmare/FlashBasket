package com.flashbasket.backend.repository;

import com.flashbasket.backend.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {

```
// 🔹 Find cart by userId (simpler & faster)
Optional<Cart> findByUserId(Long userId);

// 🔹 Check if cart exists for user
boolean existsByUserId(Long userId);

// 🔹 Delete cart by userId (optional)
void deleteByUserId(Long userId);
```

}
