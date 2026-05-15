package com.flashbasket.backend.repository;

import com.flashbasket.backend.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    // ⭐ Reviews for a product
    List<Review> findByProductId(Long productId);

    // ⭐ Reviews by user
    List<Review> findByUserNameIgnoreCase(String userName);

    // ⭐ Reviews by rating
    List<Review> findByRating(int rating);

    // ⭐ Product + rating filter
    List<Review> findByProductIdAndRating(Long productId, int rating);

    // ⭐ Prevent duplicate review (important)
    boolean existsByProductIdAndUserName(Long productId, String userName);

    // ⭐ Count reviews for product
    long countByProductId(Long productId);

    // ⭐ Delete all reviews for product (admin use)
    void deleteByProductId(Long productId);
}