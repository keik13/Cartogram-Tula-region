//загружаем данные для карты и по задолженностям по МО
queue()
  .defer(d3.csv, "resources/csv/DebtOnMo.csv")
  .defer(d3.json, "resources/simplified/tulatopos1.json")
  .await(readyDebtMo);

function readyDebtMo(error, debtMoRawData, map) {
  if (error) console.log("Произошло что-то плохое при загрузке csv -> " + error);

  var debtMoData = parseDebtMoRawDataTable(debtMoRawData);

  createTulaMap("#container1 .map", debtMoData, map);
  createBarchart("#container1 .barchart", parseDebtMoRawDataBarchart(debtMoRawData), function() {
    //обработчик здесь не нужен
  });
  createVertiсalHeaderTable("#container1 .table", [{
    "Виды Услуг": "Электроэнергия"
  }, {
    "Дата": "c Июль 2015г. по Август 2015г"
  }]);
  createTable("#container1 .table", ["№", "Муниципальное образование", "Задолженность, руб",
    "Объем потребленной услуги, в натур. выражении"
  ], debtMoData);

}

function debtDetailCsv(moName) {
  var byMo = {
    "городской округ Донской": "Don",
    "городской округ Тула": "Tula",
    "городской округ Новомосковск": "NewMsk",
    "Узловский район": "Uzl"
  };
  var moCode = byMo[moName];
  if (moCode) {
    queue()
      .defer(d3.csv, "resources/csv/DebtDetail" + moCode + ".csv")
      .defer(d3.json, "resources/csv/DebtDetail" + moCode + ".json")
      .await(readyDebtDetail);
    return true;
  }

  return false;
}

function readyDebtDetail(error, debtDetailRawData, debtDetailHeader) {
  if (error) console.log("Произошло что-то плохое при загрузке csv -> " + error)

  createBarchart("#container2 .barchart", parseDebtDetailRawDataBarchart(debtDetailRawData), function() {
    //если нужно задать поведение на клик по свг барчарта
  });
  createVertiсalHeaderTable("#container2 .table", debtDetailHeader)

  createTable("#container2 .table", ["№", "Адрес дома", "Собственник", "Задолженность, руб",
    "Объем потребленной услуги, в натур. выражении"
  ], parseDebtDetailRawDataTable(debtDetailRawData));

  d3.select("button").style("display", "block").on("click", function() {
    d3.select("#container2 svg").remove();
    d3.selectAll("#container2 table").remove();


    d3.select(this).style("display", "none");
    d3.select("#container1").transition().duration(1250).style("opacity", 1)
      .style("display", "block");
  });
}

function parseDebtMoRawDataTable(debtMoRawData) {
  var dataClone = debtMoRawData.slice(0).sort(function(a, b) {
    return +b["Задолженность, руб"] - +a["Задолженность, руб"];
  });
  dataClone.forEach(function(d, i) {
    d["Задолженность, руб"] = +d["Задолженность, руб"];
    d["Объем потребленной услуги, в натур. выражении"] = +d["Объем потребленной услуги, в натур. выражении"];
    if (d["Муниципальное образование"] != "Всего") d["№"] = i;
  });
  return dataClone;
}

function parseDebtMoRawDataBarchart(debtMoRawData) {
  var dataClone = debtMoRawData.slice(0).sort(function(a, b) {
    return +b["Задолженность, руб"] - +a["Задолженность, руб"];
  });
  return dataClone.filter(function(d) {
    return d["Муниципальное образование"] != "Всего";
  }).map(function(d, i) {
    return {
      x: +d["Задолженность, руб"],
      y: d["Муниципальное образование"]
    };
  });
}

function parseDebtDetailRawDataBarchart(debtMoRawData) {
  var dataClone = debtMoRawData.slice(0).sort(function(a, b) {
    return +b["Входящее сальдо"] - +a["Входящее сальдо"];
  }).slice(0, 21);
  return dataClone.filter(function(d) {
    return d["Населенный пункт"] != "Всего";
  }).map(function(d, i) {
    return {
      x: +d["Входящее сальдо"],
      y: d["ФИО"]
    };
  });
}

function parseDebtDetailRawDataTable(debtDetailRawData) {
  var dataClone = debtDetailRawData.map(function(d, i) {
    return {
      "№": d["№"],
      "Адрес дома": d["Населенный пункт"] + d["Улица"] + d["Дом"] + d["Квартира"],
      "Собственник": d["ФИО"],
      "Задолженность, руб": +d["Входящее сальдо"],
      "Объем потребленной услуги, в натур. выражении": +d["Расход"]
    };
  }).sort(function(a, b) {
    return b["Задолженность, руб"] - a["Задолженность, руб"];
  })
  dataClone.forEach(function(d, i) {
    if (d["Адрес дома"] != "Всего") d["№"] = i;
  });
  return dataClone;
}
