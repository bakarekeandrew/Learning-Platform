import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddCourse() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    courseName: '',
    tutor: '',
    price: '',
    description: '',
    video: '',
    photo: null, // Change this to null for file upload
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      photo: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formDataToSend = new FormData();
    formDataToSend.append('courseName', formData.courseName);
    formDataToSend.append('tutor', formData.tutor);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('video', formData.video);
    
    if (formData.photo) {
      formDataToSend.append('photo', formData.photo);
    }
  
    try {
      const response = await fetch('http://localhost:8080/api/courses', {
        method: 'POST',
        body: formDataToSend,
      });
  
      console.log('Response status:', response.status);
      
      const responseBody = await response.text();
      console.log('Response body:', responseBody);
  
      if (!response.ok) {
        setError(responseBody || 'Failed to add course');
        return;
      }
  
      const data = JSON.parse(responseBody);
      console.log('Course Added successfully!', data);
      navigate("/courses");
    } catch (error) {
      console.error('Submission error:', error);
      setError('Course add error: ' + error.message);
    }
  };
  
  return (
    <div className='add'>
      <div className='container1'>
        <h2>Course Registration</h2>
        <form onSubmit={handleSubmit} className="addCourse-form">
          <label>Name : </label>
          <input 
            type="text" 
            name="courseName" 
            value={formData.courseName} 
            onChange={handleChange}  
            required 
            style={{width:"100%"}}
          />
          <label>Instructor : </label>
          <input 
            type="text" 
            name="tutor" 
            value={formData.tutor} 
            onChange={handleChange}  
            required 
            style={{width:"100%"}}
          />
          <label>Price : </label>
          <input 
            type="number" 
            name="price" 
            value={formData.price} 
            onChange={handleChange}  
            required 
            style={{width:"100%"}}
          />
          <label>Description : </label>
          <input 
            type="text" 
            name="description" 
            value={formData.description} 
            onChange={handleChange}  
            required 
            style={{width:"100%"}}
          />
          <label>Video Link : </label>
          <input 
            type="text" 
            name="video" 
            value={formData.video} 
            onChange={handleChange}  
            required 
            style={{width:"100%"}}
          />
          <label>Course Image : </label>
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
          {formData.photo && (
            <div style={{marginTop: '10px'}}>
              <img 
                src={URL.createObjectURL(formData.photo)} 
                alt="Preview" 
                style={{maxWidth: '200px', maxHeight: '200px'}}
              />
            </div>
          )}
          {error && <span className='error-msg'>{error}</span>}
          <div className='btn1'>
            <button type="submit">Add Course</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCourse;
