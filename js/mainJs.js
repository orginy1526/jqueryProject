$(function () {

    $.ajax({
        url: "https://api.coingecko.com/api/v3/coins",
        dataType: "json",
        success: (response) => { return (response); },
        error: () => console.error('API not valid')
    });

    $(document).ajaxSuccess(function (_event, request) {
        const coinsApi = request.responseJSON;
        displayCards(coinsApi);
        moreInfo(coinsApi);

    });

    // displayCards
    function displayCards(response) {

        // ajax all coins
        console.log(response);
        $.map(response, function (card, i) {
            console.log(response);
            console.log(card);
            console.log(i);

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
                            ${moreInfoCard.ils})}₪
                                </div>`);
                },
                error: () => console.error('API not valid')
            });
        });
    }

    // prograssBar
    // prograssBar();
    function prograssBar() {
        var progressbar = $("#progressbar"),
            progressLabel = $(".progress-label");

        $(progressLabel).html('Loading');

        progressbar.progressbar({
            value: false,
            change: function () {
                progressLabel.text(progressbar.progressbar("value") + "%");
            },
            complete: function () {
                $(progressbar).addClass('d-none');
            }
        });

        function progress() {
            var val = progressbar.progressbar("value") || 0;

            progressbar.progressbar("value", val + 2);

            if (val < 99) {
                setTimeout(progress, 12);
            }
        }

        setTimeout(progress, 500);

    }

    // search
    // search();
    function search() {
        const search = $('#search');
        $(search).click(function (e) {
            const input = $('input').val();
            e.preventDefault();
            console.log(input);
            console.log(cards[0]);

        });
    }

    // about
    function about() { }

    // loadAjax
    function loadAjax() { }

    // toggle
    function toggle() { }

    // modal
    function modal() { }

});


  // progressbar
    // console.log(document.readyState);
    // if (document.readyState==='interactive'){
    //     prograssBar()
    // }else if(document.readyState==='complete'){
    //     console.log(document.readyState);
    // }
    // $.when(prograssBar).done(displayCards);
    // $( document ).ajaxEnd(prograssBar())
    // displayCards