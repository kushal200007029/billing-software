package com.billing;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;

@RestController
@RequestMapping("/api/billing")
@CrossOrigin(origins = "*") 
public class BillingController {

    private final List<Invoice> invoices = new ArrayList<>();
    private final AtomicLong nextId = new AtomicLong(1);

    @GetMapping("/invoices")
    public List<Invoice> getAllInvoices() {
        return invoices;
    }

    @PostMapping("/invoices")
    public Invoice createInvoice(@RequestBody InvoiceRequest request) {
        Invoice invoice = new Invoice();
        invoice.setId(nextId.getAndIncrement());
        invoice.setCustomerName(request.getCustomerName());
        
        double total = request.getItems() == null ? 0 : request.getItems().stream().mapToDouble(i -> i.getPrice() * i.getQuantity()).sum();
        invoice.setTotalAmount(total);
        invoice.setItems(request.getItems() == null ? new ArrayList<>() : request.getItems());
        invoice.setDate(new Date());
        
        invoices.add(invoice);
        return invoice;
    }

    @GetMapping("/invoices/{id}")
    public ResponseEntity<Invoice> getInvoice(@PathVariable("id") Long id) {
        return invoices.stream()
                .filter(inv -> inv.getId().equals(id))
                .findFirst()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

class InvoiceRequest {
    private String customerName;
    private List<InvoiceItem> items;

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public List<InvoiceItem> getItems() { return items; }
    public void setItems(List<InvoiceItem> items) { this.items = items; }
}

class Invoice {
    private Long id;
    private String customerName;
    private Double totalAmount;
    private Date date;
    private List<InvoiceItem> items;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
    public Date getDate() { return date; }
    public void setDate(Date date) { this.date = date; }
    public List<InvoiceItem> getItems() { return items; }
    public void setItems(List<InvoiceItem> items) { this.items = items; }
}

class InvoiceItem {
    private String productName;
    private Double price;
    private Integer quantity;

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}
