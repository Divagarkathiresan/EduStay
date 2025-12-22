// package and imports at top of file (keep as in your project)
package com.example.demo.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;

import com.example.demo.model.Property;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.ImageService;
import com.example.demo.service.PropertyService;
import com.example.demo.service.UserService;
import com.example.demo.utils.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;


@RestController
@RequestMapping("/edustay/properties")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "https://edustay-frontend-56xj.onrender.com"  // replace with your real URL
})
public class PropertyController {

    @Autowired
    private PropertyService propertyService;

    @Autowired
    private ImageService imageService;

    @Autowired
    private UserService userservice;

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
            if (propertyType == null || propertyType.trim().isEmpty())
                return ResponseEntity.badRequest().body("Please select a property type.");

            String header = request.getHeader("Authorization");
            if (header == null || !header.startsWith("Bearer "))
                return ResponseEntity.badRequest().body("Invalid token");

            String token = header.substring(7);
            String email = jwtUtil.getUsernameFromToken(token);

            // Upload images to Cloudinary
            List<String> imageUrls = new ArrayList<>();

            if (images != null) {
                for (MultipartFile image : images) {
                    String cloudinaryUrl = imageService.uploadImage(image);
                    imageUrls.add(cloudinaryUrl);
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
            property.setImageUrls(urlsJson);  // Store Cloudinary URLs in DB

            Property saved = propertyService.addProperty(property, email);
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            e.printStackTrace();
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
        Optional<Property> propertyOpt = propertyService.getPropertyById(id);
        if (propertyOpt.isPresent()) {
            return new ResponseEntity<>(propertyOpt.get(), HttpStatus.OK);
        } else {
            return ResponseEntity.status(404).body("Property not found");
        }
    }

    @GetMapping("/owners/{id}")
    public ResponseEntity<User> getOwner(@PathVariable Long id) {
        Optional<User> owner =  userservice.getUserById(id);
        if (owner.isPresent()) {
            return new ResponseEntity<>(owner.get(), HttpStatus.OK);
        } else {
            return ResponseEntity.status(404).body(null);   
        }
    }

}