const { transferBase64 } = require("../utils/transferBase64");

// const screenshot = require("screenshot-desktop");

// screenshot({ format: "png" })
//   .then((img) => {
//     // img: Buffer filled with png goodness
//     // ...
//     console.log(img);
//   })
//   .catch((err) => {
//     // ...
//     console.log(err);
//   });

// screenshot({ filename: "/Users/zhangping/Projects/crawler/utils/test.png" });

// const puppeteer = require(' ');

// (async () => {

// })();

const puppeteer = require("puppeteer");
const waitTime = (n) => new Promise((r) => setTimeout(r, n));

const shot = async (url) => {
  const fileUrl = "./temp/shot.png";

  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const page = await browser.newPage();
  await page.goto(url);
  await page.setViewport({
    width: 1920,
    height: 1080,
  });
  let step = 400;
  for (let i = 0; i < 50; i++) {
    await page.evaluate((distance) => {
      window.scrollBy(0, distance);
    }, step);
    await waitTime(100);
  }
  // 如果返回的是一个promise, 那么久等待这个promise结束
  const pageRendered = page.evaluate(() => {
    const imageList = Array.from(document.getElementsByTagName("img"));
    const promiseList = imageList.map((item) =>
      item.complete ? Promise.resolve() : new Promise((r) => (item.onload = r))
    );
    return Promise.all(promiseList);
  });
  const timePromise = waitTime(10000);
  // 等待十秒, 或者所有图片加载完毕
  await Promise.race([pageRendered, timePromise]);

  await page.screenshot({ path: fileUrl, fullPage: true });
  await browser.close();

  // const browser = await puppeteer.launch();
  // const page = await browser.newPage();
  // await page.setViewport({
  //   width: 1920,
  //   height: 1080,
  // });
  // await page.goto(url);
  // await page.screenshot({ path: fileUrl });
  // await browser.close();

  // 转base64
  const base64 = transferBase64(fileUrl);
  return base64;
};

module.exports.shot = shot;
