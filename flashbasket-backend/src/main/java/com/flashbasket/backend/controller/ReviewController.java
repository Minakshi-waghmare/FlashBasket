package com.flashbasket.backend.controller;

import com.flashbasket.backend.model.Review;
import com.flashbasket.backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // ⭐ Add review for a product
    @PostMapping("/add/{productId}")
    public Review addReview(@PathVariable Long productId,
            @RequestBody Review review) {
        return reviewService.addReview(productId, review);
    }

    // ⭐ Get all reviews of a product
    @GetMapping("/product/{productId}")
    public List<Review> getReviewsByProduct(@PathVariable Long productId) {
        return reviewService.getReviewsByProduct(productId);
    }

    @DeleteMapping("/delete/{reviewId}")
    public String deleteReview(@PathVariable Long reviewId) {
        reviewService.deleteReview(reviewId);
        return "Review deleted successfully";
    }

    // ⭐ Get all reviews (admin purpose)
    @GetMapping("/all")
    public List<Review> getAllReviews() {
        return reviewService.getAllReviews();
    }
}
