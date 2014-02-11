/**
 * Utilities used by the application.
 */

module.exports = {
  communicationError: communicationError,
  verifyParams: verifyParams,
  sendResponse: sendResponse,
  getHash: getHash
};

var async = require('async'),
  crypto = require('crypto');


/**
 * A generic response handler.
 * Ensures content-length is set so large responses don't get cutoff
 * @param {Mixed}     data
 * @param {Function}  callback
 * @param {Function}  [headers]
 */

function sendResponse(data, callback, headers) {
  // Ensure data is stringigifed for Content-Length calculation
  var dataStr=data;
  if (data instanceof Array || typeof data === 'object') {
    try {
       dataStr= JSON.stringify(data);
    } catch (e) {
      console.error('JSON parse failed for sendResponse()');
      console.error(e)
      return callback('Request error. Response JSON could not be parsed.', null);
    }
  }else{
    try{
      data=JSON.parse(data);
    }catch(e){
      console.error('JSON parse failed for sendResponse()');
      console.error(e)
      return callback('Request error. Response JSON could not be parsed.', null);
    }
  }

  // Ensure we have a headers object
  if(typeof headers !== 'object') {
    headers = {};
  }
  headers['Content-Length'] = Buffer.byteLength(dataStr);

  return callback(null, data);
}


/**
 * Called when communication with the CMS fails
 * @param {Object} err
 * @param {Object} res
 * @param {String} body
 * @param {Function}
 */

function communicationError(err, res, body, callback) {
  var code = 'Unknown',
    text = 'Integration communication error.';

  // Log the error if one exists
  if (err) {
    console.error('Error occurred in integrations communication:');
    console.error(JSON.stringify(err));
  }

  // We had a response, get body and status code
  if (res) {
    code = res.statusCode;

    // Don't show the default FH app unavailable response
    if (body.indexOf('Service unavailable, check service exists and is running ok') != -1) {
      text = 'Integration service is unavailable.'
    } else {
      text = body;
    }
  }

  return callback(text + ' (' + code + ')', null);
}


/**
 * Check received params against an array of expected
 * @param {String/Array}  expectedParams
 * @param {Object}        params
 * @param {Function}      callback
 */

function verifyParams(expectedParams, params, callback) {
  // Params should be an object
  if (typeof params !== 'object') {
    return callback('Expected object input but received ' + typeof params);
  }

  // Expected params should always use array, accept string for conveinience
  if (typeof expectedParams === 'string') {
    expectedParams = [expectedParams];
  }

  // Check the params object vs the expected list
  async.forEach(expectedParams, function(item, cb) {
    if (!params.hasOwnProperty(item)) {
      return cb('Missing parameter ' + item);
    }
    return cb();
  }, callback);
}


/**
 * Returns a hash for provided data.
 * @params {Mixed} data
 */

function getHash(data) {
  if (typeof data === 'object' || data instanceof Array) {
    data = JSON.stringify(data);
  }

  var md5 = crypto.createHash('md5');
  md5.update(data);
  return md5.digest('hex');
}