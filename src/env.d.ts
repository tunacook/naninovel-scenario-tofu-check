declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV?: string
    readonly GITHUB_WORKSPACE?: string
  }
}
