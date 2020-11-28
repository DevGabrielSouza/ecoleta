
import express from 'express';
import knex from './database/connection';
import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';

const routes = express.Router();
const pointsController = new PointsController();
const itemsController = new ItemsController();

routes.get('/', async (request, response) => {

    return response.json(['a', 'b', 'c']);
    
});

routes.get('/items', itemsController.get);

routes.post('/points', pointsController.create);

  

export default routes;