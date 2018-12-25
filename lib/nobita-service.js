const _ = require('lodash');
const readdir = require('nobita-readdir');
const serviceArr = readdir('./app/service/');

let service;
let serviceNewArr = serviceArr.map((item) => {
  if (item.split('/app/service/')[1].indexOf('.js') != -1) {
    return item.split('/app/service/')[1].split('.js')[0].replace(/\//g, '.');
  }
});

module.exports = async (ctx, next) => {
  for (let i in serviceNewArr) {
    service = _.merge({}, _.setWith({}, serviceNewArr[i], require(serviceArr[i])(ctx), Object));
  }

  ctx.service = service;
  await next();
};