import { useState, useEffect } from "react";
import axios from "axios";

export default function ClientForm({ onClientAdded, initialData }) {
  const [client, setClient] = useState({
    client_id: "",
    display_name: "",
    api_key: "",
    pin: "",
    mtm: "",
    available_margin: "",
    max_profit: "",
    max_loss: "",
    multiplier: "",
    commodity_margin: "",
    exit_time: "",
    qty_by_exposure: "",
  });

  useEffect(() => {
    if (initialData) {
      setClient(initialData); // Pre-fill form if editing
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient((prevClient) => ({ ...prevClient, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = initialData
      ? `http://localhost:8001/clients/${client.client_id}`
      : "http://localhost:8001/clients";
    const method = initialData ? "put" : "post";

    try {
      const response = await axios[method](url, formatClientData(client));
      onClientAdded(response.data);
    } catch (error) {
      console.error(`Error ${method === 'put' ? 'updating' : 'adding'} client:`, error.response?.data || error.message);
    }
  };

  // Format data to match FastAPI schema
  const formatClientData = (data) => ({
    ...data,
    mtm: parseFloat(data.mtm),
    available_margin: parseFloat(data.available_margin),
    max_profit: parseFloat(data.max_profit),
    max_loss: parseFloat(data.max_loss),
    multiplier: parseFloat(data.multiplier),
    commodity_margin: parseFloat(data.commodity_margin),
    qty_by_exposure: parseInt(data.qty_by_exposure, 10),
  });

  return (
    <form onSubmit={handleSubmit} className="client-form">
      <div className="form-row">
        <input
          type="text"
          name="client_id"
          placeholder="Client ID"
          value={client.client_id}
          onChange={handleChange}
          disabled={!!initialData}
        />
        <input
          type="text"
          name="display_name"
          placeholder="Display Name"
          value={client.display_name}
          onChange={handleChange}
        />
      </div>
      <div className="form-row">
        <input
          type="text"
          name="api_key"
          placeholder="API Key"
          value={client.api_key}
          onChange={handleChange}
        />
        <input
          type="password"
          name="pin"
          placeholder="PIN"
          value={client.pin}
          onChange={handleChange}
        />
      </div>
      <div className="form-row">
        <input
          type="number"
          name="mtm"
          placeholder="MTM"
          value={client.mtm}
          onChange={handleChange}
        />
        <input
          type="number"
          name="available_margin"
          placeholder="Available Margin"
          value={client.available_margin}
          onChange={handleChange}
        />
      </div>
      <div className="form-row">
        <input
          type="number"
          name="max_profit"
          placeholder="Max Profit"
          value={client.max_profit}
          onChange={handleChange}
        />
        <input
          type="number"
          name="max_loss"
          placeholder="Max Loss"
          value={client.max_loss}
          onChange={handleChange}
        />
      </div>
      <div className="form-row">
        <input
          type="number"
          name="multiplier"
          placeholder="Multiplier"
          value={client.multiplier}
          onChange={handleChange}
        />
        <input
          type="number"
          name="commodity_margin"
          placeholder="Commodity Margin"
          value={client.commodity_margin}
          onChange={handleChange}
        />
      </div>
      <div className="form-row">
        <input
          type="text"
          name="exit_time"
          placeholder="Exit Time"
          value={client.exit_time}
          onChange={handleChange}
        />
        <input
          type="number"
          name="qty_by_exposure"
          placeholder="QTY by Exposure"
          value={client.qty_by_exposure}
          onChange={handleChange}
        />
      </div>
      <button type="submit" className="submit-button">
        {initialData ? "Update Client" : "Add Client"}
      </button>

      <style jsx>{`
        .client-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .form-row {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }
        input {
          flex: 1 1 calc(50% - 16px);
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        input:disabled {
          background-color: #f0f0f0;
        }
        .submit-button {
          background-color: #4caf50;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
        }
        .submit-button:hover {
          background-color: #45a049;
        }
      `}</style>
    </form>
  );
}
