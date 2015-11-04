'use strict';

let request = require('request');
let baseUrl = 'http://www.sudoc.fr/services';

function query(service, params, callback) {

  params = Array.isArray(params) ? params.join(',') : params || '';

  let options = {
    uri: encodeURI(`${baseUrl}/${service}/${params}`),
    headers: { 'Accept': 'text/json' }
  };

  request.get(options, (err, res, body) => {
    if (err) { return callback(err); }

    let sudoc;

    try {
      sudoc = JSON.parse(body).sudoc;
    } catch (e) {
      return callback(e);
    }

    if (sudoc.error) {
      return callback(new Error(sudoc.error));
    }

    callback(null, sudoc);
  });
}

['issn2ppn', 'isbn2ppn', 'ean2ppn'].forEach((service) => {
  exports[service] = function (params, callback) {
    return query(service, params, callback);
  };
});
