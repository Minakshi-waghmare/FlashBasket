package com.flashbasket.backend.dto;

public class SearchRequestDTO {

    private String keyword;

    private String category;

    private Double minPrice;

    private Double maxPrice;

    // Constructors
    public SearchRequestDTO() {
    }

    public SearchRequestDTO(String keyword, String category,
                            Double minPrice, Double maxPrice) {
        this.keyword = keyword;
        this.category = category;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
    }

    // Getters and Setters

    public String getKeyword() {
        return keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Double getMinPrice() {
        return minPrice;
    }

    public void setMinPrice(Double minPrice) {
        this.minPrice = minPrice;
    }

    public Double getMaxPrice() {
        return maxPrice;
    }

    public void setMaxPrice(Double maxPrice) {
        this.maxPrice = maxPrice;
    }
}