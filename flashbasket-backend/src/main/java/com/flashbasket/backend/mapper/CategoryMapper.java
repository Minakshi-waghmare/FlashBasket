package com.flashbasket.backend.mapper;

import com.flashbasket.backend.dto.CategoryDTO;
import com.flashbasket.backend.model.Category;

public class CategoryMapper {

    public static CategoryDTO toDTO(Category category) {

        CategoryDTO dto = new CategoryDTO();

        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());

        return dto;
    }

    public static Category toEntity(CategoryDTO dto) {

        Category category = new Category();

        category.setId(dto.getId());
        category.setName(dto.getName());
        category.setDescription(dto.getDescription());

        return category;
    }
}