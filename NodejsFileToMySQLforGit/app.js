const reLoad = require('./mySQLEchange/reLoadFiles');
const prepareFiles = require('./mySQLEchange/prepareFiles');


pathFiles = './MagazineFiles/FromMagazine.xml';  //���� �� �����
prepareFiles(pathFiles); //�������������� ����� ��� �������� xml �  json �����
reLoad(pathFiles);



//const timeReLoad = 1000; //��� � ����� 86400*1000 - 1000 ���������� � ������� 60 ������ � �����, 60 ����� � ����, 24 ���� � ������ 60*60*24*1000
//setInterval(() => { reLoad(pathFiles) }, timeReLoad); //multisearch.xml');

