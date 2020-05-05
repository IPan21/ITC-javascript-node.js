const express = require('express');
const app = express();
require('es6-promise').polyfill();
require('isomorphic-fetch');
const cors = require('cors');
const mongodb = require('mongodb');

app.use(cors());

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
let db;
MongoClient.connect(url, function(err, client) {
  db = client.db("search");
  if (err) throw err;
});

app.get('/', (req, res) => {
   res.send('Hello')
});

app.get('/search', (req, res) => {
    const searchQuery = req.query.query;
    let response = fetchData(req.query.query)
    response.then((data) => {
        const searchResult = data;
        const obj = { searchQuery: searchQuery, searchResult: searchResult, createdDate: Date.now() };
        db.collection("SearchHistory").insertOne(obj, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          
        });
    res.send(data)
    });
});

app.get('/search-history', (req, res) => {
    const mysort = { createdDate: -1 };
    db.collection("SearchHistory").find().sort(mysort).toArray(function(err, result) {
        if (err) throw err;
        res.send(result);
        return result
    });
});

app.delete('/search-history/:id', (req, res) => {
    let query = req.params.id
    db.collection("SearchHistory").deleteOne({_id: new mongodb.ObjectID(query)}, function(err, obj) {
        if (err) throw err;
        console.log('del')
        res.send("document removed");
    });
});


async function fetchData(inputVal) {
    const response = await fetch('https://financialmodelingprep.com/api/v3/search?query=' + inputVal + '&limit=10&exchange=NASDAQ');
    if (!response.ok || inputVal === 'null' || inputVal === '') {
        console.log('invalid input')
        throw err
    } else {
        const data = await response.json();
    const myUrls = await sliceAndCombineUrls(data);
    const sorted = fetchProfilesData (myUrls)
    return (sorted)
    }
    
}


async function sliceAndCombineUrls(attempt) { 
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

async function fetchProfilesData (myurls) {
    let urls = await myurls
    let sorted = await Promise.all(urls.map(u=>fetch(u))).then(responses =>
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
    return (dataSorted)
    })
    return(sorted)
}

const PORT = 5500;
app.listen(PORT, () => {
    console.log(`Listening to PORT ${PORT}... Press Ctrl+C to quit.`);
  });