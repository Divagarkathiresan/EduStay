package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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
    private long id;
    private String title;
    private String description;
    private String location;
    private double rent;
    private String amenities;
    private boolean verified = false;
}
