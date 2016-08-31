/*
 * Glitchr - jQuery plugin for messing with images
 *
 * Copyright (c) 2015 Cody Whitby
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   #
 *
 * Version:  0.0.1
 *
 */

(function($, window, document, undefined) {

  $.fn.glitchr = function(options) {
    var elems = this;
    var base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var base64Map = base64Chars.split("");
    var reverseBase64Map = {}; base64Map.forEach(function(val, key) { reverseBase64Map[val] = key} );

    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");

    var settings = {
      intensity : 10,
    };

    if(options) {
      $.extend(settings, options);
    }

    function detectJpegHeaderSize(data) {
      jpgHeaderLength = 417;
      for (var i = 0, l = data.length; i < l; i++) {
        if (data[i] == 0xFF && data[i+1] == 0xDA) {
          jpgHeaderLength = i + 2; return;
        }
      }
    }

    function canvasDimensions($self) {
      var w = $self.width();
      var h = $self.height();

      canvas.width = w;
      canvas.height = h;
    }

    // base64 is 2^6, byte is 2^8, every 4 base64 values create three bytes
    function base64ToByteArray(str) {
      var result = [], digitNum, cur, prev;
      for (var i = 23, l = str.length; i < l; i++) {
        cur = reverseBase64Map[str.charAt(i)];
        digitNum = (i-23) % 4;
        switch(digitNum){
          //case 0: first digit - do nothing, not enough info to work with
          case 1: //second digit
            result.push(prev << 2 | cur >> 4);
            break;
          case 2: //third digit
            result.push((prev & 0x0f) << 4 | cur >> 2);
            break;
          case 3: //fourth digit
            result.push((prev & 3) << 6 | cur);
            break;
        }
        prev = cur;
      }
      return result;
    }

    function byteArrayToBase64(arr) {
      var result = ["data:image/jpeg;base64,"], byteNum, cur, prev;
      for (var i = 0, l = arr.length; i < l; i++) {
        cur = arr[i];
        byteNum = i % 3;
        switch (byteNum) {
          case 0: //first byte
            result.push(base64Map[cur >> 2]);
            break;
          case 1: //second byte
            result.push(base64Map[(prev & 3) << 4 | (cur >> 4)]);
            break;
          case 2: //third byte
            result.push(base64Map[(prev & 0x0f) << 2 | (cur >> 6)]);
            result.push(base64Map[cur & 0x3f]);
            break;
        }
        prev = cur;
      }
      if (byteNum == 0) {
        result.push(base64Map[(prev & 3) << 4]);
        result.push("==");
      } else if (byteNum == 1) {
        result.push(base64Map[(prev & 0x0f) << 2]);
        result.push("=");
      }
      return result.join("");
    }
            
    function glitchBytes(strArr) {
      var rnd = Math.floor(jpgHeaderLength + Math.random() * (strArr.length - jpgHeaderLength - 4));
      strArr[rnd] = Math.floor(Math.random() * 256);
    }
    
    function glitchImg(data) {
      for (var i = 0; i < settings.intensity; i++) {
        glitchBytes(imgDataArr);
      }

      glitched = byteArrayToBase64(imgDataArr);
      data.attr("src", glitched);
      console.log(glitched);
    }

    this.each(function() {
      var self = this;
      var $self = $(self);

      canvasDimensions($self);

      ctx.drawImage(this, 0, 0);
      imgData = canvas.toDataURL("image/jpeg");

      imgDataArr = base64ToByteArray(imgData);
      detectJpegHeaderSize(imgDataArr);

      glitchImg($self);
    });

    return this;
  };

})(jQuery, window, document);