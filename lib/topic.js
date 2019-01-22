var connection = require('./db.js');
var template = require('./template.js');
var url = require('url');
var qs = require('querystring');
var sanitizeHtml = require('sanitize-html');

exports.home = function(request, response) {
  connection.query(`SELECT * FROM topic`, function(error, topics) {
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(topics);
    var html = template.html(title, list,
      `<h2>${title}</h2>${description}`,
      `
      <div class="col-md-10"></div>
      <div class="col-md-1">
        <a href="/create" class="btn btn-primary">create</a>
      </div>
      `);
    response.writeHead(200);
    response.end(html);
  });
}

exports.page = function(request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  connection.query(`SELECT * FROM topic`, function(error, topics) {
    if (error) {
      throw error;
    }
    connection.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`, [queryData.id], function(error2, topic) {
      if (error) {
        throw error2;
      }
      var title = topic[0].title;
      var description = topic[0].description;
      var list = template.list(topics);
      var html = template.html(title, list,
        `<h2>${sanitizeHtml(title)}</h2>
        ${sanitizeHtml(description)}
        <p>by ${sanitizeHtml(topic[0].name)}</p>
        `,
        `
        <div class="col-md-9"></div>
        <div class="col-md-1">
          <a class="btn btn-primary" href="/create" >create</a>
        </div>
        <div class="col-md-1">
          <a class="btn btn-primary" href="/update?id=${queryData.id}">update</a>
        </div>
        <div class="col-md-1">
          <form action="delete_process" method="POST">
            <input type="hidden" name="id" value="${queryData.id}">
            <input class="btn btn-danger" type="submit" value="delete">
          </form>
        </div>
        `
      );
      response.writeHead(200);
      response.end(html);
    });
  });
}

exports.create = function(request, response) {
  connection.query(`SELECT * FROM topic`, function(error, topics) {
    connection.query(`SELECT * FROM author`, function(error, authors) {
      var title = 'Create';
      var list = template.list(topics);
      var html = template.html(sanitizeHtml(title), list,
        `<form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="제목"></p>
          <p>
            <textarea name="description" placeholder="내용"></textarea>
          </p>
          <p>
            ${template.authorSelect(authors)}
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
        `,
        `
        <div class="col-md-9"></div>
        <div class="col-md-1">
          <a class="btn btn-primary" href="/create">create</a>
        </div>
        <div class="col-md-1">
          <a class="btn btn-primary" href="/update?id=${title}">update</a>
        </div>
        `
        );
      response.writeHead(200);
      response.end(html);
    });
  });
}

exports.create_process = function(request, response) {
  var body = '';
  request.on('data', function(data) {
    body = body + data;
  });
  request.on('end', function() {
    var post = qs.parse(body);
    connection.query(`INSERT INTO topic (title,description,created,author_id)
        VALUES(?,?,NOW(),?)`, [post.title, post.description, post.author],
      function(error, result) {
        if (error) {
          throw error;
        }
        response.writeHead(302, {
          Location: `/?id=${result.insertId}`
        });
        response.end();
      });
  });
}

exports.update = function(request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  connection.query(`SELECT * FROM topic`, function(error, topics) {
    if (error) {
      throw error;
    }
    connection.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], function(error2, topic) {
      if (error2) {
        throw error2;
      }
      connection.query(`SELECT * FROM author`, function(error3, authors) {
        var list = template.list(topics);
        var html = template.html(sanitizeHtml(topic[0].title), list,
          `<form action="/update_process" method="post">
            <input type="hidden" name="id" value="${topic[0].id}">
            <p><input type="text" name="title" placeholder="제목" value="${sanitizeHtml(topic[0].title)}"></p>
            <p>
              <textarea class="form-control" rows="10" name="description" placeholder="내용">${sanitizeHtml(topic[0].description)}</textarea>
            </p>
            <p>
              ${template.authorSelect(authors, topic[0].author_id)}
            </p>
            <p>
              <input type="submit">
            </p>
          </form>`,
          `
          <div class="col-md-10"></div>
          <div class="col-md-1">
            <a class="btn btn-primary" href="/create">create</a>
          </div>
          <div class="col-md-1">
            <a class="btn btn-primary" href="/update?id=${topic[0].id}">update</a>
          </div>
          `
        );
        response.writeHead(200);
        response.end(html);
      });
    });
  });
}

exports.update_process = function(request, response) {
  var body = '';
  request.on('data', function(data) {
    body += data;
  });
  request.on('end', function() {
    var post = qs.parse(body);
    connection.query('UPDATE topic SET title=?, description=?, author_id=? WHERE id=?', [post.title, post.description, post.author, post.id], function(error, result) {
      response.writeHead(302, {
        Location: `/?id=${post.id}`
      });
      response.end();
    });
  });
}

exports.delete_process = function(request, response) {
  var body = '';
  request.on('data', function(data) {
    body += data;
  });
  request.on('end', function() {
    var post = qs.parse(body);
    var id = post.id;
    connection.query('DELETE FROM topic WHERE id=?', [post.id], function(error, result) {
      if (error) {
        throw error;
      }
      response.writeHead(302, {
        Location: `/`
      });
      response.end();
    });
  });
}
