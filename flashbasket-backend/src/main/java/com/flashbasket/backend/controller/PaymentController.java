package com.flashbasket.backend.controller;

import com.flashbasket.backend.dto.*;
import com.flashbasket.backend.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // Existing endpoint
    @PostMapping
    public PaymentDTO makePayment(@RequestBody PaymentDTO dto) {
        return paymentService.makePayment(dto);
    }

    // Existing endpoint
    @GetMapping("/order/{orderId}")
    public PaymentDTO getPaymentByOrderId(@PathVariable Long orderId) {
        return paymentService.getPaymentByOrderId(orderId);
    }

    // Create Razorpay order
    @PostMapping("/create-order")
    public CreatePaymentResponse createRazorpayOrder(
            @RequestBody CreatePaymentRequest request) {
        return paymentService.createRazorpayOrder(request);
    }

    // Verify Razorpay payment
    @PostMapping("/verify")
    public String verifyPayment(
            @RequestBody VerifyPaymentRequest request) {
        return paymentService.verifyPayment(request);
    }
}