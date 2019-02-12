const _ = require('lodash');
const readdir = require('nobita-readdir');
const filePath = '/app/service/';
const serviceArr = readdir(`.${filePath}`);

let service = {};
let serviceNewArr = serviceArr.map((item) => {
  const fileName = item.split(filePath)[1];
  if (fileName.indexOf('.js') != -1) {
    return fileName.split('.js')[0].replace(/\//g, '.');
  }
});

module.exports = async (ctx, next) => {
  for (let i in serviceNewArr) {
    service = _.merge(service, _.setWith({}, serviceNewArr[i], require(serviceArr[i])(ctx), Object));
  }

  ctx.service = service;
  await next();
};