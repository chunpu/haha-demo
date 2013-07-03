var fs = require('fs');
var path = require('path');

module.exports = genBlogInfoSync;

function genBlogInfoSync(pathname) {

  blogs = listFileSync(pathname);

  var blogHash = {};
  
  blogs.forEach(function(blog) {
    var oneHash = {};
    var content = fs.readFileSync(blog)+'';
    content = content.trim();
    var preInfo = content.match(/^(?:\w+\s*:\s*[^\n]+\n)+/);
    if (preInfo !== null) {
      preInfo = preInfo[0];
      var arr = preInfo.split('\n');
      arr.forEach(function(info) {
        if (!info) {
          return;
        }
        var test = info.match(/(\w+)\s*:\s*([^\n]+)/);
        if (test !== null && test.length >= 3) {
          oneHash[test[1]] = test[2];
        } else {
          //console.log(info.length);
        }
      });

    } else {
      //console.log(content);
    }
    if ('date' in oneHash) {
      try {
        oneHash.date = +new Date(oneHash.date);
      } catch(e) {
        oneHash.date = +new Date();
      }
    } else {
      oneHash.date = +new Date();
    }

    oneHash.relative = path.relative(pathname, blog);
    
    oneHash.title = oneHash.title || oneHash.relative;

    oneHash.absolute = blog;

    oneHash.content = content.replace(/^(?:\w+\s*:\s*[^\n]+\n)+/, '');

    if (!oneHash.ignore) {
        blogHash[oneHash.relative] = oneHash;
    }
  });

  return blogHash;

}


function listFileSync(pathname) {

  var p = pathname;
  var result = [];
  
  var arr = fs.readdirSync(p);
  if (arr.length === 0) {
    return result;
  }
  for (var i = 0 ; i < arr.length; i++) {
    var file = path.join(p, arr[i]);
    var stat = fs.statSync(file);
    if (stat.isFile()) {
      if (path.extname(file) === '.md') {
        result.push(file);
      }
    } else {
      var _arr = arguments.callee(file);
      result = result.concat(_arr);
    }
  }
  
  return result;

}
