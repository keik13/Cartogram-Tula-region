function createBarchart(htmlClass, data, actionOnClick) {
  var margin = {
      top: 20,
      right: 50,
      bottom: 30,
      left: 200
    },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
  
  var y = d3.scale.ordinal()
    .rangeRoundBands([0, height], .1);

  var x = d3.scale.linear()
    .range([0, width]);

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("top");

  var svg = d3.select(htmlClass).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .on("click", function() {
      if (actionOnClick) actionOnClick();
    })
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  y.domain(data.map(function(d) {
    return d.y;
  }));
  x.domain([0, d3.max(data, function(d) {
    return d.x;
  })]);

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

  svg.append("g")
    .attr("class", "x axis")
    .call(xAxis)
    .append("text")
    .attr("x", width)
    .attr("dx", ".71em")
    .text("Руб.")
    .style("text-anchor", "start");

  svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("y", function(d) {
      return y(d.y);
    })
    .attr("width", function(d) {
      return x(d.x);
    })
    .attr("height", y.rangeBand());
}