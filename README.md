# NodejsFileToMySQL
Nodejs File to MySQL

Данный проект берет файл xml формата изменяет (библотека replace-in-files)
его давая возможнность перевести из xml в json (на основе библиотеки xml2json).
Далее в базе данных SQL удаляет все таблицы и создает таблицу 'structure',
в которую заносятся данные об категориях товара и иерархии внутри категорий.
Создаются таблицы категорий и словари категорий. Далее по принадлежности 
товаров к категориям вносятся данные в соответствующие категории.
