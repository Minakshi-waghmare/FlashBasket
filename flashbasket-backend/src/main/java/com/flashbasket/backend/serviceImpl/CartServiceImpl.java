package com.flashbasket.backend.serviceImpl;

import com.flashbasket.backend.dto.CartItemDTO;
import com.flashbasket.backend.model.Cart;
import com.flashbasket.backend.model.CartItem;
import com.flashbasket.backend.repository.CartItemRepository;
import com.flashbasket.backend.repository.CartRepository;
import com.flashbasket.backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

        private final CartRepository cartRepository;
        private final CartItemRepository cartItemRepository;

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

                Cart cart = getOrCreateCart(dto.getUserId());

                Optional<CartItem> existingItem = cartItemRepository.findByCartIdAndProductId(
                                cart.getId(),
                                dto.getProductId());

                CartItem cartItem;

                if (existingItem.isPresent()) {

                        cartItem = existingItem.get();

                        cartItem.setQuantity(
                                        cartItem.getQuantity() + dto.getQuantity());

                } else {

                        cartItem = new CartItem();

                        cartItem.setCartId(cart.getId());

                        cartItem.setProductId(dto.getProductId());

                        cartItem.setQuantity(dto.getQuantity());
                }

                CartItem savedItem = cartItemRepository.save(cartItem);

                CartItemDTO response = new CartItemDTO();

                response.setId(savedItem.getId());
                response.setUserId(dto.getUserId());
                response.setProductId(savedItem.getProductId());
                response.setQuantity(savedItem.getQuantity());

                return response;
        }

        // GET CART
        @Override
        public List<CartItemDTO> getCartByUser(Long userId) {

                Cart cart = getOrCreateCart(userId);

                return cartItemRepository.findByCartId(cart.getId())
                                .stream()
                                .map(item -> {

                                        CartItemDTO dto = new CartItemDTO();

                                        dto.setId(item.getId());
                                        dto.setUserId(userId);
                                        dto.setProductId(item.getProductId());
                                        dto.setQuantity(item.getQuantity());

                                        return dto;
                                })
                                .collect(Collectors.toList());
        }

        // UPDATE QUANTITY
        @Override
        public CartItemDTO updateQuantity(Long cartItemId, Integer quantity) {

                if (quantity <= 0) {
                        throw new RuntimeException("Quantity must be greater than 0");
                }

                CartItem item = cartItemRepository.findById(cartItemId)
                                .orElseThrow(() -> new RuntimeException("Cart item not found"));

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

                if (!cartItemRepository.existsById(cartItemId)) {
                        throw new RuntimeException("Cart item not found");
                }

                cartItemRepository.deleteById(cartItemId);
        }

        // CLEAR CART
        @Override
        public void clearCart(Long userId) {

                Cart cart = getOrCreateCart(userId);

                cartItemRepository.deleteByCartId(cart.getId());
        }
}