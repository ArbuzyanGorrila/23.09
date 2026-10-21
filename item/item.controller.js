import ItemService from './item.service.js';

export class ItemController {
    constructor() {
        this.service = new ItemService();
        this.itemService = this.service;
    }

    async getItems(ctx) {
        const { id } = ctx.params;
        if (!id) {
            return this.getItem(ctx);
        }
        const res = await this.service.getOne(id);

        ctx.status = 200;
        ctx.body = {
            data: res,
        };
    }

    async getItem(ctx) {
        const { ids } = ctx.query;
        const res = await this.service.getAll({ ids });

        ctx.status = 200;
        ctx.body = {
            data: res,
        };
    }

    async updateItem(ctx) {
        const { id } = ctx.params;
        const data = ctx.request.body;
        const res = await this.service.updateItem(id, data);
        ctx.status = 200;
        ctx.body = {
            data: res,
        };
    }

    async createItem(ctx) {
        const data = ctx.request.body;
        const res = await this.service.createItem(data);

        ctx.status = 200;
        ctx.body = {
            data: res,
        };
    }

    async deleteItem(ctx) {
        const { id } = ctx.params;
        const res = await this.service.deleteItem(id);
        ctx.status = 200;
        ctx.body = {
            data: res,
        };
    }
}

export default ItemController;
