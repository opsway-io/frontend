const puppeteer = require('puppeteer');
const fs = require('fs');

const html = `
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
</head>
<body>
  <div id="chart" style="width: 800px; height: 400px; background: white;"></div>
  <script>
    const expectedData = [];
    const actualData = [];
    const upperData = [];
    const lowerData = [];
    const anomalyData = [];
    
    for (let i = 0; i < 96; i++) {
      const ts = i * 1000;
      expectedData.push({ x: ts, y: 150 });
      actualData.push({ x: ts, y: i < 72 ? 160 : null });
      upperData.push({ x: ts, y: 180 });
      lowerData.push({ x: ts, y: 120 });
      anomalyData.push({ x: ts, y: i === 36 ? 300 : null });
    }
    
    var options = {
      series: [
        { name: "Expected", type: "line", data: expectedData },
        { name: "Actual", type: "line", data: actualData },
        { name: "Upper", type: "line", data: upperData },
        { name: "Lower", type: "line", data: lowerData },
        { name: "Anomaly", type: "scatter", data: anomalyData }
      ],
      chart: { type: 'line', height: 400, animations: { enabled: false } },
      xaxis: { type: "datetime" },
      markers: {
        size: 0,
        hover: { size: 4 },
        colors: ["#666", "#00f", "#999", "#999", "#f00"]
      },
      tooltip: { shared: true, intersect: false }
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
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'chart.png' });
  await browser.close();
})();
