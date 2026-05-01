package com.flashbasket.backend.controller;

import com.flashbasket.backend.dto.CartDTO;
import com.flashbasket.backend.model.Cart;
import com.flashbasket.backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    @GetMapping
    public ResponseEntity<Cart> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(cartService.getCartByUser(userDetails.getUsername()));
    }

    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(@AuthenticationPrincipal UserDetails userDetails, @RequestBody CartDTO req) {
        return ResponseEntity.ok(cartService.addItemToCart(userDetails.getUsername(), req.getProductId(), req.getQuantity()));
    }
}