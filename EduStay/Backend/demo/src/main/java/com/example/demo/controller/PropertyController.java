package com.example.demo.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.model.Property;
import com.example.demo.service.PropertyService;
import com.example.demo.utils.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("/edustay/properties")
@CrossOrigin("http://localhost:3000")
public class PropertyController {
    @Autowired
    private PropertyService propertyService;
    
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<?> addProperty(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("location") String location,
            @RequestParam("rent") double rent,
            @RequestParam("amenities") String amenities,
            @RequestParam("images") MultipartFile[] images,
            HttpServletRequest request) {
        
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body("Invalid token");
        }
        
        try {
            String token = header.substring(7);
            String email = jwtUtil.getUsernameFromToken(token);
            
            // Save images
            List<String> imageUrls = new ArrayList<>();
            if (images != null && images.length > 0) {
                String uploadDir = "uploads/";
                Path uploadPath = Paths.get(uploadDir);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                
                for (MultipartFile image : images) {
                    if (!image.isEmpty()) {
                        String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
                        Path filePath = uploadPath.resolve(fileName);
                        Files.copy(image.getInputStream(), filePath);
                        imageUrls.add("/uploads/" + fileName);
                    }
                }
            }
            
            Property property = new Property();
            property.setTitle(title);
            property.setDescription(description);
            property.setLocation(location);
            property.setRent(rent);
            property.setAmenities(amenities);
            // Convert image URLs list to JSON string
            ObjectMapper mapper = new ObjectMapper();
            property.setImageUrls(mapper.writeValueAsString(imageUrls));
            
            Property savedProperty = propertyService.addProperty(property, email);
            return ResponseEntity.ok(savedProperty);
            
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Failed to upload image: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to add property: " + e.getMessage());
        }
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
