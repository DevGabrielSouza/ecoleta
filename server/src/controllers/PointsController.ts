import {Request, Response} from 'express';
import knex from '../database/connection';

class PointsControllers{

    async create(request: Request, response: Response) {

        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
    
        } = request.body;
    
        const trx = await knex.transaction();

        const point = {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            image: 'image-fake.jpg'
        };
    
        const insertedPointsIds = await trx('points').insert(point);
    
        const point_id = insertedPointsIds[0];
    
        const pointItems = items.map((item_id: number) => {
            return{
                item_id,
                point_id,
            };
        });
    
        await trx('point_items').insert(pointItems);
    
        return response.json({
            id: point_id,
            ...point,
        });
    
    }

}

export default PointsControllers;