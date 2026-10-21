import Router from '@koa/router';
import ItemController from './item.controller';

const router = new Router({
    prefix: '/items',
});

const controller = new ItemController();

router.get('/', controller.getItems.bind(controller));
router.get('/:id', controller.getItems.bind(controller));
router.patch('/:id', controller.updateItem.bind(controller));
router.delete('/:id', controller.deleteItem.bind(controller));
router.post('/', controller.createItem.bind(controller));

export default router;