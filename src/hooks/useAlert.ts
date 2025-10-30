import { useContext } from 'react';
import { AlertContext } from '../contexts/AlertsContext';

export function useAlert() {
  return useContext(AlertContext);
}
