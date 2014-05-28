var request = require('request'),
  should = require('should'),
  port = process.env.PORT || 3000,
  ownerHuntKey,
  productId;

describe('/api/v1/owner/products test', function(){
  before(function(done){
    request({
      'method':'POST',
      'url':'http://localhost:'+port+'/api/v1/owner/login',
      'form' : {
        'username':'owner@example.org',
        'password':'test123'
      }
    }, function(error, response, body){
      if(error) {
        done(error);
      } else {
        response.statusCode.should.be.equal(200);
        var bodyParsed = JSON.parse(body);
        bodyParsed.Code.should.be.equal(200);
        bodyParsed.huntKey.should.be.a.String;
        ownerHuntKey=bodyParsed.huntKey;
        done();
      }
    });
  });

  it('owner can create product');
  it('owner can list products');
  it('owner can list one product');
  it('owner can update product');
  it('owner can delete product with now tradelines associated');
});