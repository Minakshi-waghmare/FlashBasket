package com.flashbasket.backend.repository;

import com.flashbasket.backend.model.Order;
import com.flashbasket.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByOrderDateDesc(User user);
}
