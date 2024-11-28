import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Driver } from '../types/types';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';

const RideOptions: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (state.origin) {
      setMapCenter({
        lat: state.origin.latitude,
        lng: state.origin.longitude,
      });
    }
  }, [state.origin]);

  const getAddressFromCoordinates = async (lat: number, lng: number): Promise<string> => {
    try {
      const geocoder = new window.google.maps.Geocoder();
      const { results } = await geocoder.geocode({ location: { lat, lng } });
      if (results[0]) {
        return results[0].formatted_address; // Retorna o endereço formatado
      } else {
        throw new Error('Nenhum endereço encontrado para as coordenadas fornecidas.');
      }
    } catch (err) {
      console.error('Erro ao buscar endereço:', err);
      throw err;
    }
  };

  const handleConfirm = async (driverId: number, value: number, driverName: string) => {
    try {
      const originAddress = await getAddressFromCoordinates(state.origin.latitude, state.origin.longitude);
      const destinationAddress = await getAddressFromCoordinates(state.destination.latitude, state.destination.longitude);
  
      const body = {
        customer_id: state.costumerId,
        destination: destinationAddress,
        distance: state.distance,
        driver: {
          id: driverId,
          name: driverName,
        },
        duration: state.duration,
        origin: originAddress,
        value: value || 0,
      };
  
      console.log('Enviando corpo para a API:', body);
  
      const response = await axios.patch('http://localhost:8080/ride/confirm', body);

      console.log(response);
  
      navigate('/history', { state: state.costumerId });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('Erro no Axios:', err.response?.data || err.message);
      } else {
        console.error('Erro desconhecido:', err);
      }
      alert('Erro ao confirmar a viagem.');
    }
  };
  

  useEffect(() => {
    if (mapLoaded && mapCenter) {
      const directionsService = new google.maps.DirectionsService();

      const request = {
        origin: {
          lat: state.origin.latitude,
          lng: state.origin.longitude,
        },
        destination: {
          lat: state.destination.latitude,
          lng: state.destination.longitude,
        },
        travelMode: google.maps.TravelMode.DRIVING,
      };

      directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error('Erro ao calcular a rota:', status);
        }
      });
    }
  }, [mapLoaded, mapCenter, state.origin, state.destination]);

  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <div>
      <h2>Opções de Viagem</h2>

      <LoadScript
        googleMapsApiKey={googleMapsApiKey}
        preventGoogleFontsLoading={true}
        onLoad={() => setMapLoaded(true)}
        onError={() => alert('Erro ao carregar a API do Google Maps!')}
      >
        {mapCenter ? (
          <GoogleMap
            mapContainerStyle={{ height: '400px', width: '100%' }}
            zoom={13}
            center={mapCenter}
          >
            {/* Marcadores */}
            <Marker
              position={{
                lat: state.origin.latitude,
                lng: state.origin.longitude,
              }}
              label="Origem"
            />
            <Marker
              position={{
                lat: state.destination.latitude,
                lng: state.destination.longitude,
              }}
              label="Destino"
            />
            {directions && <DirectionsRenderer directions={directions} />}
          </GoogleMap>
        ) : (
          <p>Carregando mapa...</p>
        )}
      </LoadScript>

      <div>
        <h3>Motoristas disponíveis:</h3>
        {state.options.map((driver: Driver) => (
          <div key={driver.id}>
            <p><strong>{driver.name}</strong></p>
            <p>{driver.description}</p>
            <p>{driver.vehicle}</p>
            <p>Avaliação: {driver.review.rating}</p>
            <p>Valor: R$ {driver.value.toFixed(2)}</p>
            <button onClick={() => handleConfirm(driver.id, driver.value, driver.name)}>Escolher</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RideOptions;
