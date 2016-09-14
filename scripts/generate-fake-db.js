var _ = require('lodash'),
    fs = require('fs'),
    faker = require('faker'),
    prompt = require('prompt');

prompt.start();

prompt.get(['COLUMNS_COUNT', 'ROWS_COUNT'], function (err, result) {

    const COLUMNS_COUNT = result.COLUMNS_COUNT || 4;
    const ROWS_COUNT = result.ROWS_COUNT || 10;

    const HEADERS = {};
    _.times(COLUMNS_COUNT, () => {
        const header = faker.lorem.word();
        HEADERS[header] = header;
    });

    const ROWS = [];
    _.times(ROWS_COUNT, id => {
        const row = { id };
        _.forOwn(HEADERS, header => {
            row[header] = faker.lorem.word();
        });
        ROWS.push(row);
    });

    const META = [];
    _.times(ROWS_COUNT, id => {
            const row = { id };
            _.forOwn(HEADERS, header => {
                row[header] = {
                    align: ["left", "center", "right"][_.random(2)],
                    fontSize: [10, 12, 14, 18][_.random(3)],
                    bold: !_.random(1),
                    italic: !_.random(1)
                }
            });
            META.push(row);
        }
    );

    const json = JSON.stringify({

        HEADERS,
        ROWS,
        META

    });

    fs.writeFile("./fake-db/db.json", json, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("Fake DB was generated.");
    });

});