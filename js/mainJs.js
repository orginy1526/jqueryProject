$(function () {
    loadAjax();

    // loadAjax
    function loadAjax() {
        console.log(1);
        api();
        setInterval(() => {
            location.reload(true);
            console.log('reload');
            api();
        }, 120000);
    }

    function api() {
        console.log(2);
        $.ajax({
            url: "https://api.coingecko.com/api/v3/coins",
            dataType: "json",
            success: (response) => {
                prograssBar();
                setTimeout(() => {
                    displayCards(response);
                    moreInfo(response);
                    about();
                    search(response);
                    toggleSwitch(response);
                }, 500);
            },
            error: () => console.error('API not valid')
        });
    }

    // prograssBar
    function prograssBar() {
        console.log(3);
        $('.loadContainer').removeClass('d-none');
    }

    // displayCards
    function displayCards(response) {
        console.log(4);
        $('.loadContainer').addClass('d-none');
        // ajax all coins
        $.map(response, function (card, i) {

            // building cards
            $('#cards').append(`<div class="col-sm col-md col-lg col-xl">
            <div class="card mb-3" style="width: 18rem">
            <div
            class="d-flex align-items-end flex-column bd-highlight mb-3" id="toggleSwitch${i}"
            style="height: 8px">
                      </div>
                      <div class="card-header">${card.symbol}</div>
                      <div class="card-body">
                      <h5 class="card-title">${card.name}</h5>
                      <p>
                      <a class="btn btn-primary" data-toggle="collapse" href="#collapseExample${i}" role="button" aria-expanded="false" aria-controls="collapseExample${i}">
                      More Info
                      </a>
                      </p>
                      <div class="collapse" id="collapseExample${i}"></div>
                      </div>
                      </div>`);
        });
    }


    // moreInfo
    function moreInfo(response) {
        console.log(5);
        $.map(response, (card, i) => {
            $.ajax({
                url: `https://api.coingecko.com/api/v3/coins/${card.id}`,
                success: function (card) {
                    let moreInfoCard = {
                        img: card.image.thumb,
                        usd: card.market_data.current_price.usd,
                        eur: card.market_data.current_price.eur,
                        ils: card.market_data.current_price.ils,
                    };

                    // JSON
                    window.localStorage.setItem("moreInfoCard", JSON.stringify(moreInfoCard));

                    moreInfoCard = JSON.parse(window.localStorage.getItem("moreInfoCard"));

                    // display in collapse
                    $(`#collapseExample${i}`).append(`<div class="card card-body"><img src="
                            ${moreInfoCard.img}" alt="Coin Icon"><br/>usd: 
                            $${moreInfoCard.usd}<br/>eur: 
                            €${moreInfoCard.eur}<br/>ils:
                            ${moreInfoCard.ils}₪
                                </div>`);
                },
                error: () => console.error('API not valid')
            });
        });
    }


    // about
    function about() {
        console.log(6);
        $.ajax({
            url: "about.html",
            success: link => {
                $('#about').click(function () {
                    prograssBar();
                    setTimeout(() => {
                        $('#cards').html(link);
                    }, 501);
                });
            }
        });

    }

    // search
    function search(response) {
        console.log(7);
        $('#search').click(function (e) {
            e.preventDefault();
            let searchCrypto = $('#searchBar').val();
            let arr = [];
            $.map(response, function (crypto) {
                let cryptoSymbol = crypto.symbol;
                if (searchCrypto === cryptoSymbol) {
                    console.log(crypto);
                    arr.push(crypto);
                    $('#cards').empty();
                    $('#cards').append(displayCards(arr), moreInfo(arr), toggleSwitch(arr));
                }
            });
        });
    }

    // global variables
    let cards = [];
    let cenceledCards = [];
    let lastCard = {};

    // toggle switch
    function toggleSwitch(response) {
        console.log(8);
        $.map(response, function (card, i) {
            const toggle = $(`#toggleSwitch${i}`);
            toggle.html(`<label class="switch"><input id="input${i}" type="checkbox"><span class="slider round"></span></label>`);
            $(`#input${i}`).click(function () {
                if ($(`#input${i}`).is(':checked')) {
                    if (!cards.includes(card)) {
                        cards.push(card);
                    }
                }
                liveReports(cards);
                if (cards.length > 5) {
                    lastCard = card;
                    cards.pop(card);
                    modal();
                }
            });
        });
    }

    // modal
    function modal() {

        $.map(cards, function (card, i) {
            console.log(card);
            $("#modalBtn").trigger("click");

            $("#ulModal").append(
                `<li><img src="
                ${card.image.small}" alt="Coin Icon"> ${card.name} <button id="btn${i}" type="button" class="del btn btn-primary">delete</button></li>`
            );

            console.log(cards);
            cenceledCards = cards.slice(0);
            console.log($('#cancel'));
            $('#cancel').click(function () {
                cencelCard(cenceledCards);
            });

            $(`#btn${i}`).click(function () {
                deleteCard($(`#btn${i}`));
            });

        });
    }

    // delete card
    function deleteCard(btn) {
        const liToRemove = btn.parent()[0];
        liToRemove.remove();
        const indexOfObject = cards.findIndex(object => {
            return object.name === object.name;
        });

        cards.splice(indexOfObject, 1);

        $.map(cards, function (card, i) {
            console.log(card);
            if (!cards.includes(lastCard)) {
                $("#ulModal").append(
                    `<li><img src="
                ${lastCard.image.small}" alt="Coin Icon"> ${lastCard.name} <button id="btn${i}" type="button" class="del btn btn-primary">delete</button></li>`
                );
                cards.push(lastCard);
            }
        });
        setTimeout(() => { save(); }, 500);

    }

    // cencel
    function cencelCard(cenceledCards) {
        cards = cenceledCards;
        console.log(cards);
    }

    // save
    function save() {
        console.log(cards);
        location.reload(true);
        $("#close").trigger("click");
    }


    // live reports
    function liveReports(cards) {
        $.map(cards, function (card) {
            const cardSymbol = card.symbol;
            $.ajax({
                url: `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${cardSymbol}&tsyms=USD`,
                success: link => {
                    $('#liveReports').click(function () {
                        prograssBar();
                        // setInterval(() => {
                        console.log((Object.values(link)[0].USD));
                        var options = {
                            exportEnabled: true,
                            animationEnabled: true,
                            title: {
                                text: "Units Sold VS Profit"
                            },
                            subtitles: [{
                                text: "Click Legend to Hide or Unhide Data Series"
                            }],
                            axisX: {
                                title: "States"
                            },
                            axisY: {
                                title: "Units Sold",
                                titleFontColor: "#4F81BC",
                                lineColor: "#4F81BC",
                                labelFontColor: "#4F81BC",
                                tickColor: "#4F81BC"
                            },
                            axisY2: {
                                title: "Profit in USD",
                                titleFontColor: "#C0504E",
                                lineColor: "#C0504E",
                                labelFontColor: "#C0504E",
                                tickColor: "#C0504E"
                            },
                            toolTip: {
                                shared: true
                            },
                            legend: {
                                cursor: "pointer",
                                itemclick: toggleDataSeries
                            },
                            data: [{
                                type: "spline",
                                name: "Units Sold",
                                showInLegend: true,
                                xValueFormatString: "MMM YYYY",
                                yValueFormatString: "#,##0 Units",
                                dataPoints: [
                                    { x: new Date(2016, 0, 1), y: 120 },
                                    { x: new Date(2016, 1, 1), y: 135 },
                                    { x: new Date(2016, 2, 1), y: 144 },
                                    { x: new Date(2016, 3, 1), y: 103 },
                                    { x: new Date(2016, 4, 1), y: 93 },
                                    { x: new Date(2016, 5, 1), y: 129 },
                                    { x: new Date(2016, 6, 1), y: 143 },
                                    { x: new Date(2016, 7, 1), y: 156 },
                                    { x: new Date(2016, 8, 1), y: 122 },
                                    { x: new Date(2016, 9, 1), y: 106 },
                                    { x: new Date(2016, 10, 1), y: 137 },
                                    { x: new Date(2016, 11, 1), y: 142 }
                                ]
                            },
                            {
                                type: "spline",
                                name: "Profit",
                                axisYType: "secondary",
                                showInLegend: true,
                                xValueFormatString: "MMM YYYY",
                                yValueFormatString: "$#,##0.#",
                                dataPoints: [
                                    { x: new Date(2016, 0, 1), y: 19034.5 },
                                    { x: new Date(2016, 1, 1), y: 20015 },
                                    { x: new Date(2016, 2, 1), y: 27342 },
                                    { x: new Date(2016, 3, 1), y: 20088 },
                                    { x: new Date(2016, 4, 1), y: 20234 },
                                    { x: new Date(2016, 5, 1), y: 29034 },
                                    { x: new Date(2016, 6, 1), y: 30487 },
                                    { x: new Date(2016, 7, 1), y: 32523 },
                                    { x: new Date(2016, 8, 1), y: 20234 },
                                    { x: new Date(2016, 9, 1), y: 27234 },
                                    { x: new Date(2016, 10, 1), y: 33548 },
                                    { x: new Date(2016, 11, 1), y: 32534 }
                                ]
                            }]
                        };
                        $("#chartContainer").CanvasJSChart(options);

                        function toggleDataSeries(e) {
                            if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                                e.dataSeries.visible = false;
                            } else {
                                e.dataSeries.visible = true;
                            }
                            e.chart.render();
                        }
                        // $('#cards').html();
                        // }, 2000);
                    });
                },
                error: () => console.error('API not valid')
            });
        });
    }

});

