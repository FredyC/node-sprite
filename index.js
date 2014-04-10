// Generated by CoffeeScript 1.6.3
(function() {
  var EventEmitter, Seq, Sprite, createSprite, createSprites, fs, mapper, stylus;

  Sprite = require('./lib/sprite');

  mapper = require('./lib/mapper');

  fs = require('fs');

  Seq = require("seq");

  EventEmitter = require("events").EventEmitter;

  createSprite = function(name, options, cb) {
    var map, padding, path, sprite;
    if (options == null) {
      options = {};
    }
    if (cb == null) {
      cb = function() {};
    }
    options || (options = {});
    if (typeof options === 'function') {
      cb = options;
      options = {};
    }
    padding = options.padding || 2;
    path = options.path || './images';
    map = new mapper.VerticalMapper(padding);
    sprite = new Sprite(name, path, map, options.watch);
    sprite.load(function(err) {
      return sprite.write(function(err) {
        return cb(err, sprite);
      });
    });
    return sprite;
  };

  createSprites = function(options, cb) {
    var path;
    if (options == null) {
      options = {};
    }
    if (cb == null) {
      cb = function() {};
    }
    if (typeof options === 'function') {
      cb = options;
      options = {};
    }
    path = options.path || './images';
    return Seq().seq(function() {
      return fs.readdir(path, this);
    }).flatten().parFilter(function(dir) {
      var _this = this;
      return fs.stat("" + path + "/" + dir, function(err, stat) {
        return _this(err, stat.isDirectory());
      });
    }).parMap(function(dir) {
      return createSprite(dir, options, this);
    }).unflatten().seq(function(sprites) {
      var result, s, _i, _len;
      result = {};
      for (_i = 0, _len = sprites.length; _i < _len; _i++) {
        s = sprites[_i];
        result[s.name] = s;
      }
      return cb(null, result);
    });
  };

  stylus = function(options, cb) {
    var helper, nodes, result, retinaMatcher;
    if (options == null) {
      options = {};
    }
    if (cb == null) {
      cb = function() {};
    }
    stylus = require('stylus');
    nodes = stylus.nodes;
    retinaMatcher = new RegExp((options.retina || "2x") + "$");
    result = {};
    helper = new EventEmitter();
    helper.fn = function(name, image, dimensions) {
      var height, httpUrl, item, positionX, positionY, sprite, width;
      name = name.string;
      image = image.string;
      dimensions = dimensions ? dimensions.val : true;
      sprite = result[name];
      if (sprite == null) {
        throw new Error("missing sprite " + name);
      }
      item = sprite.image(image);
      if (item == null) {
        throw new Error("missing image " + image + " in sprite " + name);
      }
      width = item.width;
      height = item.height;
      positionX = item.positionX * -1;
      positionY = item.positionY * -1;
      if (name.match(retinaMatcher)) {
        width = width / 2;
        height = height / 2;
        positionX = positionX / 2;
        positionY = positionY / 2;
      }
      if (dimensions) {
        width = new nodes.Property(["width"], "" + width + "px");
        height = new nodes.Property(["height"], "" + height + "px");
        this.closestBlock.nodes.splice(this.closestBlock.index + 1, 0, width, height);
      }
      httpUrl = (options.httpPath || options.path) + "/" + sprite.filename();
      return new nodes.Property(["background-position"], "" + positionX + "px " + positionY + "px");
    };
    helper.dimensionsFn = function(name, image) {
      var height, item, sprite, width;
      name = name.string;
      image = image.string;
      sprite = result[name];
      if (sprite == null) {
        throw new Error("missing sprite " + name);
      }
      item = sprite.image(image);
      if (item == null) {
        throw new Error("missing image " + image + " in sprite " + name);
      }
      width = sprite._width();
      height = sprite._height();
      if (name.match(retinaMatcher)) {
        width = width / 2;
        height = height / 2;
      }
      return new nodes.Unit("" + width + "px " + height + "px");
    };
    createSprites(options, function(err, sprites) {
      var name, s;
      for (name in sprites) {
        s = sprites[name];
        s.on("update", function() {
          return helper.emit("update", name);
        });
      }
      result = sprites;
      return cb(err, helper);
    });
    return helper;
  };

  module.exports = {
    sprite: createSprite,
    sprites: createSprites,
    stylus: stylus
  };

}).call(this);
