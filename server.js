const Nightmare = require('nightmare')


const nightmare = Nightmare();

nightmare.goto('http://google.com')
  .evaluate(() => {
    return document.title;
  })
  .end()
  .then((title) => {
    console.log(title);
  })