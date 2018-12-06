const _ = require('lodash');
const readdir = require('nobita-readdir');

module.exports = async (ctx, next) => {
  let service = {};
  const serviceArr = readdir('./app/service/');
  // service
  let serviceNewArr = serviceArr.map((item) => {
    
    if (item.split('/app/service/')[1].indexOf('.js') != -1) {
      return item.split('/app/service/')[1].split('.js')[0].replace(/\//g, '.');
    }
  });
  
  for (let i in serviceNewArr) {
    service = _.merge(service, _.setWith({}, serviceNewArr[i], require(serviceArr[i])(ctx), Object));
  }
  ctx = _.merge(ctx, {service});

  await next();
};