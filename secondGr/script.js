let dataSet = [{
		img: "Общая неравномерная коррозия",
		vid: "Общая неравномерная коррозия",
		mk: "Визуально-измерительный контроль",
		ver: "95",
		rec: ""

	}, {
		img: "Общая неравномерная коррозия",
		vid: "Общая неравномерная коррозия",
		mk: "Ультразвуковая толщинометрия",
		ver: "95",
		rec: ""

	}, {
		img: "Общая неравномерная коррозия",
		vid: "Общая неравномерная коррозия",
		mk: "Ультразвуковая дефектоскопия",
		ver: "80",
		rec: ""

	}, {
		img: "Общая неравномерная коррозия",
		vid: "Общая неравномерная коррозия",
		mk: "Радиографический контроль",
		ver: "80",
		rec: ""

	}, {
		img: "Общая неравномерная коррозия",
		vid: "Общая неравномерная коррозия",
		mk: "Вихретоковый контроль",
		ver: "60",
		rec: ""

	}, {
		img: "Общая неравномерная коррозия",
		vid: "Общая неравномерная коррозия",
		mk: "Магнитный контроль",
		ver: "20",
		rec: ""

	}, {
		img: "Общая неравномерная коррозия",
		vid: "Общая неравномерная коррозия",
		mk: "Металлографические исследования",
		ver: "20",
		rec: ""

	}, {
		img: "Повышение прочностных характеристик",
		vid: "Повышение прочностных характеристик",
		mk: "Исследования механических свойств",
		ver: "80",
		rec: "",

	}, {
		img: "Повышение прочностных характеристик",
		vid: "Повышение прочностных характеристик",
		mk: "Коэрцитиметрия",
		ver: "40",
		rec: ""

	}, {
		img: "Повышение прочностных характеристик",
		vid: "Повышение прочностных характеристик",
		mk: "Металлографические исследования",
		ver: "40",
		rec: ""

	}, {
		img: "Повышение твердости",
		vid: "Повышение твердости",
		mk: "Исследования механических свойств",
		ver: "95",
		rec: ""

	}, {
		img: "Повышение твердости",
		vid: "Повышение твердости",
		mk: "Коэрцитиметрия",
		ver: "60",
		rec: ""

	}, {
		img: "Повышение твердости",
		vid: "Повышение твердости",
		mk: "Металлографические исследования",
		ver: "40",
		rec: ""

	}, {
		img: "Снижение пластичности",
		vid: "Снижение пластичности",
		mk: "Коэрцитиметрия",
		ver: "60",
		rec: ""

	}, {
		img: "Снижение пластичности",
		vid: "Снижение пластичности",
		mk: "Исследования механических свойств",
		ver: "60",
		rec: ""

	}, {
		img: "Снижение пластичности",
		vid: "Снижение пластичности",
		mk: "Металлографические исследования",
		ver: "60",
		rec: ""

	}, {
		img: "Снижение пластичности",
		vid: "Снижение пластичности",
		mk: "Акустико-эмиссионный контроль",
		ver: "60",
		rec: ""

	}, {
		img: "Снижение пластичности",
		vid: "Снижение пластичности",
		mk: "Магнитный контроль",
		ver: "40",
		rec: ""

	}, {
		img: "Снижение пластичности",
		vid: "Снижение пластичности",
		mk: "Вихретоковый контроль",
		ver: "40",
		rec: ""

	}, {
		img: "Снижение пластичности",
		vid: "Снижение пластичности",
		mk: "Визуально-измерительный контроль",
		ver: "20",
		rec: ""

	}

];




// Подготовка графика

var svg = d3.select("svg"),
	margin = {
		top: 20,
		right: 20,
		bottom: 30,
		left: 40
	},
	width = +svg.attr("width") - margin.left - margin.right,
	height = +svg.attr("height") - margin.top - margin.bottom;

keys = [],

	
	keys = Array.from(new Set(dataSet.map(k => k.mk)))



// Данные

const defaulValues = {}

dataSet.forEach(item => {
	defaulValues[item.mk] = "1";
});


let data = Object.entries(dataSet.reduce((a, {
	vid,
	mk,
	ver
}) => {
	a[vid] = a[vid] || {
		...defaulValues
	};
	a[vid][mk] = ver;
	return a;
	
}, {})).map(([k, v]) => ({
	State: k,
	...v
}));

data.columns = keys;
data.y = "Выявляемость";

groupKey = "State"

console.log(data)

formatValue = x => isNaN(x) ? "N/A" : x.toLocaleString("en")

// Шкалы

x0 = d3.scaleBand()
	.domain(data.map(d => d[groupKey]))
	.rangeRound([margin.left, width - margin.right])
	.paddingInner(0.1)

	x1 = d3.scaleBand()
    .domain(keys)
    .rangeRound([0, x0.bandwidth()])
	.padding(0.05)
	
	y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d3.max(keys, key => d[key]))]).nice()
    .rangeRound([height - margin.bottom, margin.top])

// Оси

xAxis = g => g
	.attr("transform", `translate(0,${height - margin.bottom})`)
	.call(d3.axisBottom(x0).tickSizeOuter(0))
	.call(g => g.select(".domain").remove())

yAxis = g => g
	.attr("transform", `translate(${margin.left},0)`)
	.call(d3.axisLeft(y).ticks(null, "s"))
	.call(g => g.select(".domain").remove())
	.call(g => g.select(".tick:last-of-type text").clone()
		.attr("x", 3)
		.attr("text-anchor", "start")
		.attr("font-weight", "bold")
		.text(data.y))

// Цвета

color = d3.scaleOrdinal()
	.range(["#2ecc71","#ff7f0e","#3E5F8A","#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#2e86de","#17becf"])
	

// Легенда 

legend = svg => {
	const g = svg
		.attr("transform", `translate(${width},0)`)
		.attr("text-anchor", "end")
		.attr("font-family", "sans-serif")
		.attr("font-size", 10)
		.selectAll("g")
		.data(color.domain().slice())
		.join("g")
		.attr("transform", (d, i) => `translate(0,${i * 20})`);

	g.append("rect")
		.attr("x", -19)
		.attr("width", 19)
		.attr("height", 19)
		.attr("fill", color);

	g.append("text")
		.attr("x", -24)
		.attr("y", 9.5)
		.attr("dy", "0.35em")
		.text(d => d);
}


// Рисуем график D3



svg.append("g")
	.selectAll("g")
	.data(data)
	.join("g")
	.attr("transform", d => `translate(${x0(d[groupKey])},0)`)
	.selectAll("rect")
	.data(d => keys.map(key => ({
		key,
		value: d[key]
	})))
	.join("rect")
	.attr("x", d => x1(d.key))
	.attr("y", d => y(d.value))
	.attr("width", x1.bandwidth())
	.attr("height", d => y(0) - y(d.value))
	.attr("fill", d => color(d.key))
	.append("title")
	.text(d => `${d.key} : ${formatValue(d.value)}`);

svg.append("g")
	.call(xAxis);

svg.append("g")
	.call(yAxis);

svg.append("g")
	.call(legend);

