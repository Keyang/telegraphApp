
cms.ui.registerType('videosample_1392162595786', function(element, cb) {
  app.video.getHtml(function(err,html){
    if (err){
      cb(err);
    }else{
      cb(null,html);
    }
  });
});