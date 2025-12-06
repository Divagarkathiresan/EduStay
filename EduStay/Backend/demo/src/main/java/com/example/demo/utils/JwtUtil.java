package com.example.demo.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // Use a sufficiently long secret. Keep it in application.properties or an environment variable in production.
    private final String SECRET_KEY = "MySuperSecretKeyForJWT1234567890_MustBeLongEnough_ReplaceInProd";
    private final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));

    // Token TTL: 30 minutes (adjust as needed)
    private final long TOKEN_VALIDITY_MS = 30L * 60L * 1000L;

    /**
     * Generate JWT token with email as subject.
     */
    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + TOKEN_VALIDITY_MS))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Canonical method for extracting the username (email) from token.
     */
    public String getUsernameFromToken(String token) {
        return getClaims(token).getSubject();
    }

    /**
     * Validate token: check subject matches expected email and token not expired.
     */
    public boolean validateToken(String token, String email) {
        try {
            String subject = getUsernameFromToken(token);
            return subject != null && subject.equals(email) && !isTokenExpired(token);
        } catch (Exception ex) {
            return false;
        }
    }

    private boolean isTokenExpired(String token) {
        Date exp = getClaims(token).getExpiration();
        return exp.before(new Date());
    }

    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
