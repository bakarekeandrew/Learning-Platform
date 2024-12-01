package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.entity.UserRole;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Custom password hashing method
    private String hashPassword(String password) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hashedBytes = md.digest(password.getBytes());
            
            // Convert to hexadecimal representation
            StringBuilder sb = new StringBuilder();
            for (byte b : hashedBytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error hashing password", e);
        }
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

   public User createUser(User user) {
    // Check if this is the first user
    long userCount = userRepository.count();      
    
    if (userCount == 0) {
        // Use UserRole directly, not User.UserRole
        user.setRole(UserRole.ADMIN);
    } else {
        // Use UserRole directly, not User.UserRole
        user.setRole(UserRole.USER);  // Changed from ADMIN to USER for non-first users
    }

    // Hash the password before saving
    user.setPassword(hashPassword(user.getPassword()));
    
    return userRepository.save(user);
}
    public User updateUser(Long id, User updatedUser) {
        User existingUser = userRepository.findById(id).orElse(null);
        if (existingUser != null) {
            existingUser.setUsername(updatedUser.getUsername());
            existingUser.setEmail(updatedUser.getEmail());
            // Add other fields you want to update
            return userRepository.save(existingUser);
        }
        return null;
    }
    
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public User authenticateUser(String email, String password) {
        User user = userRepository.findByEmail(email);
        
        // Hash the input password and compare with stored hashed password
        String hashedInputPassword = hashPassword(password);
        
        if (user != null && hashedInputPassword.equals(user.getPassword())) {
            return user;
        }
        return null;
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}