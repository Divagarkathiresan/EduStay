package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.example.demo.model.Property;
import com.example.demo.repository.PropertyRepository;

@Service
public class PropertyCleanupService {
    
    @Autowired
    private PropertyRepository propertyRepository;
    
    @Scheduled(fixedRate = 60000) // Run every minute
    public void deleteExpiredProperties() {
        LocalDateTime twentyMinutesAgo = LocalDateTime.now().minusMinutes(20);
        List<Property> expiredProperties = propertyRepository.findByCreatedAtBefore(twentyMinutesAgo);
        
        if (!expiredProperties.isEmpty()) {
            propertyRepository.deleteAll(expiredProperties);
            System.out.println("Deleted " + expiredProperties.size() + " expired properties after 20 minutes");
        }
    }
}