cms.ui.registerType('contact_1392132115948', function(element, cb) {
    var id = element._id;
    var name = element.name;
    cms.data.getContent(id, function(err, fullEle) {
        var content = fullEle.content;

        var template = '<div data-role="page" id="%{id}%" class="videoPage">' +
            '    <div data-role="header" data-position="fixed" data-tap-toggle="false">' +
            '      <h1 >' + name + '</h1>' +
            '    </div>' +
            '    <div data-role="content">' +
            '        <ul>' + '{content}' +
            '          </ul>' +
            '  </div>' +
            '</div>';
        var contentHtml = "";

        for (var key in content) {

            var obj = content[key];
            var img = obj.icon;
            var n = obj.title;
            var url = obj.url;
            contentHtml += '<li><a href="javascript:cms.util.webview(\''+url+'\')" target="_blank">' +
                '    <div class="imgRow"><img src="'+img+'"/></div>' +
                '    <div class="nameRow">'+n+'</div>' +
                '    <div class="dateRow">'+n+'</div>' +
                '    </a>' +
                '</li>';
        }
        template=template.replace("{content}",contentHtml);
        cb(null,template);
    });
});