var app = (function(module) {
  module.init = init;
  module.myUI = {};
  module.loadTemplate=loadView;

  function loadView(viewName,cb){
    $.get("/app/views/"+viewName+".html",function(body){
      cb(null,body);
    });
  }
  function init() {
    //init cms sdk
    cms.init({
      alias: 'telegraphapp_1383735125091',
      onNav: function(contentId) {
        setTimeout(function() {
          app.view.changePage(contentId, {
            "changeHash": true,
            "addBackBtn":true
          });
        }, 0);

      }
    });
    $.mobile.loading("show", {
      text: "Fetching Data From Server...",
      textVisible: true,
      html: ""
    });
    cms.ui.initUi(function() {
      // debugger;
      var appPage = $(cms.ui.getHtml(cms.app.alias));
      // $("#container").append(ul);
      $("#homePage [data-role='content']").html(appPage.find("[data-role='content']").html()).trigger('create').trigger('pageinit');
      // ul.listview();
      $.mobile.loading("hide");
      // $.mobile.changePage("#"+cms.app.alias);
      toast("App still downloading content in background. Please do not close app.");
      cms.events.on("synced",firstRun);
    });
    function firstRun(){
      cms.events.off("synced",firstRun);
      toast("App has downloaded all content.");
    }
    $.mobile.page.prototype.options.addBackBtn = true;
    cms.service.startPoll(8); //sync every 8 seconds.
  }

  return module;

})(app || {});

var toast=function(msg){
  $("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h3>"+msg+"</h3></div>")
  .css({ display: "block", 
    opacity: 0.90, 
    position: "fixed",
    padding: "7px",
    "text-align": "center",
    width: "270px",
    left: ($(window).width() - 284)/2,
    top: $(window).height()/2 })
  .appendTo( $.mobile.pageContainer ).delay( 1500 )
  .fadeOut( 400, function(){
    $(this).remove();
  });
}