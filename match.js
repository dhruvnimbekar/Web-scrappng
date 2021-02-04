let req = require("request");
let ch = require("cheerio");
const fs = require("fs");
let xlsx = require("xlsx");
let path = require("path");

//req('https://www.espncricinfo.com/series/ipl-2020-21-1210595/royal-challengers-bangalore-vs-sunrisers-hyderabad-eliminator-1237178/full-scorecard', cb);
function processMatch(url){
    req(url,cb);
}
function cb(error, response, data) {
    if (response.statusCode == 404) {
        console.log("Page not found");
    } else if (response.statusCode == 200) {
        // console.log(data);
       parseHTML(data);
    } else {
        console.log(err);
    }

}


function parseHTML(data){
    // fs.writeFileSync("web.htm",data);
    // console.log('file saved');
    let ftool = ch.load(data);
    let elems = ftool(".Collapsible");
   // let fullpageHTML = "";
for(let i = 0 ;i < elems.length ; i++){
// fullpageHTML += ch(elems[i]).html() + '</br>';

let InningElement = ch(elems[i]);
  let teamName = InningElement.find("h5").text();
  let arr = teamName.split('INNINGS') ;
  console.log(arr[0]);
teamName = arr[0].trim();
  let playerRows = InningElement.find(".table.batsman tbody tr");

for(let j = 0; j < playerRows.length ; j++){
    let col= ch(playerRows[j]).find('td');
    let isAllowed = ch(col[0]).hasClass("batsman-cell");
    if(isAllowed){
        let playerName = ch(col[0]).text().trim();
        let runs = ch(col[2]).text().trim();
        let balls = ch(col[3]).text().trim();
        let fours = ch(col[5]).text().trim();
        let sixes = ch(col[6]).text().trim();
        let sr = ch(col[7]).text().trim();
    processPlayer(playerName,runs,balls,sixes,fours,sr,teamName);
    }
}


 }


//  fs.writeFileSync("table.html",fullpageHTML);
//  console.log("done");


}

function processPlayer(playerName,runs,balls,sixes,fours,sr,teamName){

    let playerObject = {
        playerName: playerName,
        runs: runs,
        balls: balls, sixes,
        fours: fours,
        sr: sr, teamName
    }

let dirExist = checkExistence(teamName);

if(dirExist){

}else{

   createFolder(teamName); 
}


   let playerFileName = path.join(__dirname,teamName,playerName + ".xlsx");
   let fileExist = checkExistence(playerFileName);
   let playerEntries = [];
   if(fileExist){
     
   let JSONdata = excelReader(playerFileName,playerName);
   //fs.readFileSync(playerFileName);
    playerEntries = JSONdata;
    playerEntries.push(playerObject);
   //fs.writeFileSync(playerFileName,JSON.stringify(playerEntries));
   excelWriter(playerFileName, playerEntries, playerName);

   }else{
    playerEntries.push(playerObject);
   // fs.writeFileSync(playerFileName,JSON.stringify(playerEntries));
   excelWriter(playerFileName, playerEntries, playerName);

   }
}

function checkExistence(teamName){
  return fs.existsSync(teamName);
}

function createFolder(teamName){
fs.mkdirSync(teamName);

}

function excelReader(filePath, name) {
    if (!fs.existsSync(filePath)) {
        return null;
    } else {
        // workbook => excel
        let wt = xlsx.readFile(filePath);
        // csk -> msd
        // get data from workbook
        let excelData = wt.Sheets[name];
        // convert excel format to json => array of obj
        let ans = xlsx.utils.sheet_to_json(excelData);
        // console.log(ans);
        return ans;
    }
}


function excelWriter(filePath, json, name) {
    // console.log(xlsx.readFile(filePath));
    let newWB = xlsx.utils.book_new();
    // console.log(json);
    let newWS = xlsx.utils.json_to_sheet(json);
    // msd.xlsx-> msd
    xlsx.utils.book_append_sheet(newWB, newWS, name);  //workbook name as param
    //   file => create , replace
    xlsx.writeFile(newWB, filePath);
}
module.exports = {
    pm: processMatch
}