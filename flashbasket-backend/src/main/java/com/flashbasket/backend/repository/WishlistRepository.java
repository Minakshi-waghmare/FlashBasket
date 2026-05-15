package com.flashbasket.backend.repository;

import com.flashbasket.backend.model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

    // Get wishlist items by user id
    List<Wishlist> findByUserId(Long userId);
}