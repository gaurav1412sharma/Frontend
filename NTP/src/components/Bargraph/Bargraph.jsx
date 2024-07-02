import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  BarController
} from 'chart.js';
import styles from './Bargraph.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  BarController
);

const Bargraph = () => {
  const [graphData, setGraphData] = useState(null);
  const offsetChartRef = useRef(null);
  const delayChartRef = useRef(null);

  

  const fetchGraphData = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://csir-ntp-backend-django-server.onrender.com';
      const response = await axios.get(`${apiUrl}/api/dynamic-graph/`);
      console.log('Fetched data:', response.data);
      setGraphData(response.data);
    } catch (error) {
      console.error('Error fetching graph data:', error);
    }
  };

  useEffect(() => {
    fetchGraphData();
    const interval = setInterval(fetchGraphData, 300000); // Fetch new data every 5 minutes

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!graphData) return;

    if (offsetChartRef.current) {
      offsetChartRef.current.destroy();
    }
    if (delayChartRef.current) {
      delayChartRef.current.destroy();
    }

    const offsetCtx = document.getElementById('offsetChart').getContext('2d');
    const delayCtx = document.getElementById('delayChart').getContext('2d');

    offsetChartRef.current = new ChartJS(offsetCtx, {
      type: 'bar',
      data: {
        labels: graphData.servers,
        datasets: [{
          label: 'Offset (S)',
          data: graphData.offsets,
          backgroundColor: 'darkgreen',
        }],
      },
      options: {
        scales: {
          x: {
            type: 'category',
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    delayChartRef.current = new ChartJS(delayCtx, {
      type: 'bar',
      data: {
        labels: graphData.servers,
        datasets: [{
          label: 'Delay (S)',
          data: graphData.delays,
          backgroundColor: 'navy',
        }],
      },
      options: {
        scales: {
          x: {
            type: 'category',
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      if (offsetChartRef.current) {
        offsetChartRef.current.destroy();
      }
      if (delayChartRef.current) {
        delayChartRef.current.destroy();
      }
    };
  }, [graphData]);

  if (!graphData) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.chartContainer}>
        <canvas id="offsetChart"></canvas>
      </div>
      <div className={styles.chartContainer}>
        <canvas id="delayChart"></canvas>
      </div>
    </div>
  );
};

export default Bargraph;
