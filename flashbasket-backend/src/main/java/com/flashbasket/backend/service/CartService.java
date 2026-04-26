package com.flashbasket.backend.service;

import com.flashbasket.backend.model.*;
import com.flashbasket.backend.repository.CartItemRepository;
import com.flashbasket.backend.repository.CartRepository;
import com.flashbasket.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserService userService;

    public Cart getCartByUser(String email) {
        User user = userService.findByEmail(email);
        return cartRepository.findByUser(user).orElseGet(() -> {
            Cart cart = new Cart();
            cart.setUser(user);
            return cartRepository.save(cart);
        });
    }

    @Transactional
    public Cart addItemToCart(String email, Long productId, Integer quantity) {
        Cart cart = getCartByUser(email);
        Product product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found"));
        CartItem item = new CartItem();
        item.setCart(cart);
        item.setProduct(product);
        item.setQuantity(quantity);
        item.setPrice(product.getPrice());
        cart.getItems().add(item);
        return cartRepository.save(cart);
    }

    @Transactional
    public void clearCart(String email) {
        Cart cart = getCartByUser(email);
        cartItemRepository.deleteAll(cart.getItems());
        cart.getItems().clear();
        cartRepository.save(cart);
    }
}