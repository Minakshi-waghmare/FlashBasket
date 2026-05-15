package com.flashbasket.backend.repository;

import com.flashbasket.backend.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {


// 🔹 Find category by name
Optional<Category> findByNameIgnoreCase(String name);
// 🔹 Check if category exists
boolean existsByName(String name);


}
