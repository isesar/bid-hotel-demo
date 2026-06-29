"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ConfirmationRoom = {
  name: string;
  rateName: string;
};

export type ConfirmationSnapshot = {
  reservationNumber: string;
  guest: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  propertyName: string;
  checkin: Date;
  checkout: Date;
  nights: number;
  rooms: ConfirmationRoom[];
  totalAdults: number;
  totalChildren: number;
  grandTotal: number;
  heroImage: string;
  daysUntilArrival: number;
};

type ConfirmationContextValue = {
  snapshot: ConfirmationSnapshot | null;
  setSnapshot: (snapshot: ConfirmationSnapshot) => void;
  clearSnapshot: () => void;
};

const ConfirmationContext = createContext<ConfirmationContextValue | null>(
  null
);

export function ConfirmationProvider({ children }: { children: ReactNode }) {
  const [snapshot, setSnapshotState] = useState<ConfirmationSnapshot | null>(
    null
  );

  const setSnapshot = useCallback((value: ConfirmationSnapshot) => {
    setSnapshotState(value);
  }, []);

  const clearSnapshot = useCallback(() => {
    setSnapshotState(null);
  }, []);

  const value = useMemo(
    () => ({ snapshot, setSnapshot, clearSnapshot }),
    [snapshot, setSnapshot, clearSnapshot]
  );

  return (
    <ConfirmationContext.Provider value={value}>
      {children}
    </ConfirmationContext.Provider>
  );
}

export function useConfirmation() {
  const context = useContext(ConfirmationContext);

  if (!context) {
    throw new Error("useConfirmation must be used within ConfirmationProvider");
  }

  return context;
}
