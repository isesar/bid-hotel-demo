export type Property = {
  id: string;
  name: string;
  type: string;
};

export type PropertiesResponse = {
  properties: Property[];
};

export type Unit = {
  id: string;
  name: string;
  occupancy: {
    min: number;
    max: number;
  };
  image: string;
};

export type UnitsResponse = {
  propertyId: string;
  units: Unit[];
};

export type CalendarDay = {
  date: string;
  available: boolean;
  rateFromValue: number;
};

export type CalendarResponse = {
  propertyId: string;
  days: CalendarDay[];
};

export type Rate = {
  rateId: string;
  rateName: string;
  boardType: string;
  pricePerNight: number;
  totalPrice: number;
  breakdown: { date: string; price: number }[];
};

export type AvailabilityUnit = {
  unitId: string;
  unitsAvailable: number;
  occupancy: { min: number; max: number };
  rates: Rate[];
};

export type AvailabilityResponse = {
  propertyId: string;
  checkin: string;
  nights: number;
  units: AvailabilityUnit[];
};

export type BookingUnit = {
  unitId: string;
  rateId: string;
  quantity: number;
};

export type BookingGuest = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type BookingPayment = {
  cardNumber: string;
  cvv: string;
  expiration: string;
  holderFirst: string;
  holderLast: string;
};

export type BookingRequest = {
  propertyId: string;
  checkin: string;
  nights: number;
  units: BookingUnit[];
  guest: BookingGuest;
  payment: BookingPayment;
};

export type BookingResponse = {
  bookingId?: string;
  reference?: string;
  status?: string;
  [key: string]: unknown;
};
