 function createTulaMap(htmlClass, debtData, map) {
  var debtById = {};
  var debtArr = [];
  debtData.forEach(function(item) {
   debtById[item.OSM_ID] = item["Задолженность, руб"];
   debtArr.push(item["Задолженность, руб"]);
  });

  var color_domain = [0, 1000000, 2200000, 3300000, 4400000];
  var ext_color_domain = [0, 1000000, 2200000, 3300000, 4400000];
  var legend_labels = ["< 1000000", "1000000+", "2200000+", "3300000+", "4400000+"];
  var color = d3.scale.threshold()
   .domain(color_domain)
   .range(['rgb(242,240,247)', 'rgb(203,201,226)', 'rgb(158,154,200)', 'rgb(117,107,177)', 'rgb(84,39,143)']);

  var div = d3.select("body").append("div")
   .attr("class", "tooltip")
   .style("opacity", 0);

  var svg = d3.select(htmlClass).append("svg")
   .attr("width", '100%')
   .attr("height", '100%')
   .attr("class", "tulaMap");

  var tula = topojson.feature(map, map.objects.tula2014s);

  var projection = d3.geo
   .mercator()
   .scale(13000)
   .center([37.44, 53.9])
   .translate([window.innerWidth / 2, window.innerHeight / 2]);

  var path = d3.geo.path()
   .projection(projection);

  //рисуем карту
  //добавим заливку и поведение на мышь
  svg.append("g")
   .attr("class", "region")
   .selectAll("path")
   //.data(topojson.object(map, map.objects.tula2014s).geometries)
   .data(topojson.feature(map, map.objects.tula2014s).features) //<-- in case topojson.v1.js
   .enter().append("path")
   .attr("d", path)
   .style("fill", function(d) {
    return color(debtById[d.properties.OSM_ID]);
   })
   .style("opacity", 0.8)
   .on("mouseover", function(d) {
    d3.select(this).transition().duration(300).style("opacity", 1);

    div.transition().duration(300).style("opacity", 1);
    div.text(d.properties.NAME + " : " + debtById[d.properties.OSM_ID])
     .style("left", (d3.event.pageX) + "px")
     .style("top", (d3.event.pageY - 30) + "px");
   })
   .on("mouseout", function() {
    d3.select(this).transition().duration(300).style("opacity", 0.8);
    div.transition().duration(300)
     .style("opacity", 0);
   })
   .on("click", function(d) {
    if (debtDetailCsv(d.properties.NAME)) {
     d3.select("#container1").transition().duration(1250).style("opacity", 0)
      .style("display", "none");
    }
    else {
     d3.select(this).transition().duration(300).style("opacity", 1);
     div.transition().duration(300).style("opacity", 1);
     div.text("По данному МО отсутсвует информация")
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY - 30) + "px");
    }
   });
  //нарисовал границы районов    
  var su = svg.append("path")
   .datum(topojson.mesh(map, map.objects.tula2014s, function(a, b) {
    return a !== b;
   }))
   .attr("d", path)
   .attr("class", "subunit-boundary")
   .style("stroke-opacity", "0.0");

  su.transition().duration(1250).style("stroke-opacity", "1");

  //добавил названия районов
  svg.selectAll(".subunit-label")
   .data(topojson.feature(map, map.objects.tula2014s).features)
   .enter().append("text")
   .attr("class", function(d) {
    return "subunit-label" + d.properties.ADMIN_LVL;
   })
   .attr("transform", function(d) {
    return "translate(" + path.centroid(d) + ")";
   })
   .attr("dy", ".35em")
   .text(function(d) {
    return d.properties.NAME;
   });

  //добаввим легенду
  var legend = svg.selectAll("g.legend")
   .data(ext_color_domain)
   .enter().append("g")
   .attr("class", "legend");

  var ls_w = 20,
   ls_h = 20;

  legend.append("rect")
   .attr("x", 20)
   .attr("y", function(d, i) {
    return window.innerHeight - (i * ls_h) - 2 * ls_h;
   })
   .attr("width", ls_w)
   .attr("height", ls_h)
   .style("fill", function(d, i) {
    return color(d);
   })
   .style("opacity", 0.8);

  legend.append("text")
   .attr("x", 50)
   .attr("y", function(d, i) {
    return window.innerHeight - (i * ls_h) - ls_h - 4;
   })
   .text(function(d, i) {
    return legend_labels[i];
   });
 }