let http = require("http"),
    url = require("url"),
    fs = require("fs"),
    superagent = require("superagent"),
    cheerio = require("cheerio"),
    async = require("async"),
    eventproxy = require('eventproxy'),
    FileStore = require('fs-store').FileStore,
    Tool = require('../lib/Tool');
let Entities = require('html-entities').XmlEntities;
let entities = new Entities();


let DataCache = new FileStore('./json/Data.json');
let val = DataCache.get('urls');
console.log(val.length);

let SaveDbData = new FileStore('./json/SaveDbData.json');
let SaveDbDataval = SaveDbData.get('db');
console.log(SaveDbDataval.length);

//颜色提取
// var reg = /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/gi;
// var str = "background-color:#FF0000;";

// console.log(str.match(reg)[0]);
//

let content = '<script src="js/jquery-1.10.2.min.js"></script><script src="js/jquery.singlePageNav.js"></script><script src="js/jquery.flexslider.js"></script><script src="js/jquery.prettyPhoto.js"></script><script src="js/custom.js"></script>';
content.replace(/<script [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
  console.log(capture);
});