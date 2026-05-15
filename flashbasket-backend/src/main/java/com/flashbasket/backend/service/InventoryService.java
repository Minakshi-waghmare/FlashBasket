package com.flashbasket.backend.service;

import com.flashbasket.backend.model.Inventory;

import java.util.List;

public interface InventoryService {

    Inventory addProduct(Inventory inventory);

    List<Inventory> getAllProducts();

    Inventory getProductById(Long id);

    Inventory updateProduct(Long id, Inventory inventory);

    void deleteProduct(Long id);
}