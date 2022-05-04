const sql = require("./mySQLChange");

module.exports = async function (categoryId, offerId, offerMas) {
    let words = new Array();
    for (i = 0; i < offerMas.length; i++) {
        if (offerMas[i].length > 0) {
            words2 = await StringToDictionary(offerMas[i]);
            if (words.length == 0) words = words2; else words = [...words, ...words2];
            words = words.filter((item, index) => { return words.indexOf(item) === index });
        }
    }
        
    let sqlDictionary = await sql.LoadIdDictionary(categoryId);
    let resultDictionary = await CompareDictionary(words, sqlDictionary[0], offerId);
    for (i = 0; i < resultDictionary.length; i++) {
        if (resultDictionary[i][3] == 'add') await sql.AddWordInCategory(resultDictionary[i], categoryId);
        if (resultDictionary[i][3] == 'change') await sql.UpdateWordInCategory(resultDictionary[i], categoryId);
    }
    
};




function CompareDictionary(words, sqlDictionary0, offerId) {
    let resultDictionary = new Array();
    sqlWords = new Array();
    j = 1; //не хватает счетчика j
    //проверяю пустой словарь или нет
    if (sqlDictionary0.length > 0) {
        //получаю просто слова из массива sql
        for (i = 0; i < sqlDictionary0.length; i++) sqlWords[i] = sqlDictionary0[i]['word'];
        //повторяющиеся слова в новом солваре и sql
        let intersection = sqlWords.filter(num => words.includes(num));
        if (intersection.length > 0) { //если есть повторяющиеся слова них нужо добавить id
            for (i = 0; i < intersection.length; i++) {
                indexChange = sqlWords.indexOf(intersection[i]);
                sqlDictionary0[indexChange]['offerIds'] = sqlDictionary0[indexChange]['offerIds'] + ',' + offerId;
                sqlDictionary0[indexChange][3] = 'change';
            }
        };
        //заполняю массив ответа
        for (i = 0; i < sqlDictionary0.length; i++) {
            if (sqlDictionary0[i][3] != 'change') sqlDictionary0[i][3] = 'old';
            resultDictionary[i] = [sqlDictionary0[i]['word'], sqlDictionary0[i]['offerIds'],  sqlDictionary0[i]['wordid'], sqlDictionary0[i][3]];
        }
        //слова отсутствующие нужно добавить
        let difference = words.filter(num => !sqlWords.includes(num));
        if (difference.length > 0) { //если есть слова не входящие в словарь уже существующий нужно добавить
            difference.sort();
            currentCount = resultDictionary.length;
            for (i = 0; i < difference.length; i++) {
                resultDictionary[currentCount + i] = [difference[i], offerId, currentCount + i + 1, 'add']
            }
        }
    }
    else {
        //если словарь пустой создаем результат
        words.sort();
        for (i = 0; i < words.length; i++) {
            resultDictionary[i] = [words[i], offerId, i + 1, 'add'];
        }
    }
    return resultDictionary;
    //if (!!offer.description) offer.description = removeSpecial(offer.description); else offer.description = "";
    //if (offer.model != "") offer.model = removeSpecial(offer.model);
    //if (offer.stil != "") offer.stil = removeSpecial(offer.stil);
};

function StringToDictionary(text) {
    let words = new Array();
    if (text) {
        var lower = text.toLowerCase();
        var upper = text.toUpperCase();
        var result = "";
        j = 0;
        for (var i = 0; i < lower.length; ++i) {
            if (isNumber(text[i]) || (lower[i] != upper[i]) || (lower[i].trim() === '_') || (lower[i].trim() === '-') || (lower[i].trim() === '/')) {
                result += lower[i];
            };
            if ((lower[i].trim() === '' && result != '') || (lower[i].trim() === '.') || (lower[i].trim() === ',') ||
                (i == lower.length - 1)) {
                if (result.length > 3) {
                    // - исключить ссылку
                    words[j] = result;
                    j++;
                    //создаю исключения для слов
                    if (result.length > 4 && ((result[0] + result[1] + result[2] + result[3] == 'href') ||
                        (result[0] + result[1] + result[2] == 'ru\/')
                    ))
                        j--;
                }
                result = '';
            };
        };
        return words;
    };
};

function isNumber(value) { 
    isNumberResult = /^-{0,1}\d+$/.test(value);
    return isNumberResult;
}
