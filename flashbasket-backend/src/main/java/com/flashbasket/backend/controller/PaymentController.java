package com.flashbasket.backend.controller;

import com.flashbasket.backend.dto.PaymentDTO;
import com.flashbasket.backend.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin
public class PaymentController {
@Autowired
private PaymentService paymentService;

@PostMapping
public PaymentDTO makePayment(@RequestBody PaymentDTO dto) {
    return paymentService.makePayment(dto);
}
}
