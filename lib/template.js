module.exports = {
  html: function(title, list, body, control) {
    return `
    <!DOCTYPE html>
    <html lang="en" dir="ltr">
      <head>
        <meta charset="utf-8">
        <title>Web2 - ${title} Page</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1><a href="/">Web</a></h1>
        ${list}
        ${control}
        ${body}
      </body>
    </html>
    `;
  },
  list: function(topics) {
    var list = '<ul>';
    var i = 0;
    while (i < topics.length) {
      list = list + `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`
      i = i + 1;
    }
    list = list + '</ul>';
    return list;
  }
}
