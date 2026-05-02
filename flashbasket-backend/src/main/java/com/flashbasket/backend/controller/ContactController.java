package com.flashbasket.backend.controller;

import com.flashbasket.backend.dto.ContactDTO;
import com.flashbasket.backend.service.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin
public class ContactController {

```
@Autowired
private ContactService contactService;

// 📩 Send message
@PostMapping
public ContactDTO sendMessage(@RequestBody ContactDTO dto) {
    return contactService.saveMessage(dto);
}

// 📥 Get all messages (admin)
@GetMapping
public List<ContactDTO> getAllMessages() {
    return contactService.getAllMessages();
}
```

}
