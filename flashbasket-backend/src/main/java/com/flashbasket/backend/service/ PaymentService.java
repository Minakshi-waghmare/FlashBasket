package com.flashbasket.backend.service;

import com.flashbasket.backend.dto.PaymentDTO;

public interface PaymentService {

```
PaymentDTO processPayment(PaymentDTO dto);

PaymentDTO getPaymentByOrderId(Long orderId);
```

}
