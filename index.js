const jsdom = require("jsdom");
const request = require("request");
const config = require("./config.json");

var announced = false;
const treshold = config.treshold || 50000;
const interval = config.interval || 1000 * 60 * 2;

function cb(err, win){
	if(err)return err;

	eval(win.document.getElementsByTagName("script")[0].innerHTML);

	const money = InitBag.Thermo.Total;
	console.log(money);
	
	/*
	request({
		method: "POST",
		url: config.url,
		json: true,
		body: {
			"secret": config.secret,
			"content": money
		}
	});
	*/
	
	
	if(!announced && money >= treshold){
		announced = true;
		request({
			method: "POST",
			url: config.url,
			json: true,
			body: {
				"secret": config.secret,
				"content": "500€ donations reached in BGO!"
			}
		});
	}
	if(announced && money < treshold){
		announced = false;
	}
}

const req = jsdom.env.bind(null, {
	url: "https://www.boardgame-online.com/",
	done: cb,
	features: {
		FetchExternalResources: false,
		ProcessExternalResources: false
	}
});

function loop(){
	req();
}

setInterval(loop, interval);
