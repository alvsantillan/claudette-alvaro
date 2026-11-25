import bcrypt from 'bcrypt';

// Todo lo de bcrypt está en este archivo, así no se repite en cada service
const RONDAS = 10;

// Convierte la contraseña en un hash para guardarla en la base
export function hashPassword(password: string) {
  return bcrypt.hash(password, RONDAS);
}

// Compara la contraseña que escribió el usuario con el hash guardado
export function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
