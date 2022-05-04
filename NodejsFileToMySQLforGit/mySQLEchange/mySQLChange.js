const setConnect = require('./settingConnectMySQL.json')
const mysql = require("mysql2/promise");
/*const Parser = require("mysql/lib/protocol/Parser");*/

//configuration for magzineName
const setConn = setConnect.setConnChangeSecDB;



module.exports = {
    //функция очистки бд
    CleaningDB: async function () {
        result = "CleaningDB";
        //получаю список таблиц в БД 
        let sqlQuery = `SHOW TABLES`; //SELECT table_name FROM information_schema.tables WHERE table_schema =\`${setConn.database}\``;
        const conn = await mysql.createConnection(setConn);
        tables = await conn.execute(sqlQuery);
        for (i = 0; i < tables[0].length; i++) {
            if (setConn['database'] == 'MagazineName2') sqlQuery = `DROP TABLE \`${tables[0][i]['Tables_in_magazinename2']}\``;
            if (setConn['database'] == 'MagazineName') sqlQuery = `DROP TABLE \`${tables[0][i]['Tables_in_magazinename']}\``;
            await conn.execute(sqlQuery);
            };

        await conn.end();
        return result;
    },
    //удаление пустых таблиц
    DelEmptyTables: async function () {
        let sqlQuery = `SHOW TABLES`; 
        const conn = await mysql.createConnection(setConn);
        let tables = await conn.execute(sqlQuery);
        for (i = 0; i < tables[0].length; i++) {
            if (setConn['database'] == 'MagazineName2') sqlQuery = `SELECT * FROM \`${tables[0][i]['Tables_in_magazinename2']}\` LIMIT 1`;
            if (setConn['database'] == 'MagazineName') sqlQuery = `SELECT * FROM \`${tables[0][i]['Tables_in_magazinename']}\` LIMIT 1`;
            let resultQuery = await conn.execute(sqlQuery);
            if (resultQuery[0].lenght == 0) {
                if (setConn['database'] == 'magzineName2') sqlQuery = `DROP TABLE \`${tables[0][i]['Tables_in_magzineName2']}\``;
                if (setConn['database'] == 'magzineName') sqlQuery = `DROP TABLE \`${tables[0][i]['Tables_in_magzineName']}\``;
                await conn.execute(sqlQuery);
            }
        };

        await conn.end();
    },
    
    //функция создания структуры таблиц категорий
    CraetedStructure: async function () {
        var result = "";
        let sqlQuery = `CREATE TABLE \`structure\` (
                \`CategoryId\` INT NOT NULL,
                \`nameCategory\` VARCHAR(100) NULL,
                \`parentId\` INT NULL DEFAULT 0,
                \`url\` VARCHAR(255) NULL,
                \`ordering\` INT NULL DEFAULT 0,
                 \`level\` INT NULL DEFAULT 0,
                 PRIMARY KEY (\`CategoryId\`))`;
        result = await SendQuery(sqlQuery);
        return result;
    },

    //функция добавления таблицы категории  и словаря категории
    AddTables: async function (category) {
        level = 0;
        let sqlQuery = `CREATE TABLE \`${category.id}\`
            (
            \`offerid\` INT NOT NULL,
            \`url\` VARCHAR(255) NULL,
            \`price\` INT NULL,
            \`picture\` VARCHAR(255) NULL,
            \`createdAt\` DATETIME NULL,
            \`name\` VARCHAR(255) NULL,
            \`oldprice\` INT NULL,
            \`brand\` VARCHAR(45) NULL,
            \`brandCode\` VARCHAR(45) NULL,
            PRIMARY KEY(\`offerid\`),
            UNIQUE INDEX\`offerid_UNIQUE\`(\`offerid\` ASC) VISIBLE);`;
        result = await SendQuery(sqlQuery);
        console.log('CREAT TABLE for category ' + category.id);
        if (category.parentId != "") {
            sqlQuery = `SELECT * FROM structure WHERE CategoryId = ${category.parentId}`;
            result = await SendQuery(sqlQuery);
            level = result[0][0].level + 1;
        }
        else category.parentId = "0";
        sqlQuery = `INSERT INTO \`${setConn.database}\`.\`structure\` (\`CategoryId\`, \`nameCategory\`, \`parentId\`,\`url\`, \`level\`) VALUES (\'${category.id}\', \'${category.Name}\', \'${category.parentId}\',\'${category.url}\', \'${level}\');`;
        result = await SendQuery(sqlQuery);
        sqlQuery2 = `CREATE TABLE \`${category.id}Dictionary\`
            (
            \`word\` VARCHAR(25) NULL,
            \`offerIds\` VARCHAR(5000) NULL DEFAULT '',
            \`wordid\` INT NOT NULL,
            PRIMARY KEY(\`wordid\`),
            UNIQUE INDEX\`wordid_UNIQUE\`(\`wordid\` ASC) VISIBLE);`;
        result = await SendQuery(sqlQuery2);
        console.log('CREAT TABLE for dictionary categoryId ' + category.id);
        return result;
    },
    //функция добавления товара в таблицу по Id категории
    AddGood: async function (offer) {
        
        sqlQuery = `INSERT INTO \`${setConn.database}\`.\`${offer.categoryId}\` (\`offerid\`,\`url\`,\`price\`,\`picture\`,\`createdAt\`,
                    \`name\`,\`oldprice\`,\`brand\`,\`brandCode\`)
                        VALUES
                    (\'${offer.id}\',\'${offer.url}\',\'${offer.price}\', \'${offer.picture}\', \'${offer.createdAt}\',
                    \'${offer.name}\',\'${offer.oldprice}\',\'${offer.brand}\',\'${offer.brandCode}\')`;
        result = await SendQuery(sqlQuery);
        return result;
    },
    //функция добавления слова в словарь категории
    AddWordInCategory: async function (word, categoryId) {
        sqlQuery = `INSERT INTO \`${setConn.database}\`.\`${categoryId}dictionary\` (\`word\`, \`offerIds\`, \`wordid\`) VALUES
                    (\'${word[0]}\', \'${word[1]}\', \'${word[2]}\');`;
        result = await SendQuery(sqlQuery);
        return result;
    },
    //функция обновления записи в словаре по wordid
    UpdateWordInCategory: async function (word, categoryId) {
        
        sqlQuery = `UPDATE \`${setConn.database}\`.\`${categoryId}dictionary\` SET\`word\` = \'${word[0]}\', \`offerIds\` = \'${word[1]}\' WHERE(\`wordid\` = \'${word[2]}\');`;
        result = await SendQuery(sqlQuery);
        return result;
    },
    //функция загрузки содержимого словаря категории
    LoadIdDictionary: async function (categoryId) {
        sqlQuery = `SELECT * FROM ${setConn.database}.${categoryId}dictionary;`;
        result = await SendQuery(sqlQuery);
        return result;
    },
}

//функция отправки запроса в mySQL
async function SendQuery(sqlQuery) {
    const conn = await mysql.createConnection(setConn);
    result = await conn.execute(sqlQuery);
    await conn.end();
    return result;
}
