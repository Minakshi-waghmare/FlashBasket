package com.flashbasket.backend.serviceImpl;

import com.flashbasket.backend.model.Inventory;
import com.flashbasket.backend.repository.InventoryRepository;
import com.flashbasket.backend.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryServiceImpl implements InventoryService {

    @Autowired
    private InventoryRepository inventoryRepository;

    @Override
    public Inventory addProduct(Inventory inventory) {
        return inventoryRepository.save(inventory);
    }

    @Override
    public List<Inventory> getAllProducts() {
        return inventoryRepository.findAll();
    }

    @Override
    public Inventory getProductById(Long id) {
        return inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    @Override
    public Inventory updateProduct(Long id, Inventory inventory) {
        Inventory existing = getProductById(id);

        existing.setName(inventory.getName());
        existing.setPrice(inventory.getPrice());
        existing.setQuantity(inventory.getQuantity());
        existing.setCategory(inventory.getCategory());
        existing.setImageUrl(inventory.getImageUrl());

        return inventoryRepository.save(existing);
    }

    @Override
    public void deleteProduct(Long id) {
        inventoryRepository.deleteById(id);
    }
}