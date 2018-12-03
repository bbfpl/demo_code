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

let HandleObj = require('../lib/HandleObj');

let DataCache = new FileStore('./json/Data.json');
let Data_ERROR = new FileStore('./json/Data_ERROR.json');

let SaveDbDataCache = new FileStore('./json/SaveDbData.json');

let models = {
    init: function() {
        HandleObj.init(__dirname, function() {
            models.getItemUrl();
        });
    },
    getItemUrl: function() {
        let urls = DataCache.get('urls');
        if (urls != undefined && urls.length > 0) {
            models.openItemUrl(urls[0], function(res) {
                console.log('文章处理完成:' + res);

                //错误后加入到错误列表
                if (res == 'error') {
                    //错误后加入到错误列表
                    let errorUrls = Data_ERROR.get('urls');
                    if (errorUrls == undefined) {
                        errorUrls = [];
                    } else {
                        errorUrls.push(urls[0]);
                    };
                    Data_ERROR.set('urls', errorUrls);
                };

                urls.shift();
                DataCache.set('urls', urls);

                console.log('延时1s开始');
                models.init();

            });
        } else {
            console.log('内容全部获取完成');
        }
    },
    openItemUrl: function(data, callback) {

        HandleObj.start(data.downloadLink, function(_DATA) {
            models.uploadFile(data, _DATA, callback);
        });
    },
    uploadFile: function(data, _DATA, callback) {
        // console.log('开始上传zip');
        Tool.uploadFile2(_DATA.path, _DATA.name, function(err, res, link) {
            if (err == null) {
                data._files = res;
                data._TYPE = 'objmtl';
                data._preview_objmtl = _DATA.preview_objmtl;
                models.saveDataDb(data);
                callback('success');
            } else {
                console.log(err);
                callback('error');
            }

        });
    },
    saveDataDb: function(data) {
        let val = SaveDbDataCache.get('db');
        if (val == undefined) {
            val = [];
        } else {
            val.push(data);
        };
        SaveDbDataCache.set('db', val);
    }
};
models.init();

setInterval(function(){
    console.log('~');
}, 3000);