var Discord = require('discord.io');
var Facebook = require('fb');
var Slack = require('slack-node');

var exec = require('child_process').exec;
var request = require('request');
var cheerio = require('cheerio');
var dateFormat = require('dateformat');

var config = require('./config.json');

var discordPost = function (token, chanelId, message) {
    var bot = new Discord.Client({
        token: token,
        autorun: true
    });

    bot.on('ready', function () {
        bot.sendMessage({
            to: chanelId,
            message: message
        }, function (err, res) {
            if(err != undefined) {
                console.log("Discord error - " + err);
            }
            bot.disconnect();
        });
    });
};

var facebookPost = function (id, pw, message) {
    exec('php fbToken.php ' + id + " " + pw, function (err, stdout, stderr) {
        Facebook.setAccessToken(stdout);
        Facebook.api('me/feed', 'post', { message: message }, function (res) {
            if (!res || res.error) {
                console.log("Facebook error - " + res.error);
            }
        });
    });
};

var slackPost = function (token, message) {
    var slack = new Slack(token);
    slack.api('chat.postMessage', {
        text: message,
        channel: '#general'
    }, function (err, response) {
        if(err != undefined){
            console.log("Slack error - " + err);
        }
    });
};

var newsHeadlineParse = function(callback) {
    var headlineList = "";
    request({
        url: 'http://m.news.naver.com/rankingList.nhn',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.99 Safari/537.36'
        }
    }, function(err, res, html) {
        var $ = cheerio.load(html);
        $('.commonlist_tx_headline').each(function(i, elem) {
            headlineList += $(this).text() + "\n";
        });
        
        headlineList = "\n\n(쓸 내용이 없으시다면 아래의 뉴스 헤드라인 이라도 보내주시면 감사하겠습니다...!)\n\n" + headlineList;
        return callback(headlineList);
    });
};

var init = function() {
    var now = dateFormat(new Date(), "yyyy-mm-dd");
    newsHeadlineParse(function(news){
        if(config.discord.date.indexOf(now) != -1) {
            discordPost(config.discord.token, config.discord.channelId, config.discord.message + news);
        }
        if(config.facebook.date.indexOf(now) != -1) {
            facebookPost(config.facebook.id, config.facebook.pw, config.facebook.message + news);
        }
        if(config.slack.date.indexOf(now) != -1) {
            // 슬랙은 글자 제한인지 몰라도 에러때문에 2번을 나눠서 보냄
            slackPost(config.slack.token, config.slack.message);
            slackPost(config.slack.token, news);
        }
    });
}

init();