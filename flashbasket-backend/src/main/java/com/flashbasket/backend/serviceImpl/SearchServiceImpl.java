package com.flashbasket.backend.serviceImpl;

import com.flashbasket.backend.dto.ProductDTO;
import com.flashbasket.backend.mapper.ProductMapper;
import com.flashbasket.backend.model.Product;
import com.flashbasket.backend.repository.ProductRepository;
import com.flashbasket.backend.service.SearchService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.flashbasket.backend.model.Category;
import com.flashbasket.backend.repository.CategoryRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SearchServiceImpl implements SearchService {

    @Autowired
    private ProductRepository productRepository;
    private CategoryRepository categoryRepository;

    // Search products by keyword
    @Override
    public List<ProductDTO> searchProducts(String keyword) {

        List<Product> products =
                productRepository.findByNameContainingIgnoreCase(keyword);

        return products.stream()
                .map(product -> ProductMapper.toDTO(product))
                .collect(Collectors.toList());
    }

    // Filter products by category
    @Override
public List<ProductDTO> filterByCategory(String category) {

    Category categoryEntity =
            categoryRepository.findByNameIgnoreCase(category)
            .orElseThrow(() ->
                    new RuntimeException("Category not found: " + category));

    List<Product> products =
            productRepository.findByCategory(categoryEntity);

    return products.stream()
            .map(ProductMapper::toDTO)
            .collect(Collectors.toList());
}

    // Filter products by price range
    @Override
    public List<ProductDTO> filterByPrice(Double minPrice, Double maxPrice) {

        List<Product> products =
                productRepository.findByPriceBetween(minPrice, maxPrice);

        return products.stream()
                .map(product -> ProductMapper.toDTO(product))
                .collect(Collectors.toList());
    }
}