package com.flashbasket.backend.repository;

import com.flashbasket.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {


// 🔍 Search product by name
List<Product> findByNameContainingIgnoreCase(String name);

// 🏷️ Filter by categoryId
List<Product> findByCategoryId(Long categoryId);

// 💰 Sort by price (low → high)
List<Product> findAllByOrderByPriceAsc();

// 💰 Sort by price (high → low)
List<Product> findAllByOrderByPriceDesc();

// 📦 Get products with stock available
List<Product> findByStockGreaterThan(int stock);


}
