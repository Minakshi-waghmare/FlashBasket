package com.flashbasket.backend.repository;

import com.flashbasket.backend.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {

    // Get all addresses by user id
    List<Address> findByUserId(Long userId);
}