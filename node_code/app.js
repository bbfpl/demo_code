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

let itemsUrlFile = new FileStore('./json/itemsUrl.json');
let urlsFile = new FileStore('./json/urls.json');
let Md5Cache = new FileStore('./json/MD5.json');
let ErrorCache = new FileStore('./json/Error.json');

let DataCache = new FileStore('./json/Data.json');

// //获取urlmod
var mod = {
    init: function() {
        console.log('初始化');
        //获取所有url
        // this.readFile();
        // 获取最后获得url数量
        // let val = urlsFile.get('urls');
        // console.log(val.length);
        // 去重url
        let vals = itemsUrlFile.get('urls');
        vals.forEach(function(v){
            mod.urlsSave(v);
        });

    },
    urlA: function(url) {
        var _tlc = url.substr(0, 1).toLowerCase();
        console.log();
        if (_tlc == '.') {
            return url.substr(1);
        } else {
            return url;
        }
    },
    readFile: function() {
        let filePath = './txt/home.txt';
        console.log('读取文件：' + filePath);
        fs.readFile(filePath, function(err, data) {
            // 读取文件失败/错误
            if (err) {
                throw err;
            }
            // 读取文件成功
            let $ = cheerio.load(data);
            mod.getUrl($);
        });
    },
    getUrl: function($) {
        var urls = $('.Kszkwb a.BMggu-r4nke');
        console.log('有url:' + url.length);
        urls.each(function() {
            let _href = $(this).attr('href');
            console.log('保存url:' + _href);
            mod.itemUrlSave({
                url: mod.urlA(_href)
            });
        });

    },
    itemUrlSave: function(data) {
        let val = itemsUrlFile.get('urls');
        if (val == undefined) {
            val = [];
        } else {
            val.push(data);
        };
        itemsUrlFile.set('urls', val);
    },
    urlsSave: function(data) {
        let md5 = Tool.md5(data.url);
        if (!Md5Cache.get(md5, 0)) {
            Md5Cache.set(md5, 1);

            let val = urlsFile.get('urls');
            if (val == undefined) {
                val = [];
            } else {
                val.push(data);
            };
            urlsFile.set('urls', val);

            console.log('链接保存完成');
        } else {
            console.log('已存在,不保存缓存 ' + data.url);
        };

    }
};
// mod.init();

//获取data
var models = {
    domain: 'https://poly.google.com',
    fields: [{
        name: 'bg_color',
        selector: ['.lBiGI', 'style'],
        type: 'string',
    }, {
        name: 'title',
        selector: ['.MERCbb-r4nke .Xl2sXb-r4nke', 'text'],
        type: 'string',
    }, {
        name: 'category',
        selector: ['.NOWNBf-ag38of-jfdpUb.FHtwc', 'text'],
        type: 'string',
    }, {
        name: 'author_link',
        selector: ['.sasd3b-Tswv1b-haAclf a', 'href'],
        type: 'string',
    }, {
        name: 'author',
        selector: ['.sasd3b-Tswv1b-haAclf .sasd3b-V1ur5d', 'text'],
        type: 'string',
    }, {
        name: 'content',
        selector: ['.XLfmNe', 'text'],
        type: 'string',
    }, {
        name: 'downloadLink',
        selector: ['.uyYuVb.oJeWuf', 'data-value'],
        type: 'array',
    }],
    init: function() {
        this.getItemUrl();
    },
    getItemUrl: function() {
        let urls = urlsFile.get('urls');
        if (urls != undefined && urls.length > 0) {

            let index = (urls.length <= 50) ? urls.length : 50;

            let map = [];
            for (let i = 0; i < index; i++) {
                let _nowurl = urls[i];
                map.push(function(done) {
                    var delay = parseInt((Math.random() * 10000000) % 20000, 10);

                    setTimeout(function() {
                        console.log('延时打开:' + delay);
                        models.openItemUrl(_nowurl, function(res) {
                            console.log('文章处理完成:' + res + ' ---1:' + i);
                            //错误后加入到错误列表
                            if (res == 'error') {
                                //错误后加入到错误列表
                                let errorUrls = ErrorCache.get('urls');
                                if (errorUrls == undefined) {
                                    errorUrls = [];
                                } else {
                                    errorUrls.push(_nowurl);
                                };
                                ErrorCache.set('urls', errorUrls);
                            };

                            console.log('okkkkkk');
                            urls.shift();
                            urlsFile.set('urls', urls);
                            done();
                        });
                    }, delay);

                });
            };
            Tool.parallel(map, function(err, result) {
                if (err) {
                    console.log('错误:' + err);
                    return false;
                };
                console.log('完成');
                console.log('延时0s开始');
                models.getItemUrl();
            });


        } else {
            console.log('内容全部获取完成');
        }
    },
    openItemUrl: function(data, callback) {
        console.log('打开链接中' + data.url);
        let url = models.domain + data.url;
        superagent.get(url).end(function(err, res) {
            // console.log(err);
            // console.log(res);
            // 常规的错误处理
            if (err != null) {
                console.log('openItemUrl 错误:' + err);
                //页面打开错误
                callback('error');
                return false;
            };
            let $ = cheerio.load(res.text);
            // console.log(res.text);
            models.getFields($, data, callback);
        });
    },
    valDef: function(val, defVal) {
        return Tool.isEmpty(val) ? defVal : val;
    },
    getFields: function($$, data, callback) {

        let fields = models.fields;
        let arrData = {};
        // console.log(fields);
        for (i in fields) {
            let val = null,
                fieldName = fields[i].name, //字段名称
                selector = fields[i].selector,
                _type = fields[i].type, //保存字段type
                _find = fields[i]._find, //查找
                _remove = fields[i]._remove, //删除
                _strReplace = fields[i]._strReplace, //字符串 替换

                selector_reg = selector[0],
                selector_ext = selector[1];

            if (selector_ext == 'text') {
                if (_type == 'string') {
                    val = $$(selector_reg).text();
                    val = entities.decode(val);
                } else {
                    let vals = [];
                    $$(selector_reg).each(function() {
                        let self = $$(this);
                        let _val = entities.decode(self.text());
                        vals.push(_val);
                    });
                    val = JSON.stringify(vals);
                }
            } else if (selector_ext == 'html') {
                if ($$(selector_reg).length > 0) {
                    val = $$(selector_reg).html();
                    val = entities.decode(val);
                }
            } else {
                //attr
                val = $$(selector_reg).attr(selector_ext);
                val = entities.decode(val);
            }
            arrData[fieldName] = val;
        };
        arrData['bg_color'] = models.valDef(arrData['bg_color'], '#212121');
        //arrData['downloadLink'] = arrData.downloadLink;//Tool.urlCompletion(arrData.downloadLink, models.domain || '');
        console.log(arrData);
        models.saveData(arrData, callback);
    },
    saveData: function(data, callback) {
        if (Tool.isEmpty(data['downloadLink'])) {
            callback('error');
        } else {
            let val = DataCache.get('urls');
            if (val == undefined) {
                val = [];
            } else {
                val.push(data);
            };
            DataCache.set('urls', val);

            callback('success');
        }
    }
};
models.init();