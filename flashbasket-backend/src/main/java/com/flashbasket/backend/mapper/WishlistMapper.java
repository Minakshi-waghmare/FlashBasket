package com.flashbasket.backend.mapper;

import com.flashbasket.backend.dto.WishlistDTO;
import com.flashbasket.backend.model.Wishlist;
import org.springframework.stereotype.Component;

@Component
public class WishlistMapper {

    // Convert Entity to DTO
    public WishlistDTO toDTO(Wishlist wishlist) {

        WishlistDTO dto = new WishlistDTO();

        dto.setId(wishlist.getId());
        dto.setUserId(wishlist.getUserId());
        dto.setProductId(wishlist.getProductId());

        return dto;
    }

    // Convert DTO to Entity
    public Wishlist toEntity(WishlistDTO dto) {

        Wishlist wishlist = new Wishlist();

        wishlist.setId(dto.getId());
        wishlist.setUserId(dto.getUserId());
        wishlist.setProductId(dto.getProductId());

        return wishlist;
    }
}