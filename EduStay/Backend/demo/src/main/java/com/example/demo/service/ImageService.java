package com.example.demo.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class ImageService {

    private final Cloudinary cloudinary;

    public ImageService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public String uploadImage(MultipartFile file) throws IOException {

    byte[] bytes = file.getBytes(); // SAFE for multiple uploads

    Map uploadResult = cloudinary.uploader().upload(
            bytes,
            ObjectUtils.asMap(
                    "folder", "edustay",
                    "resource_type", "image"
            )
    );

    return uploadResult.get("secure_url").toString();
}


}
