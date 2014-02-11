/**
 * Simple interface to the CMS.
 */

//TODO add content server-side cache
module.exports = {
  getAppStructure: getAppStructure,
  getContentExtra: getContentExtra,
  getContent: getContent,
  getCmsUrl: getCmsUrl,
  apply:apply,
  env:require("./env")
};

var request = require('request'),
  utils = require('./utils.js'),
  env = require('./env.js'),
  url = require('url');


/**
 * Get the CMS URL being used.
 * @return {String}
 */

function getCmsUrl() {
  return env.get('CMS_URL');
}
function apply(_exports){
  _exports.getAppStructure=getAppStructure;
  _exports.getContentExtra=getContentExtra;
  _exports.getContent=getContent;
  _exports.getCmsUrl=getCmsUrl;
}

/**
 * Generic CMS get request
 * @param {String}
 * @param {Callback}
 */
function doRequest(path, callback) {
  var fullUrl=getCmsUrl() + path;
  request.get(fullUrl, function(err, res, body) {
    if (err || (res && res.statusCode != 200)) {
      return utils.communicationError(err, res, body, callback);
    }

    return utils.sendResponse(body, callback);
  }); 
}


/**
 * Get extra content types from CMS
 * @param {Object}
 * @param {Function}
 */
function getContentExtra(params, callback) {
  var pathKeys = ['cat', 'type', 'template', 'extraId'];
  utils.verifyParams(pathKeys, params, function(err) {
    if (err) {
      return callback(err, null);
    }

    var path = '/cms/articles/loadExtra/:cat/:type/:template/:extraId';
    pathKeys.forEach(function(k) {
      path = path.replace(':' + k, params[k]);
    });

    return doRequest(path, callback);
  });
}


/**
 * Get an article from the CMS
 * @param {Object}    params
 * @param {Function}  callback
 */

function getContent(params, callback) {
  utils.verifyParams(['contentId'], params, function(err) {
    if (err) {
      return callback(err, null);
    }

    var path = '/cms/articles/load/' + params['contentId'];
    return doRequest(path, callback);
  });
}


/**
 * Get the structure of the application specified.
 * @param {Object}    params
 * @param {Function}  callback
 */

function getAppStructure(params, callback) {
  var ts=params["timestamp"]?params["timestamp"]:0;
  utils.verifyParams(['alias'], params, function(err) {
    if (err) {
      return callback(err, null);
    }

    var path = '/cms/apps/structure/' + params['alias']+"/"+ts;
    return doRequest(path, callback);
  });
}
env.init();