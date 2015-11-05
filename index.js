'use strict';

let request = require('request');
let baseUrl = 'http://www.sudoc.fr/services';

function query(service, params, callback) {

  let arrayQuery = Array.isArray(params);
  params = arrayQuery ? params.join(',') : params || '';

  let options = {
    uri: encodeURI(`${baseUrl}/${service}/${params}`),
    headers: { 'Accept': 'text/json' }
  };

  let promise = new Promise((resolve, reject) => {
    request.get(options, (err, res, body) => {
      if (err) { return reject(err); }

      let sudoc;

      try {
        sudoc = JSON.parse(body).sudoc;
      } catch (e) {
        return reject(e);
      }

      if (sudoc.error) {
        return reject(new Error(sudoc.error));
      }

      if (arrayQuery && !Array.isArray(sudoc)) {
        sudoc = [sudoc];
      }

      resolve(sudoc);
    });
  });

  if (typeof callback === 'function') {
    promise.then(sudoc => {
      callback(null, sudoc);
      return sudoc;
    })
    .catch(err => {
      callback(err);
      throw err;
    });
  }

  return promise;
}

['issn2ppn', 'isbn2ppn', 'ean2ppn'].forEach(service => {
  exports[service] = function (params, callback) {
    return query(service, params, callback);
  };
});
