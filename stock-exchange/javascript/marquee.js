
class Marquee {
    constructor(element, key) {
        this.id = element;
        // this.key = key;
    }

    load() {
        async function marquee(key){
            try {
                const response = await fetch(`https://financialmodelingprep.com/api/v3/company/stock/list?${key}`);
                const data = await response.json();
                let list = data.symbolsList
                document.getElementById("marquee").className = "marquee";
                document.getElementById("marquee").innerHTML = (`<div class="track"><div class="content" id="div1"></div></div>`)
                        for (let i = 0; i < 40; i++) {
                            list = data.symbolsList[i];
                            let marq = document.getElementById("div1");
                            let div = document.createElement("div");
                            div.innerHTML = (`<span class="symbol">` + list.symbol + `</span>` + `<span class="price">` + list.price + `</span>`)
                            marq.appendChild(div)
                        }
                } catch(error) {
                    console.log(error)
                }
        }
        marquee(this.key)
    }



}
