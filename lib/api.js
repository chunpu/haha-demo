module.exports = function(app) {

var blog = app.get('blog');


var blogs_t = Object.keys(blog);

blogs_t.sort(function(a, b){return blog[b].date - blog[a].date});


//console.log(blog);

app.get('/api/title', function(req, res) {

  var result = [];
  for (var i = 0; i < blogs_t.length; i++) {
    result.push(blog[blogs_t[i]].title);
  }
  res.jsonp(result);
})

app.get('/api/all', function(req, res) {
  
  var result = [];
  var sort = req.query.sort || 'time';
  var order = Object.keys(blog);
  if (!sort in blog[order[0]]) {
    sort = 'time';
  }
  order.sort(function(a, b) {
    
    return blog[b].date - blog[a].date;
  });
  console.log(order);
  for (var i = 0, one; one = blog[order[i]]; i++) {
    var obj = {
      title: one.title,
      date: one.date,
      relative: one.relative
    };
    result.push(obj);
  }
  res.jsonp(result);
})

app.get('/api/blog/*', function(req, res) {
  var one = req.params[0];
  res.jsonp(blog[one]);
});

app.get('/api/page/:page', function(req, res) {
  var number = req.query.number || 10;
  var page = req.params.page;
  var result = [];
  var start = (page - 1) * number;
  if ((start + number) > blogs_t.length) {
    start = 0; 
    number = 10;
  }
  for (var i = start, one; one = blogs_t[i], i < (start + number); i++) {
    result.push(blog[blogs_t[i]]);
  }
  res.jsonp(result);
})

}
