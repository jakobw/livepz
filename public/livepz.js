window.onload = function () {
  var MARGIN_LEFT = 50,
      MARGIN_TOP = 50,
      WIDTH = 1024 - MARGIN_LEFT,
      HEIGHT = 800 - MARGIN_TOP,

      // initialize the svg element
      svg = d3.select('#chart').append('svg')
          .attr('width', WIDTH + MARGIN_LEFT)
          .attr('height', HEIGHT + MARGIN_TOP)
        .append('g')
          .attr("transform", "translate(" + MARGIN_LEFT + "," + MARGIN_TOP + ")"),

      // initialize the line chart
      x = d3.scale.linear()
        .domain([0, values.length])
        .range([0, WIDTH]),
      y = d3.scale.linear()
        .domain([d3.min(values), d3.max(values)])
        .range([HEIGHT, 0]),
      line = d3.svg.line()
        .x(function (d, i) {
          return x(i);
        })
        .y(function (d, i) {
          return y(d);
        }),

      yAchsis = d3.svg.axis()
        .scale(y)
        .orient('left');

  svg.append('g')
    .attr('class', 'y axis')
    .call(yAchsis);

  // add the line
  svg.append('svg:path')
    .attr('d', line(values));

  // mouse effects
  d3.select('#chart')
  .on('mousemove', function (d, i) {
    var pos = d3.mouse(this),
        xVal = Math.floor(x.invert(pos[0] - MARGIN_LEFT)), // why does invert not subtract the margin? :(
        opponent = history[xVal][1],
        v = history[xVal][0];

    d3.select('#line').style('left', pos[0] + 'px');
    d3.select('#info')
      .text(opponent + ': ' + (v > 0 ? '+' : '') + v)
      .style('left', pos[0] + 'px')
      .style('top', pos[1] + 'px');
  });

  // add dots
  history.forEach(function (d, i) {
    svg.append('circle')
      .attr('cx', x(i))
      .attr('cy', y(values[i]))
      .attr('r', 2)
      .attr('fill', '#06a');
  });
};
