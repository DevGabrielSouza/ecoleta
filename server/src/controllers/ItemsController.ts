import {Request, Response} from 'express';
import knex from '../database/connection';

import API_URL from '../config';

class ItemsController{
    async get (request: Request, response: Response) {

        const items = await knex('items').select('*');
    
        const serializedItems = items.map(items => {
            return {
                id: items.id,
                title: items.title,
                imageUrl: `${API_URL}/uploads/${items.image}`,
            }
        });
    
        return response.json(serializedItems);
    
    }
}

export default ItemsController;