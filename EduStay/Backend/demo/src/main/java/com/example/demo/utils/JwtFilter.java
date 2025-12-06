package com.example.demo.utils;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepo;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        System.out.println("\n================ JWT FILTER CALLED ================");

        String header = request.getHeader("Authorization");
        System.out.println("Authorization header = " + header);

        if (header != null && header.startsWith("Bearer ")) {

            String token = header.substring(7);
            System.out.println("Extracted token = " + token);

            String email = null;

            try {
                email = jwtUtil.getUsernameFromToken(token);
                System.out.println("Extracted email from token = " + email);
            } catch (Exception e) {
                System.out.println("ERROR extracting email: " + e.getMessage());
            }

            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                var userOpt = userRepo.findByEmail(email);
                User user = userOpt.orElse(null);

                System.out.println("User found in DB = " + user);

                boolean valid = jwtUtil.validateToken(token, email);
                System.out.println("Is token valid? = " + valid);

                if (user != null && valid) {
                    System.out.println("Setting authentication in SecurityContext...");

                    UsernamePasswordAuthenticationToken auth =
                            new UsernamePasswordAuthenticationToken(
                                    user, null, List.of()
                            );

                    auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(auth);

                } else {
                    System.out.println("Token INVALID or user == null");
                }
            }
        } else {
            System.out.println("Authorization header missing or NOT Bearer");
        }

        filterChain.doFilter(request, response);
    }
}
