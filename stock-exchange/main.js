
( async function () {
    const marquee = new Marquee(document.getElementById('marquee'));
    marquee.load();
    const bar = new CompareBar(document.getElementById("compareContainer"));
    bar.load()

    const form = new SearchForm(document.getElementById('form'));
    const results = new SearchResult(document.getElementById('results'));
    form.onSearch((companies) => {
        results.renderResults(companies);


    })
    })()


    