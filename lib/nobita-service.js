const merge = require('lodash/merge');
const setWith = require('lodash/setWith');
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

const bindFunc = (func, ctx) => {
  const data = {};
  if (typeof func == 'function') {
    return func.bind(ctx);
  } else if (typeof func == 'object') {
    for (const i in func) {
      data[i] = bindFunc(func[i], ctx);
    }
  }
  return data;
}

module.exports = (app) => {
  for (let i in serviceNewArr) {
    try {
      service = merge(service, setWith({}, serviceNewArr[i], require(serviceArr[i])(app), Object));
    } catch (e) {
      throw Error(`require ${serviceArr[i]} is not a function!`)
    }
  }

  app.context.service = service;
  app.service = bindFunc(service, app.context);
  return async (ctx, next) => {
    app.context.service = bindFunc(service, ctx);
    await next();
  }
};