package com.flashbasket.backend.controller;

import com.flashbasket.backend.dto.ProductDTO;
import com.flashbasket.backend.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@CrossOrigin
public class SearchController {

    @Autowired
    private SearchService searchService;

    // Search products by keyword
    @GetMapping
    public List<ProductDTO> searchProducts(@RequestParam String keyword) {
        return searchService.searchProducts(keyword);
    }

    // Filter products by category
    @GetMapping("/category")
    public List<ProductDTO> filterByCategory(@RequestParam String category) {
        return searchService.filterByCategory(category);
    }

    // Filter products by price range
    @GetMapping("/price")
    public List<ProductDTO> filterByPrice(@RequestParam Double minPrice,
                                          @RequestParam Double maxPrice) {
        return searchService.filterByPrice(minPrice, maxPrice);
    }
}