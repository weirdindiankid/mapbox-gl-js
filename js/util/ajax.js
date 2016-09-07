'use strict';

var window = require('./window');

exports.get = function(url, responseType, callback) {
    var xhr = new window.XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = responseType;
    xhr.onerror = function(e) {
        callback(e);
    };
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300 && xhr.response) {
            callback(null, xhr.response);
        } else {
            callback(new Error(xhr.statusText));
        }
    };
    xhr.send();
    return xhr;
};

exports.getJSON = function(url, callback) {
    return exports.get(url, 'json', callback);
};

exports.getArrayBuffer = function(url, callback) {
    return exports.get(url, 'arraybuffer', callback);
};

exports.getBlob = function(url, callback) {
    return exports.get(url, 'blob', callback);
};

function sameOrigin(url) {
    var a = window.document.createElement('a');
    a.href = url;
    return a.protocol === window.document.location.protocol && a.host === window.document.location.host;
}

exports.getImage = function(url, callback) {
    return exports.getBlob(url, function(err, blob) {
        if (err) return callback(err);
        var img = new window.Image();
        img.onload = function() {
            callback(null, img);
            (window.URL || window.webkitURL).revokeObjectURL(img.src);
        };
        img.src = (window.URL || window.webkitURL).createObjectURL(blob);
        img.getData = function() {
            var canvas = window.document.createElement('canvas');
            var context = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);
            return context.getImageData(0, 0, img.width, img.height).data;
        };
        return img;
    });
};

exports.getVideo = function(urls, callback) {
    var video = window.document.createElement('video');
    video.onloadstart = function() {
        callback(null, video);
    };
    for (var i = 0; i < urls.length; i++) {
        var s = window.document.createElement('source');
        if (!sameOrigin(urls[i])) {
            video.crossOrigin = 'Anonymous';
        }
        s.src = urls[i];
        video.appendChild(s);
    }
    video.getData = function() { return video; };
    return video;
};
