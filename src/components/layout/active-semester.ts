import { createContext, useContext } from 'react';

export const ActiveSemesterContext = createContext('2/2026');

export function useActiveSemester(): string {
  return useContext(ActiveSemesterContext);
}
