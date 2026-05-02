package com.flashbasket.backend.serviceImpl;

import com.flashbasket.backend.dto.ContactDTO;
import com.flashbasket.backend.model.Contact;
import com.flashbasket.backend.repository.ContactRepository;
import com.flashbasket.backend.service.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactServiceImpl implements ContactService {

@Autowired
private ContactRepository contactRepository;

@Override
public ContactDTO saveMessage(ContactDTO dto) {

    Contact contact = new Contact();
    contact.setName(dto.getName());
    contact.setEmail(dto.getEmail());
    contact.setMessage(dto.getMessage());

    Contact saved = contactRepository.save(contact);

    dto.setId(saved.getId());
    return dto;
}

@Override
public List<ContactDTO> getAllMessages() {

    return contactRepository.findAll().stream().map(contact -> {
        ContactDTO dto = new ContactDTO();
        dto.setId(contact.getId());
        dto.setName(contact.getName());
        dto.setEmail(contact.getEmail());
        dto.setMessage(contact.getMessage());
        return dto;
    }).toList();
}


}
