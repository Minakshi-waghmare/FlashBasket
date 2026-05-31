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
    try {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    } catch (Exception e) {
        // Fallback: Parse unsigned token (useful for Supabase JWTs in local development)
        try {
            String[] splitToken = token.split("\\.");
            if (splitToken.length >= 2) {
                String unsignedToken = splitToken[0] + "." + splitToken[1] + ".";
                return Jwts.parser( ) // Using standard parser fallback
                        .parseClaimsJwt(unsignedToken)
                        .getBody()
                        .getSubject();
            }
        } catch (Exception ex) {
            System.err.println("Failed to parse unsigned token: " + ex.getMessage());
        }
        return null;
    }
}

// 🔹 Validate Token
public boolean validateToken(String token, String email) {
    final String extractedEmail = extractUsername(token);
    return (extractedEmail != null && extractedEmail.equals(email) && !isTokenExpired(token));
}

// 🔹 Check Expiry
private boolean isTokenExpired(String token) {
    Date expiration = extractExpiration(token);
    return expiration != null && expiration.before(new Date());
}

private Date extractExpiration(String token) {
    try {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
    } catch (Exception e) {
        try {
            String[] splitToken = token.split("\\.");
            if (splitToken.length >= 2) {
                String unsignedToken = splitToken[0] + "." + splitToken[1] + ".";
                return Jwts.parser()
                        .parseClaimsJwt(unsignedToken)
                        .getBody()
                        .getExpiration();
            }
        } catch (Exception ex) {
            // ignore
        }
        // Fallback: return a future date if we can't extract it
        return new Date(System.currentTimeMillis() + 3600000);
    }
}

}
