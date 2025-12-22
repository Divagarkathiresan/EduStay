package com.example.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name" , nullable = false)
    @NotBlank(message = "Full Name is required")
    @Size(min = 3, message = "Name must be at least 3 characters long")
    private String name;

    @Column(name = "email" , unique = true , nullable = false)
    @NotBlank(message = "Email address is required")
    @Email(message = "Please enter a valid email")
    private String email;

    @Column(name = "password" , nullable = false)
    @NotBlank(message = "Password is required") 
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String password;

    @Column(name = "phone")
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be exactly 10 digits")
    private String phone;

    @Column(name = "role", nullable = false)
    private String role;
}
