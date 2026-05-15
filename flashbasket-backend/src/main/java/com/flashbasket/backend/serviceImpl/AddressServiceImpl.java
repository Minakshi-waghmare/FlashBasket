package com.flashbasket.backend.serviceImpl;

import com.flashbasket.backend.dto.AddressDTO;
import com.flashbasket.backend.mapper.AddressMapper;
import com.flashbasket.backend.model.Address;
import com.flashbasket.backend.repository.AddressRepository;
import com.flashbasket.backend.service.AddressService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
public class AddressServiceImpl implements AddressService {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private AddressMapper addressMapper;

    // Add new address
    @Override
    public AddressDTO addAddress(AddressDTO addressDTO) {

        Address address = addressMapper.toEntity(addressDTO);

        Address savedAddress = addressRepository.save(address);

        return addressMapper.toDTO(savedAddress);
    }

    // Get all addresses by user id
    @Override
    public List<AddressDTO> getAddressesByUserId(Long userId) {

        List<Address> addresses = addressRepository.findByUserId(userId);

        return addresses.stream()
                .map(addressMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Update address
    @Override
    public AddressDTO updateAddress(Long addressId, AddressDTO addressDTO) {

        Address existingAddress = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        existingAddress.setFullName(addressDTO.getFullName());
        existingAddress.setPhoneNumber(addressDTO.getPhoneNumber());
        existingAddress.setStreet(addressDTO.getStreet());
        existingAddress.setCity(addressDTO.getCity());
        existingAddress.setState(addressDTO.getState());
        existingAddress.setPincode(addressDTO.getPincode());
        existingAddress.setCountry(addressDTO.getCountry());

        Address updatedAddress = addressRepository.save(existingAddress);

        return addressMapper.toDTO(updatedAddress);
    }

    // Delete address
    @Override
    public void deleteAddress(Long addressId) {

        addressRepository.deleteById(addressId);
    }
}