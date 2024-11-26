import React, { useState } from "react";
import axios from "axios";

const RideRequest: React.FC = () => {
  const [customerId, setCustomerId] = useState<string>("");
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerId || !origin || !destination) {
      setError("Todos os campos são obrigatórios.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/ride/estimate", {
        customer_id: customerId,
        origin,
        destination,
      });

      console.log("Estimativa:", response.data);
      // Redirecionar ou exibir as opções (tratar isso posteriormente)
    } catch (err) {
      // Aqui garantimos que err é do tipo Error com um type assertion
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.error_description || "Erro ao estimar a viagem.");
      } else {
        setError("Ocorreu um erro desconhecido.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Solicitar Viagem</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">ID do Usuário</label>
          <input
            type="text"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="border p-2 w-full"
            placeholder="Informe o ID do usuário"
          />
        </div>
        <div>
          <label className="block font-medium">Endereço de Origem</label>
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="border p-2 w-full"
            placeholder="Informe o endereço de origem"
          />
        </div>
        <div>
          <label className="block font-medium">Endereço de Destino</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="border p-2 w-full"
            placeholder="Informe o endereço de destino"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Carregando..." : "Estimar Viagem"}
        </button>
      </form>
    </div>
  );
};

export default RideRequest;
