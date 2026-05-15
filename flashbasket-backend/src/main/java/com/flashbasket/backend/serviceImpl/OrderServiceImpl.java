package com.flashbasket.backend.serviceImpl;

import com.flashbasket.backend.dto.OrderDTO;
import com.flashbasket.backend.model.Cart;
import com.flashbasket.backend.model.CartItem;
import com.flashbasket.backend.model.Order;
import com.flashbasket.backend.repository.CartItemRepository;
import com.flashbasket.backend.repository.CartRepository;
import com.flashbasket.backend.repository.OrderRepository;
import com.flashbasket.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final CartItemRepository cartItemRepository;
    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;

    // 📦 PLACE ORDER
    @Override
    public OrderDTO createOrder(String username, OrderDTO dto) {

        Long userId = dto.getUserId();

        // 1️⃣ Get cart
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        // 2️⃣ Get cart items
        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // 3️⃣ Calculate total
        double totalAmount = cartItems.stream()
                .mapToDouble(item -> item.getQuantity() *
                        item.getPriceAtTime().doubleValue())
                .sum();

        // 4️⃣ Create Order
        Order order = new Order();
        order.setUserId(userId);
        order.setTotalAmount(totalAmount);
        order.setStatus("PLACED");
        order.setPaymentStatus("PENDING");
        order.setOrderDate(LocalDateTime.now());

        Order saved = orderRepository.save(order);

        // 5️⃣ Clear cart (CORRECT WAY)
        cartItemRepository.deleteByCartId(cart.getId());

        // 6️⃣ Return DTO
        dto.setId(saved.getId());
        dto.setTotalAmount(saved.getTotalAmount());
        dto.setStatus(saved.getStatus());
        dto.setPaymentStatus(saved.getPaymentStatus());

        return dto;
    }

    // 📥 GET ORDERS
    @Override
    public List<OrderDTO> getUserOrders(String username) {

        Long userId = 1L; // (replace with JWT later)

        return orderRepository.findByUserIdOrderByIdDesc(userId)
                .stream()
                .map(order -> {
                    OrderDTO dto = new OrderDTO();
                    dto.setId(order.getId());
                    dto.setUserId(order.getUserId());
                    dto.setTotalAmount(order.getTotalAmount());
                    dto.setStatus(order.getStatus());
                    dto.setPaymentStatus(order.getPaymentStatus());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}