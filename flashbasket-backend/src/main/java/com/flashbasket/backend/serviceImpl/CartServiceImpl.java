package com.flashbasket.backend.serviceImpl;

import com.flashbasket.backend.dto.CartItemDTO;
import com.flashbasket.backend.model.CartItem;
import com.flashbasket.backend.repository.CartItemRepository;
import com.flashbasket.backend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartServiceImpl implements CartService {

```
@Autowired
private CartItemRepository cartItemRepository;

// 🛒 Add to Cart
@Override
public CartItemDTO addToCart(CartItemDTO dto) {

    // Check if product already exists in cart
    CartItem item = cartItemRepository
            .findByUserIdAndProductId(dto.getUserId(), dto.getProductId())
            .orElse(new CartItem());

    item.setUserId(dto.getUserId());
    item.setProductId(dto.getProductId());
    item.setQuantity(item.getQuantity() == null ? dto.getQuantity()
            : item.getQuantity() + dto.getQuantity());

    CartItem saved = cartItemRepository.save(item);

    dto.setId(saved.getId());
    return dto;
}

// 📥 Get Cart Items
@Override
public List<CartItemDTO> getCartItems(Long userId) {

    return cartItemRepository.findByUserId(userId)
            .stream()
            .map(item -> {
                CartItemDTO dto = new CartItemDTO();
                dto.setId(item.getId());
                dto.setUserId(item.getUserId());
                dto.setProductId(item.getProductId());
                dto.setQuantity(item.getQuantity());
                return dto;
            })
            .collect(Collectors.toList());
}

// ❌ Remove Item
@Override
public void removeFromCart(Long cartItemId) {
    cartItemRepository.deleteById(cartItemId);
}

// 🧹 Clear Cart
@Override
public void clearCart(Long userId) {
    cartItemRepository.deleteByUserId(userId);
}
```

}
