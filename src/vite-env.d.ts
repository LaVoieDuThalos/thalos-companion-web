/// <reference types="vite/client" />

interface ViteTypeOptions {
  // By adding this line, you can make the type of ImportMetaEnv strict
  // to disallow unknown keys.
  strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
  readonly VITE_FIRESTORE_API_KEY: string;
  readonly VITE_FIRESTORE_APP_ID: string;
  readonly VITE_FIRESTORE_AUTH_DOMAIN: string;
  readonly VITE_FIRESTORE_DATABASE_URL: string;
  readonly VITE_FIRESTORE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIRESTORE_PROJECT_ID: string;
  readonly VITE_FIRESTORE_STORAGE_BUCKET: string;
  readonly VITE_API: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_VERSION_DATE: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
