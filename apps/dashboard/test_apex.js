const puppeteer = require('puppeteer');
const fs = require('fs');

const html = `
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
</head>
<body>
  <div id="chart"></div>
  <script>
    var options = {
      series: [
        { name: 'Actual', type: 'line', data: [{x: 1000, y: 150}, {x: 2000, y: 160}] },
        { name: 'Anomaly', type: 'line', data: [{x: 1000, y: null}, {x: 2000, y: null}] },
      ],
      chart: { type: 'line', height: 350 },
      stroke: { curve: 'smooth', width: [3, 2] },
      xaxis: { type: 'datetime' },
      tooltip: {
        shared: true,
        intersect: false,
      }
    };
    var chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();
  </script>
</body>
</html>
`;
fs.writeFileSync('test_apex.html', html);

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto('file://' + __dirname + '/test_apex.html');
  await page.waitForSelector('.apexcharts-canvas');
  const rect = await page.evaluate(() => {
    const el = document.querySelector('.apexcharts-canvas');
    const {x, y, width, height} = el.getBoundingClientRect();
    return {x, y, width, height};
  });
  
  // Try to hover
  await page.mouse.move(rect.x + rect.width * 0.5, rect.y + rect.height * 0.5);
  await new Promise(r => setTimeout(r, 500));
  const t2 = await page.evaluate(() => {
    const tooltip = document.querySelector('.apexcharts-tooltip');
    return tooltip ? tooltip.innerText : "NULL";
  });
  console.log("TOOLTIP:", t2);
  
  await browser.close();
})();
