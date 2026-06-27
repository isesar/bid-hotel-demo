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
