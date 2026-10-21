import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from '@koa/router';
import ItemController from './item/item.controller.js';

const app = new Koa();

const router = new Router({
    prefix: '/item',
});

const controller = new ItemController();

router.get('/', controller.getItem.bind(controller));
router.get('/:id', controller.getItems.bind(controller));
router.patch('/:id', controller.updateItem.bind(controller));
router.delete('/:id', controller.deleteItem.bind(controller));
router.post('/', controller.createItem.bind(controller));

app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);
