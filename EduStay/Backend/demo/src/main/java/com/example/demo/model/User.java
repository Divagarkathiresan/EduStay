package com.example.demo.model;

import jakarta.persistence.*;
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
    private String name;
    @Column(name = "email" , unique = true , nullable = false)
    private String email;
    @Column(name = "password" , nullable = false)
    private String password;
    @Column(name = "phone")
    private String phone;
}
