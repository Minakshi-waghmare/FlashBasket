package com.flashbasket.backend.repository;

import com.flashbasket.backend.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
}