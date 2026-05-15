package com.flashbasket.backend.service;

import com.flashbasket.backend.dto.ContactDTO;
import java.util.List;

public interface ContactService {

ContactDTO saveMessage(ContactDTO dto);

List<ContactDTO> getAllMessages();


}
