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
  });
  const [photo, setPhoto] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]); // Capture the selected file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append('courseName', formData.courseName);
      data.append('tutor', formData.tutor);
      data.append('price', formData.price);
      data.append('description', formData.description);
      data.append('video', formData.video);
      if (photo) {
        data.append('photo', photo);
      }

      const response = await fetch('http://localhost:8080/api/courses', {
        method: 'POST',
        body: data, // Use FormData instead of JSON
      });

      if (response.ok) {
        console.log('Course added successfully!');
        navigate('/courses');
      } else {
        const result = await response.json();
        setError(result.error || 'Failed to add the course.');
      }
    } catch (error) {
      setError('Error occurred while adding the course.');
      console.error(error);
    }
  };

  return (
    <div className="add">
      <div className="container1">
        <h2>Course Registration</h2>
        <form onSubmit={handleSubmit} className="addCourse-form" encType="multipart/form-data">
          <label>Name:</label>
          <input
            type="text"
            name="courseName"
            value={formData.courseName}
            onChange={handleChange}
            required
            style={{ width: '100%' }}
          />
          <label>Instructor:</label>
          <input
            type="text"
            name="tutor"
            value={formData.tutor}
            onChange={handleChange}
            required
            style={{ width: '100%' }}
          />
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            style={{ width: '100%' }}
          />
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            style={{ width: '100%' }}
          />
          <label>Video Link:</label>
          <input
            type="text"
            name="video"
            value={formData.video}
            onChange={handleChange}
            required
            style={{ width: '100%' }}
          />
          <label>Image:</label>
          <input
            type="file"
            name="photo"
            onChange={handlePhotoChange}
            accept="image/*" // Restrict to image files
            style={{ width: '100%' }}
          />
          {error && <span className="error-msg">{error}</span>}
          <div className="btn1">
            <button type="submit">Add Course</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCourse;
