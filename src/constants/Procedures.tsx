import * as React from 'react';

export type ProcedureStep = {
  label: string;
  description?: React.ReactNode;
  completed: boolean;
};

export type Procedure = {
  id: 'opening' | 'closing';
  title: string;
  completedMessage?: string;
  steps: ProcedureStep[];
  icon: string;
};

const OPENING_PROCEDURE: Procedure = {
  id: 'opening',
  title: 'Ouverture de la salle',
  completedMessage: 'Bon jeux !',
  icon: 'login',
  steps: [
    {
      label: 'Biper',
      description: (
        <>Biper avec le badge sur le boitier salto devant la porte d’entrée.</>
      ),
      completed: false,
    },
    {
      label: "Désactiver l'alarme",
      description: (
        <>
          Depuis le SAS, désactiver l’alarme en tapant le code puis valider. Le
          code vous a été envoyé en MP sur le Discord.
        </>
      ),
      completed: false,
    },
    {
      label: 'Régler les portes',
      description: (
        <>
          Régler les ouvertures de portes suivant la photo, en tournant la clé.
        </>
      ),
      completed: false,
    },
    {
      label: 'Allumer les lumières',
      description: (
        <>
          Derrière le bar, si nécessaire, allumer les lumières. Uniquement les 2
          interrupteurs (Hall 1/2 et Hall 2/2).
          <br />
          [Allumer l'oiseau avec le bouton "PC Evènementiel" si de nuit]
        </>
      ),
      completed: false,
    },
    {
      label: 'Aérer (Si besoin)',
      description: (
        <>
          Dans le hall : Ouvrir certaines portes du patio si besoin d’aérer les
          espaces et de faire circuler l’air.
        </>
      ),
      completed: false,
    },
    {
      label: 'Sortir les jeux',
      description: (
        <>
          Sortir de l’espace de stockage :
          <ul>
            <li>Étagère roulante avec les jeux</li>
            <li>Boîtes pour « petits jeux »</li>
            <li>Selon l’activité programmée : boite JDR / Bloodbowl....</li>
            <li>
              les documents nécessaires à l'équipe d'accueil (livret
              d’accueil/téléphone et chargeur/affichage).
            </li>
            Faites-vous aider !
          </ul>
        </>
      ),
      completed: false,
    },
    {
      label: 'Fermer le local de rangement',
      description: (
        <>Bien refermer le local une fois les affaires installées.</>
      ),
      completed: false,
    },
  ],
};

const CLOSING_PROCEDURE: Procedure = {
  id: 'closing',
  title: 'Fermeture de la salle',
  completedMessage: 'Bonne nuit !',
  icon: 'logout',
  steps: [
    {
      label: 'Annoncer la fermeture (Optionnel)',
      description: (
        <>
          30 minutes avant la fermeture : faire une annonce au micro (en
          musique)
        </>
      ),
      completed: false,
    },
    {
      label: 'Ranger les jeux',
      description: (
        <>Ranger tous les jeux et autres matériels dans l’espace de stockage.</>
      ),
      completed: false,
    },
    {
      label: 'Vérifier la propreté',
      description: (
        <>
          Balayer si nécessaire, laver si nécessaire. Ustensiles dans le local
          de ménage.
        </>
      ),
      completed: false,
    },
    {
      label: 'Jeter la poubelle',
      description: (
        <>
          Jeter la/les poubelles de déchets périssables dans le local poubelle.
          Remettre un sac poubelle si nécessaire. Jeter la poubelle du tri si
          nécessaire.
        </>
      ),
      completed: false,
    },
    {
      label: 'Vérifier les salles',
      description: (
        <>
          Faire le tour complet des salles: Vérifier :
          <ul>
            <li>Les portes et fenetres</li>
            <li>Remettre en place le mobilier si nécessaire</li>
            <li>Les recoins</li>
          </ul>
        </>
      ),
      completed: false,
    },
    {
      label: 'Vérifier les toilettes',
      description: <>Vérifier que personne ne se trouve dans les toilettes</>,
      completed: false,
    },
    {
      label: "Vérifier l'ascenseur",
      description: <>Vérifier que personne ne se trouve dans l'ascenseur</>,
      completed: false,
    },
    {
      label: 'Vérifier le local poubelle et retour de livres',
      description: <>Vérifier que personne ne se trouve dans ces locaux.</>,
      completed: false,
    },
    {
      label: 'Eteindre les lumières',
      description: (
        <>
          Derrière le bar : Éteindre toutes les lumières depuis le tableau
          derrière le café. <br />
          L’oiseau peut être éteint vers 23h-minuit.
        </>
      ),
      completed: false,
    },
    {
      label: 'Verrouiller la porte',
      description: (
        <>
          Dans le sas : Verrouiller la porte extérieure du SAS en tournant la
          clé vers les 2 portes fermées avec 1 flèche pour la sortie
        </>
      ),
      completed: false,
    },
    {
      label: "Enclencher l'alarme",
      description: (
        <>Dans le sas : Enclenche l’alarme en activant le code + Select</>
      ),
      completed: false,
    },
    {
      label: 'Vérifier la fermeture',
      description: (
        <>
          Attendre la fermeture de la porte et le bruit de l'enclenchement de
          l’alarme.
        </>
      ),
      completed: false,
    },
  ],
};

export const PROCEDURES: Procedure[] = [OPENING_PROCEDURE, CLOSING_PROCEDURE];
