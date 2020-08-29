import { key } from './javascript/key';
(async function () {
  const marquee = new Marquee(document.getElementById("marquee"), key);
  marquee.load();
  const bar = new CompareBar(document.getElementById("compareContainer"));
  bar.load();

  const form = new SearchForm(document.getElementById("form"), key);
  const results = new SearchResult(document.getElementById("results"), key);
  form.onSearch((companies) => {
    results.renderResults(companies);
  });
})();
