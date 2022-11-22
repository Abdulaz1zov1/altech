$(document).ready(function () {

    "use strict";


    let chartjsId = document.getElementById("statjs")
    let chartId = chartjsId.getAttribute('data-id');


    let countTashkent = 0
    let tashkent = ''
    let countXorezm = 0
    let xorezm = ''
    let countSirdaryo = 0
    let sirdaryo = ''
    let countNavoiy = 0
    let navoiy = ''
    let countFergana = 0
    let fergana = ''
    let countKashkadaryo = 0
    let kashkadaryo = ''
    let countJizzax = 0
    let jizzax = ''
    let countSurxandaryo = 0
    let surxandaryo = ''
    let countKarakalpak = 0
    let karakalpak = ''
    let countAndijan = 0
    let andijan = ''
    let countBuxara = 0
    let buxara = ''
    let countSamarkand = 0
    let samarkand = ''
    let countNamangan = 0
    let namangan = ''

    fetch(`/viktorina/static/${chartId}`)
        .then(res => res.json())
        .then(viktorina => {
            console.log(viktorina)
            viktorina.forEach(vik => {
                console.log(vik.region)
                if (vik.region == "Ташкент") { countTashkent++; tashkent = "Ташкент" }
                else if (vik.region == "Хорезмская область"){ countXorezm++; xorezm = "Хорезмская область" }
                else if (vik.region == "Сырдарьинская область") { countSirdaryo++; sirdaryo = "Сырдарьинская область" }
                else if (vik.region == "Навоийская область") { countNavoiy++; navoiy = "Навоийская область" }
                else if (vik.region == "Ферганская область") { countFergana++; fergana = "Ферганская область" }
                else if (vik.region == "Кашкадарьинская область") { countKashkadaryo++; kashkadaryo = "Кашкадарьинская область" }
                else if (vik.region == "Джизакская область") { countJizzax++; jizzax = "Джизакская область" }
                else if (vik.region == "Сурхандарьинская область") { countSurxandaryo++; surxandaryo = "Сурхандарьинская область" }
                else if (vik.region == "Республика Каракалпакстан") { countKarakalpak++; karakalpak = "Республика Каракалпакстан" }
                else if (vik.region == "Андижанская область") { countAndijan++; andijan = "Андижанская область" }
                else if (vik.region == "Бухарская область") { countBuxara++; buxara = "Бухарская область" }
                else if (vik.region == "Самаркандская область") { countSamarkand++; samarkand = "Самаркандская область" }
                else if (vik.region == "Наманганская область") { countNamangan++; namangan = "Наманганская область" }
            })
            console.log(countTashkent,tashkent)
            new Chart(document.getElementById("statjs"), { "type": "bar", "data": { "labels": [andijan, buxara, fergana, jizzax, namangan, navoiy, karakalpak, kashkadaryo, sirdaryo, samarkand, surxandaryo, tashkent, xorezm], "datasets": [{ "label": "Статистика областов", "data": [countAndijan, countBuxara, countFergana, countJizzax, countNamangan, countNavoiy, countKarakalpak, countKashkadaryo, countSirdaryo, countSamarkand, countSurxandaryo, countTashkent, countXorezm], "fill": false, "backgroundColor": ["rgba(255, 99, 132, 0.2)", "rgba(255, 159, 64, 0.2)", "rgba(255, 205, 86, 0.2)", "rgba(75, 192, 192, 0.2)", "rgba(54, 162, 235, 0.2)", "rgba(153, 102, 255, 0.2)", "rgba(201, 203, 207, 0.2)", "rgba(255, 99, 132, 0.2)", "rgba(255, 159, 64, 0.2)", "rgba(255, 205, 86, 0.2)", "rgba(75, 192, 192, 0.2)", "rgba(54, 162, 235, 0.2)", "rgba(153, 102, 255, 0.2)"], "borderColor": ["rgb(255, 99, 132)", "rgb(255, 159, 64)", "rgb(255, 205, 86)", "rgb(75, 192, 192)", "rgb(54, 162, 235)", "rgb(153, 102, 255)", "rgb(201, 203, 207)", "rgb(255, 99, 132)", "rgb(255, 159, 64)", "rgb(255, 205, 86)", "rgb(75, 192, 192)", "rgb(54, 162, 235)", "rgb(153, 102, 255)"], "borderWidth": 1 }] }, "options": { "scales": { "yAxes": [{ "ticks": { "beginAtZero": true } }] } } });

        }).catch(e=>console.error(e))




});

