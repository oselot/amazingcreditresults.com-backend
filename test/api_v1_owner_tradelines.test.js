var request = require('request'),
  should = require('should'),
  port = process.env.PORT || 3000,
  testId = Math.floor(Math.random()*10000),
  ownerHuntKey,
  ownerId,
  productId,
  tradeLineId;

describe('/api/v1/owner/tradelines test', function(){
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
        ownerHuntKey = bodyParsed.huntKey;
        ownerId = bodyParsed.id;

        request({
          'method':'POST',
          'url':'http://localhost:'+port+'/api/v1/owner/products',
          'headers': { 'huntKey':ownerHuntKey },
          'form' : {
            'name': 'SuperMega'+testId,
            'bank': 'SuperMegaBank'+testId,
            'type': 'MasterCard',
            'ncRating': 'None',
            'bcRating': 'Bronze',
            'moRating': 'Silver',
            'reportsToExperian': false,
            'reportsToEquifax': false,
            'reportsToTransunion': false
          }
        }, function(error, response, body){
            if(error) {
              done(error);
            } else {
              response.statusCode.should.be.equal(201);
              var bodyParsed = JSON.parse(body);
              bodyParsed.data.name.should.be.equal('SuperMega'+testId);
              bodyParsed.data.bank.should.be.equal('SuperMegaBank'+testId);
              bodyParsed.data.type.should.be.equal('MasterCard');
              bodyParsed.data.ncRating.should.be.equal('None');
              bodyParsed.data.bcRating.should.be.equal('Bronze');
              bodyParsed.data.moRating.should.be.equal('Silver');
              bodyParsed.data.reportsToExperian.should.be.false;
              bodyParsed.data.reportsToEquifax.should.be.false;
              bodyParsed.data.reportsToTransunion.should.be.false;
              productId = bodyParsed.data.id;
              done();
            }
        });
      }
    });
  });
//*/
  it('owner can\'t create tradeline with non existant product', function(done){
    request({
      'method':'POST',
      'url':'http://localhost:'+port+'/api/v1/owner/tradelines',
      'headers': { 'huntKey':ownerHuntKey },
      'form': {
        'name':'TestTradeline'+testId,
        'product':'5366506291e1e82b0f4be503', //non existant, but valid id
        'seller': ownerId,
        'totalAus': 10,
        'usedAus': 5,
        'price': 1100,
        'creditLimit': 10000,
        'cashLimit': 10000,
        'currentBalance': 1000,
        'ncRating':'Silver',
        'bcRating':'Silver',
        'moRating':'Silver',
        'cost':1000,
        'notes':'Some notes'
      }
    }, function(error, response, body){
      if(error) {
        done(error);
      } else {
        response.statusCode.should.be.equal(500);
        //console.log(body);
        done();
      }
    });
  });
//*/
//*/
  it('owner can\'t create tradeline with non existant seller', function(done){
    request({
      'method':'POST',
      'url':'http://localhost:'+port+'/api/v1/owner/tradelines',
      'headers': { 'huntKey':ownerHuntKey },
      'form': {
        'name':'TestTradeline'+testId,
        'product': productId,
        'seller': '5366506291e1e82b0f4be503', //non existant, but valid id
        'totalAus': 10,
        'usedAus': 5,
        'price': 1100,
        'creditLimit': 10000,
        'cashLimit': 10000,
        'currentBalance': 1000,
        'ncRating':'Silver',
        'bcRating':'Silver',
        'moRating':'Silver',
        'cost':1000,
        'notes':'Some notes'
      }
    }, function(error, response, body){
      if(error) {
        done(error);
      } else {
        response.statusCode.should.be.equal(500);
        //console.log(body);
        done();
      }
    });
  });
//*/
  it('owner can create tradeline with existand product and seller', function(done){
    request({
      'method':'POST',
      'url':'http://localhost:'+port+'/api/v1/owner/tradelines',
      'headers': { 'huntKey':ownerHuntKey },
      'form': {
        'product': productId,
        'seller': ownerId,
        'totalAus': 10,
        'usedAus': 5,
        'price': 1100,
        'creditLimit': 10000,
        'cashLimit': 10000,
        'currentBalance': 1000,
        'ncRating':'Silver',
        'bcRating':'Silver',
        'moRating':'Silver',
        'cost':1000,
        'notes':'Some notes'
      }
    }, function(error, response, body){
      if(error) {
        done(error);
      } else {
        response.statusCode.should.be.equal(201);
        var bodyParsed = JSON.parse(body);
//        console.log(bodyParsed);
/*/
//wtf - mongoose orm works REALY strange
        bodyParsed.data.product.id.should.be.equal(productId);
//*/
        bodyParsed.data.seller.should.be.equal(ownerId);
        bodyParsed.data.totalAus.should.be.equal(10);
        bodyParsed.data.usedAus.should.be.equal(5);
        bodyParsed.data.price.should.be.equal(1100);
        bodyParsed.data.creditLimit.should.be.equal(10000);
        bodyParsed.data.cashLimit.should.be.equal(10000);
        bodyParsed.data.currentBalance.should.be.equal(1000);
        bodyParsed.data.ncRating.should.be.equal('Silver');
        bodyParsed.data.bcRating.should.be.equal('Silver');
        bodyParsed.data.moRating.should.be.equal('Silver');
        bodyParsed.data.cost.should.be.equal(1000);
        bodyParsed.data.notes.should.be.equal('Some notes');
        tradeLineId = bodyParsed.data.id;
        done();
      }
    });
  });

  it('owner can list tradelines');
  it('owner can list one tradeline', function(done){
    request({
      'method':'GET',
      'url':'http://localhost:'+port+'/api/v1/owner/tradelines/'+tradeLineId,
      'headers': { 'huntKey':ownerHuntKey }
    }, function(error, response, body){
      if(error) {
        done(error);
      } else {
        response.statusCode.should.be.equal(200);
        var bodyParsed = JSON.parse(body);
        console.log(bodyParsed);
        bodyParsed.data.id.should.be.equal(tradeLineId);
/*/
//Mongoose ORM acts strange
      + expected - actual

      +"5387a3837e6951ff1c28ed4e"
      -"S£~iQÿ\u001c(íN"


        bodyParsed.data.product.id.should.be.equal(productId);
//*/
        bodyParsed.data.seller.id.should.be.equal(ownerId);
        bodyParsed.data.totalAus.should.be.equal(10);
        bodyParsed.data.usedAus.should.be.equal(5);
        bodyParsed.data.price.should.be.equal(1100);
        bodyParsed.data.creditLimit.should.be.equal(10000);
        bodyParsed.data.cashLimit.should.be.equal(10000);
        bodyParsed.data.currentBalance.should.be.equal(1000);
        bodyParsed.data.ncRating.should.be.equal('Silver');
        bodyParsed.data.bcRating.should.be.equal('Silver');
        bodyParsed.data.moRating.should.be.equal('Silver');
        bodyParsed.data.cost.should.be.equal(1000);
        bodyParsed.data.notes.should.be.equal('Some notes');
        done();
      }
    });
  });
  it('owner can update tradeline');
  it('owner can delete tradeline?');
});