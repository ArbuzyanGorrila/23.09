import SqliteLinker from '../db/sqlite.js';
import { formatItemResponse, stringifyProperties, parseQueryParams } from '../utils.js';

export class ItemService {
    constructor(dbPath = './database.sqlite') {
        this.db = new SqliteLinker(dbPath);
    }

    async getAll({ids}){
        let res;
        if(isEmpty(ids) || ids.lenght===0){
        res=await this.link.all(`select * from item`);
        }
        else{
            res=await this.link.all(
                `
                select * from item
                where id in(${this.link.createPlaceholders(ids)})
                `,
                ids
            );
        }
        return res;
    }

    async getOne(id){
        return this.getAll({ids:[id]});
    }

    async softDelete(id){
        await this.link.run(
            `
            update item
            set is_deleted=true
            where id=?
            `,
            [id]
        );
    }
    async update(
        id,
        {name,properties,status,location_id,current_location_id,category}
    ){
        const {block,value}=this.link.createSetBlock({
            name,
            properties,
            status,
            location_id,
            current_location_id,
            category_id,
        });
        await this.link.run(
            ` 
            update item
            set $(block)
            where id=?
            `,
            [id, ...values]
        );
    }
    async create({name,properties,status,location_id,current_location_id,category_id}){
       const values=[
        name,
        properties,
        status,
        location_id,
        current_location_id,
        category_id,
       ];
     
       const {lastID} = await this.link.run(`
        insert into item
        values (${this.link.createPlaceholders(values)})
        `,values);

        return this.getOne(lastID);
    }

}