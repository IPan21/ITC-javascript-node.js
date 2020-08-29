
( async function () {


    const marquee = new Marquee(document.getElementById('marquee'));
    marquee.load();
    const bar = new CompareBar(document.getElementById("compareContainer"));
    bar.load()

    const params = new URLSearchParams(window.location.search);
    const query = params.get('query');

    const form = new SearchForm(document.getElementById('form'), query);
    if (query === 'null' || query === null || query === '') {
        console.log("empty query")
    } else {
        form.onQuery()
    }
    const results = new SearchResult(document.getElementById('results'));
    form.onSearch((companies) => {
        results.renderResults(companies);


    })
    })()


    