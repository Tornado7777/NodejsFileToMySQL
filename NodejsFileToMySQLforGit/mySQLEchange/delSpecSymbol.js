//удаление спец символов из SQL запросов
module.exports = {
    //удаление спец симовлов из данных о категории и преобразование в массив
    delFromCategory: function (categoryName, parentId, categoryId, categoryUrl, ordering) {
        let category = { 'Name': categoryName, 'parentId': parentId, 'id': categoryId, 'url': categoryUrl};
        category.Name = removeSpecial(category.Name);
        return category;
    },
    //удаление спец символов из данных товара и преобразование в массив
    delFromOffer: function (
    id,
    url,
    price,
    categoryId,
    picture,
    createdAt,
    name,
    oldprice,
    vendor,
    vendorCode,
    ) {
        let offer = {
            'id': id,
            'url': url,
            'price': price,
            'categoryId': categoryId,
            'picture': picture,
            'createdAt': createdAt,
            'name': name,
            'oldprice': oldprice,
            'brand': vendor,
            'brandCode': vendorCode,
        };
        offer.name = removeSpecial(offer.name);
        return offer;
    },
}

function removeSpecial(text) {
    if (text) {
        var lower = text.toLowerCase();
        var upper = text.toUpperCase();
        var result = "";
        for (var i = 0; i < lower.length; ++i) {
            if (isNumber(text[i]) || (lower[i] != upper[i]) || (lower[i].trim() === '') || (lower[i].trim() === '.') || (lower[i].trim() === ',' || (lower[i].trim() === '-'))) {
                result += text[i];
            }
        }
        return result;
    }
}

var isNumber = function isNumber(value) {
    return typeof value === 'number' &&
        isFinite(value);
};