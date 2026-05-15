package com.flashbasket.backend.service;

import com.flashbasket.backend.dto.ProductDTO;

import java.util.List;

public interface SearchService {

    // Search products by keyword
    List<ProductDTO> searchProducts(String keyword);

    // Filter products by category
    List<ProductDTO> filterByCategory(String category);

    // Filter products by price range
    List<ProductDTO> filterByPrice(Double minPrice, Double maxPrice);
}