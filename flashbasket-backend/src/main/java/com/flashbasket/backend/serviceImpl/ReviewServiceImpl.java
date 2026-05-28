package com.flashbasket.backend.serviceImpl;

import com.flashbasket.backend.model.Review;
import com.flashbasket.backend.repository.ReviewRepository;
import com.flashbasket.backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    // ⭐ Add review (with duplicate check)
    @Override
    public Review addReview(Long productId, Review review) {

        boolean exists = reviewRepository
                .existsByProductIdAndUserId(productId, review.getUserId());

        if (exists) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "You already reviewed this product");
        }

        review.setProductId(productId);

        return reviewRepository.save(review);
    }

    // ⭐ Get all reviews for a product
    @Override
    public List<Review> getReviewsByProduct(Long productId) {
        return reviewRepository.findByProductId(productId);
    }

    // ⭐ Get all reviews (admin)
    @Override
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    // ⭐ Delete review safely
    @Override
    public void deleteReview(Long reviewId) {

        if (!reviewRepository.existsById(reviewId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Review not found with id: " + reviewId);
        }

        reviewRepository.deleteById(reviewId);
    }

    // ⭐ Get reviews by user
    @Override
    public List<Review> getReviewsByUser(String userName) {
        return reviewRepository.findByUserNameIgnoreCase(userName);
    }

    // ⭐ Get reviews by rating
    @Override
    public List<Review> getReviewsByRating(int rating) {
        return reviewRepository.findByRating(rating);
    }

    // ⭐ Count reviews for product
    @Override
    public long countReviews(Long productId) {
        return reviewRepository.countByProductId(productId);
    }

    // ⭐ Get product + rating filter
    @Override
    public List<Review> getReviewsByProductAndRating(Long productId, int rating) {
        return reviewRepository.findByProductIdAndRating(productId, rating);
    }

    // ⭐ Delete all reviews of a product (admin use)
    @Override
    public void deleteReviewsByProduct(Long productId) {
        reviewRepository.deleteByProductId(productId);
    }
}