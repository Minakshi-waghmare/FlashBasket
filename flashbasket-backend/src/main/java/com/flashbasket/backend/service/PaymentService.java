package com.flashbasket.backend.service;

import com.flashbasket.backend.dto.*;

public interface PaymentService {

    // Existing methods
    PaymentDTO makePayment(PaymentDTO dto);

    PaymentDTO getPaymentByOrderId(Long orderId);

    // Razorpay methods
    CreatePaymentResponse createRazorpayOrder(CreatePaymentRequest request);

    String verifyPayment(VerifyPaymentRequest request);
}
