const router = require("koa-router")();
const request = require("request");
const http = require('../utils/http');

router.get("/", async (ctx, next) => {
  await ctx.render("index", {
    title: "网站快照抓取",
  });
});

router.get("/string", async (ctx, next) => {
  ctx.body = "koa2 string";
});

router.get("/json", async (ctx, next) => {
  ctx.body = {
    title: "koa2 json",
  };
});

router.post("/getSnapshot", async (ctx, next) => {
  const website = ctx.request.body.website;
  const data = await http.get(website);
  ctx.body = {
    data: data,
  };
});

module.exports = router;
