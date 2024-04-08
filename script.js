const EpisodeData = getData();

const rootContainer = d3.select("#root");

rootContainer
    .append('div')
    .attr('id', 'tooltip');

rootContainer
  .append("div")
  .attr("id", "title")
  .append("h1")
  .text("FreeCodeCamp D3 Bar Chart")

let width = document.getElementById("root").scrollWidth;
let height = window.innerHeight * 0.7;

rootContainer
  .append("div")
  .attr("id", "chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

async function getData() {
  await fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
  )
    .then((res) => res.json())
    .then((json) => {
      displayBarChart(json.data);
    });
}

function displayBarChart(data) {
  console.log(data);
  const svg = d3.select("svg");
  const x = d3.scaleUtc().domain([new Date(data[0][0]), new Date(data[274][0])]).range([0, width - 100]);
  x.ticks(d3.utcYear.every(10));
  const y = d3.scaleLinear().domain([0, 20000]).range([height, 0]);

  svg
    .append("g")
    .attr("transform", `translate(50,${height - 50})`)
    .attr("id", "x-axis")
    .call(d3.axisBottom(x));
  svg
    .append("g")
    .attr("transform", `translate(50,-50)`)
    .attr("id", "y-axis")
    .call(d3.axisLeft(y));

  svg
    .selectAll('rect')
    .data(data)
    .join('rect')
        .attr("x", d => x(new Date(d[0])) + 50)
        .attr("y", d => y(d[1]) - 50)
        .attr('width', (width - 100) / data.length)
        .attr("height", d => height - y(d[1]))
        .attr("fill", "#69b3a2")
        .attr("class", "bar")
        .attr('data-date', d => d[0])
        .attr('data-gdp', d => d[1]);

    d3.selectAll('.bar').on('mouseover', (e) => displayDetails(e))
        .on('mouseout', (e) => hideDetails(e));
}

function displayDetails(e) {
    const date = e.target.__data__[0];
    const gdp = e.target.__data__[1];
    console.log(`${date}: ${gdp}`);
    const tooltip = document.getElementById('tooltip');
    d3.select('#tooltip').attr('data-date', date).attr('data-gdp', gdp);
    tooltip.innerText = `Date: ${date}\n GDP: ${gdp}`;
    tooltip.style.display = 'block';
}

function hideDetails(e) {
    const tooltip = document.getElementById('tooltip');
    tooltip.style.display = 'none';
}