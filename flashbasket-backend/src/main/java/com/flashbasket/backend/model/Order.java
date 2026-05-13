package com.flashbasket.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId; 

    private LocalDateTime orderDate = LocalDateTime.now();
    private Double totalAmount;
    private String status;
    private String paymentStatus;
    private String shippingAddress;
    private String paymentMethod;
}