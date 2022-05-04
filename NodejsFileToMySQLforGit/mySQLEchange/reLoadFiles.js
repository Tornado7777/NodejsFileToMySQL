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
        //�������� � ���� �� �����
        /*����� ��������� ������� ��������� � ����������, ���������, ���������, ���-��� ��������� ������
         * (�������)
        */
        await NewStructure();

        
        //������ ������� ��������� � ������� ���������
        for (let i = 0; i < categories.length; i++) {
            category = await delSpecSymbol.delFromCategory(categories[i].$t, categories[i].parentId, categories[i].id, categories[i].url, categories[i].ordering);
            await sql.AddTables(category);
        }

        //�������� ������� ��������� � ������� ���������
        var stil = new Array();
        for (let i = 0; i < offers.length; i++) {
            //����� �������� �� ���������
            model = "";
            stil = "";
            oldprice = "0";
            if ('oldprice' in offers[i]) oldprice = offers[i].oldprice.$t; //�������� ���� �� ���� oldprice, ���� ���� �� ������� �������� ����������
            console.log('Sent to work good have id ' + offers[i].id);
            //�������� �������� �� param �������� ��� ����� ���� ������, � ������������ � ������������ �������� ��������
            if (isArray(offers[i].param)) {
                model = offers[i].param[0].$t;
                for (j = 1; j < offers[i].param.length; j++) {
                    stil = stil + offers[i].param[j].$t + ' ';
                }
            } else model = offers[i].param.$t;
            //������ ������ ������� � �������� � ���� � ������� ������
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
            //��������� ������������ ����� � ����
            await sql.AddGood(offer);
            //��������� �� ������ ���� ��� �������� ������� ���������
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