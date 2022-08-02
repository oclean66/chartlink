var utils = require("utils");
// var odd = require("./bogota");
var elapseTime = 0;
var startUrl = "https://chartink.com/screener/intraday-positional-buy-2";
var token="";
var cookie="";
var init = 0;



// const Baseurl = "https://kingdeportes.com/geek/api/";

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
  
  onResourceRequested: function(R, req, net) {
    var match = req.url.match(
      /fbexternal-a\.akamaihd\.net\/safe_image|facebook|google|\.pdf|\.mp4|\.png|\.gif|\.avi|\.bmp|\.jpg|\.jpeg|\.swf|\.fla|\.xsd|\.xls|\.doc|\.ppt|\.zip|\.rar|\.7zip|\.gz|\.csv/gim
    );
    if (match !== null) {
      net.abort();
    }
  }
});

casper.on("error", function(msg, backtrace) {
  utils.dump(backtrace);
  // this.exit();
});
casper.on("starting", function(msg) {
  console.log("Starting...");
  elapseTime = Date.now();
});
casper.on("exit", function(msg) {
  var timerecord = Date.now() - elapseTime;
  timerecord = timerecord / 1000;
  console.log(
    "Finalizado: " + timerecord + " segundos",
    " en ",
    init,
    " eventos"
  );
});

// Start spidering
casper.start(startUrl, function(rs) {  

  console.log("Step 1");


  var headers = rs.headers;
  headers.forEach(function(element){
    if(element.name=="Set-Cookie"){
      cookie = element.value;
      // require('utils').dump(element);

    }
  });
  
});

casper.then(function() {

  
  console.log(startUrl)
  token = this.getElementInfo('meta[name="csrf-token"]');
  // console.log(token.attr('content'))
  token = token.attributes.content;
  require('utils').dump(token);

  var scan = this.getElementInfo('scan');
  // require('utils').dump(scan.nodeName);
  // require('utils').dump(JSON.parse(scan.attributes[':alert-json']));
  // require('utils').dump(JSON.parse(scan.attributes[':scan-categories-json']));
  // require('utils').dump(JSON.parse(scan.attributes[':watchlist-json']));
  var atlas = JSON.parse(scan.attributes[':scan-json']);
  // require('utils').dump(atlas);
  // require('utils').dump(JSON.parse(atlas['atlas_json']));
  
});

