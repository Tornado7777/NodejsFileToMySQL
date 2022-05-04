const reLoad = require('./mySQLEchange/reLoadFiles');
const prepareFiles = require('./mySQLEchange/prepareFiles');


pathFiles = './MagazineFiles/FromMagazine.xml';  //путь до файла
prepareFiles(pathFiles); //подготавливаем файлы для перевода xml в  json форма
reLoad(pathFiles);



//const timeReLoad = 1000; //раз в сутки 86400*1000 - 1000 милисекунд в секунде 60 секунд в минут, 60 минут в часе, 24 часа в сутках 60*60*24*1000
//setInterval(() => { reLoad(pathFiles) }, timeReLoad); //multisearch.xml');

