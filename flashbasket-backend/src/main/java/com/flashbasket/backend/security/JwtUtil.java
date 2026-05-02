package com.flashbasket.backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

// 🔑 Secret key (keep it long & secure)
private final String SECRET = "mysecretkeymysecretkeymysecretkey12345";

private Key getSignKey() {
    return Keys.hmacShaKeyFor(SECRET.getBytes());
}

// 🔹 Generate Token
public String generateToken(String email) {
    return Jwts.builder()
            .setSubject(email)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 hrs
            .signWith(getSignKey(), SignatureAlgorithm.HS256)
            .compact();
}

// 🔹 Extract Email
public String extractUsername(String token) {
    return Jwts.parserBuilder()
            .setSigningKey(getSignKey())
            .build()
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
}

// 🔹 Validate Token
public boolean validateToken(String token, String email) {
    final String extractedEmail = extractUsername(token);
    return (extractedEmail.equals(email) && !isTokenExpired(token));
}

// 🔹 Check Expiry
private boolean isTokenExpired(String token) {
    return extractExpiration(token).before(new Date());
}

private Date extractExpiration(String token) {
    return Jwts.parserBuilder()
            .setSigningKey(getSignKey())
            .build()
            .parseClaimsJws(token)
            .getBody()
            .getExpiration();
}

}
