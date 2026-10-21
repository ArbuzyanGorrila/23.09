import SqliteLinker from '../db/sqlite.js';

function isEmpty(val) {
    return val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0);
}

export class ItemService {
    constructor(dbPath = './database.sqlite') {
        this.link = new SqliteLinker(dbPath);
        this.db = this.link;
    }

    async getAll({ ids } = {}) {
        let res;
        if (typeof ids === 'string') {
            ids = ids.split(',').map((id) => id.trim()).filter(Boolean);
        } else if (typeof ids === 'number') {
            ids = [ids];
        }

        if (isEmpty(ids) || ids.length === 0 || ids.lenght === 0) {
            res = await this.link.all(`select * from item`);
        } else {
            res = await this.link.all(
                `
                select * from item
                where id in(${this.link.createPlaceholders(ids)})
                `,
                ids
            );
        }
        return res;
    }

    async getOne(id) {
        const res = await this.getAll({ ids: [id] });
        return res && res.length > 0 ? res[0] : null;
    }

    async softDelete(id) {
        await this.link.run(
            `
            update item
            set is_deleted=true
            where id=?
            `,
            [id]
        );
        return { id: Number(id), deleted: true };
    }

    async delete(id) {
        return this.softDelete(id);
    }

    async deleteItem(id) {
        return this.softDelete(id);
    }

    async update(
        id,
        { name, properties, status, location_id, expected_location_id, current_location_id, category, category_id } = {}
    ) {
        const props = typeof properties === 'object' ? JSON.stringify(properties) : properties;
        const setObj = {};
        if (name !== undefined) setObj.name = name;
        if (props !== undefined) setObj.properties = props;
        if (status !== undefined) setObj.status = status;
        if (location_id !== undefined || expected_location_id !== undefined) {
            setObj.expected_location_id = expected_location_id ?? location_id;
        }
        if (current_location_id !== undefined) setObj.current_location_id = current_location_id;
        if (category_id !== undefined || category !== undefined) {
            setObj.category_id = category_id ?? category;
        }

        const { block, values } = this.link.createSetBlock(setObj);
        if (values.length > 0) {
            await this.link.run(
                ` 
                update item
                set ${block}
                where id=?
                `,
                [...values, id]
            );
        }
        return this.getOne(id);
    }

    async updateItem(id, data) {
        return this.update(id, data);
    }

    async create({ name, properties, status = 'active', location_id, expected_location_id, current_location_id, category_id, category } = {}) {
        const expLocation = expected_location_id ?? location_id ?? null;
        const catId = category_id ?? category ?? null;
        const props = typeof properties === 'object' ? JSON.stringify(properties) : (properties || '{}');
        const values = [
            name,
            props,
            status,
            expLocation,
            current_location_id ?? null,
            catId,
        ];

        const { lastID } = await this.link.run(
            `
            insert into item (name, properties, status, expected_location_id, current_location_id, category_id)
            values (${this.link.createPlaceholders(values)})
            `,
            values
        );

        return this.getOne(lastID);
    }

    async createItem(data) {
        return this.create(data);
    }

    async getItemById(id) {
        return this.getOne(id);
    }

    async getItems(params) {
        return this.getAll(params);
    }
}

export default ItemService;
