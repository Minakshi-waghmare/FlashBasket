package com.flashbasket.backend.repository;

import com.flashbasket.backend.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {


// 🔹 Get all cart items for a user
List<CartItem> findByUserId(Long userId);

// 🔹 Find specific product in user's cart
Optional<CartItem> findByUserIdAndProductId(Long userId, Long productId);

// 🔹 Delete all cart items of a user (after order)
void deleteByUserId(Long userId);


}
