import React from 'react';
import axios from 'axios';

interface DriverOption {
  id: number;
  name: string;
  vehicle: string;
  rating: number;
  value: number;
}

interface RideOptionsProps {
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  drivers: DriverOption[];
  onConfirmRide: (driverId: number) => void;
}

const RideOptions: React.FC<RideOptionsProps> = ({
  origin,
  destination,
  distance,
  duration,
  drivers,
  onConfirmRide,
}) => {
  const handleConfirm = async (driverId: number) => {
    try {
      const response = await axios.patch('/ride/confirm', {
        customer_id: '123', // Substitua por um valor dinâmico, se necessário.
        origin,
        destination,
        distance,
        duration,
        driver: drivers.find((driver) => driver.id === driverId),
        value: drivers.find((driver) => driver.id === driverId)?.value,
      });
      if (response.status === 200) {
        onConfirmRide(driverId);
      }
    } catch (error: unknown) {
      console.error('Erro ao confirmar a viagem:', error);
      alert('Não foi possível confirmar a viagem. Tente novamente.');
    }
  };

  return (
    <div>
      <h1>Opções de Viagem</h1>
      <div>
        {/* Renderiza o mapa estático */}
        <img
          src={`https://maps.googleapis.com/maps/api/staticmap?size=600x400&markers=color:blue|label:A|${encodeURIComponent(
            origin
          )}&markers=color:green|label:B|${encodeURIComponent(
            destination
          )}&path=color:0x0000ff|weight:5|${encodeURIComponent(
            origin
          )}|${encodeURIComponent(destination)}&key=YOUR_GOOGLE_API_KEY`}
          alt="Mapa da rota"
        />
      </div>
      <h2>Motoristas Disponíveis</h2>
      <ul>
        {drivers.map((driver) => (
          <li key={driver.id}>
            <p>Nome: {driver.name}</p>
            <p>Veículo: {driver.vehicle}</p>
            <p>Avaliação: {driver.rating.toFixed(1)}</p>
            <p>Valor: R$ {driver.value.toFixed(2)}</p>
            <button onClick={() => handleConfirm(driver.id)}>Escolher</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RideOptions;