package com.flashbasket.backend.controller;

import com.flashbasket.backend.dto.AddressDTO;
import com.flashbasket.backend.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/address")
@CrossOrigin
public class AddressController {

    @Autowired
    private AddressService addressService;

    // Add new address
    @PostMapping
    public AddressDTO addAddress(@RequestBody AddressDTO addressDTO) {
        return addressService.addAddress(addressDTO);
    }

    // Get all addresses of user
    @GetMapping("/{userId}")
    public List<AddressDTO> getAddressesByUserId(@PathVariable Long userId) {
        return addressService.getAddressesByUserId(userId);
    }

    // Update address
    @PutMapping("/{addressId}")
    public AddressDTO updateAddress(@PathVariable Long addressId,
                                    @RequestBody AddressDTO addressDTO) {
        return addressService.updateAddress(addressId, addressDTO);
    }

    // Delete address
    @DeleteMapping("/{addressId}")
    public String deleteAddress(@PathVariable Long addressId) {
        addressService.deleteAddress(addressId);
        return "Address deleted successfully";
    }
}