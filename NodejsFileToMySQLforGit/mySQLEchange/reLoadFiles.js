const fs = require("fs");
const xmlParser = require("xml2json");
const sql = require("./mySQLChange");
const delSpecSymbol = require("./delSpecSymbol");
const setConn = require('./SetConnection')
const dictionaryCategory = require("./createDictionaryCategory");


module.exports = function (pathFiles) {
    fs.readFile(pathFiles, async function (err, data) {
        if (err) throw err;
        const xmlObj = xmlParser.toJson(data, { reversible: true, object: true }); //xmlParser
        const categories = xmlObj["yml_catalog"]["shop"]["categories"]["category"];
        const offers = xmlObj["yml_catalog"]["shop"]["offers"]["offer"];
        //отправка в базу из файла
        /*также создается таблица структуры с категорией, названием, родителем, кол-вом категорий сверху
         * (уровень)
        */
        await NewStructure();

        
        //создаю таблицы категорий и словари категорий
        for (let i = 0; i < categories.length; i++) {
            category = await delSpecSymbol.delFromCategory(categories[i].$t, categories[i].parentId, categories[i].id, categories[i].url, categories[i].ordering);
            await sql.AddTables(category);
        }

        //заполняю таблицы категорий и словари категорий
        var stil = new Array();
        for (let i = 0; i < offers.length; i++) {
            //задаю значения по умолчанию
            model = "";
            stil = "";
            oldprice = "0";
            if ('oldprice' in offers[i]) oldprice = offers[i].oldprice.$t; //проверяю есть ли поле oldprice, если есть то присваю значение переменной
            console.log('Sent to work good have id ' + offers[i].id);
            //проверяю является ли param массивом или имеет одну строку, в соответствии с резулбьтатом заполняю значения
            if (isArray(offers[i].param)) {
                model = offers[i].param[0].$t;
                for (j = 1; j < offers[i].param.length; j++) {
                    stil = stil + offers[i].param[j].$t + ' ';
                }
            } else model = offers[i].param.$t;
            //убираю лишние символы в запросах в базу и получаю массив
            let offer = await delSpecSymbol.delFromOffer(
                offers[i].id,
                offers[i].url.$t,
                offers[i].price.$t,
                offers[i].categoryId.$t,
                offers[i].picture.$t,
                offers[i].createdAt.$t,
                offers[i].name.$t,
                oldprice,
                offers[i].vendor.$t,
                offers[i].vendorCode.$t,
            );
            //отправляю разпарсенный товар в базу
            await sql.AddGood(offer);
            //отправляю на разбор поля для создания словаря категории
            let dictionary = [
                offers[i].name.$t,
                offers[i].description.$t,
                offers[i].vendor.$t,
                offers[i].vendorCode.$t,
                model,
                stil
            ]
            await dictionaryCategory(offer.categoryId, offer.id, dictionary);
            await sql.DelEmptyTables();
            await setConn.changeWorkDB();
        }
      
    })
}

async function NewStructure() {
    result = await sql.CleaningDB();
    console.log(result);
    result = await sql.CraetedStructure();
    console.log(result);
    return;
}

function isArray(value) {
    return Object.prototype.toString.call(value) === '[object Array]';
}