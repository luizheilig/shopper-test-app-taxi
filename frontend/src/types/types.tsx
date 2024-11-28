export interface Ride {
    customer_id: number;
    date: string;
    origin: string;
    destination: string;
    distance: number;
    duration: string;
    value: number;
    driver: {
      id: number;
      name: string;
    };
  }

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
        review: {
          comment: number;
          rating: string;}
      }>;
    };
  }

  export interface Driver {
    id: number;
    name: string;
    description: string;
    vehicle: string;
    review: {
      comment: number;
      rating: string;};
      value: number;
  }