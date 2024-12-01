import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const navigate = useNavigate();
  
  const userId = localStorage.getItem("id");
  const authToken = localStorage.getItem('token');

  useEffect(() => {
    // Fetch all courses
    axios.get("http://localhost:8080/api/courses")
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });

    // Fetch enrolled courses if user is logged in
    if (userId) {
      axios.get(`http://localhost:8080/api/learning/${userId}`)
        .then((response) => {
          const enrolledCourseIds = response.data.map(item => item.course_id);
          setEnrolled(enrolledCourseIds);
        })
        .catch((error) => {
          console.error("Error fetching enrolled courses:", error);
        });
    }
  }, [userId]);

  function enrollCourse(courseId) {
    // Check if user is authenticated
    if (!authToken) {
      toast.error('You need to login to continue', {
        position: 'top-right',
        autoClose: 1000,
      });
      setTimeout(() => {
        navigate('/login');
      }, 1000);
      return;
    }

    // Prepare enrollment request
    const enrollRequest = {
      userId: parseInt(userId),
      courseId: courseId
    };

    // Send enrollment request
    axios.post('http://localhost:8080/api/learning', enrollRequest)
      .then((response) => {
        // Update enrolled courses list
        setEnrolled(prevEnrolled => [...prevEnrolled, courseId]);

        toast.success('Course Enrolled successfully', {
          position: 'top-right',
          autoClose: 1000,
        });

        // Navigate to course page
        setTimeout(() => {
          navigate(`/course/${courseId}`);
        }, 1000);
      })
      .catch((error) => {
        console.error('Enrollment error:', error);
        toast.error('Failed to enroll. Please try again.', {
          position: 'top-right',
          autoClose: 1000,
        });
      });
  }

  return (
    <div>
      <Navbar page={"courses"}/>
      <div className="courses-container" style={{marginTop: "20px"}}>
        {courses.map((course) => (
          <div key={course.course_id} className="course-card">
            <img src={course.photo} alt={course.courseName} className="course-image" />
            <div className="course-details">
              <h3 className="course-heading">
                {course.courseName.length < 8
                  ? `${course.courseName} Tutorial`
                  : course.courseName
                }
              </h3>
              <p className="course-description" style={{color:"grey"}}>Price: ${course.price}</p>
              <p className="course-description">Tutorial by {course.tutor}</p>
            </div> 
            {enrolled.includes(course.course_id) ? (
              <button 
                className="enroll-button" 
                style={{color:'#F4D03F', backgroundColor:'darkblue', fontWeight:'bold'}} 
                onClick={() => navigate("/learnings")}
              >
                Enrolled
              </button>
            ) : (
              <button 
                className="enroll-button" 
                onClick={() => enrollCourse(course.course_id)}
              >
                Enroll
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Courses;