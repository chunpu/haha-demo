var haha = require('haha');
var app = haha();

var getBlog = require('./lib/blog.js');
var api = require('./lib/api.js');

//var blogPath = process.env.blog || __dirname + '/blog';
//var blog = getBlog(blogPath);


app.enable('test');

app.configure('test', function(){

    app.set('blogpath', '/root/blog');

    var blog = getBlog(app.get('blogpath'));
    app.set('blog', blog);


    app.get('/', function(req, res) {
      var fs = require('fs');
      var index = fs.readFileSync(__dirname+'/static'+'/index.html')+'';
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(index);
    })

    app.use(haha.static(__dirname + '/static'));

    api(app);

    app.listen(88);
});
