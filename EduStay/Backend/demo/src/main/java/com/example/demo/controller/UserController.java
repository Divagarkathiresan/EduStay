package com.example.demo.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;

import com.example.demo.model.User;
import com.example.demo.service.UserService;
import com.example.demo.utils.JwtUtil;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;



@RestController
@RequestMapping("/api/auth/users")
@CrossOrigin(origins = "*")
public class UserController {
    @Autowired
    private UserService userservice;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user){
        try {
            if(user.getName().isEmpty() || user.getEmail().isEmpty() || user.getPassword().isEmpty()){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error","All fields are required"));
            }
            if(user.getName().length() < 3 || !(user.getEmail().endsWith("@gmail.com"))){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error","Name must be at least 3 characters long & give valid email address"));
            }
            if(userservice.getUserByName(user.getName()) != null){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error","Username already exists"));
            }
            userservice.saveUser(user);
            return new ResponseEntity<>(user, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);

        }
    }

    
    @PostMapping("/login")
    public ResponseEntity<?> LoginUser(@RequestBody User user){
        if(user.getName().isEmpty() || user.getPassword().isEmpty()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error","All fields are required"));
        }
        User dbuser = userservice.getUserByName(user.getName());
        if(dbuser == null || !dbuser.getPassword().equals(user.getPassword())){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error","Invalid Credentials"));
        }

        String token = jwtUtil.generateToken(dbuser.getName());
        return ResponseEntity.ok(Map.of("token", token));
    }


    // For checking whether the jwt is working or not
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers(){
        return new ResponseEntity<>(userservice.getAllUsers(),HttpStatus.OK);
    }

    @DeleteMapping
    public void deleteAllUsers(){
        userservice.deleteAllUsers();
    }
    
}
