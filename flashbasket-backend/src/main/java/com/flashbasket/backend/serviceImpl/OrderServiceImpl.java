package com.flashbasket.backend.serviceImpl;

import com.flashbasket.backend.dto.OrderDTO;
import com.flashbasket.backend.model.CartItem;
import com.flashbasket.backend.model.Order;
import com.flashbasket.backend.repository.CartItemRepository;
import com.flashbasket.backend.repository.OrderRepository;
import com.flashbasket.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {


@Autowired
private CartItemRepository cartItemRepository;

@Autowired
private OrderRepository orderRepository;

// 📦 Place Order (Cart → Order)
@Override
public OrderDTO placeOrder(Long userId) {

    // 1️⃣ Get cart items
    List<CartItem> cartItems = cartItemRepository.findByUserId(userId);

    if (cartItems.isEmpty()) {
        throw new RuntimeException("Cart is empty");
    }

    // 2️⃣ Calculate total amount (simple logic)
    double totalAmount = cartItems.stream()
            .mapToDouble(item -> item.getQuantity() * 100) // assuming price = 100 (demo)
            .sum();

    // 3️⃣ Create Order
    Order order = new Order();
    order.setUserId(userId);
    order.setTotalAmount(totalAmount);
    order.setStatus("PLACED");
    order.setPaymentStatus("PENDING");
    order.setOrderDate(LocalDateTime.now());

    Order saved = orderRepository.save(order);

    // 4️⃣ Clear Cart after order
    cartItemRepository.deleteByUserId(userId);

    // 5️⃣ Return DTO
    OrderDTO dto = new OrderDTO();
    dto.setId(saved.getId());
    dto.setUserId(saved.getUserId());
    dto.setTotalAmount(saved.getTotalAmount());
    dto.setStatus(saved.getStatus());
    dto.setPaymentStatus(saved.getPaymentStatus());

    return dto;
}

// 📥 Get User Orders
@Override
public List<OrderDTO> getUserOrders(Long userId) {

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
