package com.flashbasket.backend.serviceImpl;

import com.flashbasket.backend.dto.CreatePaymentRequest;
import com.flashbasket.backend.dto.CreatePaymentResponse;
import com.flashbasket.backend.dto.PaymentDTO;
import com.flashbasket.backend.dto.VerifyPaymentRequest;
import com.flashbasket.backend.model.Order;
import com.flashbasket.backend.model.Payment;
import com.flashbasket.backend.repository.OrderRepository;
import com.flashbasket.backend.repository.PaymentRepository;
import com.flashbasket.backend.service.PaymentService;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    // --------------------------------------------------
    // Existing Method: Manual Payment
    // --------------------------------------------------
    @Override
    public PaymentDTO makePayment(PaymentDTO dto) {

        // Find order by ID
        Order order = orderRepository.findById(dto.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Create payment object
        Payment payment = new Payment();
        payment.setOrderId(dto.getOrderId());
        payment.setAmount(dto.getAmount());
        payment.setPaymentMethod(dto.getPaymentMethod());
        payment.setPaymentStatus("PAID");

        // Save payment to database
        Payment saved = paymentRepository.save(payment);

        // Update order status
        order.setPaymentStatus("PAID");
        order.setStatus("CONFIRMED");
        orderRepository.save(order);

        // Prepare response
        dto.setId(saved.getId());
        dto.setPaymentStatus("PAID");

        return dto;
    }

    // --------------------------------------------------
    // Existing Method: Get Payment by Order ID
    // --------------------------------------------------
    @Override
    public PaymentDTO getPaymentByOrderId(Long orderId) {

        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        PaymentDTO dto = new PaymentDTO();
        dto.setId(payment.getId());
        dto.setOrderId(payment.getOrderId());
        dto.setAmount(payment.getAmount());
        dto.setPaymentMethod(payment.getPaymentMethod());
        dto.setPaymentStatus(payment.getPaymentStatus());

        return dto;
    }

    // --------------------------------------------------
    // Create Razorpay Order
    // --------------------------------------------------
    @Override
    public CreatePaymentResponse createRazorpayOrder(
            CreatePaymentRequest request) {

        try {
            // Check order exists
            Order order = orderRepository.findById(request.getOrderId())
                    .orElseThrow(() -> new RuntimeException("Order not found"));

            // Optional: validate amount matches order total
            if (!order.getTotalAmount().equals(request.getAmount())) {
                throw new RuntimeException(
                        "Amount does not match order total");
            }

            // Create Razorpay client
            RazorpayClient razorpayClient = new RazorpayClient(
                    razorpayKeyId,
                    razorpayKeySecret);

            // Create request JSON
            JSONObject options = new JSONObject();
            options.put("amount",
                    (int) (request.getAmount() * 100)); // rupees → paise
            options.put("currency", "INR");
            options.put("receipt",
                    "order_" + request.getOrderId());

            // Create Razorpay order
            com.razorpay.Order razorpayOrder = razorpayClient.orders.create(options);

            // Return response to frontend
            return new CreatePaymentResponse(
                    razorpayOrder.get("id"),
                    razorpayKeyId,
                    request.getAmount(),
                    "INR");

        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to create Razorpay order",
                    e);
        }
    }

    // --------------------------------------------------
    // Verify Razorpay Payment
    // --------------------------------------------------
    @Override
    public String verifyPayment(VerifyPaymentRequest request) {

        try {
            // Create JSON for signature verification
            JSONObject attributes = new JSONObject();
            attributes.put(
                    "razorpay_order_id",
                    request.getRazorpayOrderId());
            attributes.put(
                    "razorpay_payment_id",
                    request.getRazorpayPaymentId());
            attributes.put(
                    "razorpay_signature",
                    request.getRazorpaySignature());

            // Verify signature
            boolean isValid = Utils.verifyPaymentSignature(
                    attributes,
                    razorpayKeySecret);

            if (!isValid) {
                throw new RuntimeException(
                        "Invalid payment signature");
            }

            // Get order
            Order order = orderRepository.findById(
                    request.getOrderId())
                    .orElseThrow(() -> new RuntimeException(
                            "Order not found"));

            // Prevent duplicate payment records
            if (paymentRepository
                    .findByOrderId(order.getId())
                    .isPresent()) {
                return "Payment already verified";
            }

            // Save payment record
            Payment payment = new Payment();
            payment.setOrderId(order.getId());
            payment.setAmount(order.getTotalAmount());
            payment.setPaymentMethod("RAZORPAY");
            payment.setPaymentStatus("PAID");

            paymentRepository.save(payment);

            // Update order
            order.setPaymentStatus("PAID");
            order.setStatus("CONFIRMED");
            orderRepository.save(order);

            return "Payment verified successfully";

        } catch (Exception e) {
            throw new RuntimeException(
                    "Payment verification failed",
                    e);
        }
    }
}