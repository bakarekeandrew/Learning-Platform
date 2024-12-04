import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditCourse() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const location = useLocation();
  const courseId = location.pathname.split("/")[2];

  const [formData, setFormData] = useState({
    course_name: '',
    instructor: '',
    price: '',
    description: '',
    y_link: '',
    photo: null,
  });

  const [existingPhotoPath, setExistingPhotoPath] = useState('');

  const [formErrors, setFormErrors] = useState({
    course_name: '',
    instructor: '',
    price: '',
    description: '',
    y_link: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    let error = '';
    if (name === 'course_name' && value === '') {
      error = 'Course name is required';
    } else if (name === 'instructor' && value === '') {
      error = 'Instructor is required';
    } else if (name === 'price' && value === '') {
      error = 'Price is required';
    } else if (name === 'description' && value === '') {
      error = 'Description is required';
    } else if (name === 'y_link' && value === '') {
      error = 'Video Link is required';
    }
    setFormErrors({ ...formErrors, [name]: error });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      photo: file,
    }));
  };

  useEffect(() => {
    async function fetchCourse() {
      try {
        const response = await axios.get(`http://localhost:8080/api/courses/${courseId}`);
        const fetchedCourse = response.data;
        setFormData({
          course_name: fetchedCourse.courseName,
          instructor: fetchedCourse.tutor,
          price: fetchedCourse.price,
          description: fetchedCourse.description,
          y_link: fetchedCourse.video,
          photo: null,
        });
        setExistingPhotoPath(fetchedCourse.photo);
      } catch (err) {
        setError('Error fetching course');
      }
    }
    fetchCourse();
  }, [courseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formDataToSend = new FormData();
    formDataToSend.append('courseName', formData.course_name);
    formDataToSend.append('tutor', formData.instructor);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('video', formData.y_link);
    
    // Only append photo if a new file is selected
    if (formData.photo) {
      formDataToSend.append('photo', formData.photo);
    }
  
    try {
      const response = await axios.post(
        `http://localhost:8080/api/courses/${courseId}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      if (response.status === 200) {
        // Redirect to Courses page
        navigate("/DCourses");  // Use the correct path to your Courses page
        
        // Optional: Show a success toast
        toast.success('Course updated successfully', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
        });
      }
    } catch (error) {
      console.error('Course update failed', error);
      setError('Failed to update course');
    }
  };
  return (
    <div className='add'>
      <div className='container1'>
        <h2>Edit Course</h2>
        <form onSubmit={handleSubmit} className="addCourse-form">
          <label>Course Name: </label>
          <input 
            type="text" 
            name="course_name" 
            value={formData.course_name} 
            onChange={handleChange} 
            required 
            style={{ width: "100%" }} 
          />
          {formErrors.course_name && <span className='error-msg' style={{color:'red',fontWeight:'bold',textAlign:'start'}}>{formErrors.course_name}</span>}

          <label>Instructor: </label>
          <input 
            type="text" 
            name="instructor" 
            value={formData.instructor} 
            onChange={handleChange} 
            required 
            style={{ width: "100%" }} 
          />
          {formErrors.instructor && <span className='error-msg' style={{color:'red',fontWeight:'bold',textAlign:'start'}}>{formErrors.instructor}</span>}

          <label>Price: </label>
          <input 
            type="number" 
            name="price" 
            value={formData.price} 
            onChange={handleChange} 
            required 
            style={{ width: "100%" }} 
          />
          {formErrors.price && <span className='error-msg' style={{color:'red',fontWeight:'bold',textAlign:'start'}}>{formErrors.price}</span>}

          <label>Description: </label>
          <input 
            type="text" 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            required 
            style={{ width: "100%" }} 
          />
          {formErrors.description && <span className='error-msg' style={{color:'red',fontWeight:'bold',textAlign:'start'}}>{formErrors.description}</span>}

          <label>Video Link: </label>
          <input 
            type="text" 
            name="y_link" 
            value={formData.y_link} 
            onChange={handleChange} 
            required 
            style={{ width: "100%" }} 
          />
          {formErrors.y_link && <span className='error-msg' style={{color:'red',fontWeight:'bold',textAlign:'start'}}>{formErrors.y_link}</span>}

          <label>Course Image: </label>
          <div style={{position: 'relative', width: '100%'}}>
            <input 
              type="file" 
              name="photo" 
              onChange={handleFileChange}  
              accept="image/*" 
              id="fileInput"
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                opacity: 0,
                width: '100%',
                height: '100%',
                cursor: 'pointer'
              }}
            />
            <button 
              type="button" 
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#f0f0f0',
                border: '1px solid #ddd'
              }}
              onClick={() => document.getElementById('fileInput').click()}
            >
              Choose Image
            </button>
          </div>

          {/* Display existing or newly selected image */}
          {formData.photo ? (
            <div style={{marginTop: '10px'}}>
              <img 
                src={URL.createObjectURL(formData.photo)} 
                alt="Preview" 
                style={{maxWidth: '200px', maxHeight: '200px'}}
              />
            </div>
          ) : (
            existingPhotoPath && (
              <div style={{marginTop: '10px'}}>
                <img 
                  src={`http://localhost:8080${existingPhotoPath}`} 
                  alt="Existing Course" 
                  style={{maxWidth: '200px', maxHeight: '200px'}}
                />
              </div>
            )
          )}

          {error && <span className='error-msg' style={{color:'red',fontWeight:'bold',textAlign:'center'}}>{error}</span>}

          <div className='btn1'>
            <button type="submit">Update</button>
          </div> 
        </form>
      </div>
    </div>
  );
}

export default EditCourse;