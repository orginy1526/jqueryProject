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
                            ${moreInfoCard.img}" alt="Coin Icon"><br/>USD: 
                            $${moreInfoCard.usd}<br/>EUR: 
                            €${moreInfoCard.eur}<br/>ILS:
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
        $('#liveReports').click(function () {

            $('#cards').empty();
            if (cards.length > 0) {
                const arr = [];
                let symbolToLink = "";

                $.map(cards, function (card, i) {
                    const coinSymbol = card.symbol.toString();
                    arr[i] = coinSymbol.toUpperCase();
                    symbolToLink += coinSymbol + ",";
                });
                console.log(symbolToLink);

                var chart = new CanvasJS.Chart("chartContainer", {
                    width: 1200,

                    axisY: {
                        title: "USD",
                    },
                    axisX: {
                        title: "seconds",
                        minimum: 0,
                    },
                    title: {
                        text: "Live Reports",
                    },
                    data: [
                        {
                            type: "line",
                            showInLegend: true,
                            legendText: `${arr[0]}`,
                            dataPoints: [],
                        },
                        {
                            type: "line",
                            showInLegend: true,
                            legendText: `${arr[1]}`,
                            dataPoints: [],
                        },
                        {
                            type: "line",
                            showInLegend: true,
                            legendText: `${arr[2]}`,
                            dataPoints: [],
                        },
                        {
                            type: "line",
                            showInLegend: true,
                            legendText: `${arr[3]}`,
                            dataPoints: [],
                        },
                        {
                            type: "line",
                            showInLegend: true,
                            legendText: `${arr[4]}`,
                            dataPoints: [],
                        },
                    ],
                });

                chart.render();

                let xValue = 0;
                let yValue;

                prograssBar();
                myGraph = setInterval(
                    function () {
                        console.log("working...");
                        $.ajax({
                            url: `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${symbolToLink}&tsyms=USD`,

                            success: (value) => {
                                $.map(arr, function (_item, i) {

                                    yValue = value[arr[i]].USD;

                                    chart.options.data[i].dataPoints.push({
                                        x: xValue,
                                        y: yValue,
                                    });
                                    chart.render();
                                });
                                xValue += 2;
                            },
                            error: () => {
                                alert("please check api address");
                            },
                        });
                    }, 2000);
            }
        });

    }

});

