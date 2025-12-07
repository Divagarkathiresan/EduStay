package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.Property;
import com.example.demo.model.User;
import com.example.demo.repository.PropertyRepository;
import com.example.demo.repository.UserRepository;

@Service
public class PropertyService {

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private UserRepository userRepository;

    public Property addProperty(Property property, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!"houseOwner".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("Only house owners can add properties");
        }

        property.setOwner(user);
        return propertyRepository.save(property);
    }

    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }

    public Optional<Property> getPropertyById(long id) {
        return propertyRepository.findById(id);
    }

    public Property updateProperty(long id, Property updatedProperty) {
        return propertyRepository.findById(id)
                .map(property -> {

                    if (updatedProperty.getTitle() != null)
                        property.setTitle(updatedProperty.getTitle());

                    if (updatedProperty.getDescription() != null)
                        property.setDescription(updatedProperty.getDescription());

                    // NEW: Property Type update
                    if (updatedProperty.getPropertyType() != null)
                        property.setPropertyType(updatedProperty.getPropertyType());

                    if (updatedProperty.getAreaName() != null)
                        property.setAreaName(updatedProperty.getAreaName());

                    if (updatedProperty.getDistrict() != null)
                        property.setDistrict(updatedProperty.getDistrict());

                    if (updatedProperty.getState() != null)
                        property.setState(updatedProperty.getState());

                    if (updatedProperty.getPincode() != 0)
                        property.setPincode(updatedProperty.getPincode());

                    if (updatedProperty.getLocationDescription() != null)
                        property.setLocationDescription(updatedProperty.getLocationDescription());

                    if (updatedProperty.getRent() != 0)
                        property.setRent(updatedProperty.getRent());

                    if (updatedProperty.getAmenities() != null)
                        property.setAmenities(updatedProperty.getAmenities());

                    if (updatedProperty.getImageUrls() != null)
                        property.setImageUrls(updatedProperty.getImageUrls());

                    property.setVerified(updatedProperty.isVerified());

                    return propertyRepository.save(property);
                })
                .orElseThrow(() -> new RuntimeException("Property not found with id " + id));
    }

    public void deleteProperty(long id) {
        propertyRepository.deleteById(id);
    }

    // SEARCH BY AREA
    public List<Property> getPropertiesByArea(String areaName) {
        return propertyRepository.findByAreaName(areaName);
    }

    // NEW: SEARCH BY PROPERTY TYPE (PG, Apartment, Rental Home)
    public List<Property> getPropertiesByType(String propertyType) {
        return propertyRepository.findByPropertyType(propertyType);
    }
}
