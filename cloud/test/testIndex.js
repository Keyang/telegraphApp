var com=require("../index.js");
var assert=require("assert");
var testApp="testapp_1383736753219";
var testContent="527a2897f711e7fd55000008";
describe("component",function(){
    it ("should contain essetial interfaces",function(){
        assert(com.getAppStructure);
        assert(com.getContentExtra);
        assert(com.getArticle);
        assert(com.getCmsUrl);
        assert(com.env);

    });
    it ("should get app structure",function(done){
        com.getAppStructure({"alias":testApp},function(err,res){
            assert(!err);
            assert(res.content.alias==testApp);
            done();
        });
    });

    it ("should get content",function(done){
        com.getArticle({"contentId":testContent},function(err,res){
            assert(!err);
            assert(res._id==testContent);
            done();
        });
    });

    it ("should get extra content",function(done){
        com.getContentExtra({
            "cat":"import",
            "type":"json",
            "template":"rss",
            "extraId":"527a2d47617f05666d000001"
        },function(err,res){
            assert(!err);
            assert(res._id=="527a2d47617f05666d000001");
            
            done();
        });
    });
});