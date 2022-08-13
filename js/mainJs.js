$(function () {
    api();
    loadAjax();

    function api() {
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
                }, 500);
            },
            error: () => console.error('API not valid')
        });
    }

    // prograssBar
    function prograssBar() {
        console.log(1);
        $('.loadContainer').removeClass('d-none');
    }

    // displayCards
    function displayCards(response) {
        console.log(2);
        $('.loadContainer').addClass('d-none');
        // ajax all coins
        $.map(response, function (card, i) {

            // building cards
            $('#cards').append(`<div class="col-sm col-md col-lg col-xl">
            <div class="card mb-3" style="width: 18rem">
                    <div
                      class="d-flex align-items-end flex-column bd-highlight mb-3"
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
        console.log(3);
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
        console.log(4);
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
        console.log(5);
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
                    $('#cards').append(displayCards(arr), moreInfo(arr));
                }
            });
        });
    }


    // loadAjax
    function loadAjax() {
        setInterval(() => {
            console.log('reload');
            api();
        }, 120000);
    }

    // toggle
    function toggle() { }

    // modal
    function modal() { }

});

