package com.flashbasket.backend.controller;

import com.flashbasket.backend.dto.WishlistDTO;
import com.flashbasket.backend.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    // Add product to wishlist
    @PostMapping("/add")
    public WishlistDTO addToWishlist(@RequestBody WishlistDTO wishlistDTO) {
        return wishlistService.addToWishlist(wishlistDTO);
    }

    // Get wishlist by user id
    @GetMapping("/{userId}")
    public List<WishlistDTO> getWishlistByUserId(@PathVariable Long userId) {
        return wishlistService.getWishlistByUserId(userId);
    }

    // Remove product from wishlist
    @DeleteMapping("/remove/{wishlistId}")
    public String removeFromWishlist(@PathVariable Long wishlistId) {
        wishlistService.removeFromWishlist(wishlistId);
        return "Product removed from wishlist successfully";
    }
}