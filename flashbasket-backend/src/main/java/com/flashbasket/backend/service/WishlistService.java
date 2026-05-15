package com.flashbasket.backend.service;

import com.flashbasket.backend.dto.WishlistDTO;

import java.util.List;

public interface WishlistService {

    // Add product to wishlist
    WishlistDTO addToWishlist(WishlistDTO wishlistDTO);

    // Get wishlist by user id
    List<WishlistDTO> getWishlistByUserId(Long userId);

    // Remove product from wishlist
    void removeFromWishlist(Long wishlistId);
}