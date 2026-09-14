package com.example.reservation_service.util;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String SECRET_KEY;

    @Value("${jwt.expiration}")
    private Long EXPIRATION_TIME;

    // Get SecretKey for 0.11.5
    private SecretKey getSigningKey() {
        byte[] keyBytes = SECRET_KEY.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public Boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token);
            return !isTokenExpired(token);
        } catch (ExpiredJwtException e) {
            System.err.println("Token expired: " + e.getMessage());
            return false;
        } catch (MalformedJwtException | UnsupportedJwtException e) {
            System.err.println("Invalid token: " + e.getMessage());
            return false;
        } catch (Exception e) {
            System.err.println("Token validation error: " + e.getMessage());
            return false;
        }
    }

    public Claims getClaims(String token) {
        return extractAllClaims(token);
    }

    public String getUserType(String token) {
        try {
            Claims claims = extractAllClaims(token);
            String userType = claims.get("userType", String.class);
            if (userType == null) {
                userType = claims.get("user_type", String.class);
            }
            return userType;
        } catch (Exception e) {
            System.err.println("Error extracting user type: " + e.getMessage());
            return null;
        }
    }

    public Integer getUserId(String token) {
        try {
            Claims claims = extractAllClaims(token);
            Integer userId = claims.get("userId", Integer.class);
            if (userId == null) {
                userId = claims.get("id", Integer.class);
            }
            return userId;
        } catch (Exception e) {
            System.err.println("Error extracting user ID: " + e.getMessage());
            return null;
        }
    }

    public Boolean isAdmin(String token) {
        if (token == null || token.isEmpty()) {
            return false;
        }

        try {
            if (!validateToken(token)) {
                return false;
            }

            String userType = getUserType(token);
            
            if (userType == null) {
                System.err.println("User type not found in token");
                return false;
            }

            return "1".equals(userType);

        } catch (Exception e) {
            System.err.println("Admin check failed: " + e.getMessage());
            return false;
        }
    }
}