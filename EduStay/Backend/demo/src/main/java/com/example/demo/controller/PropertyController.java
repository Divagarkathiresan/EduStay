// package and imports at top of file (keep as in your project)
package com.example.demo.controller;

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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/edustay/properties")
@CrossOrigin("http://localhost:3000")
public class PropertyController {

    @Autowired
    private PropertyService propertyService;

    @Autowired
    private JwtUtil jwtUtil;

    // --- addProperty (keep your existing implementation) ---
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> addProperty(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("propertyType") String propertyType,
            @RequestParam("areaName") String areaName,
            @RequestParam("district") String district,
            @RequestParam("state") String state,
            @RequestParam("pincode") int pincode,
            @RequestParam("locationDescription") String locationDescription,
            @RequestParam("rent") double rent,
            @RequestParam("amenities") String amenities,
            @RequestParam(value = "images", required = false) MultipartFile[] images,
            HttpServletRequest request) {

        try {
            // (validation omitted here for brevity — keep your validations)
            if (propertyType == null || propertyType.trim().isEmpty())
                return ResponseEntity.badRequest().body("Please select a property type.");

            // ... other checks as in your current code ...

            String header = request.getHeader("Authorization");
            if (header == null || !header.startsWith("Bearer "))
                return ResponseEntity.badRequest().body("Invalid token");

            String token = header.substring(7);
            String email = jwtUtil.getUsernameFromToken(token);

            List<String> imageUrls = new ArrayList<>();
            Path uploadPath = Paths.get("uploads/");
            if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);

            if (images != null) {
                for (MultipartFile image : images) {
                    String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
                    Files.copy(image.getInputStream(), uploadPath.resolve(fileName));
                    imageUrls.add("/uploads/" + fileName);
                }
            }

            String urlsJson = new ObjectMapper().writeValueAsString(imageUrls);

            Property property = new Property();
            property.setTitle(title);
            property.setDescription(description);
            property.setPropertyType(propertyType);
            property.setAreaName(areaName);
            property.setDistrict(district);
            property.setState(state);
            property.setPincode(pincode);
            property.setLocationDescription(locationDescription);
            property.setRent(rent);
            property.setAmenities(amenities);
            property.setImageUrls(urlsJson);

            Property saved = propertyService.addProperty(property, email);
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // --- SEARCH endpoint ---
    @GetMapping("/search")
    public ResponseEntity<?> searchProperties(
            @RequestParam(value = "district", required = false) String district,
            @RequestParam(value = "type", required = false) String propertyType,
            @RequestParam(value = "minPrice", required = false) Integer minPrice,
            @RequestParam(value = "maxPrice", required = false) Integer maxPrice
    ) {
        try {
            List<Property> allProperties = propertyService.getAllProperties();
            List<Property> filtered = allProperties;

            // FILTER BY DISTRICT (if provided)
            if (district != null && !district.trim().isEmpty()) {
                String search = district.toLowerCase();
                filtered = filtered.stream()
                        .filter(p -> safe(p.getDistrict()).contains(search)
                                || safe(p.getAreaName()).contains(search)
                                || safe(p.getState()).contains(search))
                        .toList();
            }

            // FILTER BY PROPERTY TYPE (if provided)
            if (propertyType != null && !propertyType.trim().isEmpty()) {
                final String t = propertyType.toLowerCase();
                filtered = filtered.stream()
                        .filter(p -> safe(p.getPropertyType()).equals(t))
                        .toList();
            }

            // FILTER BY PRICE RANGE (if provided)
            if (minPrice != null || maxPrice != null) {
                int min = (minPrice != null) ? minPrice : 0;
                int max = (maxPrice != null) ? maxPrice : Integer.MAX_VALUE;
                filtered = filtered.stream()
                        .filter(p -> {
                            double r = p.getRent();
                            return r >= min && r <= max;
                        })
                        .toList();
            }

            return ResponseEntity.ok(filtered);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to fetch properties");
        }
    }

    private String safe(String s) {
        return s == null ? "" : s.toLowerCase();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPropertyById(@PathVariable Long id) {
        try {
            var propertyOpt = propertyService.getPropertyById(id);
            if (propertyOpt.isEmpty())
                return ResponseEntity.status(404).body("Property not found");

            return ResponseEntity.ok(propertyOpt.get());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
    
}
