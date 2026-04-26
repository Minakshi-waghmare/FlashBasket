package com.flashbasket.backend.service;

import com.flashbasket.backend.dto.OrderDTO;
import com.flashbasket.backend.model.*;
import com.flashbasket.backend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final UserService userService;

    @Transactional
    public Order createOrder(String email, OrderDTO request) {
        User user = userService.findByEmail(email);
        Cart cart = cartService.getCartByUser(email);
        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PENDING");
        order.setShippingAddress(request.getShippingAddress());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setTotalAmount(cart.getItems().stream().mapToDouble(i -> i.getPrice() * i.getQuantity()).sum());
        Order saved = orderRepository.save(order);
        cartService.clearCart(email);
        return saved;
    }

    public List<Order> getUserOrders(String email) {
        return orderRepository.findByUserOrderByOrderDateDesc(userService.findByEmail(email));
    }
}
