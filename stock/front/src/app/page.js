"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ClientDataPage() {
  const [data, setClients] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isPolling, setIsPolling] = useState(false); // To track polling status
  const [intervalId, setIntervalId] = useState(null); // To store the polling interval ID

  // Function to fetch data from FastAPI
  const fetchClientData = async () => {
    try {
      setIsFetching(true);
      const response = await axios.get('http://localhost:8001/clients');
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching client data:', error);
    } finally {
      setIsFetching(false);
    }
  };

  // Start polling
  const startPolling = () => {
    if (!isPolling) {
      const newIntervalId = setInterval(fetchClientData, 4000); // Poll every 4 seconds
      setIntervalId(newIntervalId);
      setIsPolling(true);
    }
  };

  // Stop polling
  const stopPolling = () => {
    if (isPolling && intervalId) {
      clearInterval(intervalId);
      setIsPolling(false);
      setIntervalId(null);
    }
  };

  // Cleanup interval on component unmount
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  return (
    <div className="table-container">
      <h1>Client Data</h1>
      <div className="button-container">
        <button onClick={startPolling} disabled={isPolling}>Start</button>
        <button onClick={stopPolling} disabled={!isPolling}>Stop</button>
      </div>

      <table className="styled-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>MTM</th>
            <th>Available Margin</th>
            <th>Max Profit</th>
            <th>Max Loss</th>
            <th>Multiplier</th>
            <th>Commodity Margin</th>
            <th>Exit Time</th>
            <th>QTY by Exposure</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.display_name}</td>
              <td>{item.mtm}</td>
              <td>{item.available_margin}</td>
              <td>{item.max_profit}</td>
              <td>{item.max_loss}</td>
              <td>{item.multiplier}</td>
              <td>{item.commodity_margin}</td>
              <td>{item.exit_time}</td>
              <td>{item.qty_by_exposure}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        .table-container {
          margin: 20px;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        h1 {
          text-align: center;
          margin-bottom: 20px;
        }

        .button-container {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }

        button {
          margin: 0 10px;
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
          border: none;
          border-radius: 5px;
          background-color: #4CAF50;
          color: white;
        }

        button:disabled {
          background-color: #ddd;
          cursor: not-allowed;
        }

        .styled-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 1em;
          text-align: left;
        }

        .styled-table th, .styled-table td {
          padding: 12px 15px;
          border: 1px solid #ddd;
        }

        .styled-table thead {
          background-color: #4CAF50;
          color: white;
        }

        .styled-table tbody tr:hover {
          background-color: #f1f1f1;
        }
      `}</style>
    </div>
  );
}
