function required(envVar, name) {
    if (!envVar) {
      throw new Error(`Variável de ambiente ${name} não definida`);
    }
    return envVar;
  }
  
  export const DB_HOST = required(process.env.DB_HOST, "localhost");
  export const DB_USER = required(process.env.DB_USER, "root");
  export const DB_PASSWORD = required(process.env.DB_PASSWORD, "ipora@123");
  export const DB_NAME = required(process.env.DB_NAME, "db_mlgames");
  
  export const DB_PORT = process.env.DB_PORT || 3306;
  
  export const JWT_SECRET = required(process.env.JWT_SECRET, "130708Manel");