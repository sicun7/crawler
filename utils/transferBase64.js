const fs = require("fs");

const transfer = (fileUrl) => {
  const bitmap = fs.readFileSync(fileUrl);
  const base64str = Buffer.from(bitmap, "binary").toString("base64");
  const imagePrefix = "data:image/png;base64,";
  return `${imagePrefix}${base64str}`;
};

module.exports.transferBase64 = transfer;
