package com.flashbasket.backend.controller;

import com.flashbasket.backend.dto.CartItemDTO;
import com.flashbasket.backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin("*")
public class CartController {

    private final CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<CartItemDTO> addToCart(@RequestBody CartItemDTO dto) {
        return ResponseEntity.ok(cartService.addToCart(dto));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<CartItemDTO>> getCart(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.getCartByUser(userId));
    }

    @PutMapping("/update/{cartItemId}")
    public ResponseEntity<CartItemDTO> updateQuantity(
            @PathVariable Long cartItemId,
            @RequestParam Integer quantity) {
        return ResponseEntity.ok(cartService.updateQuantity(cartItemId, quantity));
    }

    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<String> removeItem(@PathVariable Long cartItemId) {
        cartService.removeFromCart(cartItemId);
        return ResponseEntity.ok("Item removed");
    }

    @DeleteMapping("/clear/{userId}")
    public ResponseEntity<String> clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok("Cart cleared");
    }
}