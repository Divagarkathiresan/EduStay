//Backend/demo/src/main/java/com/example/demo/repository/UserRepository.java
package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.User;


@Repository
public interface UserRepository extends JpaRepository<User,Long>{
    User findByName(String name);
    
    Optional<User> findById(Long id);
    // User findByEmail(String email); 
    Optional<User> findByEmail(String email);
}
