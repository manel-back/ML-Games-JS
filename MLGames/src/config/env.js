import dotenv from "dotenv";
dotenv.config();

function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === "") {
    throw new Error(`Variável de ambiente obrigatória ausente: ${name}`);
  }
  return value;
}

export const env = {
  PORT: Number(process.env.PORT || 3000),
  DB_HOST: required("DB_HOST", "localhost"),
  DB_PORT: Number(process.env.DB_PORT || 3306),
  DB_USER: required("DB_USER", "root"),
  DB_PASSWORD: process.env.DB_PASSWORD ?? "ipora@123",
  DB_NAME: required("DB_NAME", "db_mlgames"),
  JWT_SECRET: required("JWT_SECRET", "change-me-in-production"),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
};
