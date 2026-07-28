# Thalos Companion Web

Application web pour gérer le fonctionnement de l'association **La Voie du Thalos**.

## 📋 Table des matières

- [À propos](#à-propos)
- [Stack technique](#stack-technique)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Structure du projet](#structure-du-projet)
- [Architecture](#architecture)
- [Contributions](#contributions)

## À propos

Thalos Companion Web est une solution web complète conçue pour faciliter la gestion administrative et opérationnelle de l'association La Voie du Thalos. L'application offre une interface intuitive pour les membres et administrateurs afin de gérer les différents aspects de l'association.

## Stack technique

### Frontend
- **TypeScript** (93.3%) - Langage principal avec typage statique
- **React** - Framework UI
- **SCSS** (5%) - Stylisation avancée
- **JavaScript** (1.5%) - Scripts auxiliaires
- **HTML** (0.2%) - Structure

### Backend
- **Firebase** - Base de données et authentification
- **Firebase API** - Couche d'accès aux données

### Environnement
- **Node.js** 22+
- **npm** - Gestionnaire de dépendances

## Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants installés :

- [Node.js](https://nodejs.org/) version 22 ou supérieure
- npm (généralement inclus avec Node.js)
- Un compte Firebase configuré

## Installation

### 1. Cloner le repository

```bash
git clone https://github.com/LaVoieDuThalos/thalos-companion-web.git
cd thalos-companion-web
```

### 2. Installer les dépendances

```bash
npm install
```

## Configuration

### Variables d'environnement Firebase

Avant de lancer l'application, vous devez configurer les variables d'environnement Firebase :

1. Créez un fichier `.env.local` à la racine du projet
2. Ajoutez votre configuration Firebase API (voir `firebaseConfig.js`)

**Exemple de configuration :**

```javascript
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

## Utilisation

### Démarrer l'application en mode développement

```bash
npm run start
```

L'application sera accessible à `http://localhost:3000`

### Build pour la production

```bash
npm run build
```

### Tests

```bash
npm run test
```

## Structure du projet

```
thalos-companion-web/
├── app/                 # Pages principales de l'application
├── api/                 # Couche d'accès à Firebase
├── components/          # Composants React
│   ├── common/         # Composants réutilisables et génériques
│   ├── forms/          # Composants de formulaires
│   └── modals/         # Fenêtres modales (popups)
├── constants/          # Données de référence et constantes
├── hooks/              # Hooks React personnalisés
├── model/              # Modèles du domaine
├── services/           # Couche Service (entre domaine et API)
├── utils/              # Utilitaires et fonctions auxiliaires
├── firebaseConfig.js   # Configuration Firebase
├── package.json        # Dépendances du projet
└── README.md          # Ce fichier
```

## Architecture

### Architecture en couches

L'application suit une architecture en couches bien définie :

```
┌─────────────────────────────────┐
│      Pages (app/)               │
│      Composants (components/)   │
└────────────────┬────────────────┘
                 │
        ┌────────▼────────┐
        │  Services       │
        │  (services/)    │
        └──────��─┬────────┘
                 │
        ┌────────▼────────┐
        │  API Firebase   │
        │  (api/)         │
        └─────────────────┘
```

### Descriptions des couches

- **Pages** : Points d'entrée de l'application, gèrent les routes et l'état global
- **Composants** : Blocs de construction réutilisables de l'UI
  - `common/` : Composants sans dépendances métier
  - `forms/` : Gestion des formulaires
  - `modals/` : Popups et dialogues
- **Services** : Logique métier et orchestration
- **API** : Interface avec Firebase
- **Hooks** : Logique réutilisable côté React
- **Model** : Types et interfaces du domaine
- **Constantes** : Données fixes et énumérations
- **Utils** : Fonctions utilitaires génériques

## Contributions

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le repository
2. Créez une branche pour votre feature (`git checkout -b feature/amazing-feature`)
3. Commitez vos changements (`git commit -m 'Add amazing feature'`)
4. Poussez vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

### Guidelines

- Respectez la structure du projet existante
- Utilisez TypeScript pour la typage statique
- Documentez votre code
- Testez vos modifications

## License

Ce projet appartient à l'association La Voie du Thalos.

---

Pour toute question ou problème, veuillez contacter l'équipe de développement ou ouvrir une issue sur GitHub.
