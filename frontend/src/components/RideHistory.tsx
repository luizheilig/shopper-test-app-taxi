import React, { useState } from 'react';
import axios from 'axios';

interface Ride {
  id: number;
  date: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver: {
    id: number;
    name: string;
  };
  value: number;
}

const RideHistory: React.FC = () => {
  const [customerId, setCustomerId] = useState('');
  const [driverId, setDriverId] = useState('');
  const [rides, setRides] = useState<Ride[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchRides = async () => {
    try {
      setError(null);
      const response = await axios.get<{ rides: Ride[] }>(`/ride/${customerId}`, {
        params: driverId ? { driver_id: driverId } : {},
      });
      setRides(response.data.rides);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error_description || 'Erro desconhecido');
      } else {
        setError('Erro inesperado.');
      }
    }
  };

  return (
    <div>
      <h1>Histórico de Viagens</h1>
      <div>
        <label>
          ID do Usuário:
          <input
            type="text"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Motorista:
          <select value={driverId} onChange={(e) => setDriverId(e.target.value)}>
            <option value="">Todos</option>
            <option value="1">Motorista 1</option>
            <option value="2">Motorista 2</option>
          </select>
        </label>
      </div>
      <button onClick={fetchRides}>Buscar Histórico</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {rides &&
          rides.map((ride) => (
            <li key={ride.id}>
              <p>Data: {ride.date}</p>
              <p>Origem: {ride.origin}</p>
              <p>Destino: {ride.destination}</p>
              <p>Distância: {ride.distance} km</p>
              <p>Duração: {ride.duration}</p>
              <p>Motorista: {ride.driver.name}</p>
              <p>Valor: R$ {ride.value.toFixed(2)}</p>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default RideHistory;
