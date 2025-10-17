import { createContext, useState, type ReactNode } from 'react';

export type AlertDialogAction = {
  label: string;
  primary?: boolean;
  onClick: (closeFunction: () => void) => void;
};

export type AlertContextProps = {
  currentAlert?: Alert;
  alert: (a: Alert) => void;
  info?: (message: string) => void;
  warning?: (message: string) => void;
  error?: (message: string) => void;
  dialog: (
    title: string,
    message: string,
    actions: AlertDialogAction[]
  ) => void;
  reset: () => void;
};

export type Alert = {
  level?: 'info' | 'warn' | 'error';
  title?: string;
  message: string;
  modal?: boolean;
  actions?: AlertDialogAction[];
};

export const AlertContext = createContext<AlertContextProps>({
  alert: () => {},
  dialog: () => {},
  reset: () => {},
});

export const AlertActions = {
  CANCEL: (label = 'Annuler') =>
    ({
      label,
      onClick: (closeFunction: () => void) => closeFunction(),
    }) satisfies AlertDialogAction,
  OK: (onClickFunction: () => Promise<void>, label = 'OK') => ({
    label,
    primary: true,
    onClick: (closeFunction: () => void) => {
      onClickFunction().then(() => closeFunction());
    },
  }),
};

export default function AlertContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [alertContext, setAlertContext] = useState<AlertContextProps>({
    alert: (a: Alert) => {
      setAlertContext((prev) => ({ ...prev, currentAlert: a }));
    },
    dialog: (title, message, actions) => {
      const a: Alert = {
        title,
        message,
        actions,
      };
      setAlertContext((prev) => ({ ...prev, currentAlert: a }));
    },
    reset: () => {
      setAlertContext((prev) => ({ ...prev, currentAlert: undefined }));
    },
  });

  return (
    <AlertContext.Provider value={alertContext}>
      {children}
    </AlertContext.Provider>
  );
}
