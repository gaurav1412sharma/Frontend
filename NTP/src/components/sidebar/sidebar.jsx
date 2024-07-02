import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './sidebar.module.css';

const Sidebar = () => {
  const [searchInput, setSearchInput] = useState('');
  const [packetDetails, setPacketDetails] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  
  useEffect(() => {
    fetchCsrfToken();
  }, []);

  const fetchCsrfToken = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://csir-ntp-backend-django-server.onrender.com';
      const response = await axios.get(`${apiUrl}/api/csrf_token/`);
      setCsrfToken(response.data.csrf_token);
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://csir-ntp-backend-django-server.onrender.com';
      console.log('Sending request with data:', { search_input: searchInput });
      const response = await axios.post(
        `${apiUrl}/api/search/`,
        { search_input: searchInput },
        {
          headers: {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json',
          },
        }
      );
      setPacketDetails(response.data);
    } catch (error) {
      console.error('Error fetching packet details:', error.response ? error.response.data : error);
      setPacketDetails({ error: 'Failed to fetch packet details' });
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <div className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <button className={styles.toggleButton} onClick={toggleSidebar}>
          {sidebarOpen ? 'X' : '☰'}
          <span className={styles.toolTip}>Want to know more about specific server's packet-details, Click Here</span>
        </button>
        {sidebarOpen && (
          <>
            <form className={styles.searchForm} onSubmit={handleSearch}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Enter domain name or IP address"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button type="submit" className={styles.searchButton}>Search</button>
            </form>
            <div className={styles.packetDetails}>
              {packetDetails ? (
                Object.entries(packetDetails).map(([key, value]) => (
                  <div key={key} className={styles.packetDetail}>
                    <strong>{key}:</strong> {value}
                  </div>
                ))
              ) : (
                'No details yet.'
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Sidebar;
