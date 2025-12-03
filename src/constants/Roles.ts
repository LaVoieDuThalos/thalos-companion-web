import { ACTIVITIES } from './Activities';

export interface Role {
  id: string;
  label: string;
}

export function findRoleById(roleId: string): Role | undefined {
  return ROLES.find((r) => r.id === roleId);
}

export const ROLE_BUREAU: Role = { id: 'bureau', label: 'Bureau' };
export const ROLE_OUVREUR: Role = {
  id: 'ouvreur',
  label: 'Ouverture/Fermeture de salle',
};
export const ROLE_REFERENT: Role = { id: 'referent', label: 'Référent' };

export const ROLES_REFERENT = ACTIVITIES.filter((act) => act.referent).map(
  (act) => ({ id: 'referent.' + act.id, label: 'Référent ' + act.name }) as Role
);

export const ROLES = [ROLE_BUREAU, ...ROLES_REFERENT, ROLE_OUVREUR];
