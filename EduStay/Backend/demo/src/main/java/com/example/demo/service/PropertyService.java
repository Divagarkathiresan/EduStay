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
    
    public Property addProperty(Property property, String username) {
        User user = userRepository.findByName(username);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        if (!"houseOwner".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("Only house owners can add properties");
        }
        property.setOwner(user);
        return propertyRepository.save(property);
    }
    
    public List<Property> getAllProperties(){
        return propertyRepository.findAll();
    }
    
    public Optional<Property> getPropertyById(long id){
        return propertyRepository.findById(id);
    }

    public Property updateProperty(long id, Property updatedProperty){
        return propertyRepository.findById(id)
        .map(property -> {
            if(updatedProperty.getTitle() != null){
                property.setTitle(updatedProperty.getTitle());    
            }
            if(updatedProperty.getDescription() != null){
                property.setDescription(updatedProperty.getDescription());    
            }
            if(updatedProperty.getLocation() != null){
                property.setLocation(updatedProperty.getLocation());
            }
            if(updatedProperty.getRent() != 0){
                property.setRent(updatedProperty.getRent());
            }
            if(updatedProperty.getAmenities() != null){
                property.setAmenities(updatedProperty.getAmenities());
            }
            if(updatedProperty.isVerified() != property.isVerified()){
                property.setVerified(updatedProperty.isVerified());
            }
            return propertyRepository.save(property);
        }).orElseThrow(() -> new RuntimeException("Property not found with id " + id));
    }

    public void deleteProperty(long id){
        propertyRepository.deleteById(id);
    }

    public List<Property> getPropertiesByLocation(String location){
        return propertyRepository.findByLocation(location);
    }

}
