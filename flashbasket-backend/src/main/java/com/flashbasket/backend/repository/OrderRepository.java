package com.flashbasket.backend.repository;

import com.flashbasket.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

```
// 🔹 Get orders by userId (latest first)
List<Order> findByUserIdOrderByIdDesc(Long userId);

// 🔹 Get orders by status
List<Order> findByStatus(String status);

// 🔹 Get orders by payment status
List<Order> findByPaymentStatus(String paymentStatus);
```

}
