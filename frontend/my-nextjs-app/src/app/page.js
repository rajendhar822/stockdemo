// src/app/page.js

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import ClientForm from "../../components/ClientForm"; // Import ClientForm component

export default function Home() {
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false); // State to toggle form visibility
  const [editingClient, setEditingClient] = useState(null); // State for client being edited

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = () => {
    // Fetch data from FastAPI
    axios
      .get("http://localhost:8001/clients")
      .then((response) => {
        setClients(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the clients data:", error);
      });
  };

  // Toggle form display for new client
  const handleAddClick = () => {
    setShowForm(true);
    setEditingClient(null); // Reset editing state when adding new
  };

  // Update client list when a new or edited client is added
  const handleClientAdded = (newClient) => {
    if (editingClient) {
      // If we are editing, replace the existing client in the list
      const updatedClients = clients.map((client) =>
        client.client_id === newClient.client_id ? newClient : client
      );
      setClients(updatedClients);
    } else {
      // If adding a new client
      setClients([...clients, newClient]);
    }
    setShowForm(false); // Hide the form after submission
  };

  // Handle edit click
  const handleEditClick = (client) => {
    setEditingClient(client); // Set the client to be edited
    setShowForm(true); // Show form for editing
  };

  // Handle delete client
  const handleDeleteClick = (client_id) => {
    axios
      .delete(`http://localhost:8001/clients/${client_id}`)
      .then(() => {
        setClients(clients.filter((client) => client.client_id !== client_id));
      })
      .catch((error) => {
        console.error("There was an error deleting the client:", error);
      });
  };

  return (
    <div>
      <button onClick={handleAddClick} className="add-button">+ Add</button>

      {/* Conditionally render the form */}
      {showForm && (
        <ClientForm
          onClientAdded={handleClientAdded}
          initialData={editingClient} // Pass client data if editing
        />
      )}

      <h1>Clients List</h1>
      <table>
        <thead>
          <tr>
            <th>Client ID</th>
            <th>Display Name</th>
            <th>API Key</th>
            <th>PIN</th>
            <th>MTM</th>
            <th>Available Margin</th>
            <th>Max Profit</th>
            <th>Max Loss</th>
            <th>Multiplier</th>
            <th>Commodity Margin</th>
            <th>Exit Time</th>
            <th>QTY by Exposure</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.client_id}>
              <td>{client.client_id}</td>
              <td>{client.display_name}</td>
              <td>{client.api_key}</td>
              <td>{client.pin}</td>
              <td>{client.mtm}</td>
              <td>{client.available_margin}</td>
              <td>{client.max_profit}</td>
              <td>{client.max_loss}</td>
              <td>{client.multiplier}</td>
              <td>{client.commodity_margin}</td>
              <td>{client.exit_time}</td>
              <td>{client.qty_by_exposure}</td>
              <td>
                <button onClick={() => handleEditClick(client)}>Edit</button>
                <button onClick={() => handleDeleteClick(client.client_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        .add-button {
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          margin-bottom: 16px;
        }
        .add-button:hover {
          background-color: #45a049;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 16px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f4f4f4;
        }
        button {
          background-color: #f44336;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          margin-right: 8px;
        }
        button:hover {
          background-color: #e53935;
        }
      `}</style>
    </div>
  );
}
