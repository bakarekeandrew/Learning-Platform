package com.example.demo.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.entity.Course;
import com.example.demo.service.CourseService;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @GetMapping
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }

    @GetMapping("/{id}")
    public Course getCourseById(@PathVariable Long id) {
        return courseService.getCourseById(id);
    }

    @PostMapping
    public Course createCourse(
        @RequestParam("courseName") String courseName,
        @RequestParam("tutor") String tutor,
        @RequestParam("price") int price,
        @RequestParam("description") String description,
        @RequestParam("video") String video,
        @RequestParam(value = "photo", required = false) MultipartFile photo
    ) throws IOException {
        Course course = new Course();
        course.setCourseName(courseName);
        course.setTutor(tutor);
        course.setPrice(price);
        course.setDescription(description);
        course.setVideo(video);

        // Handle file upload
        if (photo != null && !photo.isEmpty()) {
            String fileName = UUID.randomUUID().toString() + "_" + photo.getOriginalFilename();
            Path filePath = Paths.get(uploadDir).resolve(fileName);
            Files.copy(photo.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            course.setPhoto("/uploads/" + fileName);
        }

        return courseService.createCourse(course);
    }

    @PostMapping("/{id}")
    public Course updateCourse(@PathVariable Long id, @RequestBody Course updatedCourse) {
        return courseService.updateCourse(id, updatedCourse);
    }

    @DeleteMapping("/{id}")
    public void deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
    }
}