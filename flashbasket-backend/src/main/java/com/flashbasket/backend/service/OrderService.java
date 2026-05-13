package com.flashbasket.backend.service;

import com.flashbasket.backend.dto.OrderDTO;
import java.util.List;

public interface OrderService {

OrderDTO createOrder(String username, OrderDTO dto);

List<OrderDTO> getUserOrders(String username);

}
