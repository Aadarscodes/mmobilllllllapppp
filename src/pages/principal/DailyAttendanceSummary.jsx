// filepath: c:\Users\VK~Singh\Desktop\school mangement system\school-dashboard\finalnewfrontent\src\pages\principal\DailyAttendanceSummary.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DailyAttendanceSummary = ({ schoolId, token, teacherId }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceSummary, setAttendanceSummary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAttendanceSummary = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem("principal_token"); // Retrieve token directly

      const response = await axios.get(
        `https://api.jsic.in/api/teacher-attendance/daily-summary`,
        {
          params: { schoolId, date, teacherId: teacherId || undefined },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAttendanceSummary(response.data.data);
    } catch (err) {
      console.error("Error fetching attendance summary:", err.response || err.message);
      setError(err.response?.data?.message || "Failed to fetch attendance summary");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceSummary();
  }, [date, teacherId]);

  return (
    <div>
      <h2>Daily Attendance Summary</h2>

      {/* Date Picker */}
      <div>
        <label htmlFor="date">Select Date: </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* Loading State */}
      {loading && <p>Loading...</p>}

      {/* Error Message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Attendance Summary Table */}
      {!loading && !error && attendanceSummary.length > 0 && (
        <table border="1" style={{ width: '100%', marginTop: '20px' }}>
          <thead>
            <tr>
              <th>Teacher Name</th>
              <th>Email</th>
              <th>Punches</th>
            </tr>
          </thead>
          <tbody>
            {attendanceSummary.map((teacher) => (
              <tr key={teacher.teacherId}>
                <td>{teacher.fullName}</td>
                <td>{teacher.email}</td>
                <td>
                  {teacher.punches.map((punch, index) => (
                    <div key={index}>
                      <strong>{punch.type}:</strong> {new Date(punch.time).toLocaleTimeString()} <br />
                      <small>
                        Lat: {punch.latitude}, Lon: {punch.longitude}
                      </small>
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* No Data Message */}
      {!loading && !error && attendanceSummary.length === 0 && (
        <p>No attendance records found for the selected date.</p>
      )}
    </div>
  );
};

export default DailyAttendanceSummary;