import Router from 'koa-router';
const router = new Router({ prefix: '/single' });
import ytdl from 'ytdl-core';
import ytsr from 'ytsr';
router.get('/', async (ctx, next) => {
    ctx.body = `<head><link rel="stylesheet" href="https://unpkg.com/bamboo.css"></head><form action="/single" method="post"><input type="text" name="id" placeholder="Fightman - Casiopea vs Tsquare"><input type="submit"></form>`;
});
router.post('/', async (ctx, next) => {
    let requestBody = ctx.request.body;
    let found = (await ytsr(requestBody.id, { 'limit': 1 })).items[0];
    ctx.response.set('content-disposition', `attachment; filename*=UTF-8''${requestBody.id.replace(/[/\\?%*:|"<>]/g, '-')}.mp3`);
    ctx.body = ytdl(found.id, { filter: 'audioonly' });
});
export default router;
//# sourceMappingURL=single.js.map