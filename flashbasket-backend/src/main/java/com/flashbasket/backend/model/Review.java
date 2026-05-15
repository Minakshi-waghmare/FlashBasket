package com.flashbasket.backend.model;

import jakarta.persistence.*;

@Entity
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String comment;
    private int rating;

    private Long productId;

    private String userName;

    // 🔹 Default constructor
    public Review() {
    }

    // 🔹 Parameterized constructor (optional but useful)
    public Review(Long id, String comment, int rating, Long productId, String userName) {
        this.id = id;
        this.comment = comment;
        this.rating = rating;
        this.productId = productId;
        this.userName = userName;
    }

    // 🔹 Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }
}