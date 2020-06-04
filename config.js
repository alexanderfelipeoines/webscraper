"use strict";

const path = require("path");
const moment = require("moment");
module.exports = class Config {
  constructor() {
    this.environment = process.env.environment || "dev";
    this.version = process.env.version || "0.0.0.1";
    this.port = process.env.port || "8080";
    this.csvFileName = this.csvFileNameExt(
      process.env.csvFileName || "Scraped"
    );
    this.urlMain = process.env.urlMain || "https://webscraper.io";
    this.csvHeaders = [
      "Title",
      "Description",
      "Price",
      "Link",
      "Reviews",
      "Stars",
    ];
    this.fallback_locale = process.env.fallback_locale || "en";
    this.locale = process.env.locale || this.fallback_locale;
    this.format = process.env.timeDate_format || "MMM Do YY";
    this.url =
      process.env.url ||
      "https://webscraper.io/test-sites/e-commerce/allinone/computers/laptops";
  }

  csvFileNameExt(fn) {
    if (!(path.extname(fn) === ".csv")) {
      console.log("Appending .csv to the provided filename: ", fn);
      let fileName =
        moment().format(this.format).toString() +
        " - " +
        fn.toString() +
        ".csv";
      console.log("Filename is now: ", fileName);
      return fileName;
    }
    console.log("Filename is: ", fileName);
    return fn;
  }

  display() {
    console.log(
      "Environment: " +
        this.environment +
        "\n" +
        "Version: " +
        this.version +
        "\n" +
        "Port: " +
        this.port +
        "\n" +
        "Csv File Name: " +
        this.csvFileName +
        "\n" +
        "Locale: " +
        this.locale +
        "\n"
    );
  }
};
