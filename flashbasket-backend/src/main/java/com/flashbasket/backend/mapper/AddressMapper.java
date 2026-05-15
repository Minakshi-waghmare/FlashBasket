package com.flashbasket.backend.mapper;

import com.flashbasket.backend.dto.AddressDTO;
import com.flashbasket.backend.model.Address;
import org.springframework.stereotype.Component;

@Component
public class AddressMapper {

    // Convert Entity to DTO
    public AddressDTO toDTO(Address address) {

        AddressDTO dto = new AddressDTO();

        dto.setId(address.getId());
        dto.setUserId(address.getUserId());
        dto.setFullName(address.getFullName());
        dto.setPhoneNumber(address.getPhoneNumber());
        dto.setStreet(address.getStreet());
        dto.setCity(address.getCity());
        dto.setState(address.getState());
        dto.setPincode(address.getPincode());
        dto.setCountry(address.getCountry());

        return dto;
    }

    // Convert DTO to Entity
    public Address toEntity(AddressDTO dto) {

        Address address = new Address();

        address.setId(dto.getId());
        address.setUserId(dto.getUserId());
        address.setFullName(dto.getFullName());
        address.setPhoneNumber(dto.getPhoneNumber());
        address.setStreet(dto.getStreet());
        address.setCity(dto.getCity());
        address.setState(dto.getState());
        address.setPincode(dto.getPincode());
        address.setCountry(dto.getCountry());

        return address;
    }
}