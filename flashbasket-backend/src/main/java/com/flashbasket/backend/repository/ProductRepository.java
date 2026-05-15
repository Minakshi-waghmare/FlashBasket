package com.flashbasket.backend.repository;

import com.flashbasket.backend.model.Product;
import com.flashbasket.backend.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // 🔍 Search product by name
    List<Product> findByNameContainingIgnoreCase(String name);

    // 🏷️ Filter by categoryId
    List<Product> findByCategoryId(Long categoryId);

    // 🏷️ Filter by category
    List<Product> findByCategory(Category category);

    // 💰 Filter by price range
    List<Product> findByPriceBetween(Double minPrice, Double maxPrice);

    // 💰 Price low → high
    List<Product> findAllByOrderByPriceAsc();

    // 💰 Price high → low
    List<Product> findAllByOrderByPriceDesc();

    // 📦 Products in stock
    List<Product> findByStockGreaterThan(int stock);

    // ❗ Prevent duplicate product
    boolean existsByNameIgnoreCase(String name);
}