var sanitizeHtml = require('sanitize-html');

module.exports = {
  html: function(title, list, body, control) {
    return `
    <!DOCTYPE html>
    <html lang="en" dir="ltr">
      <head>
        <meta charset="utf-8">
        <title>Web2 - ${title} Page</title>
        <meta charset="utf-8">
        <link rel="stylesheet" type="text/css" href="./style.css" />
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
      </head>
      <body>
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <p class="text-center">
              <h1><a href="/">Web</a></h1>
            </p>
          </div>
        </div>
        
        <div class="row">
          <div class="col-md-11"></div>
          <div class="col-md-1">
            <a class="btn btn-success" href="/author">저자</a>        
          </div>
        </div>

        <div class="row">
          <nav>
            <div class="col-md-2">
              ${list}
            </div>
          </nav>
          <div class="col-md-10">${body}</div>
        </div>
        
        <div class="row">
        ${control}
        </div>
        
        
        <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.6/umd/popper.min.js" integrity="sha384-wHAiFfRlMFy6i5SRaxvfOCifBUQy1xHdJ/yoi7FRNXMRBu5WHdZYu1hA6ZOblgut" crossorigin="anonymous"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/js/bootstrap.min.js" integrity="sha384-B0UglyR+jN6CkvvICOB2joaf5I4l3gm9GU6Hc1og6Ls7i6U/mkkaduKaBhlAXv9k" crossorigin="anonymous"></script>
        </div>      
      </body>
    </html>
    `;
  },
  list: function(topics) {
    var list = `<ul>`;
    var i = 0;
    while (i < topics.length) {
      list = list + `<li>
      <a href="/?id=${topics[i].id}">${sanitizeHtml(topics[i].title)}</a>
      </li>`
      i = i + 1;
    }
    list = list + '</ul>';
    return list;
  },
  authorSelect: function(authors, author_id) {
    var tag = '';
    var i = 0;
    while (i < authors.length) {
      var selected = '';
      if (authors[i].id === author_id) {
        selected = ' selected';
      }
      tag += `<option value="${authors[i].id}"${selected}>${sanitizeHtml(authors[i].name)}</option>`;
      i++;
    }
    return `
    <select name="author">
      ${tag}
    </select>
    `;
  },
  authorTable: function(authors){
    var tag = `
      <table class="table text-center">
        <tr>
          <th>이름</th>
          <th>직무</th>
          <th>수정</th>
          <th>삭제</th>
        </tr>
    `;
    var i = 0;
    while (i < authors.length) {
      tag += `
        <tr>
          <td>
            ${sanitizeHtml(authors[i].name)}
          </td>
          <td>
            ${sanitizeHtml(authors[i].profile)}
          </td>
          <td>
            <a class="btn btn-primary" href="/author/update?id=${authors[i].id}">update</a>
          </td>
          <td>
            <form action="/author/delete_process" method="POST">
              <input type="hidden" name="id" value="${authors[i].id}">
              <input class="btn btn-danger" type="submit" value="delete">
            </form>
          </td>
        <tr>
      `
      i++;
    }
    tag += `</table>`
    return tag;
  }
}
