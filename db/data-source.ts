import { config } from 'dotenv';
import { Employee } from 'src/employee/entities/employee.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Employee],
  //   synchronize: true, // disable in production
  migrations: ['dist/db/migrations/*.js'],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
