
class SearchForm {
    constructor(element, query) {
        this.id = element;
        this.someVariable = {};
        this.query = query;
        console.log(this.query)

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
        const response = await fetch(`http://localhost:5500/search?query=${inputVal}`)
        const data = await response.json();
        this.hideSpinner()
        console.log(data)
        return data
    }


    async sortProfilesData (dataSorted) {
           
        let data2 = await dataSorted;
        const results = new SearchResult(document.getElementById('results'));
        results.renderResults(data2)
        return data2
      
    }

    async getServerResults(){
        try {
        let inputVal = document.getElementById("myInput").value;
        this.setQueryOnAdressBar(inputVal)
        this.showSpinner()
        let fetchedData = this.fetchData(inputVal) 
        this.sortProfilesData (fetchedData)

        } catch(error){
            console.log(error)
        //     let overlayMessage = document.createElement("div");
        //     let popUp = document.getElementById("popUp")
        //     overlayMessage.setAttribute("class", "overlayMessage");
        //     overlayMessage.innerHTML = ('<div id="close"><div id="closePopUp">close &#215;</div></div><div id="errorText">Sorry, the website is down for mantainance</div>')
        //     popUp.appendChild(overlayMessage);
        //     document.getElementById('closePopUp').addEventListener('click', () => {popUp.style.visibility = "hidden"})
        }

    }

    async QuerygetServerResults(){
        try {
        let inputVal = document.getElementById("myInput").value;
            if (this.query === 'null' || this.query === '') {
                console.log("empty query")
            } else {
                inputVal = this.query
            }
        
        this.showSpinner()
        let fetchedData = this.fetchData(inputVal) 
        this.sortProfilesData (fetchedData)

        } catch(error){
            console.log(error)
        //     let overlayMessage = document.createElement("div");
        //     let popUp = document.getElementById("popUp")
        //     overlayMessage.setAttribute("class", "overlayMessage");
        //     overlayMessage.innerHTML = ('<div id="close"><div id="closePopUp">close &#215;</div></div><div id="errorText">Sorry, the website is down for mantainance</div>')
        //     popUp.appendChild(overlayMessage);
        //     document.getElementById('closePopUp').addEventListener('click', () => {popUp.style.visibility = "hidden"})
        }

    }

    onQuery() {

        document.getElementById('form').innerHTML=(`<div class="input-group mb-3">
        <input type="text" class="form-control" placeholder="Search" aria-label="Recipient's username" aria-describedby="button-addon2" id="myInput">
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" type="button" id="button-addon2">Search</button>
        </div>
        <div id="loadingResults" class="spinner-border text-secondary" role="status">
        <span class="sr-only">Loading...</span>
        </div>`)
        this.QuerygetServerResults()
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

