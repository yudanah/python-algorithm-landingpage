/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TOSS_PAYMENTS_CLIENT_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
