

let req = require("request");
let ch = require("cheerio");
let obj = require("./match.js");
const { processMatch } = require("./match.js");

console.log("Before");
// let url = 'https://www.espncricinfo.com/series/ipl-2020-21-1210595/match-results';
function getScoreCardUrl(url) {

    req(url, cb);
}
function cb(error, response, data) {
    // resoure not  found
    if (response.statusCode == 404) {
        console.log("Page not found");
        // resource found
    } else if (response.statusCode == 200) {
        // console.log(data);
        parseHTML(data);
    } else {
        console.log(err);
    }
}
function parseHTML(data) {
    let fTool = ch.load(data);
    let AllScorecardElem = fTool('a[data-hover="Scorecard"]');
    for (let i = 0; i < AllScorecardElem.length; i++) {
        let url = ch(AllScorecardElem[i]).attr("href");
        let fullUrl = "https://www.espncricinfo.com" + url;
        obj.pm(fullUrl);
    }
}


module.exports = {
    getScoreCardUrl: getScoreCardUrl
}