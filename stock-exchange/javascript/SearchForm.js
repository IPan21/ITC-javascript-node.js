
class SearchForm {
    constructor(element) {
        this.id = element;
        this.someVariable = {};

    }

    setQueryOnAdressBar(inputVal){
        if (history.pushState) {
            var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?query=' + inputVal;
            window.history.pushState({path:newurl},'',newurl);
        }
    }

    showSpinner() {
        document.getElementById('loadingResults').style.display = 'inline'; 
    }

    hideSpinner() {
        document.getElementById('loadingResults').style.display = 'none'; 
    }

    async fetchData(inputVal) {
        const response = await fetch('https://financialmodelingprep.com/api/v3/search?query=' + inputVal + '&limit=10&exchange=NASDAQ');
        const data = await response.json();
        this.hideSpinner()
        let attempt = data;
        return data
    }

    async sliceAndCombineUrls(attempt) { 
        let dataURLS = await attempt;
            let symbols = [];
            let urls = [];
            dataURLS.map(item => symbols.push(item.symbol));
            for (let i = 0; i < 4; i++) {
                if (symbols.length > 2) {
                    let url = 'https://financialmodelingprep.com/api/v3/company/profile/';
                    url = url + symbols[0] + ',' + symbols[1] + ',' + symbols[2];
                    urls.push(url)
                    symbols.shift()
                    symbols.shift()
                    symbols.shift()
                } else  {
                    let url = 'https://financialmodelingprep.com/api/v3/company/profile/';
                    url = url + symbols.toString()
                    urls.push(url)
                    break
                }
            }
            return urls     
    }

    async fetchProfilesData (myurls) {
        let urls = await myurls
         Promise.all(urls.map(u=>fetch(u))).then(responses =>
            Promise.all(responses.map(res => res.json()))
        ).then(data1 => {
            let dataSorted = [];
            data1.map(item => {
            if (item.companyProfiles) {
                item.companyProfiles.map(it => dataSorted.push(it))
            } else {
                dataSorted.push(item)
            }
        })
        this.sortProfilesData (dataSorted)
        })
    }

    sortProfilesData (dataSorted) {
           
        let data2 = dataSorted;
        const results = new SearchResult(document.getElementById('results'));
        results.renderResults(data2)
        return data2
      
    }

    async getServerResults(){
        try {
        let inputVal = document.getElementById("myInput").value;
        this.setQueryOnAdressBar(inputVal)
        this.showSpinner()
        // this.fetchData(inputVal)
        let fetchedData = this.fetchData(inputVal) 
        let myurls = this.sliceAndCombineUrls(fetchedData)
            console.log(myurls)
        this.fetchProfilesData (myurls)

        } catch(error){
            // console.log(error)
            let overlayMessage = document.createElement("div");
            let popUp = document.getElementById("popUp")
            overlayMessage.setAttribute("class", "overlayMessage");
            overlayMessage.innerHTML = ('<div id="close"><div id="closePopUp">close &#215;</div></div><div id="errorText">Sorry, the website is down for mantainance</div>')
            popUp.appendChild(overlayMessage);
            document.getElementById('closePopUp').addEventListener('click', () => {popUp.style.visibility = "hidden"})
        }

    }

    onSearch() {

        document.getElementById('form').innerHTML=(`<div class="input-group mb-3">
        <input type="text" class="form-control" placeholder="Search" aria-label="Recipient's username" aria-describedby="button-addon2" id="myInput">
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" type="button" id="button-addon2">Search</button>
        </div>
        <div id="loadingResults" class="spinner-border text-secondary" role="status">
        <span class="sr-only">Loading...</span>
        </div>`)


            document
            .getElementById('button-addon2')
            .addEventListener('click', () => {this.getServerResults()});
            

            document
            .getElementById('myInput')
            .addEventListener('input', debounce(() => {this.getServerResults()}, 800));

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
}

