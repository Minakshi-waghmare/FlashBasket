package com.flashbasket.backend.repository;

import com.flashbasket.backend.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByProductId(Long productId);

    boolean existsByProductIdAndUserId(Long productId, Long userId);

    List<Review> findByUserNameIgnoreCase(String userName);

    List<Review> findByRating(int rating);

    List<Review> findByProductIdAndRating(Long productId, int rating);

    long countByProductId(Long productId);

    void deleteByProductId(Long productId);
}