package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Property;
import com.example.demo.service.PropertyService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/edustay/properties")
@CrossOrigin("http://localhost:3000")
public class PropertyController {
    @Autowired
    private PropertyService propertyService;

    @PostMapping
    public Property addProperty(@RequestBody Property property) {
        return propertyService.addProperty(property);
    }     

    @GetMapping("/{id}")
    public Property getPropertyById(@PathVariable long id){
        return propertyService.getPropertyById(id).orElse(null);
    }
    
    @GetMapping
    public List<Property> getAllProperties(){
        return propertyService.getAllProperties();
    }

    @PutMapping("/{id}")
    public Property updateProperty(@PathVariable long id,@RequestBody Property updatedProperty){
        return propertyService.updateProperty(id, updatedProperty);
    }

    @DeleteMapping("/{id}")
    public String deleteProperty(@PathVariable long id){
        propertyService.deleteProperty(id);
        return "Property deleted successfully";
    }

    @GetMapping("/search")
    public List<Property> getPropertiesByLocation(@RequestParam String location){
        return propertyService.getPropertiesByLocation(location);
    }
}
