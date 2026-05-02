package com.flashbasket.backend.dto;

public class PaymentDTO {


private Long id;
private Long orderId;
private String paymentMethod;
private String paymentStatus;
private Double amount;

public PaymentDTO() {}

public Long getId() {
    return id;
}

public Long getOrderId() {
    return orderId;
}

public String getPaymentMethod() {
    return paymentMethod;
}

public String getPaymentStatus() {
    return paymentStatus;
}

public Double getAmount() {
    return amount;
}

public void setId(Long id) {
    this.id = id;
}

public void setOrderId(Long orderId) {
    this.orderId = orderId;
}

public void setPaymentMethod(String paymentMethod) {
    this.paymentMethod = paymentMethod;
}

public void setPaymentStatus(String paymentStatus) {
    this.paymentStatus = paymentStatus;
}

public void setAmount(Double amount) {
    this.amount = amount;
}


}
