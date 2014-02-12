cms.ui.registerType('gallery_1392160275582', function(element, cb) {
  app.gallery.getHtml(function(err,html){
    if (err){
      cb(err);
    }else{
      cb(null,html);
    }
  });
});