package com.flashbasket.backend.service;

import com.flashbasket.backend.dto.CartItemDTO;
import java.util.List;

public interface CartService {

    CartItemDTO addToCart(CartItemDTO dto);

    List<CartItemDTO> getCartByUser(Long userId);

    CartItemDTO updateQuantity(Long cartItemId, Integer quantity);

    void removeFromCart(Long cartItemId);

    void clearCart(Long userId);
}