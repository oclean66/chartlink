var utils = require("utils");
// var odd = require("./bogota");
var elapseTime = 0;
var startUrl = "https://garados-e9838.firebaseio.com/Collections.json?auth=ztpK3S3RhgmFvYxon17IQvjoelDr2UBiMMbTQ4Mr&debug=true";
var token = "";
var cookie = "";
var init = 0;

// Create instances
var casper = require("casper").create({
  verbose: false,
  logLevel: "debug",
  pageSettings: {
    loadImages: false,
    loadPlugins: false,
    userAgent:
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36"
  },

  onResourceRequested: function (R, req, net) {
    var match = req.url.match(
      /fbexternal-a\.akamaihd\.net\/safe_image|facebook|google|\.pdf|\.mp4|\.png|\.gif|\.avi|\.bmp|\.jpg|\.jpeg|\.swf|\.fla|\.xsd|\.xls|\.doc|\.ppt|\.zip|\.rar|\.7zip|\.gz|\.csv/gim
    );
    if (match !== null) {
      net.abort();
    }
  }
});

casper.on("error", function (msg, backtrace) {
  utils.dump(backtrace);
  // this.exit();
});
casper.on("starting", function (msg) {
  console.log("Starting...");
  elapseTime = Date.now();
});
casper.on("exit", function (msg) {
  var timerecord = Date.now() - elapseTime;
  timerecord = timerecord / 1000;
  console.log("Finalizado: " + timerecord + " segundos");
});

casper.start(startUrl,
  {
    method: "get",
    contentType: 'application/json',
    dataType: 'json',
  },
  function (rs) {
    console.log("Step 1");
  }
);

casper.then(function (rs) {
  // console.log(startUrl);
  console.log("1. Buscando URL en firebase");

  collection = JSON.parse(this.getPageContent());

  var key = Object.keys(collection);

  key.forEach(function (element) {
    // require('utils').dump(collection[element]);
    var title = "";
    var actual = "";

    casper.thenOpen(collection[element].url,
      function (responde) {
        title = this.getTitle();
        actual = this.getCurrentUrl();

        var headers = responde.headers;
        headers.forEach(function (element) {
          if (element.name == "Set-Cookie") {
            cookie = element.value;
          }
        });

        token = this.getElementInfo('meta[name="csrf-token"]');
        token = token.attributes.content;

        var scan = this.getElementInfo('scan');
        var atlas = JSON.parse(scan.attributes[':scan-json']);

        var areaElement = document.createElement("textarea");
        areaElement.innerHTML = scan.attributes[':scan-json'];

        var tsAtlas = JSON.parse(areaElement.value);

        areaElement.innerHTML = tsAtlas.atlas_json;
        tsAtlas.atlas_json = JSON.parse(areaElement.value)



        // console.log(scan.attributes[':scan-json']);


        casper.thenOpen('https://chartink.com/screener/process', {
          "headers": {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "es-CO,es;q=0.9,en-US;q=0.8,en;q=0.7,es-419;q=0.6",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "sentry-trace": "b1362670cbe7438b827171190830a2fa-96f35154a83d4d6c-1",
            "x-csrf-token": token,
            "x-requested-with": "XMLHttpRequest",
            "cookie": "_ga=GA1.2.1205342034.1592941686; __utmz=102564947.1593756763.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); bfp_sn_rf_8b2087b102c9e3e5ffed1c1478ed8b78=Direct/External; bfp_sn_rt_8b2087b102c9e3e5ffed1c1478ed8b78=1593756787269; bafp=4375fef0-bcf4-11ea-959a-b97945f46541; __utma=102564947.1205342034.1592941686.1593756763.1594040109.2; _gid=GA1.2.415556331.1601446429; session_depth=chartink.com%3D1%7C887657607%3D1; hbcm_sd=1%7C1601447556600; bfp_sn_pl=1601447557_609156743727; XSRF-TOKEN=eyJpdiI6InZtbU1UcVAzYStqbHp4R1Awb0NoQ1E9PSIsInZhbHVlIjoic0JpaEJIamhYSWNJaVF2UXlGemJhcmNyZ2tFTjFVWnppdVJ0QU85NEt3ajB2MU5oOHc4UVpSeFNObFdyK3JxRSIsIm1hYyI6IjA5MzI5ZjRlZjdiOWQ3MWFmZjkyN2IxNjFkZWM0NzI2NjU4YTgzYzQ5ZjFmNmNkOTQ5ZDMyZjViYWViYzcwMGEifQ%3D%3D; ci_session=eyJpdiI6ImFscDFteWQzMlZNNE1lOGFreDZKcXc9PSIsInZhbHVlIjoiODhOdGJFM3FzZEFBU2k1SGlaczViMzRtREoyUXNoV1wvYWlIeXp5RXFyRmFFT3FYMnVOTmpjNDA2V0gwcUh4WFAiLCJtYWMiOiJiZGI2OTExZWI1MDRlOWQxYmJlYzRjM2MwOTkyMTk0MzY5NTgxNGVhNWI3ZjkwNWU0Y2I3MjY4NmYzN2RmNmQ1In0%3D"

          },
          encoding: 'utf8',
          "referrer": actual,
          "referrerPolicy": "strict-origin-when-cross-origin",
          data: collection[element].scan,

          "method": "POST",
          "mode": "cors",


        }, function (response) {

          var content = JSON.parse(this.getPageContent());
          // require('utils').dump(content);
          // require('utils').dump(response);
          // this.echo(this)



          casper.thenOpen(
            "https://garados-e9838.firebaseio.com/Datatables/" + element + ".json?auth=ztpK3S3RhgmFvYxon17IQvjoelDr2UBiMMbTQ4Mr&debug=true",
            {
              method: "put",
              data: JSON.stringify({
                "collectionId": element,
                "token": token,
                "content": content,
                'atlas': tsAtlas,
                "data": content.data,
                "title": title,
                "alias": collection[element].title,
                "updated": new Date().getTime(),
              }),
              headers: {
                auth: "AIzaSyBsXBLlhQx001FqU2U9imzJLulTGM0EVWw",
              },
              contentType: 'application/json',
              dataType: 'json',
            }, function (response) {
              casper.echo(" - " + title + " POSTED TO Firebase");

            });

        });

      }
    );




  });

})

casper.run();