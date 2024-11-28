import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Ride } from '../types/types';
import { useLocation } from 'react-router-dom';

const RideHistory: React.FC = () => {
  const { state } = useLocation();
  const [userId, setUserId] = useState('');
  const [driverId, setDriverId] = useState('');
  const [rides, setRides] = useState<Ride[]>([]);
  const [filteredRides, setFilteredRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      setUserId(state);
    }
  }, [state, userId]);

  const fetchRides = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/ride/${userId}`);
      setRides(Array.isArray(response.data) ? response.data : response.data.rides || []);
      setFilteredRides(Array.isArray(response.data) ? response.data : response.data.rides || []); // Inicializa os filtros
    } catch (err) {
      alert('Erro ao carregar o histórico de viagens.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchRides();
  }, [fetchRides]);

  useEffect(() => {
    if (driverId) {
      setFilteredRides(rides.filter((ride) => ride.driver.id === parseInt(driverId, 10)));
    } else {
      setFilteredRides(rides);
    }
  }, [driverId, rides]);

  return (
    <div>
      <h2>Histórico de Viagens</h2>
      <p>ID do Usuário</p>
      <input
        type="text"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <p>Motorista</p>

      <select value={driverId} onChange={(e) => setDriverId(e.target.value)}>
        <option value="">Todos</option>
        <option value="1">Motorista 1</option>
        <option value="2">Motorista 2</option>
        <option value="3">Motorista 3</option>
      </select>
      <button onClick={fetchRides} disabled={loading}>
        {loading ? 'Carregando...' : 'Aplicar Filtro'}
      </button>

      <div>
        {filteredRides.length > 0 ? (
          filteredRides.map((ride) => (
            <div key={ride.customer_id}>
              <p>{ride.date}</p>
              <p>{ride.driver.name}</p>
              <p>Origem: {ride.origin}</p>
              <p>Destino: {ride.destination}</p>
              <p>Distância: {ride.distance} km</p>
              <p>Tempo: {ride.duration}</p>
              <p>Valor: R$ {ride.value.toFixed(2)}</p>
            </div>
          ))
        ) : (
          <p>Nenhuma viagem encontrada.</p>
        )}
      </div>
    </div>
  );
};

export default RideHistory;
