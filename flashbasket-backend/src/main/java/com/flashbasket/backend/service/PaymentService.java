package com.flashbasket.backend.service;

import com.flashbasket.backend.dto.PaymentDTO;

public interface PaymentService {

PaymentDTO makePayment(PaymentDTO dto);

PaymentDTO getPaymentByOrderId(Long orderId);


}
