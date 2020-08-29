
class CompanyInfo {
    constructor(element, symbol) {
        this.id = element;
        this.symbol = symbol;
    }

    async load() {
        let container = document.getElementById("cardsRow")
        for (let i = 0; i < this.symbol.length; i++) {
            
            let innerContainer = document.createElement("div");
            innerContainer.setAttribute('id', "container" + this.symbol[i]+1)
            innerContainer.setAttribute('class', "col-11 col-md-5 col-xl-3 shadow-lg ")
            innerContainer.innerHTML = (`
            <div id="compInfo` + i + `" class="row d-flex h-50 align-content-start">
                    <div class="col-12">
                        <div id="logoDiv` + i + `" class="d-flex justify-content-left">
                        </div>
                    </div>
                    <div class="col-12">
                        <div id="companyName` + i + `" class="companyName d-flex">
                        </div>
                    </div>
                    <div class="col-12">
                        <div id="sector` + i + `" class="sector">
                        </div>
                    </div>
                    <div class="col-12">
                        <div id="loadingResults` + i + `" class="loadingResults spinner-border text-secondary" role="status"><span class="sr-only">Loading...</span>
                        </div>
                    </div>
                    <div class="col-12">
                        <div id="stockPrice` + i + `" class="stockPrice">
                        </div>
                        <div id="changesPercentage` + i + `" class="percentsGreen">
                        </div>
                    </div>
                    <div class="col-12">
                        <div id="description` + i + `" class="description">
                        </div>
                    </div>
            </div>
            <div class="row h-50 col-12 align-content-end">
                    <div class="col-12">
                    <canvas id="myChart` + i + `" class="myChart" width="100" height="100"></canvas>
                    </div>   
            </div>
            `)
            container.appendChild(innerContainer)

            let company;
            document.getElementById(`loadingResults` + i).style.display = 'inline'; 

        try {
            const response = await fetch(`http://localhost:5500/company/profile/${this.symbol[i]}`);
            const data = await response.json();
            company = data.profile;
            let percents = company.changesPercentage.slice(1,-2);
            percents = parseFloat(percents)
            
            if (percents <= 0) {
                document.getElementById(`changesPercentage` + i).className = 'percentsRed';
            } else {
                document.getElementById(`changesPercentage` + i).className = 'percentsGreen';
            }
        
            document.getElementById(`logoDiv` + i).innerHTML = `<img src='` + company.image + `'>`;
            document.getElementById(`companyName` + i).innerHTML = company.companyName;
            document.getElementById(`sector` + i).innerHTML = '(' + company.sector + ')';
            document.getElementById(`stockPrice` + i).innerHTML = 'Stock price: ' + ' $' + company.price;
            document.getElementById(`changesPercentage` + i).innerHTML = ' ' + company.changesPercentage;
            document.getElementById(`description` + i).innerHTML = company.description;
            document.getElementById(`loadingResults` + i).style.display = 'none';
            } catch(error) {
                console.log(error)
            }
        
        }
    }

    async addChart(){
        for (let i = 0; i < this.symbol.length; i++) {
        try {    
            const response = await fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${this.symbol[i]}?serietype=line`);
            const data = await response.json();
            let rowNumber = 0;
            let dates = [];
            let number = data.historical.length;
            let biggest = data.historical[number - 1];
            for (let i = 0; i < 11; i++) {
                if (i === 10) {
                    dates.push(biggest.date);
                } else {
                dates.push(data.historical[rowNumber].date);
                rowNumber = rowNumber + (Math.ceil(data.historical.length * 0.1));}
            }

            let rowNumber1 = 0;
            let prices = [];
            for (let i = 0; i < 11; i++) {
                if (i === 10) {
                    prices.push(biggest.close);
                } else {
                    prices.push(data.historical[rowNumber1].close);
                    rowNumber1 = rowNumber1 + (Math.ceil(data.historical.length * 0.1));
                }
                

            }
                

            let ctx = document.getElementById(`myChart` + i);
            let chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dates,
                datasets: [{
                    label: 'Stock Price Hystory',
                    backgroundColor: 'rgb(102, 178, 255)',
                    borderColor: 'rgb(51, 153, 255)',
                    data: prices
                       }]
                     },
                    options: {}
                    });
    
                    
            } catch(error) {
                console.log(error)
            }
    }
    }
    

}





