
async function deleteData(item) {
    const response = await fetch('http://localhost:5500/search-history/' + item, {method: 'delete'});
    const json = await response.text();
    return response;
  }

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

function ButtonInTheList (element, item){
    const button = document.createElement("button")
    button.innerText = "Delete";
    element.appendChild(button)

    button.addEventListener('click', () => {
        deleteData(item._id)
        location.reload();
        dblist.CreateList()
  })
}

async function fetchData() {
const response = await fetch(`http://localhost:5500/search-history`)
const data = await response.json();
return data
}

class MyDBList {
    constructor(element) {
        this.id = element;
    }

    async CreateList() {
        try {
        let data = await fetchData();
        data.map(item => {
            let div = document.getElementById("list");
            div.className = "container mt-5 shadow-lg p-5 bg-white rounded"
            let ul = document.createElement("ul");
            div.appendChild(ul);
            let d = new Date(item.createdDate);
            let li = document.createElement("li");
            li.className = "listrow"
            let resultlinebox = document.createElement("div");
            resultlinebox.innerHTML = (`<a href="index.html?query=${item.searchQuery}">` + `<b>` + 'Search query: ' + `</b>` + item.searchQuery + '&nbsp;&nbsp;&nbsp;' +`<b>` + ' Date: ' + `</b>` + d.toString() + `</a>`)
            resultlinebox.className = 'resultlinebox';
                
            
            item.searchResult.map(item => {
                
                let resultline = document.createElement("div");
                resultline.className = 'resultline'
                resultline.innerHTML = (item.symbol + '&nbsp;&nbsp;&nbsp;||&nbsp;&nbsp;&nbsp;' + item.profile.companyName) 
                resultlinebox.appendChild(resultline)
                li.appendChild(resultlinebox)
            })
            ul.appendChild(li);
            const buttonCompare = new ButtonInTheList (li, item);
            
            })
        } catch (err) {
            console.log(err)
        }
    }
}


const dblist = new MyDBList(document.getElementById("list"))
dblist.CreateList()

