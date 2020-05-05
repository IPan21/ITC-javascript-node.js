let linkArray = [];

function remove(el) {
    var element = el;
    element.parentNode.parentNode.removeChild(element.parentNode);
    compBar.getCount(document.getElementById("addButtons"));
    for (let i = 0; i < linkArray.length; i++){ 
        if ( linkArray[i] === el.id.slice(1)) { linkArray.splice(i, 1); break}
        let linkA = "company.html?symbol=" + linkArray.toString();
        document.getElementById('compareItemsLink').setAttribute("href", linkA)
    }
  }



class CompareBar {
    constructor(element) {
        this.id = element;
    }

    load() {
        document.getElementById("compareContainer").innerHTML = (`<div id="addButtons"></div>
        <div id="compareLink"><a href='company.html?symbol=' id='compareItemsLink'>Compare <span id="numOfEl"></span> companies &nbsp;</a></div>`)
    }

    getCount(parent, getChildrensChildren){
        const relevantChildren = 0;
        const children = parent.childNodes.length;
        for(let i=0; i < children; i++){
            if(parent.childNodes[i].nodeType != 3){
                if(getChildrensChildren)
                    relevantChildren += getCount(parent.childNodes[i],true);
                relevantChildren++;
            }
        }

        if (relevantChildren > 0) {
            document.getElementById("numOfEl").innerText = (relevantChildren);
        } else {
            document.getElementById("numOfEl").innerText = "";
        }
        // console.log(relevantChildren)
        return relevantChildren;
    }

    addbutton(item){
        if (document.getElementById("numOfEl").innerText == "3") {
            alert("max 3!");
        } else {
            let buttonbox = document.getElementById("addButtons")
            let compareB = document.createElement("div");
            compareB.setAttribute('id', "div" + item.symbol)
            compareB.innerHTML = (`<button id=b${item.symbol} class="compare-bar-button" onclick='remove(this)'>${item.symbol} &nbsp; &#215;</button>`)
            buttonbox.appendChild(compareB)
            linkArray.push(item.symbol)
            let linkA = "company.html?symbol=" + linkArray.toString();
            document.getElementById('compareItemsLink').setAttribute("href", linkA)
        }



    }

}

const compBar = new CompareBar(document.getElementById("addButtons"));


class SearchResult {
    constructor(element) {
        this.id = element;

    }
    sayhi() {
        console.log("hi")
    }



    highlightResults() {
        document
        .getElementById('myInput')
        .addEventListener('input', debounce(highlightResults, 1000));

        const term = document.getElementById("myInput").value;
        const results = document.getElementById("myListResults").innerText;
        results.replace(new RegExp(term, "gi"), (match) => `<mark>${match}</mark>`);
        

        function debounce(callback, time) {
            var timeout;
            return function() {
                var context = this;
                var args = arguments;
                if (timeout) {
                    clearTimeout(timeout);
                }
                timeout = setTimeout(function() {
                    timeout = null;
                    callback.apply(context, args);
                }, time);
                
            }
        }
    }
        
    renderResults(attempt) {
        document.getElementById("myListResults").innerHTML=(`<div id="loadingResults" class="spinner-border text-secondary" role="status">
        <span class="sr-only">Loading...</span>
        </div>`)
        attempt.map(getData)


        async function getData(item) {
            const line = new List(item)
            line.load(item)

    }
}
}

class List {
    constructor(item) {
        const param = new URLSearchParams(window.location.search);
        const qu = param.get('query');
        console.log(qu)
        let term = document.getElementById("myInput").value;
        if (qu === 'null' || qu === '') {
            console.log("empty query")
        } else {
            term = qu
        }
        const resultsName = item.profile.companyName;
        let wordName = resultsName.replace(new RegExp(term, "gi"), (match) => `<mark>${match}</mark>`);
        const resultsSymbol = item.symbol;
        let wordSymbol = resultsSymbol.replace(new RegExp(term, "gi"), (match) => `<mark>${match}</mark>`);
        let ul = document.getElementById("myListResults");
        let li = document.createElement("li");
        
        li.innerHTML = (`<a href='company.html?symbol=` + item.symbol + `'>` 
        + `<img src = '` + item.profile.image + `'>`
        + wordName
        + `<span class="symbol">` + ' (' + wordSymbol + ')' + `</span>`
        + `<span id='` + item.symbol + `'>` + item.profile.changesPercentage + `</span>`
        +`</a>`)
        ul.appendChild(li);
        const buttonCompare = new ButtonInTheList (li, item);
    }

    load(item) {

        if (item.profile.changes <= 0) {
            document.getElementById(item.symbol).className = 'percentsRed'; 
        } else {
            document.getElementById(item.symbol).className = 'percentsGreen';
        }
            
    //     function buttonCallback(){
    //         compBar.addbutton(item)
    //         compBar.getCount(document.getElementById("addButtons"))
    // }




}}

function ButtonInTheList (element, item){
        const button = document.createElement("button")
        button.innerText = item.symbol
        element.appendChild(button)

        button.onclick = () => {
        compBar.addbutton(item)
        compBar.getCount(document.getElementById("addButtons"))
      }
}