package com.flashbasket.backend.repository;

import com.flashbasket.backend.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {


// 🔹 Get payment by orderId (one order = one payment)
Optional<Payment> findByOrderId(Long orderId);

// 🔹 Get all payments by status (PAID / FAILED / PENDING)
List<Payment> findByPaymentStatus(String paymentStatus);

// 🔹 Get payments by method (UPI / CARD / COD)
List<Payment> findByPaymentMethod(String paymentMethod);


}
