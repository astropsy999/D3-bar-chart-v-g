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
                                x = 0,
                                ww = 20, // расстояние между видами на графике 

                                // Определяем ширину линий баров в зависимости от количества возможных дефектов

                                $width = $('#svg.visualchart').width(),
                                datLen = data1.table.length,
                                // ширина одного бара
                                wl = (0.8 * $width / datLen);





                            let frstwdth = [0],
                                alltheVid = [],
                                legMetds = [],
                                col = '',
                                lastEl = '',
                                recNum = '',
                                vidLen = '',
                                vidbarLen = '',
                                xvid = '',
                                StrtWidth = 0,
                                FullWidth = '',
                                LastWidth = 0,
                                dataSet = data1.table



                            for (let i = 0; i < data1.table.length; i++) {



                                alltheVid.push(data1.table[i].vid)
                                legMetds.push(data1.table[i].mk)

                                // Помещаем данные в таблицу

                                tableB += '<tr>';

                                if (data1.table[i].img == false) {
                                    tableB += '<td></td>';
                                } else {

                                    // tableB += '<td><img class="imgvid" src="' + img_url + data1.table[i].img + img_ext + '?rnd=' + Math.floor(Math.random() * 101) + ' tabindex="0"><br>';
                                    // tableB += '<img class="imgvid" src="' + img_url + data1.table[i].img + '1' + img_ext + '?rnd=' + Math.floor(Math.random() * 101) + 'alt="" tabindex="0"></td>';

                                }

                                tableB += '<td>' + data1.table[i].vid + '</td>';
                                tableB += '<td>' + data1.table[i].mk + '</td>';
                                tableB += '<td class="viyavl" style="width: 50px;">' + data1.table[i].ver + '%</td>';

                                tableB += '<td class="prim" style="width: 300px;">' + data1.table[i].prim + '</td>';
                                tableB += '<td class="rec" style="width: 200px;">' + data1.table[i].rec + '</td>';
                                tableB += '</tr>';

                                // Построение графика Custom

                                //                     // Раскрашиваем методы контроля на графике 




                                // switch (data1.table[i].mk) {

                                //     case 'Акустико-эмиссионный контроль': col = '#2e86de'
                                //     break
                                //     case 'Вибродиагностика': col = '#2ecc71'
                                //     break
                                //     case 'Внутренний осмотр': col = '#3498db'
                                //     break
                                //     case 'Геодезия': col = '#9b59b6'
                                //     break
                                //     case 'Гидравлические испытания': col = '#d63031'
                                //     break
                                //     case 'Исследования механических свойств': col = '#f39c12'
                                //     break
                                //     case 'Метод магнитной памяти': col = '#d35400'
                                //     break
                                //     case 'Ультразвуковая дефектоскопия': col = '#990066'
                                //     break
                                //     case 'Цветная дефектоскопия': col = '#003153'
                                //     break
                                //     case 'Вихретоковый контроль': col = '#3D2B1F'
                                //     break
                                //     case 'Магнитный контроль': col = '#8CCB5E'
                                //     break
                                //     case 'Радиографический контроль': col = '#FFCF40'
                                //     break
                                //     case 'МИТ': col = '#2A8D9C'
                                //     break
                                //     case 'Металлографические исследования': col = '#DD80CC'
                                //     break
                                //     case 'Наружный осмотр': col = '#009B76'
                                //     break
                                //     case 'Пневмоиспытания': col = '#B00000'
                                //     break
                                //     case 'Стилоскопирование': col = '#3E5F8A'
                                //     break
                                //     case 'Тепловой контроль': col = '#FFB02E'
                                //     break
                                //     case 'Ультразвуковая толщинометрия': col = '#ee5253'
                                //     break
                                //     case 'Ультразвуковое скрининговое сканирование': col = '#34C924'
                                //     break
                                //     case 'Визуально-измерительный контроль': col = '#01a3a4'
                                //     break
                                //     case 'Магнитопорошковая дефектоскопия': col = '#0095B6'
                                //     break
                                //     case 'Прочность материалов': col = '#DCDCDC'
                                //     break
                                //     case 'Влажность элементов': col = '#F64A46'
                                //     break
                                //     case 'Замеры сопротивления': col = '#004524'
                                //     break
                                //     case 'Динамическое испытание': col = '#D1E231'
                                //     break
                                //     case 'Коэрцитиметрия': col = '#423189'
                                //     break
                                //     default: col = ''
                                // } 











                                // Рисуем график (HandMade)

                                let ych = 196 - data1.table[i].ver // расстояние от начала координат до цифры над столбцом
                                $('.allform h4').css('display', 'flex')
                                // добавляем бары графика, вычисляя их толщину в зависимости от количества баров    
                                $('.barchart').append(`<rect width="${wl}" height="${data1.table[i].ver}%" x=${x} y=0 fill="${col}"><title>${data1.table[i].mk}</title></rect>`);
                                // Добавляем Примечания к значению в % над графиком
                                if (data1.table[i].prim != '') {
                                    $('.txtchart').append(`<circle title="${data1.table[i].prim}"  cx="${x+6}" cy="${ych-3.5}%" r="4.5" fill="red" class="prim"><title>${data1.table[i].prim}</title></circle>`);
                                }
                                // пишем значения в % над каждым баром
                                $('.txtchart').append(`<text x="${x}" y="${ych}%" class="charttxt">${data1.table[i].ver}</text>`);

                                // Вычленяем число из Рекомендаций
                                if (data1.table[i].rec != '') {
                                    recNum = parseInt(data1.table[i].rec.replace(/[^\d]/g, ''))
                                    let ychZ = 196 - recNum


                                    $('.barchart').append(`<rect width="${wl}" height="${recNum}%" x=${x} y=0 fill="${col}" class="transchart"><title>${data1.table[i].rec} методом ${data1.table[i].mk}</title></rect>`)
                                    $('.txtchart').append(`<text x="${x}" y="${ychZ}%" class="charttxt transtxtchart">${recNum}</text>`)

                                }


                                x = x + wl // двигаем графики
                                // ловим когда наступает смена вида деффекта
                                if (i > 0 && i < data1.table.length - 1 && data1.table[i].vid != data1.table[i + 1].vid) {

                                    x = x + wl // делаем промежуток между видами


                                    frstwdth.push(x)


                                    vidLen = frstwdth[1] - frstwdth[0] - wl

                                    $('.data-vidname').append(`<text class="underVName" style="width:${vidLen}px;" x="${x}" y="98%">${data1.table[i].vid}</text>`)
                                    $('.data-vidname').append(`<text class="spaceVName" style="width:${wl}px;" x="${x}" y="98%"></text>`)

                                    frstwdth.shift()

                                    StrtWidth = x

                                } else {

                                    $('.data-vidname').append(`<text x="${x}" y="98%"></text>`)
                                }
                                vidbarLen = vidLen - wl
                                xvid = x - vidLen

                                if (i < data1.table.length - 1 && data1.table[i].vid != data1.table[i + 1].vid) {
                                    $('.vidbar').append(`<rect width="${vidbarLen + wl}" height="100%" x="${xvid - wl}" fill="#044B94" fill-opacity="0.1"><title>${data1.table[i].vid}</title></rect>`)
                                }

                            }
                            unVid = [...new Set(alltheVid)] // получаем массив с уникальными значениями дефектов

                            FullWidth = (data1.table.length * wl) + (unVid.length * wl)
                            LastWidth = FullWidth - StrtWidth - wl


                            // Последнее название вида

                            let theLVid = alltheVid[alltheVid.length - 1]
                            $('.data-vidname').append(`<text class = "underVName" style="width:${LastWidth}px" x="${x}" y="98%">${theLVid}</text>`)

                            // Последний бар деффекта

                            $('.vidbar').append(`<rect width="${LastWidth}" height="100%" x="${StrtWidth}" fill="#044B94" fill-opacity="0.1"><title>${theLVid}</title></rect>`)

                            // Рисуем Легенду 

                            let unLegMk = [...new Set(legMetds)] // получаем массив с уникальными значениями методов
                            $('.legend-color').css('width', `${wl}`);
                            $('.legend-one').css({
                                'width': '300px'
                            })


                            // Рисуем саму легенду 
                            unLegMk.forEach((item) => {
                                let colObj = {
                                    'Акустико-эмиссионный контроль': '#2e86de',
                                    'Вибродиагностика': '#2ecc71',
                                    'Внутренний осмотр': '#3498db',
                                    'Геодезия': '#9b59b6',
                                    'Гидравлические испытания': '#d63031',
                                    'Исследования механических свойств': '#f39c12',
                                    'Метод магнитной памяти': '#d35400',
                                    'Ультразвуковая дефектоскопия': '#990066',
                                    'Цветная дефектоскопия': '#003153',
                                    'Вихретоковый контроль': '#3D2B1F',
                                    'Магнитный контроль': '#8CCB5E',
                                    'Радиографический контроль': '#FFCF40',
                                    'МИТ': '#2A8D9C',
                                    'Металлографические исследования': '#DD80CC',
                                    'Наружный осмотр': '#009B76',
                                    'Пневмоиспытания': '#B00000',
                                    'Стилоскопирование': '#3E5F8A',
                                    'Тепловой контроль': '#FFB02E',
                                    'Ультразвуковая толщинометрия': '#ee5253',
                                    'Ультразвуковое скрининговое сканирование': '#34C924',
                                    'Визуально-измерительный контроль': '#01a3a4',
                                    'Магнитопорошковая дефектоскопия': '#0095B6',
                                    'Прочность материалов': '#DCDCDC',
                                    'Влажность элементов': '#F64A46',
                                    'Замеры сопротивления': '#004524',
                                    'Динамическое испытание': '#D1E231',
                                    'Коэрцитиметрия': '#423189'
                                }
                                $('.charts-legend').append(`<div class="legend-one"><div class="legend-color" style="background-color:${colObj[item]}"></div><div class="legend-name">${item}</div></div>`)

                            });

                            // Примечание

                            $('.charts-legend').append(`<div class="legend-one"><div class="prmcrcl"><p>Примечания</p></div></div>`)

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

                                // switch (dt.ogrContr[0]) {
                                    
                                //     case "Ограничение зоны контроля доступностью объекта (подземный, на высоте) и подготовкой (снятие изоляции, зачистка и т.д.)":
                                //         $('#chkbx1').attr( 'checked', true );
                                //         break;
                                // }

                                
                                
                                // $('#chkbx3').attr( 'checked', true )
                                if ($.inArray("Ограничение зоны контроля доступностью объекта (подземный, на высоте) и подготовкой (снятие изоляции, зачистка и т.д.)", dt.ogrContr ) != -1) {
                                    $('#chkbx1').attr( 'checked', true );
                                } else if ($.inArray ("Отсутствует доступ к объекту контроля со стороны воздействия коррозионно-активных компонентов", dt.ogrContr,[1]) != -1) {
                                    $('#chkbx2').attr( 'checked', true )
                                } else if ($.inArray("Контроль в режиме эксплуатации (при температурах поверхности объекта от 100 °С)", dt.ogrContr,[2]) != -1) {
                                    $('#chkbx3').attr( 'checked', true )
                                }
                                

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