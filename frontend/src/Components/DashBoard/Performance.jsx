import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './dstyle.css';
import { useNavigate } from 'react-router-dom';

const Performance = () => {
  const [performanceData, setPerformanceData] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCourse() {
      try {
        const userId = localStorage.getItem("id");
        if (!userId) {
          console.error("No user ID found");
          return;
        }
        const response = await axios.get(`http://localhost:8080/api/learning/${userId}`);
        setEnrolledCourses(response.data || []);
      } catch (err) {
        console.error("Error fetching enrolled courses:", err);
        setEnrolledCourses([]);
      }
    }
    fetchCourse();
  }, []);

  useEffect(() => {
    async function fetchPerformanceData() {
      try {
        const userId = localStorage.getItem("id");
        if (!userId) {
          console.error("No user ID found");
          return;
        }
        const response = await fetch(`http://localhost:8080/api/assessments/perfomance/${userId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPerformanceData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching performance data:", error);
        setPerformanceData([]);
      }
    }
    fetchPerformanceData();
  }, []);

  function certifiedUser(id) {
    navigate(`/certificate/${id}`);
  }

  return (
    <div className="performance-container" style={{ marginTop: '70px' }}>
      <div style={{ marginBottom: '80px' }}>
        <h2 style={{ color: 'darkblue' }}>Courses Enrolled</h2>
        <table className="performance-table" style={{ width: '40%' }}>
          <thead>
            <tr>
              <th>Courses</th>
            </tr>
          </thead>
          <tbody>
            {enrolledCourses.length > 0 ? (
              enrolledCourses.map((data, index) => (
                <tr key={index}>
                  <td>{data.course_name}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td>No enrolled courses</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div>
        <h2 style={{ color: 'darkblue' }}>PERFORMANCE</h2>
        <table className="performance-table" style={{ marginBottom: '40px' }}>
          <thead>
            <tr>
              <th>Courses</th>
              <th>Progress</th>
              <th>Marks</th>
              <th>Certificate</th>
            </tr>
          </thead>
          <tbody>
            {performanceData.length > 0 ? (
              performanceData.map((data, index) => (
                <tr key={index}>
                  <td>{data.course?.course_name || 'N/A'}</td>
                  <td className={data.marks !== 0 ? 'completed-status' : 'pending-status'}>
                    {data.marks !== 0 ? 'Completed' : 'Pending'}
                  </td>
                  <td>{data.marks}</td>
                  <td 
                    className={data.marks !== 0 ? 'completed-certificate' : 'pending-certificate'}
                    onClick={() => data.marks !== 0 && certifiedUser(data.course?.id)}
                  >
                    {data.marks !== 0 ? 'Download Certificate' : 'Not Available'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No performance data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Performance;