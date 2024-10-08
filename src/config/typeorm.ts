import { DataSource, DataSourceOptions } from "typeorm"; 
import { config as dotenvConfig } from "dotenv";
import { registerAs } from "@nestjs/config";

dotenvConfig({ path: ".env" });

console.log('DB Host:', process.env.DB_HOST);  // Debe mostrar 'postgresdb o localhost dependiendo de la DB'


const config = {

    type: 'postgres',
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    autoLoadEntities: true,
    synchronize: true,
    logging: false,
    entities: ["dist/**/*.entity{.ts,.js}"],
    migrations: ["dist/migrations/*{.js,.ts}"],
    dropSchema: false,
}

export default registerAs("typeorm", () => config);

export const connectionSource = new DataSource(config as DataSourceOptions);

