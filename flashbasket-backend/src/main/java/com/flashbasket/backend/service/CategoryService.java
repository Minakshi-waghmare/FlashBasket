package com.flashbasket.backend.service;

import com.flashbasket.backend.dto.CategoryDTO;

import java.util.List;

public interface CategoryService {

    CategoryDTO createCategory(CategoryDTO dto);

    CategoryDTO getCategoryById(Long id);

    List<CategoryDTO> getAllCategories();

    CategoryDTO updateCategory(Long id, CategoryDTO dto);

    void deleteCategory(Long id);

    List<com.flashbasket.backend.dto.ProductDTO> getProductsByCategoryName(String name);
}