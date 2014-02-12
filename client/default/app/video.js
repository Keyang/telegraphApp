app.video = (function(module) {
  module.getXml = getXml;
  module.getHtml = getHtml;

  function getXml(cb) {
    $fh.act({
      "act": "getVideo"
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
        var url=x.find("pubdata").attr("ex-ref");
        var imgSrc=x.find("media.on_summary_image>media-reference").attr("source");
        var caption=x.find("media-caption").text();
        var intro=x.find("block.text").text();
        app.story.renderRelated(x,function(err,relateHtml){
          if (err){
            cb(err);
          }else{
            app.loadTemplate("videoTemplate",function(err,html){
              if(err){
                cb(err);
              }else{
                html=html.replace("{title}",title)
                          .replace("{url}",url)
                          .replace("{imgSrc}",imgSrc)
                          .replace("{caption}",caption)
                          .replace("{intro}",intro)
                          .replace("{relate}",relateHtml);
                cb(null,html);
              }
            });
          }
        });
      };
    });
  }
  return module;
})(app.video || {});