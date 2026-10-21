import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from '@koa/router';
import ItemController from './item/item.controller.js';

const app = new Koa();



app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);
