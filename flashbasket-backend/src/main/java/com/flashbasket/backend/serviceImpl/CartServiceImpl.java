package com.flashbasket.backend.serviceImpl;

import com.flashbasket.backend.dto.CartItemDTO;
import com.flashbasket.backend.model.Cart;
import com.flashbasket.backend.model.CartItem;
import com.flashbasket.backend.model.User;
import com.flashbasket.backend.model.Product;

import com.flashbasket.backend.repository.CartItemRepository;
import com.flashbasket.backend.repository.CartRepository;
import com.flashbasket.backend.repository.UserRepository;
import com.flashbasket.backend.repository.ProductRepository;

import com.flashbasket.backend.service.CartService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

        private final CartRepository cartRepository;
        private final CartItemRepository cartItemRepository;
        private final UserRepository userRepository;
        private final ProductRepository productRepository;

        // GET OR CREATE CART
        private Cart getOrCreateCart(Long userId) {
                return cartRepository.findByUserId(userId)
                                .orElseGet(() -> {
                                        Cart cart = new Cart();
                                        cart.setUserId(userId);
                                        return cartRepository.save(cart);
                                });
        }

        // ADD TO CART
        @Override
        public CartItemDTO addToCart(CartItemDTO dto) {

                if (dto.getUserId() == null || dto.getProductId() == null) {
                        throw new RuntimeException("INVALID_INPUT");
                }

                if (!productRepository.existsById(dto.getProductId())) {
                        throw new RuntimeException("PRODUCT_NOT_FOUND");
                }

                Cart cart = getOrCreateCart(dto.getUserId());

                // 🔥 CHECK IF ITEM ALREADY EXISTS
                CartItem existing = cartItemRepository
                                .findByCartIdAndProductId(cart.getId(), dto.getProductId())
                                .orElse(null);

                if (existing != null) {
                        existing.setQuantity(existing.getQuantity() + dto.getQuantity());
                        CartItem saved = cartItemRepository.save(existing);

                        dto.setId(saved.getId());
                        dto.setQuantity(saved.getQuantity());
                        return dto;
                }

                // ELSE CREATE NEW ITEM
                CartItem item = new CartItem();
                item.setCartId(cart.getId());
                item.setProductId(dto.getProductId());
                item.setQuantity(dto.getQuantity());

                CartItem saved = cartItemRepository.save(item);

                dto.setId(saved.getId());
                return dto;
        }

        // GET CART

        @Override
        public List<CartItemDTO> getCartByUser(Long userId) {

                Cart cart = cartRepository.findByUserId(userId)
                                .orElse(null);

                if (cart == null)
                        return new ArrayList<>();

                List<CartItem> items = cartItemRepository.findByCartId(cart.getId());

                if (items.isEmpty())
                        return new ArrayList<>(); // 🔥 FIX

                List<Long> productIds = items.stream()
                                .map(CartItem::getProductId)
                                .collect(Collectors.toList());

                List<Product> products = productRepository.findAllById(productIds);

                Map<Long, Product> productMap = products.stream()
                                .filter(p -> p.getId() != null)
                                .collect(Collectors.toMap(Product::getId, p -> p, (a, b) -> a));

                return items.stream().map(item -> {

                        Product product = productMap.get(item.getProductId());

                        CartItemDTO dto = new CartItemDTO();
                        dto.setId(item.getId());
                        dto.setUserId(userId);
                        dto.setProductId(item.getProductId());
                        dto.setQuantity(item.getQuantity());

                        if (product != null) {
                                dto.setProductName(product.getName());
                                dto.setPrice(product.getPrice());
                                dto.setImageUrl(product.getImageUrl());
                        }

                        return dto;

                }).collect(Collectors.toList());
        }

        // UPDATE QUANTITY
        @Override
        public CartItemDTO updateQuantity(Long cartItemId, Integer quantity) {

                if (quantity <= 0) {
                        throw new RuntimeException("INVALID_QUANTITY");
                }

                CartItem item = cartItemRepository.findById(cartItemId)
                                .orElseThrow(() -> new RuntimeException("CART_ITEM_NOT_FOUND"));

                item.setQuantity(quantity);

                CartItem saved = cartItemRepository.save(item);

                CartItemDTO dto = new CartItemDTO();
                dto.setId(saved.getId());
                dto.setProductId(saved.getProductId());
                dto.setQuantity(saved.getQuantity());

                return dto;
        }

        // REMOVE ITEM
        @Override
        public void removeFromCart(Long cartItemId) {
                cartItemRepository.deleteById(cartItemId);
        }

        // CLEAR CART
        @Override
        public void clearCart(Long userId) {
                Cart cart = getOrCreateCart(userId);
                cartItemRepository.deleteByCartId(cart.getId());
        }
}