const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const moment = require("moment");
const csvWriter = require("csv-write-stream");
require("dotenv").config();
const Config = require("./config");
const cfg = new Config();
cfg.display();
moment.locale(cfg.locale);

function urlReq() {
  return new Promise((resolve, reject) => {
    request(cfg.url, (error, response, html) => {
      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
        const element = $(".thumbnail");
        const arr = [];
        element.each((i, el) => {
          const item = $(el).find(".caption");
          const ratings = $(el).find(".ratings");
          let obj = {
            Title: item.find(".title").attr("title"),
            Description: item.find(".description").text(),
            Price: item.find(".price").text(),
            Link:
              cfg.urlMain.toString() +
              item.find(".title").attr("href").toString(),
            Ratings: {
              Stars: ratings
                .children(":first-child")
                .next()
                .attr("data-rating"),
              Reviews: ratings.children(":first-child").text(),
            },
          };
          arr.push(obj);
        });
        if (arr.length === 0 || arr === undefined) {
          let err = {
            error: {
              Msg: "No data in data array after fetching from url",
              statusCode: 400,
            },
          };
          console.error(err);
          reject(err);
        } else {
          resolve(arr);
        }
      } else {
        let err = { error: { msg: error, statusCode: 500 } };
        console.log(err);
        reject(err);
      }
    });
  });
}
function writeCsv(arr) {
  if (!fs.existsSync(cfg.csvFileName)) {
    console.log("write headers", cfg.csvHeaders);
    var writer = csvWriter({ headers: cfg.csvHeaders });
    writer.pipe(fs.createWriteStream(cfg.csvFileName));
  } else {
    console.log("do not write headers");
    var writer = csvWriter({ sendHeaders: false });
    writer.pipe(fs.createWriteStream(cfg.csvFileName));
  }
  for (let i = 0; i < arr.length; i++) {
    const obj = arr[i];
    for (let index = 0; index < cfg.csvHeaders.length; index++) {
      let header = cfg.csvHeaders[index];
      writer.write({
        Title: obj.Title,
        Description: obj.Description,
        Price: obj.Price,
        Link: obj.Link,
        Reviews: obj.Ratings.Reviews,
        Stars: obj.Ratings.Stars,
      });
    }
  }
  writer.end();
}
async function asyncCall() {
  console.log("calling");
  const result = await urlReq();
  writeCsv(result);
}
asyncCall();
