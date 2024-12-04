import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  LineChart, Line, 
  PieChart, Pie, Cell 
} from 'recharts';
import SideBar from './SideBar';
import Navbar from './Navbar';

function Dashboard() {
  const [userscount, setUserscount] = useState(0);
  const [coursescount, setCoursescount] = useState(0);
  const [enrolled, setEnrolled] = useState(0);
  
  // State for charts with initial empty arrays
  const [barData, setBarData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [pieData, setPieData] = useState([]);

  const COLORS = ['#3C91E6', '#FFCE26', '#FD7238', '#82ca9d'];

  useEffect(() => {
    // Fetch user count
    fetch("http://localhost:8080/api/users")
      .then((response) => response.json())
      .then((users) => {
        setUserscount(users.length);
        
        // Transform user data for bar and line charts
        const monthlyUserData = users.reduce((acc, user) => {
          const month = new Date(user.createdAt).toLocaleString('default', { month: 'short' });
          const existingMonth = acc.find(item => item.name === month);
          
          if (existingMonth) {
            existingMonth.users++;
          } else {
            acc.push({ name: month, users: 1 });
          }
          return acc;
        }, []).sort((a, b) => {
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return months.indexOf(a.name) - months.indexOf(b.name);
        });
        
        setBarData(monthlyUserData);
        setLineData(monthlyUserData);
      })
      .catch((error) => console.error('Error fetching users:', error));

    // Fetch courses count
    fetch("http://localhost:8080/api/courses")
      .then((response) => response.json())
      .then((courses) => {
        setCoursescount(courses.length);
        
        // Transform course data for pie chart
        const courseCategoryData = courses.reduce((acc, course) => {
          const category = course.category || 'Uncategorized';
          const existingCategory = acc.find(item => item.name === category);
          
          if (existingCategory) {
            existingCategory.value++;
          } else {
            acc.push({ name: category, value: 1 });
          }
          return acc;
        }, []);
        
        setPieData(courseCategoryData);
      })
      .catch((error) => console.error('Error fetching courses:', error));

    // Fetch enrolled count
    fetch("http://localhost:8080/api/learning")
      .then((response) => response.json())
      .then((enrollments) => {
        setEnrolled(enrollments.length);
      })
      .catch((error) => console.error('Error fetching enrollments:', error));
  }, []);

  return (
    <div style={{ backgroundColor: "var(--grey)", minHeight: '100vh', display: 'flex' }}>
      <SideBar current={"dashboard"} />
      <section id="content" style={{ flex: 1, padding: '20px' }}>
        <Navbar />
        <main>
          <div className="head-title">
            <div className="left">
              <h1 id="dashboard" style={{ color: 'darkblue' }}>Dashboard</h1>
            </div>
          </div>
          
          {/* Cards in a single row */}
          <ul
              className="box-info"
              style={{
                display: 'flex',
                // justifyContent: 'space-between', 
                flexWrap: 'wrap', // Allows wrapping if necessary
                gap: '30px', // Reduced gap for less spacing
                margin: 0,
                padding: 0,
                listStyle: 'none',
              }}
            >
              <li
                style={{
                  flex: '1 1 calc(32% - 10px)', // Slightly wider cards to reduce gaps
                  maxWidth: '280px', // Adjust card width
                  backgroundColor: 'var(--light)', // Optional: Add background color
                  padding: '16px',
                  borderRadius: '12px',
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Adds slight shadow for better appearance
                  display: 'flex',
                  alignItems: 'center', // Vertically aligns the icon and text
                  gap: '10px', // Space between icon and text
                }}
              >
                <i className="bx bxs-group" style={{ fontSize: '36px', color: '#3C91E6' }}></i>
                <span className="text">
                  <h3 style={{ margin: 0 }}>{userscount}</h3>
                  <p style={{ margin: 0 }}>Total Users</p>
                </span>
              </li>
              <li
                style={{
                  flex: '1 1 calc(32% - 10px)',
                  maxWidth: '280px',
                  backgroundColor: 'var(--light)',
                  padding: '16px',
                  borderRadius: '12px',
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <i className="bx bx-book" style={{ fontSize: '36px', color: '#FFCE26' }}></i>
                <span className="text">
                  <h3 style={{ margin: 0 }}>{coursescount}</h3>
                  <p style={{ margin: 0 }}>Total Courses</p>
                </span>
              </li>
              <li
                style={{
                  flex: '1 1 calc(32% - 10px)',
                  maxWidth: '280px',
                  backgroundColor: 'var(--light)',
                  padding: '16px',
                  borderRadius: '12px',
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <i className="bx bxs-calendar-check" style={{ fontSize: '36px', color: '#FD7238' }}></i>
                <span className="text">
                  <h3 style={{ margin: 0 }}>{enrolled}</h3>
                  <p style={{ margin: 0 }}>Total Enrollment</p>
                </span>
              </li>
            </ul>


          
          {/* Charts Section */}
          <div className="table-data" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginTop: '20px' 
          }}>
            {/* Bar Chart */}
            <div style={{ 
              flex: 1, 
              backgroundColor: 'var(--light)', 
              borderRadius: '20px', 
              padding: '24px',
              marginRight: '24px'
            }}>
              <div className="head">
                <h3>Monthly User Growth</h3>
              </div>
              <BarChart width={400} height={300} data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" fill="#3C91E6" />
              </BarChart>
            </div>
            
            {/* Pie Chart */}
            <div style={{ 
              flex: 1, 
              backgroundColor: 'var(--light)', 
              borderRadius: '20px', 
              padding: '24px'
            }}>
              <div className="head">
                <h3>Course Categories</h3>
              </div>
              <PieChart width={400} height={300}>
                <Pie
                  data={pieData}
                  cx={200}
                  cy={150}
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          </div>
        </main>
      </section>
    </div>
  );
}

export default Dashboard;