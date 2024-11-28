export interface RideOptionsState {
    customerId: string;
    origin: string;
    destination: string;
    estimate: {
      distance: number;
      duration: string;
      price: number;
      drivers: Array<{
        id: number;
        name: string;
        description: string;
        vehicle: string;
        rating: number;
      }>;
    };
  }