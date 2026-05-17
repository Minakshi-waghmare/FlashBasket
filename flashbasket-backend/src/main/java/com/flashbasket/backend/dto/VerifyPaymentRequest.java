package com.flashbasket.backend.dto;

public class VerifyPaymentRequest {

    // Your internal order ID from the orders table
    private Long orderId;

    // Razorpay order ID returned by /api/payment/create-order
    private String razorpayOrderId;

    // Razorpay payment ID returned after successful payment
    private String razorpayPaymentId;

    // Razorpay signature returned after successful payment
    private String razorpaySignature;

    public VerifyPaymentRequest() {
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getRazorpayOrderId() {
        return razorpayOrderId;
    }

    public void setRazorpayOrderId(String razorpayOrderId) {
        this.razorpayOrderId = razorpayOrderId;
    }

    public String getRazorpayPaymentId() {
        return razorpayPaymentId;
    }

    public void setRazorpayPaymentId(String razorpayPaymentId) {
        this.razorpayPaymentId = razorpayPaymentId;
    }

    public String getRazorpaySignature() {
        return razorpaySignature;
    }

    public void setRazorpaySignature(String razorpaySignature) {
        this.razorpaySignature = razorpaySignature;
    }
}