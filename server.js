import express from 'express';
import { APP_PORT} from './config';
import errorHandler from './middlewares/errorHandler';
 import routers from './routes';
import './config/databaseConfig.js';


const app=express();


app.use(express.json())
app.use('/api',routers); 


app.use(errorHandler);
app.listen(APP_PORT,()=>console.log(` Listening on port ${APP_PORT}.`));  