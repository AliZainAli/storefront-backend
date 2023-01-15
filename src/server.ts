import express, { Request, Response, Application } from 'express';
import logger from './middlewares/logger';
import orderRoutes from './routes/orders';
import productRoutes from './routes/products';
import userRoutes from './routes/users';

const app: express.Application = express();
const port: number = 3000;
//const address: string = '0.0.0.0:3000';

//app.use(bodyParser.json());

app.use([logger]);

app.use('/orders', orderRoutes);
app.use('/products', productRoutes);
app.use('/users', userRoutes);

app.get('/', function (req: Request, res: Response) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  //  console.log(`starting app on: ${address}`);
  console.log('server started on port: ' + port);
});


export default app;
