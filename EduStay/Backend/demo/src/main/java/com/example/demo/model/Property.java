package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name="properties")
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @NotBlank(message = "Title cannot be empty")
    @Size(min = 5, max = 100, message = "Title must be between 5 and 100 characters")
    private String title;

    @NotBlank(message = "Description cannot be empty")
    @Size(min = 20, max = 10000, message = "Description must be at least 20 characters")
    private String description;

    // NEW FIELD: PROPERTY TYPE (PG, Apartment, Rental Home)
    @NotBlank(message = "Property type is required")
    private String propertyType;

    // Address fields
    @NotBlank(message = "Area name cannot be empty")
    @Size(min = 3, max = 100, message = "Area name must be at least 3 characters")
    private String areaName;

    @NotBlank(message = "District cannot be empty")
    @Size(min = 3, max = 100, message = "District must be at least 3 characters")
    private String district;

    @NotBlank(message = "State cannot be empty")
    @Size(min = 3, max = 100, message = "State must be at least 3 characters")
    private String state;

    @Min(value = 100000, message = "Pincode must be a valid 6-digit number")
    @Max(value = 999999, message = "Pincode must be a valid 6-digit number")
    private int pincode;

    @NotBlank(message = "Location description cannot be empty")
    @Size(min = 5, max = 200, message = "Location description must be between 5 and 200 characters")
    private String locationDescription;

    @Min(value = 1000, message = "Rent must be at least 1000")
    @Max(value = 500000, message = "Rent cannot exceed 500000")
    private double rent;

    @NotBlank(message = "Amenities cannot be empty")
    private String amenities;

    @NotBlank(message = "At least one image URL is required")
    private String imageUrls;

    private boolean verified = false;
}
