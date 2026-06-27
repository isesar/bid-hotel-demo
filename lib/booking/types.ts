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
