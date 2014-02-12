var cms = require("fh-cms-cloud");
var storyXml = "http://api.telegraph.co.uk/samples/StoryArticle.xml";
var gallaryXml = "http://api.telegraph.co.uk/samples/PictureGalleryArticle.xml";
var videoXml = "http://api.telegraph.co.uk/samples/VideoArticle.xml";
var request = require("request");

cms.apply(module.exports);
exports.getStory = function(param, cb) {
  mashCache("story",storyXml,cb);
}
exports.getGallary = function(param, cb) {
  mashCache("gallary",gallaryXml,cb);
}
exports.getVideo = function(param, cb) {
  mashCache("video",videoXml,cb);
}
/**
 * Retrieve data with key from cache, if not exists, mash data from url and cache to key.
 * @param  {[type]}   key [description]
 * @param  {[type]}   url [description]
 * @param  {Function} cb  [description]
 * @return {[type]}       [description]
 */
function mashCache(key, url, cb) {
  $fh.cache({
    "act": "load",
    "key": key
  }, function(err, res) {
    if (!err && res) {
      cb(null, {
        "data": res
      });
    } else {
      request.get(url, function(err, res) {
        if (err) {
          return cb(err);
        }
        $fh.cache({
          "act": "save",
          "key": key,
          "value": res.body
        }, function() {
          cb(null, {
            "data": res.body
          });
        });
      });
    }
  });
}