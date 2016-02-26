function createTable(htmlID, headers, info) {
  var table = d3.select(htmlID).append("table");
  var thead = table.append("thead");
  var tbody = table.append("tbody");

  thead.append("tr").selectAll("th").data(headers).enter().append("th").text(function(header) {
    return header;
  });

  var rows = tbody.selectAll("tr").data(info).enter().append("tr");

  var cells = rows.selectAll("td").data(function(row) {
    return headers.map(function(header) {
      return {
        value: row[header]
      };
    });
  }).enter().append("td").text(function(d) {
    return d.value;
  });

  return table;
}

function createVertiсalHeaderTable(htmlID, info) {
  var table = d3.select(htmlID).append("table");

  var rows = table.selectAll("tr").data(info).enter().append("tr");

  var cells = rows.selectAll("td").data(function(row) {
    var cellArr = [];
    for (var key in row) {
      cellArr.push(key);
      cellArr.push(row[key]);
    }
    return cellArr;
  }).enter().append("td").text(function(d) {
    return d
  });

  return table;
}
