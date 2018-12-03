let http = require("http"),
    url = require("url"),
    fs = require("fs"),
    superagent = require("superagent"),
    cheerio = require("cheerio"),
    async = require("async"),
    eventproxy = require('eventproxy'),
    FileStore = require('fs-store').FileStore,
    DB = require('../lib/Db_MySql'),
    Tool = require('../lib/Tool');
let Entities = require('html-entities').XmlEntities;
let entities = new Entities();

let SaveDbDataCache = new FileStore('./json/SaveDbData.json');
let Data_ERROR = new FileStore('./json/SaveDbData_Error.json');

//ALTER TABLE `app_post` ADD `om_bg_color` VARCHAR(20) NOT NULL COMMENT '3d默认背景颜色' AFTER `put_time`, ADD `author` VARCHAR(100) NOT NULL COMMENT '作者' AFTER `om_bg_color`, ADD `om_preview` TEXT NOT NULL COMMENT '3d预览' AFTER `author`;

let models = {
    init: function() {
        this.getItemUrl();
    },
    getItemUrl: function() {
        let db = SaveDbDataCache.get('db');
        if (db != undefined && db.length > 0) {
            models.openItemUrl(db[0]);
        } else {
            console.log('内容全部获取完成');
        }
    },
    openItemUrl: function(data) {
        // console.log(data);
        this.addFile(data._files, data);
    },
    addFile: function(data, objData) {
        data.is_put = 0;
        data.time = new Date().getTime();

        //先查询
        DB.find('app_files', {
            fields: 'id',
            where: [{
                md5: data.md5
            }]
        }, function(res) {
            if (res == false) {
                DB.insert('app_files', data, function(fileid) {
                    console.log('save success,file ID:' + fileid);
                    objData._fileID = fileid;
                    models.addCategory(objData);
                });
            } else {
                console.log('find success !file ID:' + res.id);
                objData._fileID = res.id;
                models.addCategory(objData);
            }
        });
    },
    addCategory: function(objData) {
        DB.find('app_categorys', {
            fields: 'id',
            where: [{
                category_en: objData.category
            }]
        }, function(res) {
            if (res == false) {
                DB.insert('app_categorys', {
                    category_zh: '',
                    category_en: objData.category,
                    parent: 73,
                    is_put: 0
                }, function(cid) {
                    console.log('save success,category ID:' + cid);
                    objData.parent_category_id = 73;
                    objData.category_id = cid;
                    models.addPost(objData);
                });
            } else {
                console.log('find success,category ID:' + res.id);
                objData.parent_category_id = 73;
                objData.category_id = res.id;
                models.addPost(objData);
            }
        });
    },
    addPost: function(data) {
        // if (data) data = {};
        let insData = {
            time: new Date().getTime(),
            om_bg_color: data.bg_color,
            parent_category_id: data.parent_category_id,
            category_id: data.category_id,
            author: data.author,
            collection_sources: data.downloadLink,
            om_preview: Tool.sTb(Tool.Json_oTs(data._preview_objmtl)),
            title: data.title,
            content: Tool.sTb(data.content),
            type: 4,
            file_id: data._fileID,
            md5: Tool.md5(data.downloadLink),
            is_put: false,
            status: 0
        };
        // console.log(insData);
        DB.insert('app_post', insData, function(dbres) {
            console.log('保存成功,post ID是:' + dbres);
            models.end();
        });
    },
    end: function() {
        
        let db = SaveDbDataCache.get('db');
        db.shift();
        SaveDbDataCache.set('db', db);
        console.log('处理完成');
        models.init();
    }
};
models.init();