casper.thenOpen('https://chartink.com/screener/process', {
    method: "post",
    headers:{
     'accept': 'application/json, text/javascript, */*; q=0.01',
     "x-csrf-token": 'YQD8jolAFcNwMyGqVRLdTDcp31mquq4asIqPx19l',
     "Cookie":'_ga=GA1.2.1205342034.1592941686; __utmz=102564947.1593756763.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); bfp_sn_rf_8b2087b102c9e3e5ffed1c1478ed8b78=Direct/External; bfp_sn_rt_8b2087b102c9e3e5ffed1c1478ed8b78=1593756787269; bafp=4375fef0-bcf4-11ea-959a-b97945f46541; __utma=102564947.1205342034.1592941686.1593756763.1594040109.2; _gid=GA1.2.101580530.1599684223; XSRF-TOKEN=eyJpdiI6InBnNVpJTDVDM0I5UFdJS3Azdml6RWc9PSIsInZhbHVlIjoidWZXMVd3RmlIRVZRcFdVQzdFQjF0XC9VeFB1R081RjhUTGRwSU1xeHJIXC9Tdkdaa2xha0NpWXhIaE9sRWVLbVBGIiwibWFjIjoiYTgwMTlkNWU2NmQ0YWVmMzE0ZTAwMzEyMmVjOGFjOTc5OTFlYjAxN2EwNjQ3Mjk0NjU5MjliOTE5MWNlYzM4ZiJ9; ci_session=eyJpdiI6ImtVUzNzdXpFVGFRTWtUODhZbDlrVmc9PSIsInZhbHVlIjoieFwvSkNxdE9iQmdobmZMNlM1VkVqeTFndkZsSXpEQitSWjBUbUhJUVVTT201WTdtTVhUNm1lczdOODRqdDB2K0MiLCJtYWMiOiIyMzU0YTRkOWVmZmNkYjhhMzcwMTJkYTA3MjU1YTk2ZTBjYjkxZjAxOWJiMDdjYmQ2ZjRkZTdjZGUzOTQ5ZDQwIn0%3D',
     
    },
    // data: scanClause + '&use_live=1',
}, function(response) {
    // require('utils').dump(response);
    // require('utils').dump(cookie);
    // require('utils').dump(token);
    // console.log(token);
    // require('utils').dump(JSON.parse(this.getPageContent()));

    casper.thenOpen("https://garados-e9838.firebaseio.com/Collections.json?auth=ztpK3S3RhgmFvYxon17IQvjoelDr2UBiMMbTQ4Mr&debug=true",{
          method: "get",
          // data: JSON.stringify(allFish),
          // headers: {
          //   auth : "AIzaSyBsXBLlhQx001FqU2U9imzJLulTGM0EVWw",
          // },
          contentType : 'application/json',
          dataType: 'json',
        },function(response){
          // casper.echo("POSTED TO Firebase: "+JSON.stringify(response));
          collection = JSON.parse(this.getPageContent());
          var key = Object.keys(collection);
          key.forEach(function(element){
            require('utils').dump(collection[element]);

            casper.thenOpen("https://garados-e9838.firebaseio.com/Datatables/"+element+".json?auth=ztpK3S3RhgmFvYxon17IQvjoelDr2UBiMMbTQ4Mr&debug=true",{
              method: "put",
              data: JSON.stringify({
                "collectionId" :element,
                "data" : 
                [ 
                  {
                    "bsecode" : "517569",
                    "close" : 371.15,
                    "name" : "Kei Industries Limited",
                    "nsecode" : "KEI",
                    "per_chg" : 1.81,
                    "sr" : 1,
                    "volume" : 202097
                  }, {
                    "bsecode" : "523367",
                    "close" : 358.95,
                    "name" : "Dcm Shriram Limited",
                    "nsecode" : "DCMSHRIRAM",
                    "per_chg" : 1.06,
                    "sr" : 2,
                    "volume" : 180925
                  }, {
                    "bsecode" : "522249",
                    "close" : 251.6,
                    "name" : "Mayur Uniquoters Ltd",
                    "nsecode" : "MAYURUNIQ",
                    "per_chg" : 9.39,
                    "sr" : 3,
                    "volume" : 298492
                  }, {
                    "bsecode" : "534076",
                    "close" : 182.25,
                    "name" : "Orient Refractories Limited",
                    "nsecode" : "ORIENTREF",
                    "per_chg" : 2.39,
                    "sr" : 4,
                    "volume" : 136042
                  }, {
                    "close" : 114,
                    "name" : "THEINVEST",
                    "nsecode" : "THEINVEST",
                    "per_chg" : 7.5,
                    "sr" : 5,
                    "volume" : 9488
                  }, {
                    "bsecode" : "532729",
                    "close" : 90.6,
                    "name" : "Uttam Sugar Mills Limited",
                    "nsecode" : "UTTAMSUGAR",
                    "per_chg" : 6.34,
                    "sr" : 6,
                    "volume" : 523656
                  }, {
                    "bsecode" : "502168",
                    "close" : 90.1,
                    "name" : "Ncl Industries Limited",
                    "nsecode" : "NCLIND",
                    "per_chg" : 1.29,
                    "sr" : 7,
                    "volume" : 1974231
                  }, {
                    "bsecode" : "511208",
                    "close" : 4.1,
                    "name" : "Il&fs Investment Managers Limited",
                    "nsecode" : "IVC",
                    "per_chg" : 2.5,
                    "sr" : 8,
                    "volume" : 258782
                  }, {
                    "bsecode" : "532775",
                    "close" : 0.75,
                    "name" : "Gtl Infrastructure Limited",
                    "nsecode" : "GTLINFRA",
                    "per_chg" : 7.14,
                    "sr" : 9,
                    "volume" : 12785069
                  } 
                ],
                "title" : "Intraday Positional Buy"
              }),
              headers: {
                auth : "AIzaSyBsXBLlhQx001FqU2U9imzJLulTGM0EVWw",
              },
              contentType : 'application/json',
              dataType: 'json',
            },function(response){
              casper.echo("POSTED TO Firebase");
              // collection = JSON.parse(this.getPageContent());
              // var key = Object.keys(collection);
              // key.forEach(function(element){
              //   require('utils').dump(collection[element]);
                
              // });

            });


            
          });

        }
    );
});
casper.run();

