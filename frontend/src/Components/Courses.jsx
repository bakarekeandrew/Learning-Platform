import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Courses() {
  // State for courses and filtering
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [enrolled, setEnrolled] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(6);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [sortBy, setSortBy] = useState('');

  const navigate = useNavigate();
  
  const userId = localStorage.getItem("id");
  const authToken = localStorage.getItem('token');

  // Fetch courses and enrolled courses
  useEffect(() => {
    axios.get("http://localhost:8080/api/courses")
      .then((response) => {
        setCourses(response.data);
        setFilteredCourses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });

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

  // Advanced filtering and sorting
  useEffect(() => {
    let result = [...courses];

    if (searchTerm) {
      result = result.filter(course => 
        course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.tutor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (priceFilter) {
      switch(priceFilter) {
        case 'free':
          result = result.filter(course => course.price === 0);
          break;
        case 'low':
          result = result.filter(course => course.price > 0 && course.price <= 50);
          break;
        case 'medium':
          result = result.filter(course => course.price > 50 && course.price <= 100);
          break;
        case 'high':
          result = result.filter(course => course.price > 100);
          break;
        default:
          break;
      }
    }

    if (sortBy) {
      switch(sortBy) {
        case 'priceLowToHigh':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'priceHighToLow':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'alphabetical':
          result.sort((a, b) => a.courseName.localeCompare(b.courseName));
          break;
        default:
          break;
      }
    }

    setFilteredCourses(result);
    setCurrentPage(1);
  }, [searchTerm, priceFilter, sortBy, courses]);

  // Pagination logic
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  function enrollCourse(courseId) {
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

    const enrollRequest = {
      userId: parseInt(userId),
      courseId: courseId
    };

    axios.post('http://localhost:8080/api/learning', enrollRequest)
      .then((response) => {
        setEnrolled(prevEnrolled => [...prevEnrolled, courseId]);

        toast.success('Course Enrolled successfully', {
          position: 'top-right',
          autoClose: 1000,
        });

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
      
      {/* Search and Filter Section */}
      <div className="filter-container" style={{
        display: 'flex', 
        justifyContent: 'center', 
        gap: '10px', 
        margin: '20px 0'
      }}>
        <input 
          type="text" 
          placeholder="Search courses..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '10px',
            width: '300px',
            borderRadius: '5px',
            border: '1px solid #ddd'
          }}
        />

        <select 
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ddd'
          }}
        >
          <option value="">All Prices</option>
          <option value="free">Free Courses</option>
          <option value="low">$0 - $50</option>
          <option value="medium">$50 - $100</option>
          <option value="high">Over $100</option>
        </select>

        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ddd'
          }}
        >
          <option value="">Sort By</option>
          <option value="priceLowToHigh">Price: Low to High</option>
          <option value="priceHighToLow">Price: High to Low</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
      </div>
      
      {/* Courses Grid */}
      <div className="courses-container" style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '20px',
        padding: '0 20px'
      }}>
        {currentCourses.map((course) => (
          <div 
            key={course.course_id} 
            className="course-card" 
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              width: '250px',
              height: '350px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}
          >
            <img 
              src={`http://localhost:8080${course.photo}`}  
              alt={course.courseName} 
              style={{
                width: '100%',
                height: '150px', 
                objectFit: 'cover'
              }}
            />
            <div style={{
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              flex: 1
            }}>
              <div>
                <h3 style={{
                  margin: '0 0 5px 0',
                  fontSize: '16px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {course.courseName.length > 20 
                    ? course.courseName.substring(0, 20) + '...' 
                    : course.courseName}
                </h3>
                <p style={{
                  color: 'grey',
                  margin: '5px 0',
                  fontSize: '14px'
                }}>
                  Price: ${course.price}
                </p>
                <p style={{
                  margin: '0',
                  fontSize: '14px',
                  color: '#666'
                }}>
                  By {course.tutor}
                </p>
              </div>
              
              {enrolled.includes(course.course_id) ? (
                <button 
                  style={{
                    marginTop: '10px',
                    padding: '8px',
                    backgroundColor: 'darkblue',
                    color: '#F4D03F',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate("/learnings")}
                >
                  Enrolled
                </button>
              ) : (
                <button 
                  style={{
                    marginTop: '10px',
                    padding: '8px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                  onClick={() => enrollCourse(course.course_id)}
                >
                  Enroll
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div 
        className="pagination" 
        style={{
          display: 'flex', 
          justifyContent: 'center', 
          marginTop: '20px'
        }}
      >
        {Array.from({ 
          length: Math.ceil(filteredCourses.length / coursesPerPage) 
        }).map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            style={{
              margin: '0 5px',
              padding: '5px 10px',
              backgroundColor: currentPage === index + 1 ? '#007bff' : '#fff',
              color: currentPage === index + 1 ? '#fff' : '#007bff',
              border: '1px solid #007bff',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Courses;