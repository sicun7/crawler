var request = require("request");
module.exports = {
  get: function (url) {
    return new Promise(function (resolve, reject) {
      request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          resolve(body);
        } else {
          reject("error");
        }
      });
    });
  },
};
