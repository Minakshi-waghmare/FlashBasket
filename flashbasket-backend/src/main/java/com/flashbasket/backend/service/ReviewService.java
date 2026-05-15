package com.flashbasket.backend.service;

import com.flashbasket.backend.model.Review;

import java.util.List;

public interface ReviewService {

    // ⭐ Add review
    Review addReview(Long productId, Review review);

    // ⭐ Get reviews by product
    List<Review> getReviewsByProduct(Long productId);

    // ⭐ Get all reviews (admin)
    List<Review> getAllReviews();

    // ⭐ Delete single review
    void deleteReview(Long reviewId);

    // ⭐ Get reviews by user
    List<Review> getReviewsByUser(String userName);

    // ⭐ Get reviews by rating
    List<Review> getReviewsByRating(int rating);

    // ⭐ Count reviews for product
    long countReviews(Long productId);

    // ⭐ Get product + rating filter
    List<Review> getReviewsByProductAndRating(Long productId, int rating);

    // ⭐ Delete all reviews for a product (admin)
    void deleteReviewsByProduct(Long productId);
}