'use strict';

let request = require('request');
let baseUrl = 'http://www.sudoc.fr/services';

function query(service, params, callback) {

  params = Array.isArray(params) ? params.join(',') : params || '';

  let options = {
    uri: encodeURI(`${baseUrl}/${service}/${params}`),
    headers: { 'Accept': 'text/json' }
  };

  return new Promise(function (resolve, reject) {
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

      resolve(sudoc);
    });
  })
  .then(sudoc => {
    if (typeof callback === 'function') { callback(null, sudoc); }
    return sudoc;
  })
  .catch(err => {
    if (typeof callback === 'function') { callback(err); }
    throw err;
  });
}

['issn2ppn', 'isbn2ppn', 'ean2ppn'].forEach((service) => {
  exports[service] = function (params, callback) {
    return query(service, params, callback);
  };
});
