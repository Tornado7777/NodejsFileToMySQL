const fs = require("fs");
const setConn = require('./settingConnectMySQL.json')


//смена пользователей базы и используемых базданных

module.exports = {

    createSetConnection: async function () {
        const setConnChangeSecDB = {
            host: '127.0.0.1',
            port: '3306',
            user: 'userMagazineName',
            database: 'magazineName',
            password: 'hdgkhgk13re'
        };

        const setConnReadOnlySecDB = {
            host: '127.0.0.1',
            port: '3306',
            user: 'userROmagazineName',
            database: 'magazineName',
            password: 'kid0I7213Der'
        };

        const setConnChangeWorkDB = {
            host: '127.0.0.1',
            port: '3306',
            user: 'usermagazineName2',
            database: 'magazineName2',
            password: 'hgyNK765litr'
        };
        const setConnReadOnlyWorkDB = {
            host: '127.0.0.1',
            port: '3306',
            user: 'userROmagazineName2',
            database: 'magazineName2',
            password: 'dfge6732ghRTDk'
        };

        const setConnect = {
            setConnChangeSecDB,
            setConnReadOnlySecDB,
            setConnChangeWorkDB,
            setConnReadOnlyWorkDB
        };

        fs.writeFile('./mySQLEchange/settingConnectMySQL.json', JSON.stringify(setConnect), (err) => {
            if (err) console.log('Error');
        });
    },
    changeWorkDB: async function () {
        
        const setConnChangeSecDB = setConn.setConnChangeWorkDB;

        const setConnReadOnlySecDB = setConn.setConnReadOnlyWorkDB;

        const setConnChangeWorkDB = setConn.setConnChangeSecDB;;
        const setConnReadOnlyWorkDB = setConn.setConnReadOnlySecDB;

        const setConnect = {
            setConnChangeSecDB,
            setConnReadOnlySecDB,
            setConnChangeWorkDB,
            setConnReadOnlyWorkDB
        };

        //console.log(setConn);
        //console.log(setConnect);

        fs.writeFile('./mySQLEchange/settingConnectMySQL.json', JSON.stringify(setConnect), (err) => {
            if (err) console.log('Error');
        });

    }
}