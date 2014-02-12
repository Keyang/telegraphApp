app.gallery = (function(module) {
  module.getXml = getXml;
  module.getHtml = getHtml;

  function getXml(cb) {
    $fh.act({
      "act": "getGallary"
    }, function(res) {
      if (res && res.data) {
        cb(null, res.data);
      }
    }, function(err) {
      cb(err);
    });
  }

  function getHtml(cb) {
    getXml(function(err, xml) {
      if (err) {
        cb(err);
      } else {
        var x = $($.parseXML(xml));
        var title = x.find("head title").text();
        var medias = x.find("body media");
        var listHtmlArr = [];
        for (var i = 0; i < medias.length; i++) {
          var media = $(medias[i]);
          var imgSrc = media.find("media-reference").attr("source");
          listHtmlArr.push('<li><a href="javascript:cms.util.webview(\'' + imgSrc + '\')" target="_blank"><img src="' + imgSrc + '" height="80" width="80"></a></li>');
        }
        var listHtml = listHtmlArr.join("");
        app.story.renderRelated(x, function(err, relatedHtml) {
          if (err) {
            cb(err);
          } else {
            app.loadTemplate("galleryTemplate", function(err, html) {
              if (err) {
                cb(err);
              } else {
                html = html.replace("{title}", title).replace("{imgList}", listHtml).replace("{relate}",relatedHtml);
                cb(null, html);
              }
            });
          }
        });

      }
    });
  }
  return module;
})(app.gallery || {});