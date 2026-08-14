package com.example.create_service.middleware;

import com.example.create_service.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class AdminMiddleware extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                   HttpServletResponse response, 
                                   FilterChain filterChain) 
            throws ServletException, IOException {
        
        String path = request.getRequestURI();
        
        // ⭐ PUBLIC ENDPOINTS - No token required
        if (path.startsWith("/student") || 
            path.startsWith("/public") || 
            path.startsWith("/health") ||
            path.startsWith("/login") ||
            path.startsWith("/register")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        // ⭐ ADMIN ENDPOINTS - Token required
        String authHeader = request.getHeader("Authorization");
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Unauthorized\", \"message\": \"No token provided\"}");
            return;
        }
        
        String token = authHeader.substring(7);
        
        if (!jwtUtil.validateToken(token)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Unauthorized\", \"message\": \"Invalid token\"}");
            return;
        }
        
        // Check if admin (only for admin endpoints)
        if (path.startsWith("/admin") && !jwtUtil.checkIfAdmin(token)) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Forbidden\", \"message\": \"Admin access required\"}");
            return;
        }
        
        // Set user info for controllers
        request.setAttribute("userId", jwtUtil.getUserId(token));
        request.setAttribute("userType", jwtUtil.getUserType(token));
        request.setAttribute("username", jwtUtil.extractUsername(token));
        
        filterChain.doFilter(request, response);
    }
}