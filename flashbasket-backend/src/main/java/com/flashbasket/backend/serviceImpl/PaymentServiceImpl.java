package com.flashbasket.backend.serviceImpl;

import com.flashbasket.backend.dto.PaymentDTO;
import com.flashbasket.backend.model.Order;
import com.flashbasket.backend.model.Payment;
import com.flashbasket.backend.repository.OrderRepository;
import com.flashbasket.backend.repository.PaymentRepository;
import com.flashbasket.backend.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PaymentServiceImpl implements PaymentService {
@Autowired
private PaymentRepository paymentRepository;

@Autowired
private OrderRepository orderRepository;

@Override
public PaymentDTO makePayment(PaymentDTO dto) {

    Order order = orderRepository.findById(dto.getOrderId())
            .orElseThrow(() -> new RuntimeException("Order not found"));

    Payment payment = new Payment();
    payment.setOrderId(dto.getOrderId());
    payment.setAmount(dto.getAmount());
    payment.setPaymentMethod(dto.getPaymentMethod());
    payment.setPaymentStatus("PAID");

    Payment saved = paymentRepository.save(payment);

    // 🔥 IMPORTANT: update order
    order.setPaymentStatus("PAID");
    order.setStatus("CONFIRMED");
    orderRepository.save(order);

    dto.setId(saved.getId());
    dto.setPaymentStatus("PAID");

    return dto;
}


}
