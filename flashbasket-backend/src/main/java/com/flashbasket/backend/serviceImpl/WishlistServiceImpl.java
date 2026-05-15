package com.flashbasket.backend.serviceImpl;

import com.flashbasket.backend.dto.WishlistDTO;
import com.flashbasket.backend.mapper.WishlistMapper;
import com.flashbasket.backend.model.Wishlist;
import com.flashbasket.backend.repository.WishlistRepository;
import com.flashbasket.backend.service.WishlistService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistServiceImpl implements WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private WishlistMapper wishlistMapper;

    // Add product to wishlist
    @Override
    public WishlistDTO addToWishlist(WishlistDTO wishlistDTO) {

        Wishlist wishlist = wishlistMapper.toEntity(wishlistDTO);

        Wishlist savedWishlist = wishlistRepository.save(wishlist);

        return wishlistMapper.toDTO(savedWishlist);
    }

    // Get wishlist by user id
    @Override
    public List<WishlistDTO> getWishlistByUserId(Long userId) {

        List<Wishlist> wishlist = wishlistRepository.findByUserId(userId);

        return wishlist.stream()
                .map(wishlistMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Remove product from wishlist
    @Override
    public void removeFromWishlist(Long wishlistId) {

        wishlistRepository.deleteById(wishlistId);
    }
}