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
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;

import com.example.demo.model.Property;
import com.example.demo.service.PropertyService;
import com.example.demo.utils.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/edustay/properties")
@CrossOrigin("http://localhost:3000")
public class PropertyController {

    @Autowired
    private PropertyService propertyService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> addProperty(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("location") String location,
            @RequestParam("rent") double rent,
            @RequestParam("amenities") String amenities,
            @RequestParam(value = "images", required = false) MultipartFile[] images,
            HttpServletRequest request) {

        // ------------------------------
        // USER-FRIENDLY VALIDATION
        // ------------------------------
        if (title.trim().length() < 5)
            return ResponseEntity.badRequest().body("Title must be at least 5 characters long.");

        if (description.trim().length() < 20)
            return ResponseEntity.badRequest().body("Description must be at least 20 characters long.");

        if (location.trim().length() < 3)
            return ResponseEntity.badRequest().body("Location must be at least 3 characters long.");

        if (rent < 1000 || rent > 500000)
            return ResponseEntity.badRequest().body("Rent must be between ₹1000 and ₹500000.");

        if (images == null || images.length == 0)
            return ResponseEntity.badRequest().body("Please upload at least one image.");

        if (images.length > 5)
            return ResponseEntity.badRequest().body("You can upload a maximum of 5 images.");

        for (MultipartFile image : images) {
            if (image.getSize() > 5 * 1024 * 1024)
                return ResponseEntity.badRequest().body("Each image must be below 5MB.");

            String type = image.getContentType();
            if (!(type.equals("image/jpeg") || type.equals("image/png")))
                return ResponseEntity.badRequest().body("Only JPG and PNG images are allowed.");
        }

        // ------------------------------
        // JWT TOKEN VALIDATION
        // ------------------------------
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body("Invalid token");
        }

        try {
            String token = header.substring(7);
            String email = jwtUtil.getUsernameFromToken(token);

            // ------------------------------
            // SAVE IMAGES
            // ------------------------------
            List<String> imageUrls = new ArrayList<>();
            String uploadDir = "uploads/";
            Path uploadPath = Paths.get(uploadDir);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            for (MultipartFile image : images) {
                String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(image.getInputStream(), filePath);
                imageUrls.add("/uploads/" + fileName);
            }

            // Convert URL list to JSON
            ObjectMapper mapper = new ObjectMapper();
            String urlsJson = mapper.writeValueAsString(imageUrls);

            // ------------------------------
            // SAVE PROPERTY
            // ------------------------------
            Property property = new Property();
            property.setTitle(title);
            property.setDescription(description);
            property.setLocation(location);
            property.setRent(rent);
            property.setAmenities(amenities);
            property.setImageUrls(urlsJson);

            Property saved = propertyService.addProperty(property, email);
            return ResponseEntity.ok(saved);

        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Failed to upload image: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/search")
public ResponseEntity<?> getPropertiesByLocation(@RequestParam String location) {
    try {
        List<Property> properties = propertyService.getPropertiesByLocation(location);
        return ResponseEntity.ok(properties);
    } catch (Exception e) {
        return ResponseEntity.status(500).body("Failed to fetch properties");
    }
}

}
