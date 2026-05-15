package com.flashbasket.backend.controller;

import com.flashbasket.backend.model.Inventory;
import com.flashbasket.backend.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @PostMapping("/add")
    public Inventory addProduct(@RequestBody Inventory inventory) {
        return inventoryService.addProduct(inventory);
    }

    @GetMapping("/all")
    public List<Inventory> getAllProducts() {
        return inventoryService.getAllProducts();
    }

    @GetMapping("/{id}")
    public Inventory getProductById(@PathVariable Long id) {
        return inventoryService.getProductById(id);
    }

    @PutMapping("/update/{id}")
    public Inventory updateProduct(@PathVariable Long id,
            @RequestBody Inventory inventory) {
        return inventoryService.updateProduct(id, inventory);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteProduct(@PathVariable Long id) {
        inventoryService.deleteProduct(id);
        return "Product deleted successfully";
    }
}