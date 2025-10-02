package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Property;

public interface PropertyRepository extends JpaRepository<Property, Long> {
    List<Property> findByLocation(String location);
}
