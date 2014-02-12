app.story = (function(module) {
  module.getXml = getXml;
  module.getHtml = getHtml;
  module.renderRelated=renderRelated;
  /**
   * Retrieve xml from cloud
   * @param  {Function} cb [description]
   * @return {[type]}      [description]
   */
  function getXml(cb) {
    $fh.act({
      "act": "getStory"
    }, function(res) {
      if (res && res.data) {
        cb(null, res.data);
      }
    }, function(err) {
      cb(err);
    });
  }

  function getHtml(cb) {
    var mappingStory = {
      "{title}": "head title",
      "{abstract}": "abstract",
      "{img_url}": "media-reference@source",
      "{img_alt}": "media-reference@alternate-text",
      "{caption}": "media-caption",
      "{credit}": "media-producer",
      "{articleBody}": "block.text"
    }

    getXml(function(err, xml) {
      if (err) {
        cb(err);
      } else {
        var x = $($.parseXML(xml));
        renderRelated(x, function(err, relatedHtml) {
          template("storyTemplate", x, mappingStory, function(err, storyHtml) {
            if (err) {
              return cb(err);
            }
            storyHtml = storyHtml.replace("{related}", relatedHtml);
            cb(null, storyHtml);
          });
        });
      }
    });
  }

  function renderRelated(xmlObj, cb) {
    var mappingList = {
      "{relateUrl}": "virtloc@idsrc",
      "{relateTitle}": "virtloc"
    }
    var relatedArticles = xmlObj.find("block.relatedArticles li");
    templateList("storyListTemplate", relatedArticles, mappingList, function(err, listHtml) {
      if (err) {
        return cb(err);
      }
      app.loadTemplate("relatedTemplate", function(err, html) {
        if (err) {
          cb(err);
        } else {
          html = html.replace("{storyList}", listHtml);
          cb(null, html);
        }
      });
    });

  }

  function template(templateName, xmlObj, map, cb) {
    app.loadTemplate(templateName, function(err, html) {
      if (err) {
        cb(err);
      } else {
        for (var key in map) {
          var sel = map[key];
          var selArr = sel.split("@");
          if (selArr.length == 1) {
            html = html.replace(key, xmlObj.find(sel).text());
          } else {
            html = html.replace(key, xmlObj.find(selArr[0]).attr(selArr[1]));
          }
        }
        cb(null, html);
      }
    });
  }

  function templateList(templateName, xmlObjArr, map, cb) {
    var _html = [];
    app.loadTemplate(templateName, function(err, oriHtml) {
      if (err) {
        cb(err);
      } else {
        for (var i = 0; i < xmlObjArr.length; i++) {
          var xmlObj = $(xmlObjArr[i]);
          var html = oriHtml;
          for (var key in map) {
            var sel = map[key];
            var selArr = sel.split("@");
            if (selArr.length == 1) {
              html = html.replace(key, xmlObj.find(sel).text());
            } else {
              html = html.replace(key, xmlObj.find(selArr[0]).attr(selArr[1]));
            }
          }
          _html.push(html);
        }

        cb(null, _html.join(""));
      }
    });
  }

  return module;
})(app.story || {});