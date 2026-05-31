package com.flashbasket.backend.controller;

import com.flashbasket.backend.dto.CategoryDTO;
import com.flashbasket.backend.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @PostMapping
    public CategoryDTO createCategory(@RequestBody CategoryDTO dto) {
        return categoryService.createCategory(dto);
    }

    @GetMapping("/{id}")
    public CategoryDTO getCategory(@PathVariable Long id) {
        return categoryService.getCategoryById(id);
    }

    @GetMapping("/name/{categoryName}/products")
    public List<com.flashbasket.backend.dto.ProductDTO> getCategoryProducts(@PathVariable String categoryName) {
        // Standardizes incoming url paths (e.g., 'home-kitchen' -> 'Home & Kitchen')
        String cleanName = categoryName.replace("-", " ");
        if (categoryName.equalsIgnoreCase("home-kitchen")) {
            cleanName = "Home & Kitchen";
        }

        return categoryService.getProductsByCategoryName(cleanName);
    }

    @GetMapping
    public List<CategoryDTO> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @PutMapping("/{id}")
    public CategoryDTO updateCategory(@PathVariable Long id,
            @RequestBody CategoryDTO dto) {
        return categoryService.updateCategory(id, dto);
    }

    @DeleteMapping("/{id}")
    public String deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return "Category deleted successfully";
    }
}