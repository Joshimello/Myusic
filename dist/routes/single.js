import Router from 'koa-router';
const router = new Router({ prefix: '/single' });
import ytdl from 'ytdl-core';
router.get('/', async (ctx, next) => {
    ctx.body = `<form action="/single" method="post"><input type="text" name="id"><input type="submit"></form>`;
});
router.post('/', async (ctx, next) => {
    let requestBody = ctx.request.body;
    ctx.response.set('content-type', 'audio/mpeg');
    ctx.response.set('content-disposition', `attachment; filename=${requestBody.id}.mp3`);
    ctx.body = ytdl(requestBody.id, { filter: 'audioonly' });
});
export default router;
//# sourceMappingURL=single.js.map