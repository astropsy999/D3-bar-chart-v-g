window.onload = function () {
    const dataFill = function () {
        let data = [];
        // const img_url = 'https://giapdc.ru/forms/mpmk/img/';
        const img_ext = '.jpg';
        const fillClassObj = () => {};

        // Формируем запрос
        const zapros = () => {
            $.ajax({
                url: 'https://service.giapdc.ru/index.php/InfoController/getSiteInfo?key=1316c5212b3a76df53b447f0332280bd&mode=1',
                method: 'post',
                dataType: 'json',
                success: function (data) {
                    for (let i = 0; i < data['mat'].length; i++) {
                        let option = "<option " + "value='" + data['mat'][i]['m'] + "' data-typeM='" + data['mat'][i]['tm'] + "'>" + data['mat'][i]['m'] + "</option>";
                        $("#materialList").append(option);
                    }
                    $("#materialList").selectpicker('refresh');

                    for (let i = 0; i < data['tM'].length; i++) {
                        let option = "<option " + "value='" + data['tM'][i]['key'] + "'>" + data['tM'][i]['label'] + "</option>";
                        $("#materialTypeList").append(option);
                    }
                    $("#materialTypeList").selectpicker('refresh');

                    for (let i = 0; i < data['pS'].length; i++) {
                        let option = "<option " + "value='" + data['pS'][i]['key'] + "'>" + data['pS'][i]['label'] + "</option>";
                        $("#protectSredaList").append(option);
                    }
                    $("#protectSredaList").selectpicker('refresh');

                    for (let i = 0; i < data['ogrS'].length; i++) {
                        let option = "<option " + "value='" + data['ogrS'][i]['key'] + "'>" + data['ogrS'][i]['label'] + "</option>";
                        $("#agrCompList").append(option);
                    }
                    $("#agrCompList").selectpicker('refresh');

                    for (let i = 0; i < data['dopF'].length; i++) {
                        let option = "<option " + "value='" + data['dopF'][i]['key'] + "'>" + data['dopF'][i]['label'] + "</option>";
                        $("#dopFactList").append(option);
                    }
                    $("#dopFactList").selectpicker('refresh');

                    for (let i = 0; i < data['sre'].length; i++) {
                        let option = "<option " + "value='" + data['sre'][i]['key'] + "'>" + data['sre'][i]['label'] + "</option>";
                        $("#sredaList").append(option);
                    }
                    $("#sredaList").selectpicker('refresh');

                    for (let i = 0; i < data['agrList'].length; i++) {
                        let option = "<option " + "value='" + data['agrList'][i]['key'] + "'>" + data['agrList'][i]['label'] + "</option>";
                        $("#agrList").append(option);
                    }
                    $("#agrList").selectpicker('refresh');
                }
            });
        }

        const groupTable = ($rows) => {
            var i, count = 1;
            var vids = $rows.find('td:eq(1)');
            var pics = $rows.find('td:eq(0)');
            var vid = $(vids[0]);
            var pic = $(pics[0]);
            for (i = 1; i < vids.length; i++) {
                if (vid.text() == $(vids[i]).text()) {
                    count++;
                    $(vids[i]).addClass('deleted');
                    $(pics[i]).addClass('deleted');
                } else {
                    if (count > 1) {
                        vid.attr('data-rowspan', count);
                        pic.attr('data-rowspan', count);
                    }
                    count = 1;
                    vid = $(vids[i]);
                    pic = $(pics[i]);
                }
            }
            if (count > 1) {
                vid.attr('data-rowspan', count);
                pic.attr('data-rowspan', count);
            }
        }

        // Проверка и передача данных

        const events = () => {
            $('.chart').css('display', 'none')
            $('.checkboxes').css('display', 'none')

            $('#materialList').on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
                let val = $(this).val();

                if ($(this).attr('disabled') != true) {
                    if (val == 'Ничего не выбрано') {
                        let typM = $("#materialList option[value='" + previousValue + "']").data('typem');
                        $("#materialTypeList option.tizemec").remove();
                        $("#materialTypeList").attr('disabled', false);
                        $("#materialTypeList").val('Ничего не выбрано');
                    } else {
                        let typM = $("#materialList option[value='" + val + "']").data('typem');
                        let option = "<option " + "value='" + typM + "' class='tizemec'>" + typM + "</option>";
                        $("#materialTypeList").append(option);
                        $("#materialTypeList").attr('disabled', true);
                        $("#materialTypeList").val(typM);
                    }
                    $("#materialTypeList").selectpicker('refresh');
                }
            });
            $('#materialTypeList').on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
                let val = $(this).val();
                if ($(this).attr('disabled') != true) {
                    if (val == 'Ничего не выбрано') {
                        $("#materialList").attr('disabled', false);
                    } else {
                        $("#materialList").attr('disabled', true);
                        $("#materialList").val('Ничего не выбрано');
                    }
                    $("#materialList").selectpicker('refresh');
                }
            });
            $('#sredaList').on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
                let val = $(this).val();
                $('#sredaList option:selected').prependTo('#sredaList');
                $("#sredaList").selectpicker('refresh');
                if (val == null) {
                    //тут пусто
                    $('#sredaList').find('option').attr('disabled', false);
                    $("#sredaList").selectpicker('refresh');
                } else if (val.length == 1) {
                    if (val[0] == 'Атмосферный воздух') {
                        $('#sredaList').find('option[value!="Атмосферный воздух"]').attr('disabled', true);
                    } else {
                        $('#sredaList').find('option[value="Атмосферный воздух"]').attr('disabled', true);
                    }
                    $("#sredaList").selectpicker('refresh');
                }

            });

            $('#agrList').on('changed.bs.select', function () {

                $('#agrList option:selected').prependTo('#agrList');
                $("#agrList").selectpicker('refresh');

            });

            $('#dopFactList').on('changed.bs.select', function () {
                $('#dopFactList option:selected').prependTo('#dopFactList');
                $("#dopFactList").selectpicker('refresh');
            });

            $('#getResult').on('click', function () {
                $(".my-error-message").css("display", "none");
                $(".my-error-control").removeClass('my-error-control');
                $(".calc").css('display', 'block');


                let dt = {};
                dt.material = $("#materialList").val() == '' || $("#materialList").val() == 'Ничего не выбрано' ? null : $("#materialList").val();
                dt.materialType = $("#materialTypeList").val() == '' || $("#materialTypeList").val() == 'Ничего не выбрано' ? null : $("#materialTypeList").val();
                dt.protectSreda = $("#protectSredaList").val() == '' || $("#protectSredaList").val() == 'Ничего не выбрано' ? null : $("#protectSredaList").val();
                dt.ogrContr = $("#agrCompList").val();
                dt.expSreda = $("#sredaList").val();
                dt.agrComp = $("#agrList").val();
                dt.dopFact = $("#dopFactList").val();
                dt.davl = $("#davl").val() == "" ? null : $("#davl").val();
                dt.temp = $("#temp").val() == "" ? null : $("#temp").val();
                if ((dt.material == null && dt.materialType == null) || dt.expSreda == null || dt.temp == null) {
                    if (dt.material == null && dt.materialType == null) {
                        $("#materialList").siblings('.my-error-message').css("display", "block");
                        $("#materialList").siblings('.bootstrap-select').addClass('my-error-control');
                        $("#materialTypeList").siblings('.my-error-message').css("display", "block");
                        $("#materialTypeList").siblings('.bootstrap-select').addClass('my-error-control');
                        $(".calc").css('display', 'none');
                    }
                    if (dt.expSreda == null) {
                        $("#sredaList").siblings('.my-error-message').css("display", "block");
                        $("#sredaList").siblings('.bootstrap-select').addClass('my-error-control');
                        $(".calc").css('display', 'none');
                    }
                    if (dt.temp == null) {
                        $("#temp").siblings('.my-error-message').css("display", "block");
                        $("#temp").addClass('my-error-control');
                        $(".calc").css('display', 'none');

                    }
                    console.log("Необходимо заполнить обязательные параметры");

                    return;
                }
                $("#getResult").attr('disabled', true);


                // Получаем ответ

                $.ajax({
                    url: 'https://service.giapdc.ru/index.php/InfoController/getSiteInfo?key=1316c5212b3a76df53b447f0332280bd&mode=2',
                    method: 'post',
                    dataType: 'json',
                    data: {
                        dt: dt
                    },
                    success: function (data1) {
                        $("#getResult").removeAttr('disabled');

                        $(".calc").css('display', 'none');
                        $('header').css('display', 'none');
                        // $('.chart').css('display', 'none')
                        // $('.checkboxes').css('display','flex') 
                        $('.mpmk2_txt').css('display', 'flex');
                        if (data1.res == 1) {
                            $("#dataAnswerCorProc").html(data1.vkk.join('<br/>'));





                            let tableB = '',
                                dataSet = data1.table



                            for (let i = 0; i < data1.table.length; i++) {



                                alltheVid.push(data1.table[i].vid)
                                legMetds.push(data1.table[i].mk)

                                // Помещаем данные в таблицу

                                tableB += '<tr>';

                                if (data1.table[i].img == false) {
                                    tableB += '<td></td>';
                                }
                                // else {

                                //     // tableB += '<td><img class="imgvid" src="' + img_url + data1.table[i].img + img_ext + '?rnd=' + Math.floor(Math.random() * 101) + ' tabindex="0"><br>';
                                //     // tableB += '<img class="imgvid" src="' + img_url + data1.table[i].img + '1' + img_ext + '?rnd=' + Math.floor(Math.random() * 101) + 'alt="" tabindex="0"></td>';

                                // }

                                tableB += '<td>' + data1.table[i].vid + '</td>';
                                tableB += '<td>' + data1.table[i].mk + '</td>';
                                tableB += '<td class="viyavl" style="width: 50px;">' + data1.table[i].ver + '%</td>';

                                tableB += '<td class="prim" style="width: 300px;">' + data1.table[i].prim + '</td>';
                                tableB += '<td class="rec" style="width: 200px;">' + data1.table[i].rec + '</td>';
                                tableB += '</tr>';

                            }

                            //   Построение графика D3 Горизонтальный

                            plottGraph(dataSet);

                            function plottGraph(dataSet) {


                                // Очистка
                                d3.select('svg').selectAll('*').remove();

                                $('.degrad').css('left', '1060px')
                                $('.mk').css('left', '1060px')
                                $('.ogr').css('left', '1060px')
                                $('.indataflx ').css('width', '72em')

                                // Подготовка графика

                                var svg = d3.select("svg"),
                                    margin = {
                                        top: 20,
                                        right: 20,
                                        bottom: 30,
                                        left: 220
                                    },
                                    width = +svg.attr("width") - margin.left - margin.right,
                                    height = +svg.attr("height") - margin.top - margin.bottom;

                                keys = Array.from(new Set(dataSet.map(k => k.mk)))

                                // Данные

                                const defaulValues = {}

                                dataSet.forEach(item => {
                                    defaulValues[item.mk] = "1";
                                });

                                data = Object.entries(dataSet.reduce((a, {
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
                                data.y = "Выявляемость, %";

                                groupKey = "State"

                                formatValue = x => isNaN(x) ? "N/A" : x.toLocaleString("en")

                                // Шкалы

                                y0 = d3.scaleBand()
                                    .domain(data.map(d => d[groupKey]))
                                    .rangeRound([margin.top, height - margin.bottom])
                                    .paddingInner(0.1)


                                y1 = d3.scaleBand()
                                    .domain(keys.reverse())
                                    .rangeRound([y0.bandwidth(), 0])
                                    .padding(0.05)


                                x = d3.scaleLinear()
                                    .domain([0, d3.max(data, d => d3.max(keys, key => d[key]))]).nice()
                                    .rangeRound([margin.left, width - margin.right])
                                    .nice()


                                // Цвета

                                var color = d3.scaleOrdinal()
                                    .range(["#1b1051", "#5E4FA2", "#3288BD", "#66C2A5", "#ABDDA4", "#E6F598",
                                        "#FFFFBF", "#FEE08B", "#FDAE61", "#F46D43", "#D53E4F", "#9E0142", "#500021", "#2a0003"
                                    ]);


                                // Легенда 

                                legend = svg => {
                                    const g = svg
                                        .style('background-color', 'lightgrey')
                                        .attr("transform", `translate(${width+120}, 200)`)
                                        .attr("text-anchor", "end")
                                        .attr("font-family", "sans-serif")
                                        .attr("font-size", 10)
                                        .selectAll("g")
                                        .data(color.domain().slice().reverse())
                                        .join("g")
                                        .attr('class', 'legend-buttons')
                                        .attr("transform", (d, i) => `translate(240,${i * 20})`)

                                    g.append("text")
                                        .attr('class', 'legend-buttons')
                                        .attr("x", -24)
                                        .attr("y", 9.5)
                                        .attr("dy", "0.35em")
                                        .text(d => d)

                                    g.append("rect")
                                        .attr("x", -19)
                                        .attr("width", 19)
                                        .attr("height", 19)
                                        .attr("fill", color);


                                }

                                // Рисуем график D3

                                svg.append("g")
                                    .selectAll("g")
                                    .data(data)
                                    .join("g")
                                    .attr("transform", d => `translate(0,${y0(d[groupKey])})`)
                                    .selectAll("rect")
                                    .data(d => keys.map(key => ({
                                        key,
                                        value: d[key]
                                    })))
                                    .join("rect")
                                    .attr('class', 'data-chart')
                                    .attr("x", d => x(0))
                                    .attr("y", d => y1(d.key))
                                    .attr("height", y1.bandwidth())
                                    .attr("width", d => x(d.value) - x(0))
                                    .attr("fill", d => color(d.key))
                                    .append("title")
                                    .text(d => `${d.key} : ${formatValue(d.value)}`);


                                // Оси

                                xAxis = g => g
                                    .attr("transform", `translate(0,${height - margin.bottom})`)
                                    .call(d3.axisBottom(x))
                                    .call(g => g.select(".domain").remove())
                                    .call(d3.axisBottom(x).ticks(4, "s").tickSize(-height + 40))
                                    .call(g => g.select(".tick:last-of-type text").clone()
                                        .attr("x", 15)
                                        .attr("text-anchor", "start")
                                        .attr("font-weight", "bold")
                                        .text(data.y))
                                    .style('color', '#8E8883');



                                yAxis = g => g
                                    .attr("transform", `translate(${margin.left},0)`)
                                    .call(d3.axisLeft(y0).ticks(null, "s"))
                                    .call(g => g.select(".domain").remove())



                                // svg.append("g")
                                // 	.attr("fill", "black")
                                // 	.attr("text-anchor", "end")
                                // 	.attr("font-family", "sans-serif")
                                // 	.attr("font-size", 12)
                                // 	.selectAll("text")
                                // 	.data(dataSet)
                                // 	.join("text")
                                // 	.attr("x", 500)
                                // 	.attr("y", d => y1(d.key))
                                // 	//   .attr("dy", "0.35em")
                                // 	//   .attr("dx", -4)
                                // 	.text(d => d.ver)
                                // 	.call(text => text.filter(d => x(d.value) - x(0) < 20) // short bars
                                // 		.attr("dx", +4)
                                // 		.attr("fill", "black")
                                // 		.attr("text-anchor", "start"));


                                svg.append("g")
                                    .call(xAxis);

                                svg.append("g")
                                    .call(yAxis);

                                svg.append("g")
                                    .call(legend);


                                // $('.legend-one').on('click', function(event) {

                                //     for (let z=0; z < data1.table.length; z++) {
                                //         var mkOff = event.target.innerHTML

                                //         if (data1.table[z].mk === mkOff) {

                                //             $('.legend-one').eq(z).toggleClass('click')
                                //             $('.r-txt').eq(z).slideToggle()
                                //             $('.charttxt').eq(z).toggle(500)
                                //             // data1.table.splice (z, 1)  

                                //             // $('.transchart').eq(z).slideToggle()


                                //             }


                                // Убираем графики по клику на легенде

                                $(".legend-buttons").on("click", function (event) {

                                    $(this).toggleClass('switched')
                                    console.log(this)

                                    var mkOff;

                                    dataSet.forEach(function (item, index) {

                                        mkOff = event.target.innerHTML
                                        if (mkOff === item.mk) {


                                            // let buffDataSet = []
                                            // buffDataSet.push(item)

                                            // dataSet.splice(index, 1)

                                            item.ver = "0"


                                        }


                                    })
                                    updateGraph(dataSet)
                                })


                            }




                            // ON Click 
                            d3.selectAll("rect").on("click", function () {
                                let remData = this.innerHTML
                                var attrDef = $(this).attr('width')

                                $(this).attr('width', 6)


                                // d3.select("svg").selectAll(".tick").remove()
                                // d3.select("svg").selectAll(".data-chart").remove()
                                // updateGraph (dataSet);
                            });


                            // Вертикальный график D3

                            function d3VerticalGraph() {

                                // Очистка старого графика

                                d3.select('svg').selectAll('*').remove();
                                $('.degrad').css('left', '1160px')
                                $('.mk').css('left', '1160px')
                                $('.ogr').css('left', '1160px')
                                $('.indataflx ').css('width', '80em')

                                $(".rotate-btn").css('display', 'flex');

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
                                    .domain(keys.reverse())
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
                                    .call(d3.axisLeft(y).ticks(4, "s").tickSize(-width + 50))
                                    .call(g => g.select(".domain").remove())
                                    .call(g => g.select(".tick:last-of-type text").clone()
                                        .attr("x", 3)
                                        .attr("text-anchor", "start")
                                        .attr("font-weight", "bold")
                                        .text(data.y))



                                // Цвета

                                color = d3.scaleOrdinal()
                                    .range(["#1b1051", "#5E4FA2", "#3288BD", "#66C2A5", "#ABDDA4", "#E6F598",
                                        "#FFFFBF", "#FEE08B", "#FDAE61", "#F46D43", "#D53E4F", "#9E0142", "#500021", "#2a0003"
                                    ])


                                // Легенда 

                                legend = svg => {
                                    const g = svg
                                        .attr("transform", `translate(${width+270}, 200)`)
                                        .attr("text-anchor", "end")
                                        .attr("font-family", "sans-serif")
                                        .attr("font-size", 10)
                                        .selectAll("g")
                                        .data(color.domain().slice().reverse())
                                        .join("g")
                                        .attr('class', 'legend-buttons')
                                        .attr("transform", (d, i) => `translate(0,${i * 20})`);

                                    g.append("rect")
                                        .attr('class', 'legend-buttons')
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
                                    .attr('class', 'data-chart')
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



                                d3.selectAll("rect").on("click", function () {
                                    let remData = this.innerHTML
                                    var attrDef = $(this).attr('height')

                                    $(this).attr('height', 5)


                                    // d3.select("svg").selectAll(".tick").remove()
                                    // d3.select("svg").selectAll(".data-chart").remove()
                                    // updateGraph (dataSet);
                                });

                            }

                            //  Повернуть график 

                            let flag = 0

                            $('.rotate-btn').on('click', function () {

                                if (flag == 0) {
                                    d3VerticalGraph(dataSet);
                                    flag = 1
                                } else {
                                    plottGraph(dataSet)
                                    flag = 0
                                }
                            });


                            function updateGraph(dataSet) {

                                // Очистка
                                d3.select('svg').selectAll('*').remove();

                                $('.degrad').css('left', '1060px')
                                $('.mk').css('left', '1060px')
                                $('.ogr').css('left', '1060px')
                                $('.indataflx ').css('width', '72em')

                                // Подготовка графика

                                var svg = d3.select("svg"),
                                    margin = {
                                        top: 20,
                                        right: 20,
                                        bottom: 30,
                                        left: 220
                                    },
                                    width = +svg.attr("width") - margin.left - margin.right,
                                    height = +svg.attr("height") - margin.top - margin.bottom;

                                keys = Array.from(new Set(dataSet.map(k => k.mk)))

                                // Данные

                                const defaulValues = {}

                                dataSet.forEach(item => {
                                    defaulValues[item.mk] = "1";
                                });

                                data = Object.entries(dataSet.reduce((a, {
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
                                data.y = "Выявляемость, %";

                                groupKey = "State"

                                formatValue = x => isNaN(x) ? "N/A" : x.toLocaleString("en")

                                // Шкалы

                                y0 = d3.scaleBand()
                                    .domain(data.map(d => d[groupKey]))
                                    .rangeRound([margin.top, height - margin.bottom])
                                    .paddingInner(0.1)


                                y1 = d3.scaleBand()
                                    .domain(keys.reverse())
                                    .rangeRound([y0.bandwidth(), 0])
                                    .padding(0.05)


                                x = d3.scaleLinear()
                                    .domain([0, d3.max(data, d => d3.max(keys, key => d[key]))]).nice()
                                    .rangeRound([margin.left, width - margin.right])
                                    .nice()


                                // Цвета

                                var color = d3.scaleOrdinal()
                                    .range(["#1b1051", "#5E4FA2", "#3288BD", "#66C2A5", "#ABDDA4", "#E6F598",
                                        "#FFFFBF", "#FEE08B", "#FDAE61", "#F46D43", "#D53E4F", "#9E0142", "#500021", "#2a0003"
                                    ]);


                                // Легенда 

                                legend = svg => {
                                    const g = svg
                                        .style('background-color', 'lightgrey')
                                        .attr("transform", `translate(${width+120}, 200)`)
                                        .attr("text-anchor", "end")
                                        .attr("font-family", "sans-serif")
                                        .attr("font-size", 10)
                                        .selectAll("g")
                                        .data(color.domain().slice().reverse())
                                        .join("g")
                                        .attr('class', 'legend-buttons')
                                        .attr("transform", (d, i) => `translate(240,${i * 20})`)

                                    g.append("text")
                                        .attr('class', 'legend-buttons')
                                        .attr("x", -24)
                                        .attr("y", 9.5)
                                        .attr("dy", "0.35em")
                                        .text(d => d)

                                    g.append("rect")
                                        .attr("x", -19)
                                        .attr("width", 19)
                                        .attr("height", 19)
                                        .attr("fill", color);


                                }

                                // Рисуем график D3

                                svg.append("g")
                                    .selectAll("g")
                                    .data(data)
                                    .join("g")
                                    .attr("transform", d => `translate(0,${y0(d[groupKey])})`)
                                    .selectAll("rect")
                                    .data(d => keys.map(key => ({
                                        key,
                                        value: d[key]
                                    })))
                                    .join("rect")
                                    .attr('class', 'data-chart')
                                    .attr("x", d => x(0))
                                    .attr("y", d => y1(d.key))
                                    .attr("height", y1.bandwidth())
                                    .attr("width", d => x(d.value) - x(0))
                                    .attr("fill", d => color(d.key))
                                    .append("title")
                                    .text(d => `${d.key} : ${formatValue(d.value)}`);


                                // Оси

                                xAxis = g => g
                                    .attr("transform", `translate(0,${height - margin.bottom})`)
                                    .call(d3.axisBottom(x))
                                    .call(g => g.select(".domain").remove())
                                    .call(d3.axisBottom(x).ticks(4, "s").tickSize(-height + 40))
                                    .call(g => g.select(".tick:last-of-type text").clone()
                                        .attr("x", 15)
                                        .attr("text-anchor", "start")
                                        .attr("font-weight", "bold")
                                        .text(data.y))
                                    .style('color', '#8E8883');



                                yAxis = g => g
                                    .attr("transform", `translate(${margin.left},0)`)
                                    .call(d3.axisLeft(y0).ticks(null, "s"))
                                    .call(g => g.select(".domain").remove())



                                // svg.append("g")
                                // 	.attr("fill", "black")
                                // 	.attr("text-anchor", "end")
                                // 	.attr("font-family", "sans-serif")
                                // 	.attr("font-size", 12)
                                // 	.selectAll("text")
                                // 	.data(dataSet)
                                // 	.join("text")
                                // 	.attr("x", 500)
                                // 	.attr("y", d => y1(d.key))
                                // 	//   .attr("dy", "0.35em")
                                // 	//   .attr("dx", -4)
                                // 	.text(d => d.ver)
                                // 	.call(text => text.filter(d => x(d.value) - x(0) < 20) // short bars
                                // 		.attr("dx", +4)
                                // 		.attr("fill", "black")
                                // 		.attr("text-anchor", "start"));


                                svg.append("g")
                                    .call(xAxis);

                                svg.append("g")
                                    .call(yAxis);

                                svg.append("g")
                                    .call(legend);

                                // Убираем графики по клику на легенде

                                $(".legend-buttons").on("click", function (event) {



                                    var mkOff;

                                    dataSet.forEach(function (item, index) {

                                        mkOff = event.target.innerHTML
                                        if (mkOff === item.mk) {


                                            // let buffDataSet = []
                                            // buffDataSet.push(item)

                                            // dataSet.splice(index, 1)

                                            item.ver = "0"


                                        }


                                    })
                                    plottGraph(dataSet)
                                })

                                // ON Click 
                                d3.selectAll("rect").on("click", function () {
                                    let remData = this.innerHTML
                                    var attrDef = $(this).attr('width')

                                    $(this).attr('width', 6)


                                    // d3.select("svg").selectAll(".tick").remove()
                                    // d3.select("svg").selectAll(".data-chart").remove()
                                    // updateGraph (dataSet);
                                });

                            }


                            // Ограничения по контролю 

                            if (dt.ogrContr !== null) {


                                let chkbx1 = "Ограничение зоны контроля доступностью объекта (подземный, на высоте) и подготовкой (снятие изоляции, зачистка и т.д.)",
                                    chkbx2 = "Отсутствует доступ к объекту контроля со стороны воздействия коррозионно-активных компонентов",
                                    chkbx3 = "Контроль в режиме эксплуатации (при температурах поверхности объекта от 100 °С)"

                                dt.ogrContr.forEach((item, index) => {
                                    if (dt.ogrContr[index] === chkbx1) {
                                        $('#chkbx1').attr('checked', true)
                                    } else if (dt.ogrContr[index] === chkbx2) {
                                        $('#chkbx2').attr('checked', true)
                                    } else if (dt.ogrContr[index] === chkbx3) {
                                        $('#chkbx3').attr('checked', true)
                                    }
                                })

                            }


                            $(".rotate-btn").css('display', 'flex');
                            $('.reloadpage').click(function () {
                                location.reload();
                            })
                            $('.chart').css('display', 'flex')
                            $('.checkboxes').css('display', 'block')
                            $(".indataflx").css('display', 'flex');
                            $("#svg").html($("#svg").html());
                            $('#dataAnswerDefTable tbody').html(tableB);
                            $('.visualchart').css('display', 'flex');
                            groupTable($('#dataAnswerDefTable tbody tr'), 1, 1);
                            $('#dataAnswerDefTable .deleted').remove();
                            $('#dataAnswerDefTable td[data-rowspan]').each(function () {
                                $(this).attr('rowspan', $(this).attr('data-rowspan'));
                            });

                            // Исходные данные

                            $('#material').text(dt.material || 'нет');
                            $('#materialType').text(dt.materialType);
                            $('#protect').text(dt.protectSreda || 'нет');
                            $('#confines').text(dt.ogrContr || 'нет');
                            $('#techsreda').text(dt.expSreda || 'нет');
                            $('#components').text(dt.agrComp || 'нет');
                            $('#dopfactors').text(dt.dopFact || 'нет');
                            $('#davlenie').text(dt.davl || 0 + ' МПа');
                            $('#temper').text(`${dt.temp} °C`);
                            $('#stageResult').css('display', 'block');
                            $('.enterform').css('display', 'none');
                            $('.rect').on('hover', () => {

                            });




                            $('#mod').modal('show');
                            $("img").error(function () {
                                $(this).hide();
                            });
                        }
                    },
                    error: function () {
                        console.log("fhgfgfgf");
                        $("#getResult").removeAttr('disabled');
                    }
                });
                console.log(dt);

            });
            //тултипы
            // $('[data-toggle="tooltip"],[data-toggle="dropdown"]').tooltip();
        }
        return {
            init: function () {
                zapros();
                events();
            }
        }




    }();



    // Защита от копирования

    $(function () {
        $('.allform').attr('oncopy', 'return false;');
        $('#mod').attr('oncopy', 'return false;');
    });

    $(function () {
        $(".selectpicker").selectpicker({
            liveSearch: true,
            noneResultsText: 'Ничего не найдено',
            size: 10
        });
        dataFill.init();
        $('.select-multiple').on('changed.bs.select', function (e) {
            const $this = $(this);
            selectData = $this.data('selectpicker');
            if (selectData) {
                selectData.$newElement.removeClass('open');
            }
        });
    });
}