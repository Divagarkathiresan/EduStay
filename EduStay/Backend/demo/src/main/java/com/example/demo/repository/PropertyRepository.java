package com.example.demo.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.model.Property;
import com.example.demo.model.User;

public interface PropertyRepository extends JpaRepository<Property, Long> {

    List<Property> findByAreaName(String areaName);

    List<Property> findByDistrict(String district);

    List<Property> findByState(String state);

    List<Property> findByPincode(int pincode);

    // NEW — Search by property type
    List<Property> findByPropertyType(String propertyType);

    List<Property> findByOwner(User owner);
}
