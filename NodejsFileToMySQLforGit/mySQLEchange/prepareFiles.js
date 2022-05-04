const replace = require('replace-in-file');

let pathFiles;

module.exports = function (pathToFiles) {
    pathFiles = pathToFiles;
    RunReplace();
}

async function RunReplace() {
    await ReplaceInFiles(/\&amp\;/g, ' ');
    await ReplaceInFiles(/\&/g, ' ');
    await ReplaceInFiles(/\#039\;/g, ' ');
    await ReplaceInFiles(/\'/g, '_');
    await ReplaceInFiles(/\<p\>/g, '');
    await ReplaceInFiles(/\<\/p\>/g, '');
    await ReplaceInFiles(/\<\!\[CDATA\[/g, '');
    await ReplaceInFiles(/\]\]\>/g, '');
}

function ReplaceInFiles(replaceFrom, replaceTo) {
    const options = {
        files: pathFiles,
        from: replaceFrom,
        to: replaceTo,
    };
    try {
        const results = replace.sync(options);
        console.log('Replacement results:', results);
    }
    catch (error) {
        console.error('Error occurred:', error);
    }
}