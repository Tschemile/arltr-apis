import { TypeOrmModule } from "@nestjs/typeorm";

const connectDB = TypeOrmModule.forRoot({
  type: 'postgres',
  url: process.env.DB_URL,
  entities: [__dirname + '/../**/*.entity.js'],
  synchronize: true,
  // ssl: {
  //   rejectUnauthorized: false,
  // }
})

export default connectDB