package com.flashbasket.backend.repository;

import com.flashbasket.backend.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContactRepository extends JpaRepository<Contact, Long> {


// 🔹 Find messages by email
List<Contact> findByEmail(String email);

// 🔹 Delete messages by email (optional admin feature)
void deleteByEmail(String email);


}