// require('utils').dump(JSON.parse(scan.attributes[':scan-likes']));
  
    //  obtengo los params BODY y abro el url POST del feed

    //{/* <scan :scan-likes=​"{"totalLikes":​0,"likedByUser":​false}​" :scan-json=​"{"id":​1550220,"name":​"Intraday Positional Buy","description":​"Intraday Positional Buy","is_private":​false,"slug":​"intraday-positional-buy-2","scan_category_id":​4,"atlas_json":​"{\"group\":​{\"type\":​3,\"children\":​[{\"id\":​49708916,\"type\":​2,\"operation\":​{\"value\":​\">\",\"field\":​{\"id\":​49708862,\"type\":​2,\"operation\":​{\"value\":​\"default\",\"field\":​null}​,\"parentType\":​null,\"isEnabled\":​true,\"measure\":​{\"value\":​\"number\",\"type\":​1,\"parameters\":​[{\"inputValue\":​\"175\",\"type\":​\"input-number\"}​]​}​}​}​,\"parentType\":​null,\"isEnabled\":​true,\"measure\":​{\"value\":​\"cci\",\"type\":​1,\"offset\":​{\"value\":​\"30_minute\",\"intradayOffsetValue\":​\"-0\"}​,\"parameters\":​[{\"inputValue\":​\"34\",\"type\":​\"input-number\"}​]​}​}​,{\"type\":​3,\"children\":​[{\"id\":​49708890,\"type\":​2,\"operation\":​{\"value\":​\"<\",\"field\":​{\"id\":​49708864,\"type\":​2,\"operation\":​{\"value\":​\"default\",\"field\":​null}​,\"parentType\":​null,\"isEnabled\":​true,\"measure\":​{\"value\":​\"number\",\"type\":​1,\"parameters\":​[{\"inputValue\":​\"-100\",\"type\":​\"input-number\"}​]​}​}​}​,\"parentType\":​null,\"isEnabled\":​true,\"measure\":​{\"value\":​\"cci\",\"type\":​1,\"offset\":​{\"value\":​\"30_minute\",\"intradayOffsetValue\":​\"-1\"}​,\"parameters\":​[{\"inputValue\":​\"34\",\"type\":​\"input-number\"}​]​}​}​,{\"id\":​49708892,\"type\":​2,\"operation\":​{\"value\":​\"<\",\"field\":​{\"id\":​49708866,\"type\":​2,\"operation\":​{\"value\":​\"default\",\"field\":​null}​,\"parentType\":​null,\"isEnabled\":​true,\"measure\":​{\"value\":​\"number\",\"type\":​1,\"parameters\":​[{\"inputValue\":​\"-100\",\"type\":​\"input-number\"}​]​}​}​}​,\"parentType\":​null,\"isEnabled\":​true,\"measure\":​{\"value\":​\"cci\",\"type\":​1,\"offset\":​{\"value\":​\"30_minute\",\"intradayOffsetValue\":​\"-2\"}​,\"parameters\":​[{\"inputValue\":​\"34\",\"type\":​\"input-number\"}​]​}​}​,{\"id\":​49708894,\"type\":​2,\"operation\":​{\"value\":​\"<\",\"field\":​{\"id\":​49708868,\"type\":​2,\"operation\":​{\"value\":​\"default\",\"field\":​null}​,\"parentType\":​null,\"isEnabled\":​true,\"measure\":​{\"value\":​\"number\",\"type\":​1,\"parameters\":​[{\"inputValue\":​\"-100\",\"type\":​\"input-number\"}​]​}​}​}​,\"parentType\":​null,\"isEnabled\":​true,\"measure\":​{\"value\":​\"cci\",\"type\":​1,\"offset\":​{\"value\":​\"30_minute\",\"intradayOffsetValue\":​\"-3\"}​,\"parameters\":​[{\"inputValue\":​\"34\",\"type\":​\"input-number\"}​]​}​}​,{\"id\":​49708896,\"type\":​2,\"operation\":​{\"value\":​\"<\",\"field\":​{\"id\":​49708870,\"type\":​2,\"operation\":​{\"value\":​\"default\",\"field\":​null}​,\"parentType\":​null,\"isEnabled\":​true,\"measure\":​{\"value\":​\"number\",\"type\":​1,\"parameters\":​[{\"inputValue\":​\"-100\",\"type\":​\"input-number\"}​]​}​}​}​,\"parentType\":​null,\"isEnabled\":​true,\"measure\":​{\"value\":​\"cci\",\"type\":​1,\"offset\":​{\"value\":​\"30_minute\",\"intradayOffsetValue\":​\"-4\"}​,\"parameters\":​[{\"inputValue\":​\"34\",\"type\":​\"input-number\"}​]​}​}​,{\"id\":​49708898,\"type\":​2,\"operation\":​{\"value\":​\"<\",\"field\":​{\"id\":​49708872,\"type\":​2,\"operation\":​{\"value\":​\"default\",\"field\":​null}​,\"parentType\":​null,\"isEnabled\":​true,\"measure\":​{\"value\":​\"number\",\"type\":​1,\"parameters\":​[{\"inputValue\":​\"-100\",\"type\":​\"input-number\"}​]​}​}​}​,\"parentType\":​null,\"isEnabled\":​true,\"measure\":​{\"value\":​\"cci\",\"type\":​1,\"offset\":​{\"value\":​\"30_minute\",\"intradayOffsetValue\":​\"-5\"}​,\"parameters\":​[{\"inputValue\":​\"34\",\"type\":​\"input-number\"}​]​}​}​,{\"id\":​49708900,\"type\":​2,\"operation\":​{\"value\":​\"<\",\"field\":​{\"id\":​49708874,\"type\":​2,\"operation\":​{\"value\":​\"default\",\"field\":​null}​,\"parentType\":​null,\"isEnabled\":​true,\"measure\":​{\"value\":​\"number\",\"type\":​1,\"parameters\":​[{\"inputValue\":​\"-100\",\"type\":​\"input-number\"}​]​}​}​}​,\"parentType\":​null,\"isEnabled\":​true,\"measure\":​{\"value\":​\"cci\",\"type\":​1,\"offset\":​{\"value\":​\"30_minute\",\"intradayOffsetValue\":​\"-6\"}​,\"parameters\":​[{\"inputValue\":​\"34\",\"type\":​\"input-number\"}​]​}​}​,{\"id\":​49708902,\"type\":​2,\"operation\":​{\"value\":​\"<\",\"field\":​{\"id\":​49708876,\"type\":​2,\"operation\":​{\"value\":​\"default\",\"field\":​null}​,\"parentType\":​null,\"isEnabled\":​true,\"measure\":​{\"value\":​\"number\",\"type\":​1,\"parameters\":​[{\"inputValue\":​\"-100\",\"type\":​\"input-number\"}​]​}​}​}​,\"parentType\":​null,\"isEnabled\":​true,\"measure\":​{\"value\":​\"cci\",\"type\":​1,\"offset\":​{\"value\":​\"30_minute\",\"intradayOffsetValue\":​\"-7\"}​,\"parameters\":​[{\"inputValue\":​\"34\",\"type\":​\"input-number\"}​]​}​}​,{\"id\":​49708904,\"type\":​2,\"operation\":​{\"value\":​\"<\",\"field\":​{\"id\":​49708878,\"type\":​2,\"operation\":​{\"value\":​\"default\",\"field\":​null}​,\"parentType\":​null,\"isEnabled\":​true,\"measure\":​{\"value\":​\"number\",\"type\":​1,\"parameters\":​[{\"inputValue\":​\"-100\",\"type\":​\"input-number\"}​]​}​}​}​,\"parentType\":​null,\"isEnabled\":​true,\"measure\":​{\"value\":​\"cci\",\"type\":​1,\"offset\":​{\"value\":​\"30_minute\",\"intradayOffsetValue\":​\"-8\"}​,\"parameters\":​[{\"inputValue\":​\"34\",\"type\":​\"input-number\"}​]​}​}​,{\"id\":​49708906,\"type\":​2,\"operation\":​{\"value\":​\"<\",\"field\":​{\"id\":​49708880,\"type\":​2,\"operation\":​{\"value\":​\"default\",\"field\":​null}​,\"parentType\":​null,\"isEnabled\":​true,\"measure\":​{\"value\":​\"number\",\"type\":​1,\"parameters\":​[{\"inputValue\":​\"-100\",\"type\":​\"input-number\"}​]​}​}​}​,\"parentType\":​null,\"isEnabled\":​true,\"measure\":​{\"value\":​\"cci\",\"type\":​1,\"offset\":​{\"value\":​\"30_minute\",\"intradayOffsetValue\":​\"-9\"}​,\"parameters\":​[{\"inputValue\":​\"34\",\"type\":​\"input-number\"}​]​}​}​,{\"id\":​49708908,\"type\":​2,\"operation\":​{\"value\":​\"<\",\"field\":​{\"id\":​49708882,\"type\":​2,\"operation\":​{\"value\":​\"default\",\"field\":​null}​,\"parentType\":​null,\"isEnabled\":​true,\"measure\":​{\"value\":​\"number\",\"type\":​1,\"parameters\":​[{\"inputValue\":​\"-100\",\"type\":​\"input-number\"}​]​}​}​}​,\"parentType\":​null,\"isEnabled\":​true,\"measure\":​{\"value\":​\"cci\",\"type\":​1,\"offset\":​{\"value\":​\"30_minute\",\"intradayOffsetValue\":​\"-10\"}​,\"parameters\":​[{\"inputValue\":​\"34\",\"type\":​\"input-number\"}​]​}​}​,{\"id\":​49708910,\"type\":​2,\"operation\":​{\"value\":​\"<\",\"field\":​{\"id\":​49708884,\"type\":​2,\"operation\":​{\"value\":​\"default\",\"field\":​null}​,\"parentType\":​null,\"isEnabled\":​true,\"measure\":​{\"value\":​\"number\",\"type\":​1,\"parameters\":​[{\"inputValue\":​\"-100\",\"type\":​\"input-number\"}​]​}​}​}​,\"parentType\":​null,\"isEnabled\":​true,\"measure\":​{\"value\":​\"cci\",\"type\":​1,\"offset\":​{\"value\":​\"30_minute\",\"intradayOffsetValue\":​\"-11\"}​,\"parameters\":​[{\"inputValue\":​\"34\",\"type\":​\"input-number\"}​]​}​}​,{\"id\":​49708912,\"type\":​2,\"operation\":​{\"value\":​\"<\",\"field\":​{\"id\":​49708886,\"type\":​2,\"operation\":​{\"value\":​\"default\",\"field\":​null}​,\"parentType\":​null,\"isEnabled\":​true,\"measure\":​{\"value\":​\"number\",\"type\":​1,\"parameters\":​[{\"inputValue\":​\"-100\",\"type\":​\"input-number\"}​]​}​}​}​,\"parentType\":​null,\"isEnabled\":​true,\"measure\":​{\"value\":​\"cci\",\"type\":​1,\"offset\":​{\"value\":​\"30_minute\",\"intradayOffsetValue\":​\"-12\"}​,\"parameters\":​[{\"inputValue\":​\"34\",\"type\":​\"input-number\"}​]​}​}​,{\"id\":​49708914,\"type\":​2,\"operation\":​{\"value\":​\"<\",\"field\":​{\"id\":​49708888,\"type\":​2,\"operation\":​{\"value\":​\"default\",\"field\":​null}​,\"parentType\":​null,\"isEnabled\":​true,\"measure\":​{\"value\":​\"number\",\"type\":​1,\"parameters\":​[{\"inputValue\":​\"-100\",\"type\":​\"input-number\"}​]​}​}​}​,\"parentType\":​null,\"isEnabled\":​true,\"measure\":​{\"value\":​\"cci\",\"type\":​1,\"offset\":​{\"value\":​\"30_minute\",\"intradayOffsetValue\":​\"-13\"}​,\"parameters\":​[{\"inputValue\":​\"34\",\"type\":​\"input-number\"}​]​}​}​]​,\"measurevalue\":​\"default\",\"join\":​\"any\",\"combination\":​\"passes\",\"segment\":​\"cash\",\"isEnabled\":​true}​]​,\"measurevalue\":​\"default\",\"join\":​\"all\",\"combination\":​\"passes\",\"segment\":​\"cash\",\"isEnabled\":​true}​}​","dependant_indicator_ids":​null,"authorizations":​{"update":​false}​}​" :watchlist-json=​"[{"id":​136699,"name":​"Banknifty"}​,{"id":​166311,"name":​"ETFs"}​,{"id":​33489,"name":​"futures"}​,{"id":​167068,"name":​"Gold ETFs"}​,{"id":​45603,"name":​"indices"}​,{"id":​136492,"name":​"Midcap 50"}​,{"id":​33619,"name":​"nifty 100"}​,{"id":​46553,"name":​"nifty 200"}​,{"id":​33492,"name":​"nifty 50"}​,{"id":​57960,"name":​"nifty 500"}​,{"id":​109630,"name":​"nifty and banknifty"}​]​" :scan-categories-json=​"[{"id":​4,"name":​"Candlestick Patterns scan"}​,{"id":​3,"name":​"Range Breakouts scan"}​,{"id":​11,"name":​"Fundamental Scans"}​,{"id":​2,"name":​"Bullish scan"}​,{"id":​1,"name":​"Bearish scan"}​,{"id":​6,"name":​"Intraday Bullish scan"}​,{"id":​7,"name":​"Intraday Bearish scan"}​,{"id":​10,"name":​"Crossover"}​,{"id":​5,"name":​"Other Scans"}​]​" :alert-json=​"{"pause_after_trigger":​false,"frequencies":​[{"id":​1,"name":​"1 minutes"}​,{"id":​17,"name":​"2 minutes"}​,{"id":​18,"name":​"3 minutes"}​,{"id":​3,"name":​"5 minutes"}​,{"id":​4,"name":​"10 minutes"}​,{"id":​5,"name":​"15 minutes"}​,{"id":​6,"name":​"20 minutes"}​,{"id":​19,"name":​"25 minutes"}​,{"id":​7,"name":​"30 minutes"}​,{"id":​20,"name":​"45 minutes"}​,{"id":​16,"name":​"75 minutes"}​,{"id":​8,"name":​"hour"}​,{"id":​9,"name":​"2 hours"}​,{"id":​21,"name":​"3 hours"}​,{"id":​10,"name":​"4 hours"}​,{"id":​13,"name":​"market open"}​,{"id":​14,"name":​"market close"}​,{"id":​12,"name":​"week"}​,{"id":​11,"name":​"month"}​,{"id":​15,"name":​"day at time"}​]​,"notificationTypes":​[{"id":​2,"name":​"Email","order_number":​1,"is_visible":​true}​,{"id":​1,"name":​"Sms","order_number":​2,"is_visible":​true}​,{"id":​3,"name":​"Sms & Email","order_number":​3,"is_visible":​true}​,{"id":​4,"name":​"Desktop\/​Mobile (web)​","order_number":​4,"is_visible":​true}​]​,"authorizations":​{"update":​false}​}​">​</scan>​ 

    // https://chartink.com/screener/process

  //  curl 'https://chartink.com/screener/process' \
  //   -H 'authority: chartink.com' \
  //   -H 'accept: application/json, text/javascript, */*; q=0.01' \
  //   -H 'dnt: 1' \
  //   -H 'x-csrf-token: YQD8jolAFcNwMyGqVRLdTDcp31mquq4asIqPx19l' \
  //   -H 'x-requested-with: XMLHttpRequest' \
  //   -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36' \
  //   -H 'sentry-trace: 050e99ab9ab840999e66c2663de51818-9de444e2f2674a32-1' \
  //   -H 'content-type: application/x-www-form-urlencoded; charset=UTF-8' \
  //   -H 'origin: https://chartink.com' \
  //   -H 'sec-fetch-site: same-origin' \
  //   -H 'sec-fetch-mode: cors' \
  //   -H 'sec-fetch-dest: empty' \
  //   -H 'referer: https://chartink.com/screener/intraday-positional-buy-2' \
  //   -H 'accept-language: en-US,en;q=0.9,es-CO;q=0.8,es;q=0.7' \
  //   -H 'cookie: _ga=GA1.2.1205342034.1592941686; __utmz=102564947.1593756763.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); bfp_sn_rf_8b2087b102c9e3e5ffed1c1478ed8b78=Direct/External; bfp_sn_rt_8b2087b102c9e3e5ffed1c1478ed8b78=1593756787269; bafp=4375fef0-bcf4-11ea-959a-b97945f46541; __utma=102564947.1205342034.1592941686.1593756763.1594040109.2; _gid=GA1.2.101580530.1599684223; XSRF-TOKEN=eyJpdiI6IlwvTU9SREN4MWxTZTUxMHFQdFliUW9BPT0iLCJ2YWx1ZSI6IllxUDZNM25jSTlJRklMZyt6N1hPUGtHQ3o3XC9QSmxUdG4rNXRQWUZSY1BNcWhNRk4ycG1XOGRyVXd2R2R0cWcyIiwibWFjIjoiMWUzZDdkMmU3ZmExMzE4OTI2MTdhZTg4YzUwYzJmYjhhZmQxMWY2MzZlY2Q1MmRlMThhNmU1NTk5YzBkNjBhZSJ9; ci_session=eyJpdiI6IjBMTDJpbXhuazh5OEJISHhrMG1vU0E9PSIsInZhbHVlIjoiZHZDUnhaNkZ0XC9PM0hIdk9kZmpBeEU2dGNSQllvYXNTQzY1SVpLcFNJM2lEclphbmd3MnI0aCtwamdxVWRPNTgiLCJtYWMiOiI3MzVmMTFjM2IyNTI2ODE2NjUyYmQ2MWI3ZDcyZWI2Y2E5ZGJlODI2NzJmMjk1NmM0ZDJmNjAzMzA4NmFhYTE5In0%3D; _gat=1' \
  //   --data-raw 'scan_clause=(+%7Bcash%7D+(+%5B0%5D+30+minute+cci(+34+)+%3E+175+and(+%7Bcash%7D+(+%5B-1%5D+30+minute+cci(+34+)+%3C+-100+or+%5B-2%5D+30+minute+cci(+34+)+%3C+-100+or+%5B-3%5D+30+minute+cci(+34+)+%3C+-100+or+%5B-4%5D+30+minute+cci(+34+)+%3C+-100+or+%5B-5%5D+30+minute+cci(+34+)+%3C+-100+or+%5B-6%5D+30+minute+cci(+34+)+%3C+-100+or+%5B-7%5D+30+minute+cci(+34+)+%3C+-100+or+%5B-8%5D+30+minute+cci(+34+)+%3C+-100+or+%5B-9%5D+30+minute+cci(+34+)+%3C+-100+or+%5B-10%5D+30+minute+cci(+34+)+%3C+-100+or+%5B-11%5D+30+minute+cci(+34+)+%3C+-100+or+%5B-12%5D+30+minute+cci(+34+)+%3C+-100+or+%5B-13%5D+30+minute+cci(+34+)+%3C+-100+)+)+)+)+' \
  //   --compressed
    
  // scan_clause: ( {cash} ( [0] 30 minute cci( 34 ) > 175 and( {cash} ( [-1] 30 minute cci( 34 ) < -100 or [-2] 30 minute cci( 34 ) < -100 or [-3] 30 minute cci( 34 ) < -100 or [-4] 30 minute cci( 34 ) < -100 or [-5] 30 minute cci( 34 ) < -100 or [-6] 30 minute cci( 34 ) < -100 or [-7] 30 minute cci( 34 ) < -100 or [-8] 30 minute cci( 34 ) < -100 or [-9] 30 minute cci( 34 ) < -100 or [-10] 30 minute cci( 34 ) < -100 or [-11] 30 minute cci( 34 ) < -100 or [-12] 30 minute cci( 34 ) < -100 or [-13] 30 minute cci( 34 ) < -100 ) ) ) ) 

