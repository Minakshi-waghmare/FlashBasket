package com.flashbasket.backend.service;

import com.flashbasket.backend.dto.AddressDTO;

import java.util.List;

public interface AddressService {

    // Add new address
    AddressDTO addAddress(AddressDTO addressDTO);

    // Get all addresses by user id
    List<AddressDTO> getAddressesByUserId(Long userId);

    // Update address
    AddressDTO updateAddress(Long addressId, AddressDTO addressDTO);

    // Delete address
    void deleteAddress(Long addressId);
}