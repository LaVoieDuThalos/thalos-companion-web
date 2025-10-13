export interface Role {
  id: string;
  label: string;
}

export const ROLE_BUREAU: Role = { id: 'bureau', label: 'Bureau' };
export const ROLE_OUVREUR: Role = {
  id: 'ouvreur',
  label: 'Ouverture/Fermeture de salle',
};

export const ROLES = [ROLE_BUREAU, ROLE_OUVREUR];
