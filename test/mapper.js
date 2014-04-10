// Generated by CoffeeScript 1.6.3
(function() {
  var HorizontalMapper, Sprite, VerticalMapper, path;

  Sprite = require('../lib/sprite');

  VerticalMapper = require('../lib/mapper').VerticalMapper;

  HorizontalMapper = require('../lib/mapper').HorizontalMapper;

  path = './test/images';

  module.exports = {
    testVerticalMapper: function(beforeExit, assert) {
      var mapper, sprite;
      mapper = new VerticalMapper(10);
      sprite = new Sprite('global', path, mapper);
      return sprite.load(function() {
        var image, images, _i, _len;
        images = sprite.images;
        mapper.map(images);
        assert.equal(0, images[0].positionY);
        assert.equal(310, images[1].positionY);
        for (_i = 0, _len = images.length; _i < _len; _i++) {
          image = images[_i];
          assert.equal(0, image.positionX);
        }
        assert.equal(200, mapper.width);
        assert.equal(510, mapper.height);
        return assert.equal(200 * 510, mapper.area());
      });
    },
    testHorizontalMapper: function(beforeExit, assert) {
      var mapper, sprite;
      mapper = new HorizontalMapper(10);
      sprite = new Sprite('global', path, mapper);
      return sprite.load(function() {
        var image, images, _i, _len;
        images = sprite.images;
        mapper.map(images);
        assert.equal(0, images[0].positionX);
        assert.equal(110, images[1].positionX);
        for (_i = 0, _len = images.length; _i < _len; _i++) {
          image = images[_i];
          assert.equal(0, image.positionY);
        }
        assert.equal(310, mapper.width);
        assert.equal(300, mapper.height);
        return assert.equal(310 * 300, mapper.area());
      });
    }
  };

}).call(this);
