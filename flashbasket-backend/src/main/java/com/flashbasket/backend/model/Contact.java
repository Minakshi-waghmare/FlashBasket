package com.flashbasket.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "contact")
public class Contact {

```
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

private String name;
private String email;
private String message;

public Contact() {}

public Long getId() {
    return id;
}

public String getName() {
    return name;
}

public String getEmail() {
    return email;
}

public String getMessage() {
    return message;
}

public void setId(Long id) {
    this.id = id;
}

public void setName(String name) {
    this.name = name;
}

public void setEmail(String email) {
    this.email = email;
}

public void setMessage(String message) {
    this.message = message;
}
```

}
