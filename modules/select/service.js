const fs = require('fs')

module.exports.page = () => {
  const ballDirs = fs.readdirSync(__dirname + '/../../app/components/balls', { withFileTypes: true })
    .filter((item) => item.isDirectory())
    .map((item) => item.name);

  replaceScript = '';
  const balls = {};

  for (let ballDir of ballDirs) {
    balls[ballDir] = JSON.parse(fs.readFileSync(`${__dirname}/../../app/components/balls/${ballDir}/intro.json`, { encoding: 'utf-8' }));
  }

  let template = fs.readFileSync(__dirname + '/page.html', { encoding: 'utf-8' });

  return template.replace('<bxb-script></bxb-script>', `
    <script>
      window.BALLS = ${JSON.stringify(balls)} 
    </script>
  `)
}