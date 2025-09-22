# thalos-companion-web

Application Web pour gérer le fonctionnement de l'association La Voie du Thalos

## Requirements

- Node 22

## Structure
 
- app : Pages
- api : Couche d'accès à Firebase
- components: Composants unitaires
  - common : Composants réutilisables (et utilisés par d'autres composants). Sans réel lien avec le domaine.
  - forms : Formulaires
  - modals : Fenêtre modales (popup)
- constants : Ensemble de données de références
- hooks : Hook react custom
- model : Modèle du domaine 
- services : Couche Service (entre domaine et API) 
- utils : Utilitaires inclassables

## Installation

`npm install`

## Run 

Variables d'environnement : Configuration Firebase API (voir firebaseConfig.js)

`npm run start`

