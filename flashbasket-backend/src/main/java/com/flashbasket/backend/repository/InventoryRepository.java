package com.flashbasket.backend.repository;

import com.flashbasket.backend.model.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    // 🔍 Search by product name
    List<Inventory> findByNameContainingIgnoreCase(String name);

    // 📦 Filter by category
    List<Inventory> findByCategory(String category);

    // 💰 Filter by price
    List<Inventory> findByPriceLessThan(double price);

    // 📊 Only in-stock products
    List<Inventory> findByQuantityGreaterThan(int quantity);

    // ❗ Check duplicate product (FIXED)
    boolean existsByName(String name);

    // 🗑 Delete by name (FIXED)
    void deleteByName(String name);
}