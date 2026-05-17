package com.flashbasket.backend.dto;

public class CreatePaymentResponse {

    private String razorpayOrderId;
    private String key;
    private Double amount;
    private String currency;

    public CreatePaymentResponse() {
    }

    public CreatePaymentResponse(String razorpayOrderId, String key,
            Double amount, String currency) {
        this.razorpayOrderId = razorpayOrderId;
        this.key = key;
        this.amount = amount;
        this.currency = currency;
    }

    public String getRazorpayOrderId() {
        return razorpayOrderId;
    }

    public void setRazorpayOrderId(String razorpayOrderId) {
        this.razorpayOrderId = razorpayOrderId;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }
}