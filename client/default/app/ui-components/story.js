cms.ui.registerType('samplestory_1392148407769', function(element, cb) {
  app.story.getHtml(function(err,html){
    if (err){
      cb(err);
    }else{
      cb(null,html);
    }
  });
});