var express = require('express');
var router = express.Router();
const siteUrl = "https://www.timeshighereducation.com/rankings/united-states/2020#!/page/0/length/-1/sort_by/rank/sort_order/asc/cols/stats";
const axios = require("axios");
const cheerio = require('cheerio')

router.post('/scrape_college_ranking', async function(req, res, next) {
    //7.1 Scrape college rankings.  Scrape WSJ/THE 2020 rankings of all colleges in colleges.txt.
    // if(req.body.id==1){
    //     const result = await axios.get(siteUrl);
    //     const $ = cheerio.load(result.data);
    //     const txt = $("td").text();
    //     console.log(txt);
    //     console.log("hs");
    // }
    // return res.json({
    //     msg:"Welcome"
    // });

});

module.exports = router;