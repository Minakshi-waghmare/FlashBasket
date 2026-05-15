package com.flashbasket.backend.serviceImpl;

import com.flashbasket.backend.dto.CartItemDTO;
import com.flashbasket.backend.model.*;
import com.flashbasket.backend.repository.*;
import com.flashbasket.backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

        private final CartRepository cartRepository;
        private final CartItemRepository cartItemRepository;
        private final ProductRepository productRepository;
        private final UserRepository userRepository; // 🔥 ADD THIS

        // 🔥 GET OR CREATE CART
        private Cart getOrCreateCart(Long userId) {

                return cartRepository.findByUserId(userId)
                                .orElseGet(() -> {

                                        User user = userRepository.findById(userId)
                                                        .orElseThrow(() -> new RuntimeException("User not found"));

                                        Cart cart = new Cart();
                                        cart.setUser(user);

                                        return cartRepository.save(cart);
                                });
        }

        // ➕ ADD TO CART
        @Override
        public CartItemDTO addToCart(CartItemDTO dto) {

                if (dto.getProductId() == null || dto.getUserId() == null) {
                        throw new RuntimeException("UserId and ProductId are required");
                }

                Cart cart = getOrCreateCart(dto.getUserId());

                Product product = productRepository.findById(dto.getProductId())
                                .orElseThrow(() -> new RuntimeException("Product not found"));

                CartItem item = cartItemRepository
                                .findByCartIdAndProductId(cart.getId(), product.getId())
                                .orElse(null);

                if (item == null) {
                        item = new CartItem();
                        item.setCart(cart);
                        item.setProduct(product);
                        item.setQuantity(dto.getQuantity());
                } else {
                        item.setQuantity(item.getQuantity() + dto.getQuantity());
                }

                item.setPriceAtTime(BigDecimal.valueOf(product.getPrice()));

                CartItem saved = cartItemRepository.save(item);

                dto.setId(saved.getId());
                dto.setProductName(product.getName());
                dto.setPrice(product.getPrice());

                return dto;
        }

        // 📥 GET CART
        @Override
        public List<CartItemDTO> getCartByUser(Long userId) {

                Cart cart = getOrCreateCart(userId);

                return cartItemRepository.findByCartId(cart.getId())
                                .stream()
                                .map(item -> {
                                        CartItemDTO dto = new CartItemDTO();
                                        dto.setId(item.getId());
                                        dto.setUserId(userId);
                                        dto.setProductId(item.getProduct().getId());
                                        dto.setProductName(item.getProduct().getName());
                                        dto.setPrice(item.getPriceAtTime().doubleValue());
                                        dto.setQuantity(item.getQuantity());
                                        return dto;
                                })
                                .collect(Collectors.toList());
        }

        // ✏️ UPDATE QUANTITY
        @Override
        public CartItemDTO updateQuantity(Long cartItemId, Integer quantity) {

                if (quantity == null || quantity <= 0) {
                        throw new RuntimeException("Quantity must be greater than 0");
                }

                CartItem item = cartItemRepository.findById(cartItemId)
                                .orElseThrow(() -> new RuntimeException("Cart item not found"));

                item.setQuantity(quantity);

                CartItem saved = cartItemRepository.save(item);

                CartItemDTO dto = new CartItemDTO();
                dto.setId(saved.getId());
                dto.setProductId(saved.getProduct().getId());
                dto.setProductName(saved.getProduct().getName());
                dto.setPrice(saved.getPriceAtTime().doubleValue());
                dto.setQuantity(saved.getQuantity());

                return dto;
        }

        // ❌ REMOVE ITEM
        @Override
        public void removeFromCart(Long cartItemId) {

                if (!cartItemRepository.existsById(cartItemId)) {
                        throw new RuntimeException("Cart item not found");
                }

                cartItemRepository.deleteById(cartItemId);
        }

        // 🧹 CLEAR CART
        @Override
        public void clearCart(Long userId) {

                Cart cart = getOrCreateCart(userId);

                cartItemRepository.deleteByCartId(cart.getId());
        }
}