package com.flashbasket.backend.mapper;

import com.flashbasket.backend.dto.PaymentDTO;
import com.flashbasket.backend.model.Payment;
import org.springframework.stereotype.Component;

@Component
public class PaymentMapper {

public PaymentDTO toDTO(Payment payment) {
    if (payment == null) return null;

    PaymentDTO dto = new PaymentDTO();
    dto.setId(payment.getId());
    dto.setOrderId(payment.getOrderId());
    dto.setPaymentMethod(payment.getPaymentMethod());
    dto.setPaymentStatus(payment.getPaymentStatus());
    dto.setAmount(payment.getAmount());

    return dto;
}

public Payment toEntity(PaymentDTO dto) {
    if (dto == null) return null;

    Payment payment = new Payment();
    payment.setId(dto.getId());
    payment.setOrderId(dto.getOrderId());
    payment.setPaymentMethod(dto.getPaymentMethod());
    payment.setPaymentStatus(dto.getPaymentStatus());
    payment.setAmount(dto.getAmount());

    return payment;
}

}
