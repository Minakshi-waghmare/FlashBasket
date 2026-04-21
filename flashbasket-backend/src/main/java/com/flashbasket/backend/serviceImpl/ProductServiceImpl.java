package com.flashbasket.backend.serviceImpl;

import com.flashbasket.backend.dto.ProductDTO;
import com.flashbasket.backend.exception.ResourceNotFoundException;
import com.flashbasket.backend.mapper.ProductMapper;
import com.flashbasket.backend.model.Category;
import com.flashbasket.backend.model.Product;
import com.flashbasket.backend.repository.CategoryRepository;
import com.flashbasket.backend.repository.ProductRepository;
import com.flashbasket.backend.service.ProductService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    // ✅ Constructor Injection (BEST PRACTICE)
    public ProductServiceImpl(ProductRepository productRepository,
                              CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public ProductDTO createProduct(ProductDTO dto) {

        Category category = getCategoryById(dto.getCategoryId());

        Product product = ProductMapper.toEntity(dto, category);

        return ProductMapper.toDTO(productRepository.save(product));
    }

    @Override
    public ProductDTO getProductById(Long id) {

        Product product = getProductEntityById(id);

        return ProductMapper.toDTO(product);
    }

    @Override
    public List<ProductDTO> getAllProducts() {

        return productRepository.findAll()
                .stream()
                .map(ProductMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ProductDTO updateProduct(Long id, ProductDTO dto) {

        Product product = getProductEntityById(id);

        // ✅ update fields safely
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setStock(dto.getStock());
        product.setImageUrl(dto.getImageUrl());

        // optional category update
        if (dto.getCategoryId() != null) {
            product.setCategory(getCategoryById(dto.getCategoryId()));
        }

        return ProductMapper.toDTO(productRepository.save(product));
    }

    @Override
    public void deleteProduct(Long id) {

        Product product = getProductEntityById(id);

        productRepository.delete(product);
    }

    // ===================== 🔥 Helper Methods =====================

    private Product getProductEntityById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product not found with id: " + id));
    }

    private Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category not found with id: " + id));
    }
}