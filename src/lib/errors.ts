export class EnvError extends Error {
  constructor(key: string) {
    super(`${key} is not set`);
  }
}
