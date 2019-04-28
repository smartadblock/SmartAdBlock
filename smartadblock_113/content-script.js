var currenturl=rooturl(window.location.href);
var sb_rc="";
var sb_sel="";
var sab_timeout;
var notapop=chrome.i18n.getMessage("notapopup");
var blockedit=chrome.i18n.getMessage("blockedit");
var popuprisk=[];
var jsrule=[];
var ispopuprisk=false;
var firefox=false;
var isiframe=false;

function inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}
isiframe=inIframe();

chrome.runtime.sendMessage({start:true});

function dangerquiet(ev,sel){
}

function no_create(){
var actualCode = '';
	actualCode = actualCode+'if(document.createElement) {';
	actualCode = actualCode+'var superCreateElement = document.createElement;';
	actualCode = actualCode+'document.createElement = function(evt) {';
	actualCode = actualCode+'var ele = superCreateElement.apply(this, arguments);';
	actualCode = actualCode+'if(arguments[0].toLowerCase()=="a"){arguments[0]="sab";}';
	actualCode = actualCode+'return ele;';
	actualCode = actualCode+'}}';

	var script = document.createElement('script');
	script.textContent = actualCode;
	(document.head||document.documentElement).appendChild(script);
	script.remove();
}


function no_append(){
var actualCode = 'window.orig_append = Element.prototype.appendChild;';
	actualCode = actualCode+'Element.prototype.appendChild = function(){';
	actualCode = actualCode+'window.orig_append.apply(this, arguments);};';

	var script = document.createElement('script');
	script.textContent = actualCode;
	(document.head||document.documentElement).appendChild(script);
	script.remove();
}
	
function no_open(){
var actualCode = 'window.open = function (url, windowName, windowFeatures) {';
	actualCode = actualCode+'}';

	var script = document.createElement('script');
	script.textContent = actualCode;
	(document.head||document.documentElement).appendChild(script);
	script.remove();
}

function popupdanger(url){
	if (typeof url == 'undefined'){return false;}
	url=url.toLowerCase();
	url=url.replace("http://","");
	url=url.replace("https://","");
	arr=url.split("/");
	url=arr[0];
	arr=url.split("?");
	url=arr[0];
	for (var j = 0; j < popuprisk.length; j++) {
		if(url.includes(popuprisk[j])){
			return true;
		}
	}
	return false;
}

chrome.storage.local.get("popuprisk", function(result) {
	var popupriskjson=JSON.parse(result["popuprisk"]);
	for (var key in popupriskjson) {
		if (popupriskjson.hasOwnProperty(key)) {
			popuprisk.push(key);
		}
	}
	ispopuprisk=popupdanger(currenturl);
	if(ispopuprisk){treat_cs();}
});

function sab_getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

function notifyExtension(e) {
  var target = e.target;
  while ((target.tagName != "A" || !target.href) && target.parentNode) {
    target = target.parentNode;
  }
  if (target.tagName != "A")
    return;
  chrome.runtime.sendMessage({"url": target.href});
}

function rooturl(url){
	if (typeof url == 'undefined'){return "";}
	if(url.includes("http://") || url.includes("https://")){
		url=url.replace("://","");
		url=url.replace("https","");
		url=url.replace("http","");
		arr=url.split("/");
		url=arr[0];
		arr=url.split("?");
		url=arr[0];
		arr=url.split("&");
		url=arr[0];
		arr=url.split("#");
		url=arr[0];
		return url;
	}
	else{
		return "local";
	}
}

function callback() {
    if (chrome.runtime.lastError) {
    } else {
    }
}

//$( document ).ready(function() {
	//conditional on popup danger 1.0.5
//	if(ispopuprisk){
function treat_cs(){
		res='<div id="smartadblockmess" ';
		res+='>'+blockedit+'<br> '+notapop+'<br><br><a id="smartadblockmesslink" href=""  target="_blank" style=""></a></div>';	
		  
		$('body').append(res);
		$( 'body').contextmenu(function(event) {
			hr="";
			if (typeof event.target.href == 'undefined'){
				hr="";
				p=0;
				var parent = event.target.parentElement;
					while(hr=="" && p<5){
					if(parent.href==='undefined'){hr="";}else{hr=parent.href}
					p=p+1;
				}
				}
				else{hr=event.target.href;}
			sel=sab_getSelectionText();
			if (typeof hr == 'undefined'){hr="";}
			try{
		 chrome.runtime.sendMessage({cm:true,rc: hr,sl:sel});
		}catch{}
		});
		$('a').click(function(){
			l=$(this).attr('href');
			if(l!=''){
				try {
					chrome.runtime.sendMessage({validtab: true,rc: l});
				}
				catch(err) {
				}
			}
		}); 
		$('a').mousedown(function(){
			l=$(this).attr('href');
			if(l!=''){
				try {
					chrome.runtime.sendMessage({validtab: true,rc: l});
				}
				catch(err) {
				}
			}
		}); 
	no_open();
	no_create();
}
	//end of conditional on popup danger 1.0.4
//});

function msgfromurl(txt){
	arr=txt.match(/.{1,30}/g);
	if(arr.length==1){return arr[0];}
	if(arr.length==2){return arr[0]+'<br>'+arr[1];}
	if(arr.length>2){return arr[0]+'<br>'+arr[1]+'<br>'+arr[2];}
}

if(!firefox){
	chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
	  if (msg.action == 'newtab' && !isiframe) {
		t=msgfromurl(msg.url);
		$('#smartadblockmesslink').html(t);
		$('#smartadblockmesslink').attr("href", msg.url)
		$('#smartadblockmess').slideDown(400);
		clearTimeout(sab_timeout);
		sab_timeout=setTimeout(function(){ $('#smartadblockmess').slideUp(400); }, 7000);
	  }
	    return Promise.resolve("Dummy");
	});
}

if(firefox){
	browser.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
	  if (msg.action == 'newtab' && !isiframe) {
		t=msgfromurl(msg.url);
		$('#smartadblockmesslink').html(t);
		$('#smartadblockmesslink').attr("href", msg.url)
		$('#smartadblockmess').slideDown(400);
		clearTimeout(sab_timeout);
		sab_timeout=setTimeout(function(){ $('#smartadblockmess').slideUp(400); }, 7000);
	  }
	    return Promise.resolve("Dummy");
	});
}

function display_block(m){
		t=msgfromurl(m);
		$('#smartadblockmesslink').html(t);
		$('#smartadblockmesslink').attr("href", m)
		$('#smartadblockmess').slideDown(400);
		clearTimeout(sab_timeout);
		sab_timeout=setTimeout(function(){ $('#smartadblockmess').slideUp(400); }, 7000);
}

function setNotificationCallback(callback) {
    const OldNotify = window.Notification;
    const newNotify = (title, opt) => {
        callback(title, opt);
        return new OldNotify(title, opt);
    };
    newNotify.requestPermission = OldNotify.requestPermission.bind(OldNotify);
    Object.defineProperty(newNotify, 'permission', {
        get: () => {
            return OldNotify.permission;
        }
    });
    window.Notification = newNotify;
}