const router = require("koa-router")();
const sm2 = require("sm-crypto").sm2;
const request = require("request");
const http = require("../utils/http");
const { shot } = require("../utils/screenshots");

router.get("/", async (ctx, next) => {
  await ctx.render("index", {
    title: "网站快照抓取",
  });
});

router.post("/encrypt", async (ctx, next) => {
  const pwd = ctx.request.body.pwd;
  if (!pwd) {
    return (ctx.body = {
      code: 400,
      msg: "密码不能为空",
    });
  }
  let timestramp = await http.get(
    `https://paicc-core.pingan.com.cn/paicc-core-web/webapi/getCurrentTimeMillis.do?_=${new Date().getTime()}`
  );
  timestramp += "";
  let pwdlen = pwd.length;
  if (pwdlen < 10) pwdlen = "0" + pwdlen;
  // 已知的X和Y坐标
  const localEccX =
    "dd8ed256555a4b748b9ea17de33449e7b578571f2f93917637fa3a6d3bdd6494";
  const localEccY =
    "dfedf198794efef8f69931aaea07f6b95556d464ddcfe8821aff0b3ffa8f93ef";
  // 将X和Y坐标转换为16进制字符串，然后拼接在一起形成公钥
  const publicKey = "04" + localEccX + localEccY;
  // 要加密的数据
  const data = `${timestramp.length}${timestramp}${pwdlen}${pwd}`;
  // 使用公钥进行加密
  // const cipherText = sm2.doEncrypt(data, publicKey, "utf8", {
  //   cipherMode: 1, // 使用C1C3C2模式
  // });
  const cipherMode = 1;
  let encryptData = sm2.doEncrypt(data, publicKey, cipherMode); // 加密结果
  ctx.body = {
    code: 200,
    timestramp,
    pwd: data,
    encryptPwd: encryptData,
  };
});

router.get("/json", async (ctx, next) => {
  ctx.body = {
    title: "koa2 json",
  };
});

router.post("/getSnapshot", async (ctx, next) => {
  const website = ctx.request.body.website;
  const type = ctx.request.body.type;
  let data = "";
  if (type === "PIC") {
    data = await shot(website);
  } else {
    data = await http.get(website);
  }
  ctx.body = {
    data,
  };
});

module.exports = router;
