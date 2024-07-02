import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './RightSideBar.module.css';

const servers = {
  csir: ['time.nplindia.org', 'time.nplindia.in', '14.139.60.103', '14.139.60.106', '14.139.60.107'],
  nic: ['samay1.nic.in', 'samay2.nic.in'],
  doca: ['157.20.67.8']
};

// Helper function to get CSRF token from cookies
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const setAxiosCSRFToken = () => {
  const token = getCookie('csrftoken');
  if (token) {
    axios.defaults.headers.common['X-CSRFToken'] = token;
  }
};

const RightSidebar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [packetDetails, setPacketDetails] = useState(null);

  useEffect(() => {
    setAxiosCSRFToken();
  }, []);

  const toggleDropdown = () => {
    if (dropdownOpen) {
      setDropdownOpen(false);
      setPacketDetails(null);
    } else {
      setDropdownOpen(true);
    }
  };

  const fetchPacketDetails = async (server) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://csir-ntp-backend-django-server.onrender.com';
      const response = await axios.post(
        `${apiUrl}/api/search/`,
        { search_input: server },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true, // include credentials with request
        }
      );
      setPacketDetails(response.data);
    } catch (error) {
      console.error('Error fetching packet details:', error.response ? error.response.data : error);
      setPacketDetails({ error: 'Failed to fetch packet details' });
    }
  };

  return (
    <div>
      <button className={styles.toggleButton} onClick={toggleDropdown}>
        {dropdownOpen ? '✖' : '⋮'}
        {!dropdownOpen && <span className={styles.toolTip}>Want to know more about packet-details? Click Here</span>}
      </button>
      <div className={`${styles.dropdownContent} ${dropdownOpen ? styles.show : ''}`}>
        <div className={styles.tab} onClick={() => fetchPacketDetails(servers.csir[0])}>
          CSIR_NPL SERVERS
        </div>
        <div className={styles.tab} onClick={() => fetchPacketDetails(servers.nic[0])}>
          NIC SERVERS
        </div>
        <div className={styles.tab} onClick={() => fetchPacketDetails(servers.doca[0])}>
          DOCA SERVERS
        </div>
      </div>
      {packetDetails && (
        <div className={`${styles.packetDetails} ${dropdownOpen ? styles.show : ''}`}>
          {Object.entries(packetDetails).map(([key, value]) => (
            <div key={key} className={styles.packetDetail}>
              <strong>{key}:</strong> {value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RightSidebar;
