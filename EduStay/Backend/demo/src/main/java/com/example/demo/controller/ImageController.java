package com.example.demo.controller;

import com.example.demo.service.ImageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/edustay/image")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "https://edustay-frontend-56xj.onrender.com"
})
public class ImageController {

    private final ImageService imageService;

    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public ResponseEntity<?> upload(@RequestPart MultipartFile file) {
        try {
            // Upload image to Cloudinary
            String imageUrl = imageService.uploadImage(file);

            // Return URL of uploaded image
            return ResponseEntity.ok(imageUrl);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Upload failed: " + e.getMessage());
        }
    }
}
