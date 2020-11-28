import {Request, Response} from 'express';
import knex from '../database/connection';

class PointsControllers{

    async index(request: Request, response: Response) {

        const { city, uf, items } = request.query;

        // Converte os items separados por , (vírgula) em array numérico
        const parsedItems = String(items).split(',').map(item => Number(item.trim()));

        const points = await knex('points').select('points.*')
        .join('point_items', 'point_id', '=', 'point_items.point_id')
        .whereIn('point_items.item_id', parsedItems)
        .where('city', String(city))
        .where('uf', String(uf))
        .distinct();
    
        return response.json(points);
    
    }

    async show(request: Request, response: Response) {

        const { id } = request.params;

        const point = await knex('points').select('*').where('id', id).first();

        const items = await knex('items').select('*').join('point_items', 'items.id', '=', 'point_items.item_id').where('point_items.point_id', id);

        point.items = items;
    
        if ( !point ){
            return response.status(400).json({message: "Point not found!"});
        }

        return response.json(point);
    
    }


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

        await trx.commit();
    
        return response.json({success: true});
    
    }

}

export default PointsControllers;