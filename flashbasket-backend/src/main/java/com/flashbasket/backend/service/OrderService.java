package com.flashbasket.backend.service;

import com.flashbasket.backend.dto.OrderDTO;
import java.util.List;

public interface OrderService {

OrderDTO placeOrder(Long userId);

List<OrderDTO> getUserOrders(Long userId);

}
