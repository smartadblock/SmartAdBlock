var wt=[];
var disable=chrome.i18n.getMessage("dis");
var enable=chrome.i18n.getMessage("ena");
var on=chrome.i18n.getMessage("on");
var loc_one=chrome.i18n.getMessage("loc_one");
var loc_two=chrome.i18n.getMessage("loc_two");
var hasblock=chrome.i18n.getMessage("hasblock");
var req=chrome.i18n.getMessage("request");
var inactive=chrome.i18n.getMessage("inactive");
var sug=chrome.i18n.getMessage("suggestions");
var tip=chrome.i18n.getMessage("tips");
var simage="s9.png";
var suf=new Object();


function load_suffix(){
	var xhr = new XMLHttpRequest();
	var buff;
	xhr.open('GET', chrome.extension.getURL('popup/suffix.txt'), true);
	xhr.onreadystatechange = function()
	{
		if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200)
		{
				var sufeasy=xhr.responseText;
				var sufear=sufeasy.split("\n"); 
				var ne = sufear.length;
				for (var i = 0; i < ne; i++) {
					buff=sufear[i].trim();
					suf[buff]="";
				}
				popinit();
		}
	};
	xhr.send();
}
load_suffix();

function extractHostname(url) {
    var hostname;
    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }
    hostname = hostname.split(':')[0];
    hostname = hostname.split('?')[0];
    return hostname;
}

function rooturl(url) {
	if (typeof url == 'undefined'){return "";}
	url=url.trim();
	url=url.replace("www.","");
	url=url.replace("www2.","");
	url=url.replace("www3.","");
	if (url.startsWith("chrome-extension")){return "chrome-extension";}
    var domain = extractHostname(url);
        splitArr = domain.split('.');
        arrLen = splitArr.length;
    if (arrLen > 2) {
        domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
		if(domain in suf){
			domain = splitArr[arrLen - 3] + '.' + domain;
		}
    }
    return domain;
}

function switchelement(url,tabs){
	 var ru=rooturl(url);
	 var img=document.getElementById("flag").getAttribute('src');
	 if(img==simage){removeelement(ru,tabs);}else{addelement(ru,tabs);}
}

function addelement(ru,tabs){
	 var res={};
	 res[ru]="o"
	  chrome.storage.local.set(res, function() {
		  changeicon(ru,tabs);
		  //var flushingCache = chrome.webRequest.handlerBehaviorChanged();
		  chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
        });
}
function removeelement(ru,tabs){
	  chrome.storage.local.remove(ru, function() {
		  changeicon(ru,tabs)
		  //var flushingCache = chrome.webRequest.handlerBehaviorChanged();
		  chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
        });
}
function changeicon(ru,tabs){
        chrome.storage.local.get(ru, function(result) {
          if(ru in result){document.getElementById("flag").setAttribute('src',simage);
		  document.getElementById("dis").innerHTML = enable;
		  }
		  else{document.getElementById("flag").setAttribute('src','white.png');
		  document.getElementById("dis").innerHTML = disable;}
        });
}

function popinit(){
			chrome.storage.local.get(null, function(result) {
			wt=result;
			syncmessage();
		});
		document.getElementById("reload").onclick = function() {
				chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				switchelement(tabs[0].url,tabs);		   
			});
		};

		document.getElementById("dis").innerHTML=disable;
		document.getElementById("on").innerHTML=on;
		document.getElementById("loc_one").innerHTML=loc_one;
		document.getElementById("loc_two").innerHTML=loc_two;
		document.getElementById("suggest").innerHTML=sug;
		document.getElementById("tip").innerHTML=tip;
//});

//window.addEventListener('load', function() {
		document.getElementById("tips").addEventListener('click',function() {
			console.log("clicked");
	    chrome.tabs.create({url: "https://www.smartadblock.co.uk"});
	});
	
setInterval(function(){ 
syncmessage(); 
}, 500);

	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
		var url = tabs[0].url;
		var ro=rooturl(url);
		if(islocal(url)){
			document.getElementById("tips").style.display = 'none';
			document.getElementById("container").style.display = 'none';
			document.getElementById("topcontainer").style.display = 'none';
			document.getElementById("local").style.display = 'block';
		}
		changeicon(ro,tabs);
		document.getElementById("site").innerHTML = ro;
		document.getElementById("siteup").innerHTML = ro;
		document.getElementById("fav").src=tabs[0].favIconUrl;
		syncmessage();
	});
}
//});

function islocal(url){
	if(url.includes("http://") || url.includes("https://")){
		return false;
	}
	else{
		return true;
	}
}

function syncmessage(){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		var ro=rooturl(tabs[0].url);
			if(ro in wt){
			document.getElementById("status").innerHTML = inactive;
			}
		else
		{	
		chrome.browserAction.getBadgeText({}, function(result) {
			if(result==""){result=0;}
			if(result<2){plu="";}else{plu="s";}
			document.getElementById("status").innerHTML = hasblock+" "+result+" "+req+plu;
		});
		}
	});
			chrome.storage.local.get(null, function(result) {
			wt=result;
		});
}

