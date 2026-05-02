package com.flashbasket.backend.service;

import com.flashbasket.backend.dto.CartItemDTO;
import java.util.List;

public interface CartService {

    CartItemDTO addToCart(CartItemDTO dto);

    List<CartItemDTO> getCartByUser(Long userId);

    void removeFromCart(Long cartItemId);

    void clearCart(Long userId);
}