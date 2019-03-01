affiche('start');
var block_count=[];
var tabid=0+'id';
var letgo=false;
var sb_rc="";
var sb_sel="";
block_count[tabid]=0;
var cssrule=new Map();
var sab_all=[];
var sab_all_v=[];
var sab_iframe=[];
var pref=[];
var cssrulewhite=[];
cssrulewhite["all"]=[];
var cssdelay=[];
var allreqrules=[];
var reqdom=new Map();
var reqdomtarget=new Map();
var reqsub=new Map();
var cookierules=[];
cookierules["all"]=[];
var csswhite=[];
var allwhite=[];
var reqwhite=[];
var sublongest=[];
var subrules=[];
var tot=0;
var followtab=[];
var sourcetab;
var popuptab;
var popuprisk=[];
var jsrule=[];
var popupsourcewhite=[];
var quicklist=[];
var wt=[];
var taburl="";
var dangerrules=[];
var veryquick=[];
var idstourl=[];
var treatedframes=[];
var numberofupdates=[];
var debugmode=false;
var skipcookie=false;
var skipsocial=false;
var dangerforbrules=[];
var targetwhitelist=[];
var reqforce=[];
var nomulti=[];
var topazf=[];
var topazs=[]
var topazdelay=[];
var tarif=[];
var dltry=0;
var dlerror=false;
var firefox=false;
var filterloaded=false;
var interv;
var sepdisp='{display:none !important;}';
var suf=[];
var stw=[];
var con=[];
var endw=[];
var loaderc=0;
var skipcss=[];
var ignorelist=[];
var extra_rules;
var trackerlist="";
var loader;
var extra_filters;
var dups=new Map();

function loadextra(){
	chrome.storage.local.get("rules", function(result) {
		if(typeof result != 'undefined'){
			try{
				var res=JSON.parse(result["rules"]);
				extra_rules=res;
			}catch{extra_rules=[];}
		}else{extra_rules=[];}
		loadextrafilters();
	});
}

function loadextrafilters(){
	chrome.storage.local.get("filters", function(result) {
		if(typeof result != 'undefined'){
			try{
				var res=JSON.parse(result["filters"]);
				extra_filters=res;
			}catch{extra_filters=[];}
		}else{extra_filters=[];}
		load_ignore();
	});
}

 function load_ignore(){
	ignorelist=[];
	var xhr = new XMLHttpRequest();
	xhr.open('GET', chrome.extension.getURL('ignorelist.txt'), true);
	xhr.onreadystatechange = function()
	{
		if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200)
		{
				var igneasy=xhr.responseText;
				var ignear=igneasy.split("\n"); 
				var ne = ignear.length;
				for (var i = 0; i < ne; i++) {
					ignorelist[ignear[i].trim()]="";
				}
				load_suffix();
		}
	};
	xhr.send();
}

function load_suffix(){
	suf=[];
	var xhr = new XMLHttpRequest();
	xhr.open('GET', chrome.extension.getURL('popup/suffix.txt'), true);
	xhr.onreadystatechange = function()
	{
		if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200)
		{
				var sufeasy=xhr.responseText;
				var sufear=sufeasy.split("\n"); 
				var ne = sufear.length;
				for (var i = 0; i < ne; i++) {
					suf[sufear[i].trim()]="";
				}
				load_prefilter();
		}
	};
	xhr.send();
}

function load_prefilter(){
	var xhr = new XMLHttpRequest();
	var buff;
	pref=[];
	var sep=":not(body):not(html)";
	xhr.open('GET', chrome.extension.getURL('prefilter.txt'), true);
	xhr.onreadystatechange = function()
	{
		if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200)
		{
				var sufeasy=xhr.responseText;
				var sufear=sufeasy.split("\n"); 
				var ne = sufear.length;
				for (var i = 0; i < ne; i++) {
					if(sufear[i].startsWith("*")){
						buff=sufear[i].replace("*","").trim();
						stw.push(buff);
						pref.push('[id^="'+buff+'" i]'+sep);
						pref.push('[class^="'+buff+'" i]'+sep);
					}
					if(sufear[i].startsWith("#")){
						buff=sufear[i].replace("#","").trim();
						con.push(buff);
						pref.push('[id*="'+buff+'" i]'+sep);
						pref.push('[class*="'+buff+'" i]'+sep);
					}
					if(sufear[i].startsWith("|")){
						buff=sufear[i].replace("|","").trim();
						endw.push(buff);
						pref.push('[id$="'+buff+'" i]'+sep);
						pref.push('[class$="'+buff+'" i]'+sep);
						pref.push('[class*="'+buff+' " i]'+sep);
					}
				}
				initfilters();
		}
	};
	xhr.send();
}

function reinit(){
	clearInterval(loader);
	loader=setInterval(function(){ 
if(loaderc%3==0){chrome.browserAction.setBadgeText({text: '>--'});}
if(loaderc%3==1){chrome.browserAction.setBadgeText({text: '->-'});}
if(loaderc%3==2){chrome.browserAction.setBadgeText({text: '-->'});}
loaderc=loaderc+1;
 }, 100);
 
loadextra();
}

reinit();

chrome.tabs.query(
  {currentWindow: true, active : true},
  function(tab){tabid=tab.id+'id';}
)
newtabanalysis();
chrome.browserAction.setBadgeBackgroundColor({color: "#999"});

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

function isabrowserpage(url){
	if(url.startsWith("about:blank")){return false;}
	if(url.startsWith("chrome-extension")){return true;}
	if(url.startsWith("chrome://")){return true;}
	if(url.startsWith("about:")){return true;}
	if(url.startsWith("view-source:")){return true;}
	return false;
}

function isextensionpage(url){
	if(url.startsWith("https://chrome.google.com/")){return true;}
	if(url.startsWith("https://addons.mozilla.")){return true;}
	return false;
}

function isnotdefinedyet(url){
	if(url==""){return true;}
	if(url=="about:blank"){return true;}
	return false;
}

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 20; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

function affiche(t){
	if(debugmode){console.log(t);}
}

function getparenturl(detail){
	var tkey=detail["tabId"]+"p";
	if(tkey in idstourl){return idstourl[tkey];}
	if(detail["parentFrameId"]==-1){
		return detail["initiator"];
	}
	if(detail["tabId"]>=0){
		chrome.tabs.get(detail["tabId"],function callback() {if (chrome.runtime.lastError) { console.log(chrome.runtime.lastError.message);} else {
			chrome.tabs.get(detail["tabId"],function(tab) {
				if(typeof tab != 'undefined'){
					if (typeof tab["url"] == 'undefined'){
						return "";
					}
					else
					{
						return tab["url"];
					}
				}
			});	
		}});
	}
	if(detail["frameId"]==0){
		return detail["url"];
		}
		return "";
}

function extractHostname(url) {
    var hostname;
    if (url.indexOf("://") > -1) {
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
    var domain = extractHostname(url),
        splitArr = domain.split('.'),
        arrLen = splitArr.length;
    if (arrLen > 2) {
        domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
		if(domain in suf){
			domain = splitArr[arrLen - 3] + '.' + domain;
		}
    }
    return domain;
}

function makecookierule(txt){
	txt=txt.replace("!C!","");
	var arr=txt.split("##");
	if(arr[0]==""){
		cookierules["all"].push(arr[1]);
	}
	else{
		var arrc=arr[0].split(",");
		var ne = arrc.length;
		for (var i = 0; i < ne; i++) {
			if(!(arrc[i] in cookierules)){cookierules[arrc[i]]=[];}
				cookierules[arrc[i]].push(arr[1]);
		}
	}
}

function checkflag(txt){
	if(txt.includes("skipcookie")){
		skipcookie=true;
	}
	if(txt.includes("skipsocial")){
		skipsocial=true;
	}
}

function treatreqexception(txt){
	txt=txt.replace("!#r#","");
	if(txt.includes("||")){
		var splitarr=txt.split("||");
		reqwhite.push(splitarr[0]);
		var splitroot=splitarr[0];
		var tail=splitarr[1];
		var tailarr=tail.split(",");
		var ne = tailarr.length;
		reqforce[splitroot]=[];
		for (var i = 0; i < ne; i++) {
			if(tailarr[i].length>1){
				reqforce[splitroot].push(tailarr[i]);
			}
		}
	}
	else{
		reqwhite.push(txt);
	}
}

function topdelay(txt){
	if(txt.includes("||")){
		var toparr=txt.split("||");
		return toparr[1];
	}
	return 0;
}

function topazroot(txt){
	if(txt.includes("||")){
		var toparr=txt.split("||");
		txt=toparr[0];
	}
	if(txt.includes("!")){
		var toparr=txt.split("!");
		txt=toparr[1];
	}
	return txt;
}

function topazcode(txt){
	if(txt.includes("!")){
		var toparr=txt.split("!");
		return toparr[0];
	}
	return "";
}

function treattopazf(txt){
	var r=topazroot(txt);
	var c=topazcode(txt);
	topazf[r]=c;
	return ;
}

function treattopazs(txt){
	var d=topdelay(txt);
	var r=topazroot(txt);
	var c=topazcode(txt);
	if(d>0){topazdelay[r]=d;}
	topazs[r]=c;
	return ;
}

function treattarif(txt){
	if(txt.includes("##")){
		var tarifarr=txt.split("##");
		var webs=tarifarr[0];
		var rull=tarifarr[1];
		if(!(webs in tarif)){tarif[webs]="";}
		tarif[webs]+=" "+rull+sepdisp;
	}
}

function prefilter(fil){
	var ne = stw.length;
	var buff;
	fil=fil.toLowerCase();
	for (var i = 0; i < ne; i++) {	
		buff='#'+stw[i].trim();
		if(fil.startsWith(buff)){return true;}
		buff='.'+stw[i].trim();
		if(fil.startsWith(buff)){return true;}
	}
	ne = con.length;
	for (var i = 0; i < ne; i++) {	
		buff=con[i].trim();
		if(fil.includes(buff)){return true;}
	}
	ne = endw.length;
	for (var i = 0; i < ne; i++) {	
		buff=endw[i].trim();
		if(fil.endsWith(buff)){return true;}
	}
	return false;
}

function isdup(txt){
	if(dups.has(txt)){return true;}else{dups.set(txt,"");return false;}
}

function treatcss(origtxt,i,key="sab***all"){
	var interm='';
	var tarr;
	var arr;
	var rightr;
	var txt=origtxt.split('').join('');
	txt=txt.trim();
	track=false;
	if(isdup(txt) && key=="sab***all"){return "css";}
	if(txt.startsWith("!if!")){treatcss(txt.replace("!if!",""),i,"sab***iframe");return "css";}
	if(txt.startsWith("!tarif!")){treattarif(txt.replace("!tarif!",""));return "css";}
	if(txt.startsWith("!sp1!")){treattopazf(txt.replace("!sp1!",""));return "css";}
	if(txt.startsWith("!sp2!")){treattopazs(txt.replace("!sp2!",""));return "css";}
	if(txt.startsWith("!~!")){veryquick.push(txt.replace("!~!",""));return "css";}
	if(txt.startsWith("!D!")){dangerrules.push(txt.replace("!D!",""));return "css";}
	if(txt.startsWith("!C!")){makecookierule(txt);return "css";}
	if(txt.startsWith("!o->!")){popupsourcewhite.push(txt.replace("!o->!",""));return "css";}
	if(txt.startsWith("!->o!")){targetwhitelist.push(txt.replace("!->o!",""));return "css";}
	if(txt.startsWith("!flag!")){checkflag(txt);return "css";}
	if(txt.startsWith("!danger!")){dangerforbrules.push(txt.replace("!danger!",""));return "css";}
	if(txt.startsWith("!nomulti!")){nomulti[txt.replace("!nomulti!","")]="";return "css";}
	if(txt.startsWith("!*")){popuprisk.push(txt.replace("!*",""));return "css";}
	if(txt.startsWith("!js!")){jsrule.push(txt.replace("!js!",""));return "css";}
	if(txt.startsWith("!s!")){skipcss=skipcss.concat(txt.replace("!s!","").split(","));return "css";}
	if(txt.startsWith("!##")){allwhite.push(txt.replace("!##",""));return "css";}
	if(txt.startsWith("!#tr#")){trackerlist=trackerlist+txt.replace("!#tr#","");return "css";}
	if(txt.startsWith("!#r#")){treatreqexception(txt.replace("*tr*",trackerlist));return "css";}
	if(txt.startsWith("!#t#")){txt=txt.replace("!#t#","");arr=txt.split("|");cssdelay[arr[0]]=arr[1];return "css";}
	if(txt.startsWith("!#")){csswhite.push(txt.replace("!#",""));return "css";}
	if(txt.startsWith("!") || txt.startsWith("[")){return "css";}
	if(txt.includes("#")){
		if(txt.includes("#@")){
			tarr=txt.split("#@#");
			if(tarr[0]==""){
				cssrulewhite["all"].push(tarr[1]);
				return "css";
			}
			else{
				arr=tarr[0].split(",");
				var ne = arr.length;
				for (var i = 0; i < ne; i++) {
					if(!(arr[i] in ignorelist)){
						if(!(arr[i] in cssrulewhite)){cssrulewhite[arr[i]]=[];}
						cssrulewhite[arr[i]].push(tarr[1]);
					}
				}
			}
			return "css";
		}
		else{
			if(txt.includes("##")){
				txt=txt.replaceAll("*bo*","body{overflow:visible !important;}");
				txt=txt.replaceAll("*ho*","html{overflow:visible !important;}");
				txt=txt.replaceAll("*bi*","body{background-image:none !important;}");
				txt=txt.replaceAll("**"," !important;}");
				txt=txt.replaceAll('[c=','[class*="');
				txt=txt.replaceAll('[h=','[href*="');
				txt=txt.replaceAll('[s=','[src*="');
				txt=txt.replaceAll('[i=','[id*="');
				txt=txt.replaceAll('[r=','[src*="');
				if(!(txt.includes("~"))){
				tarr=txt.split("##");
				if(prefilter(tarr[1])){return "css";}
				}else{txt=txt.replace("~","");}
				tarr=txt.split("##");
				if(tarr[0]==""){
					var nosli=tarr[1].split('').join('');
					if(nosli.includes("'")){
						sab_all_v.push(nosli);
					}
					else{
						if(key=="sab***iframe"){sab_iframe.push(nosli);}else{sab_all.push(nosli);}
					}
				}
				else{
					arr=tarr[0].split(",");
					var ne = arr.length;
					for (var i = 0; i < ne; i++) {
						if(!(arr[i] in ignorelist)){
							if(!(cssrule.has(arr[i]))){cssrule.set(arr[i],"");}
							var nosli=tarr[1].split('').join('');
							cssrule.set(arr[i],cssrule.get(arr[i])+nosli+sepdisp);
						}
					}
				}
				return "css";
			}
		}
	}
	else{
	}
	return "";
}

function make_req_rules(easy_arr){
	var ne = easy_arr.length;
	var cssrule="";
	var d=0;
	var dt=0;
	var s=0;
	var c=0;
	var bef;
	var aft;
	var xindex;
	var best="";
	var bestn;
	for (var i = 0; i < ne; i++) {
		var origtxt=easy_arr[i].split('').join('');
		var b=treatcss(origtxt,i);
		var track=false;
		if(b=="css"){
			c++;
			continue;
			}
		var a=treatrule(origtxt);
		allreqrules.push(origtxt);
		var index=allreqrules.length-1;
		if(a!==false){
			m = a["domainw"].length;
			if(m>0){
				for (var j = 0; j < m; j++) {
					if(!(a["domainw"][j] in ignorelist)){
						if(!reqdom.has(a["domainw"][j])){reqdom.set(a["domainw"][j],"")}
						bef=reqdom.get(a["domainw"][j]);
						xindex=index;
						if(a["domtarget"]){xindex=-1*index;}
						if(bef==""){aft=xindex}else{aft=bef+','+xindex}
						reqdom.set(a["domainw"][j],aft);
						d++;
					}
				}
			}
			if(m==0 && a["domtarget"]){
				if(!(a["root"] in ignorelist)){
					if(!reqdomtarget.has(a["root"])){reqdomtarget.set(a["root"],"")}
						bef=reqdomtarget.get(a["root"]);
						if(bef==""){aft=index}else{aft=bef+','+index}
						reqdomtarget.set(a["root"],aft);
						dt++;
				}
			}
			if(m==0 && !a["domtarget"]){
				var npp = a["longest"].length;
				bestn=0;
				best="";
				for (var j = 0; j < npp; j++) {
					if (a["longest"][j].length>bestn){
						bestn=a["longest"][j].length;
						best=a["longest"][j];
						}
				}
				sublongest.push(best);
				subrules.push(index);
				s++;
			}
		}
	}
	affiche("Domain limited rules "+d);
	affiche("Domain target rules "+dt);
	affiche("substring rules "+s);
	affiche("css rules "+c);
}

function keeptrying(){
	console.log("launching keeptrying");
	setTimeout(function(){
		if(filterloaded==false){
			console.log("trying loading filters again");
			reinit();
		}
	}, 5000);
}

function extracttext(arr){
	var xhr = new XMLHttpRequest();
	var easy;
	var easy_att;
	var skipall=false;
	if(arr.length==0){
		if(dlerror==true && dltry==0){
			dltry=1;
			initfilters("second");
			return 0;
		}
		if(dlerror==true && dltry>0){
			dltry=0;
			keeptrying();
			return 0;
		}
		var nnp=popuprisk.length;
		var popupriskjson={};
		for (var i = 0; i < nnp; i++) {
			popupriskjson[popuprisk[i]]="";
		}
		var myJsonString = JSON.stringify(popupriskjson);
		var res={};
		res["popuprisk"]=myJsonString;
		chrome.storage.local.set(res, function() {
        });
		var nnp=jsrule.length;
		var jsrulejson={};
		for (var i = 0; i < nnp; i++) {
			jsrulejson[jsrule[i]]="";
		}
		var myJsonString = JSON.stringify(jsrulejson);
		var res={};
		res["jsrule"]=myJsonString;
		chrome.storage.local.set(res, function() {
        });
		var d=new Date();
		chrome.storage.local.set({"lastupdate": d.toString()}, function() {
			console.log("stored last update "+d.toString());
        });
		filterloaded=true;
		var ne = pref.length;
		for (var i = 0; i < ne; i++) {
			sab_all.push( pref[i]);
		}
		make_req_rules(extra_rules);
		stw=[];
		con=[];
		endw=[];
		ignorelist=[];
		dups.clear();
		clearInterval(loader);
		chrome.browserAction.setBadgeText({text: ''});
		return 0;
	}
	var txt=arr.pop();
	noerror=false;
	if(txt.includes("~")){
		var noerror=true;
		txt=txt.replace("~","");
	}
	if(txt.includes("https:")){
		var suff="?r="+makeid();
		xhr.open("GET", txt+suff, true);
	}
	else{
		xhr.open('GET', chrome.extension.getURL(txt), true);
	}
	xhr.onreadystatechange = function()
	{
		if(xhr.readyState == XMLHttpRequest.DONE && xhr.status != 200 && !noerror)
		{
			dlerror=true;
		}
		if(xhr.readyState == XMLHttpRequest.DONE)
		{
			if(txt.includes("cookie")){
				if(skipcookie){
					skipall=true;
				}
			}
			if(txt.includes("social")){
				if(skipsocial){
					skipall=true;
				}
			}
			if(skipall==false){
			easy=xhr.responseText;
			var easy_arr=easy.split("\n"); 
			easy="";
			make_req_rules(easy_arr);
			}
			extracttext(arr);
		}
	};
	xhr.send();	
	easy="";
	return 0;
}
	
function initfilters(err=""){
cssrule=new Map();
allreqrules=[];
reqdom=new Map();
reqdomtarget=new Map();
reqsub=new Map();
csswhite=[];
allwhite=[];
reqwhite=[];
sublongest=[];
subrules=[];
popuprisk=[];
jsrule=[];
quicklist=[];
veryquick=[];
sab_all=[];
sab_all_v=[];
sab_iframe=[];
cssrulewhite=[];
cssrulewhite["all"]=[];
treatedframes=[];
dangerrules=[];
idstourl=[];
numberofupdates=[];
cookierules=[];
cookierules["all"]=[];
skipcookie=false;
skipsocial=false;
dangerforbrules=[];
targetwhitelist=[];
cssdelay=[];
reqforce=[];
nomulti=[];
topazf=[];
topazs=[];
topazdelay=[];
tarif=[];
dlerror=false;
filterloaded=false;
var skipcss=[];
var trackerlist="";
dups=new Map();

var randnum=makeid(); 
var elp='https://raw.githubusercontent.com/easylist/easylist/master/easylist/easylist_';
var fbp='https://raw.githubusercontent.com/easylist/easylist/master/fanboy-addon/fanboy_';
var addf='https://www.trafiklite.com/smartadblock/filters/sabfilter.txt';
var addff='https://www.trafiklite.com/smartadblock/filters/sabfilter_4.txt';
var cf=fbp+'cookie_general_hide.txt';
var cwf=fbp+'cookie_whitelist_general_hide.txt';
var csf=fbp+'cookie_specific_hide.txt';
var cswf=fbp+'cookie_whitelist_specific_hide.txt';
var ela=elp+'adservers.txt';
var elg=elp+'general_block.txt';
var elgd=elp+'general_block_dimensions.txt';
var elgh=elp+'general_hide.txt';
var elsb=elp+'specific_block.txt';
var elsh=elp+'specific_hide.txt';
var elt=elp+'thirdparty.txt';
var elw=elp+'whitelist.txt';
var elwd=elp+'whitelist_dimensions.txt';
var elwgh=elp+'whitelist_general_hide.txt';
var elbase="https://easylist.to/easylist/easylist.txt";
var inp=[addff,elbase,cf,cwf,csf,addf];
if(err=="second"){
	inp=[addff,ela,elg,elgd,elgh,elsb,elsh,elt,elw,elwd,elwgh,cf,cwf,csf,addf];
}
for (var i = 0; i <  extra_filters.length; i++) {
	inp.push("~"+extra_filters[i]);
}
extracttext(inp);	
}

function checklastupdate(){
        chrome.storage.local.get(["lastupdate"], function(result) {
			var d=new Date();
			var diff=(d-Date.parse(result["lastupdate"]));
			if(diff>86400000){
				affiche("reloading arrays");
				initfilters();
			}
        });
}

function refreshcounter(){
	chrome.storage.local.get(null, function(result) {
		wt=result;
		var ru=rooturl(taburl);
		if(ru in wt){
			chrome.browserAction.setBadgeText({text: ''});
			chrome.browserAction.setIcon({path : "icons/sbgry38.png"});
			chrome.browserAction.setTitle({title: 'SmartAdBlock is disabled on this page'});
			return;
		}
		if(tabid in block_count){
			if(block_count[tabid]>0){
				chrome.browserAction.setBadgeText({text: ''+block_count[tabid]});
				chrome.browserAction.setIcon({path : "icons/sbr38.png"});
				chrome.browserAction.setTitle({title: 'SmartAdBlock has blocked '+block_count[tabid]+' requests'});
			}
			else{
				chrome.browserAction.setBadgeText({text: ''});
				chrome.browserAction.setIcon({path : "icons/sbr38.png"});
				chrome.browserAction.setTitle({title: 'SmartAdBlock'});
			}
		}
		else{
			chrome.browserAction.setBadgeText({text: ''});
			chrome.browserAction.setIcon({path : "icons/sbr38.png"});
			chrome.browserAction.setTitle({title: 'SmartAdBlock'});
		}
	});
}

function checkall(req){
	var lu=0;
	var found=false;
	var line;
	var doublematch=[];
	var ind;
	var doit;
	var track;
	if (typeof req["initiator"] == 'undefined'){return false;}
	if(isabrowserpage(req["initiator"])){return false;}
	if(isextensionpage(req["initiator"])){return false;}
	var tri=rooturl(req["initiator"]);
	var tro=rooturl(req["url"]);
	if(reqdom.has(tri)){
		line=reqdom.get(tri).toString();
		var rulz=line.split(",");
		for (var i = 0; i <  rulz.length; i++) {
			if(rulz[i]<0){
				doublematch.push(rulz[i]);
			}
			else
			{
				lu++;
				var c=checkreq(req,allreqrules[rulz[i]],found);
				if (c=="matchnormal") {
				  found=true;
				}
				if (c=="matchexception") {
				  return false;
				}
			}
		}
	}
	if(reqdomtarget.has(tro)){
		line=reqdomtarget.get(tro).toString();
		var rulz=line.split(",");
		for (var i = 0; i <  rulz.length; i++) {
			doit=rulz[i]>0;
			doit=doit||(rulz[i]<0 && doublematch.includes(rulz[i]));
			if(doit){
				ind=Math.abs(rulz[i]);
				lu++;
				c=checkreq(req,allreqrules[ind],found);
				if (c=="matchnormal") {
				  found=true;
				}
				if (c=="matchexception") {
				  return false;
				}
			}
		}
	}
	for (var j = 0; j < sublongest.length; j++) {	
		if(req["url"].includes(sublongest[j])){
			lu++;
			var c=checkreq(req,allreqrules[subrules[j]],found);
			if (c=="matchnormal") {
			  found=true;
			}
			if (c=="matchexception") {
			  return false;
			}
		}
	}
	if(found){return true;}
  return false;
}

function dangertest(details){
	if (typeof details["initiator"] != 'undefined'){
		var ru=rooturl(details["initiator"]);
		if(popupdanger(ru)){
			var ne = dangerrules.length;
			for (var i = 0; i < ne; i++) {
				if(details["initiator"].includes(dangerrules[i])){return true;}
			}
		}
	}
	return false;
}

function fastcheck(details){
	if(details["type"]=="ping"){return false;}
	if(details["type"]=="stylesheet"){return false;}
	if("initiator" in details){
		if("url" in details){
			if(details["url"]==details["initiator"]){
				return false;
			}
		}
	}
	return checkall(details);
}

function reqwhiteforce(ru,details){
	if(typeof details["url"]!="undefined"){
		var durl=details["url"];
		if(ru in reqforce){
			var reqarr=reqforce[ru];
			var ne = reqarr.length;
			for (var i = 0; i < ne; i++) {
				if(durl.includes(reqarr[i])){
					increment(details["tabId"]);
					refreshcounter();
					return {cancel: true};
					}
			}
		}
	}
	return ;
}

 chrome.webRequest.onBeforeRequest.addListener(
        function(details) {
			var track=false;
			var txt=details["url"];
			var parenturl=details["url"];
			parenturl=getparenturl(details);
			var ru=rooturl(parenturl);
			if(ru in wt){return;}
			if(isallwhite(ru)){return ;}
			if(isreqwhite(ru)){return reqwhiteforce(ru,details);}
			details["initiator"]=parenturl;
			var test=fastcheck(details);
			if(!test){test=dangertest(details);}
			if(!test){
				var ifru=rooturl(details["url"]);
				if(ifru in tarif){
					var ifid="n"+details["frameId"];
					if(!(ifid in treatedframes) && details["frameId"]>0){
						chrome.tabs.insertCSS(details["tabId"], {code: tarif[ifru], frameId : details["frameId"],allFrames:true,matchAboutBlank : true,runAt:"document_start"},callback);
						treatedframes[ifid]=1;
					}
					if((ifid in treatedframes) && details["frameId"]>0){
						if(treatedframes[ifid]<4){
							chrome.tabs.insertCSS(details["tabId"], {code: tarif[ifru], frameId : details["frameId"],allFrames:true,matchAboutBlank : true,runAt:"document_start"},callback);
							treatedframes[ifid]=treatedframes[ifid]+1;
						}
					}
				}
			}
			if(test){	
				increment(details["tabId"]);
				refreshcounter();
			}
			else{
			}
          return {cancel: test};
        },
        {urls: ["<all_urls>"]},
        ["blocking"]);
		
function increment(idnum){
	var fullid=idnum+"id";
	if(fullid in block_count){
		block_count[fullid]++;	
	}
	else{
		block_count[fullid]=1;
	}
}

function newtabanalysis(isnew){
		var ban_anim=false;
		chrome.tabs.query({
		active: true,
		lastFocusedWindow: true
	}, function(tabs) {

		if (typeof tabs !== 'undefined') {
			var tab = tabs[0];
			if (typeof tab !== 'undefined' && !isnotdefinedyet(tab.url)) {
				if ("id" in tab) {
				tabid=tab.id+'id';
				taburl=tab.url;
				idstourl[tab.id+"p"]=tab.url;
				}
				else{
					tabid=-1+'id';
					taburl="";
				}
			}
			if (isnew=="new"){block_count[tabid]=0;}
			if(tabid in block_count){
				refreshcounter();
			}
			else{
				block_count[tabid]=0;
				refreshcounter();
			}
		}
	});        
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if(message.validtab) {
	  affiche("received pass true");
	  letgo=true;
	  setTimeout(function(){ letgo=false;}, 800);
	  sb_rc=message.rc;
	  return;
  }
  if(message.cm) {
	  sb_rc=message.rc;
	  sb_sel=message.sl;
	  return;
  }
  if(message.start){
	  affiche("new tab started");
	  affiche(sender);
	  numberofupdates[sender.tab.id+"p"]=0;
	  return;
  }
  if(message.reload){
	  reinit();
	  return;
  }
  return ;
});

function iscsswhite(txt){
	if(txt==""){return false;}
	var ne = csswhite.length;
	var carr;
	for (var i = 0; i < ne; i++) {
		if(csswhite[i].includes("|")){
			carr=csswhite[i].split("|");
			if(txt.includes(carr[0])&&txt.includes(carr[1])){return true;}
		}
		else
		{
		if(txt.includes(csswhite[i])){return true;}
		}
	}
	return false;
}

function isallwhite(txt){
	if(txt==""){return false;}
	var ne = allwhite.length;
	for (var i = 0; i < ne; i++) {
		if(txt.includes(allwhite[i])){
			return true;}
	}
	return false;
}

function isreqwhite(txt){
	if(txt==""){return false;}
	var ne = reqwhite.length;
	for (var i = 0; i < ne; i++) {
		if(txt.includes(reqwhite[i])){
			return true;}
	}
	return false;
}

function insertautocookie(txt,tab){
	var delay=200;
	if(txt.includes("||")){
		var arrt=txt.split("||");
		var delay=arrt[1];
		txt=arrt[0];
	}	
	var deb='window.addEventListener("load", function() { setTimeout(function(){';
	var debb='window.addEventListener("DOMContentLoaded", function() { setTimeout(function(){';
	
	var end='}, '+delay+'); });';	
	var endd='}, 0); });';	
	var sep="'";

	var codetxt=deb+'if(typeof($('+sep+txt+sep+')[0])!="undefined"){$('+sep+txt+sep+')[0].click();}'+end;
	chrome.tabs.executeScript(tab.id,  {code: codetxt, runAt:"document_start"},callback);
	codetxt=debb+'if((typeof document.querySelectorAll('+sep+txt+sep+')[0])!="undefined"){document.querySelectorAll('+sep+txt+sep+')[0].click();}'+endd;
	chrome.tabs.executeScript(tab.id,  {code: codetxt, runAt:"document_start"},callback);
	codetxt=deb+'if(typeof($('+sep+txt+sep+')[0])!="undefined"){$('+sep+txt+sep+')[0].click();}'+endd;
	chrome.tabs.executeScript(tab.id,  {code: codetxt, runAt:"document_start"},callback);
}

function insertlatecss(txt,tab,delay){
	//delay=2000;
	var deb='window.addEventListener("load", function() { setTimeout(function(){  $("head").append('+sep+'<style>'+txt+'</style>'+sep+');';
	var end='}, '+delay+'); });';	
	var codetxt=deb+end;
	chrome.tabs.executeScript(tab.id,  {code: codetxt, runAt:"document_start"},callback);
}

function topazrep(txt){
	var res="";
	if(txt.includes("t")){res=res+"top:0px !important;"}
	if(txt.includes("o")){res=res+"opacity:0 !important;"}
	if(txt.includes("p")){res=res+"pointer-events:none !important;"}
	if(txt.includes("a")){res=res+"position:absolute !important;"}
	if(txt.includes("z")){res=res+"z-index:-999 !important;"}
	return res;
}

function toskipcss(txt){
	if(txt==""){return false;}
	txt="."+txt;
	var ne = skipcss.length;
	for (var i = 0; i < ne; i++) {
		if(txt.includes(skipcss[i]) && skipcss[i].length>1){
			return true;}
	}
	return false;
}

function insertion(tab){
	if(isabrowserpage(tab.url)){return ;}
	if(isextensionpage(tab.url)){return ;}
	affiche("inserting CSS");
	var ru=rooturl(tab.url);
	var nall=cookierules["all"].length;
	for (var i = 0; i < nall; i++) {
		insertautocookie(cookierules["all"][i],tab);
	}
	if(ru in cookierules){
		var ns=cookierules[ru].length;
		for (var i = 0; i < ns; i++) {
			affiche(cookierules[ru][i]);
			insertautocookie(cookierules[ru][i],tab);
		}
	}
	var istopazf=false;
	var istopazs=false;
	if(ru in topazf){istopazf=true;}
	if(ru in topazs){istopazs=true;}
	if(iscsswhite(tab.url)){return;}
	if(popupdanger(tab.url)){
		chrome.tabs.insertCSS(tab.id, {code: sab_iframe.join(sepdisp)+sepdisp, allFrames:true, runAt:"document_start", cssOrigin : "user",matchAboutBlank : true},callback);
	}
	var modkeyopone="";
	var modkeyoptwo="";
	var modkeyopthr="";
	for (const [key,value] of cssrule){
			if(tab.url.includes(key)){
				if(isabrowserpage(tab.url)){return;}
				try {
					if(istopazf==false){
						modkeyopone=modkeyopone+value;
						//console.log(modkeyop);
						//chrome.tabs.insertCSS(tab.id, {code: modkeyop, allFrames:false,runAt:"document_start", cssOrigin : "user",matchAboutBlank : true},callback);
					}
					if(istopazf==true){
						var toptxt=topazf[ru];
						var rep=topazrep(toptxt);
						var modkeyoptwo=modkeyoptwo+value.replaceAll("display:none",rep);
						//chrome.tabs.insertCSS(tab.id, {code: modkeyop, allFrames:false,runAt:"document_start", cssOrigin : "user",matchAboutBlank : true},callback);
					}
					if(istopazs==true){
						var toptxt=topazs[ru];
						var rep=topazrep(toptxt);
						var del=topazdelay[ru];
						var modkeyopthr=modkeyopthr+value.replaceAll("display:none",rep);
						//insertlatecss(modkeyop,tab,del);
					}
				}
				catch(err) {
					affiche("insertion error");
				}
			}
	}
	
				try {
					if(istopazf==false){
						if(!toskipcss(ru)){
						var modall=sab_all.join(sepdisp)+sepdisp;
							var ne = cssrulewhite["all"].length;
							for (var i = 0; i < ne; i++) {
									exc=cssrulewhite["all"][i];
									if((typeof modall)=="string"){
										modall=modall.replace(exc,"#_p_p");
									}
								}	
						if(ru in cssrulewhite){
							var ne = cssrulewhite[ru].length;
							for (var i = 0; i < ne; i++) {
									exc=cssrulewhite[ru][i];
									if((typeof modall)=="string"){
										modall=modall.replace(exc,"#_p_p");
									}
								}
							}
						chrome.tabs.insertCSS(tab.id, {code: modkeyopone+modall+sab_all_v.join(sepdisp)+sepdisp, allFrames:false, runAt:"document_start", cssOrigin : "user",matchAboutBlank : true},callback);
						}
						else
						{
						chrome.tabs.insertCSS(tab.id, {code: modkeyopone, allFrames:false, runAt:"document_start", cssOrigin : "user",matchAboutBlank : true},callback);
						}
					}
					if(istopazf==true){
						if(!toskipcss(ru)){
						var toptxt=topazf[ru];
						var rep=topazrep(toptxt);
						var seprep="{"+rep+" !important;}";
						var modall=sab_all.join(seprep)+seprep;
							var ne = cssrulewhite["all"].length;
							for (var i = 0; i < ne; i++) {
									exc=cssrulewhite["all"][i];
									if((typeof modall)=="string"){
										modall=modall.replace(exc,"#_p_p");
									}
								}	
						if(ru in cssrulewhite){
							var ne = cssrulewhite[ru].length;
							for (var i = 0; i < ne; i++) {
									exc=cssrulewhite[ru][i];
									if((typeof modall)=="string"){
										modall=modall.replace(exc,"#_p_p");
									}
								}
							}
						
						chrome.tabs.insertCSS(tab.id, {code: modkeyoptwo+modall+sab_all_v.join(sepdisp)+sepdisp, allFrames:false, runAt:"document_start", cssOrigin : "user",matchAboutBlank : true},callback);
						}else{
						chrome.tabs.insertCSS(tab.id, {code: modkeyoptwo, allFrames:false, runAt:"document_start", cssOrigin : "user",matchAboutBlank : true},callback);
						}
					}
					if(istopazs==true){
						if(!toskipcss(ru)){
						var toptxt=topazs[ru];
						var rep=topazrep(toptxt);
						var del=topazdelay[ru];
						var seprep="{"+rep+" !important;}";
						var modall=sab_all.join(seprep)+seprep;
							var ne = cssrulewhite["all"].length;
							for (var i = 0; i < ne; i++) {
									exc=cssrulewhite["all"][i];
									if((typeof modall)=="string"){
										modall=modall.replace(exc,"#_p_p");
									}
								}	
						if(ru in cssrulewhite){
							var ne = cssrulewhite[ru].length;
							for (var i = 0; i < ne; i++) {
									exc=cssrulewhite[ru][i];
									if((typeof modall)=="string"){
										modall=modall.replace(exc,"#_p_p");
									}
								}
							}
						
						insertlatecss(modkeyopthr+modall,tab,del);
						}else{
						insertlatecss(modkeyopthr,tab,del);
						}
					}
				}
				catch(err) {
					affiche("insertion error");
				}
}

function callback() {
    if (chrome.runtime.lastError) {
    } else {
    }
}

function sharpurl(txt){
	if (typeof txt == 'undefined'){return "";}
	txt=txt.trim();
	txt=txt.replace("http://","");
	txt=txt.replace("https://","");
	if(txt.slice(-1)=="/"){txt=txt.slice(0, -1);}
	return txt;
}

function isexpected(url){
	url=sharpurl(url);
	if(url==""){return false;}
	var exp=sharpurl(sb_rc);
	var expp=sharpurl(sb_sel);
	return (exp==url || expp==url);
}

function isalreadyloaded(tab){
	if(!(tab.id in idstourl)){return false;}
	var urls=idstourl[tab.id];
	var arr=urls.split("#");
	urls=arr[0];
	arr=urls.split("?");
	urls=arr[0];
	urlo=tab.url;
	arr=urlo.split("#");
	urlo=arr[0];
	arr=urlo.split("?");
	urlo=arr[0];
	return urlo==urls;
}

function isdangerforbidden(txt){
	var nda=dangerforbrules.length;
	for (var i = 0; i < nda; i++) {
		if(txt.includes(dangerforbrules[i])){return true;}
	}
	return false;
}

function isnomulti(sourcetab){
	if(typeof(sourcetab)!="undefined"){
		if("url" in sourcetab){
			var source=sourcetab.url;
			var su=rooturl(source);
			return (su in nomulti);
		}
	}
	return false;
}

function tryremove(id){
	try{
		var removing = chrome.tabs.remove(id);
		removing.then(emp,emp);
	}
	catch(err){
	}	
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if(changeInfo.status==="complete"){
		affiche("complete");
	}
	if(changeInfo.status=="loading"){
		if(filterloaded==false){
			//sinitfilters();
		}
		if(firefox){
			if(tab.url=="about:blank"){return;}
		}
		affiche("loading");
		var sttab=tabId+'id';
		affiche(tab);
		affiche(idstourl);
		if(sttab in followtab){
			var source=sourcetab.url;
			delete followtab[sttab];
			if(popupdanger(source)){
				if(!firefox){
					if(isnotdefinedyet(tab.url)){
						tryremove(tab.id);
						notify(sourcetab.id,tab.url);
						return 0;
					}
				}
				var s=isasearch(tab.url) || istargetwhitelisted(tab.url);
				var ru=rooturl(tab.url);
				var su=rooturl(source);
				if(!isexpected(tab.url) && !s){
					tryremove(tab.id);
					notify(sourcetab.id,tab.url);
					return 0;
				}
				var t=tab.url;
				if(isdangerforbidden(t)){
					tryremove(tab.id);
					notify(sourcetab.id,tab.url);
					return 0;
				}
			}
			var a=popupcheck(tab,sourcetab);
			if(a==0){return 0;}
		}
		var tinum=tab.id+"p";
		if(tinum in idstourl){
			var ruold=rooturl(idstourl[tinum]);
			var runew=rooturl(tab.url);
			if(runew!=ruold){
				numberofupdates[tinum]=0;
			}
		}
		var updatelimit=3;
		var checklimit=true;
		if(isnomulti(tab)){checklimit=false;}
		if(tinum in numberofupdates){
			if(numberofupdates[tinum]>updatelimit && checklimit){
				return;
			}
		}
		else{
			numberofupdates[tinum]=1;
		}
		t=tab.url;
		if(isabrowserpage(t)){return;}
			block_count[tab.id+"id"]=0;
			registernewtab(tab);
			checklastupdate();
			numberofupdates[tinum]++;
	}
});

function registernewtab(tab){
		var ru=rooturl(tab.url);
		chrome.storage.local.get(null, function(result) {
			wt=result;
			affiche("registering new tab "+(ru in wt));
			affiche("ru "+ru);
			affiche("wt");
			affiche(wt);
			if((ru in wt)==false){
				insertion(tab);
			}
			newtabanalysis();
		});
}

function popupcheck(tab,tabb){
		if(tab.url==""){
		chrome.tabs.remove(tab.id);
		notify(tabb.id,tab.url);
		return 0;
		}
		var ru=rooturl(tab.url);
        var source=tabb.url;
		var samedomain=(rooturl(source)==ru);
		var se=isabrowserpage(tab.url);
		var s=isasearch(tab.url);
		se=se || s;
		se=se || (isexpected(tab.url));
		se=se || samedomain;
		se=se || istargetwhitelisted(tab.url);
		if(tab.active==true && !se){
			tryremove(tab.id);
			notify(tabb.id,tab.url);
			return 0;
		}    
		return 1;
}

function isasearch(txt){
return txt.includes("google") && txt.includes("/search");
}

function popupdanger(url){
	if (typeof url == 'undefined'){return false;}
	var arr;
	url=url.toLowerCase();
	url=url.replace("http://","");
	url=url.replace("https://","");
	arr=url.split("/");
	url=arr[0];
	arr=url.split("?");
	url=arr[0];
	if(url in wt){return false;}
	for (var j = 0; j < popuprisk.length; j++) {
		if(url.includes(popuprisk[j])){
			return true;
		}
	}
	return false;
}

function notify(id,txt){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		chrome.tabs.sendMessage(id, {action: "newtab",url: txt});  
	});
}

function allowpopup(tab){
	if(typeof tab!="undefined"){url=tab.url;}
	var url_short=rooturl(url);
	if(url_short in wt){return true;}
	if(isallwhite(url)){return true;}
	if(isabrowserpage(url)){return true;}
	var ne = popupsourcewhite.length;
	for (var i = 0; i < ne; i++) {
		if(url.includes(popupsourcewhite[i])){return true;}
	}
	return false;
}

function istargetwhitelisted(txt){
	var nta=targetwhitelist.length;
	for (var i = 0; i < nta; i++) {
		if(txt.includes(targetwhitelist[i])){return true;}
	}
	return false;
}

function gettabsource(tab){
	if(typeof(tab)!="undefined"){
		if("url" in tab){
			return rooturl(tab.url);
		}
	}
return "";
}
chrome.tabs.onCreated.addListener(function(tab) { 
	var rutt=rooturl(tab.url);

	var samedomain=false;
	lasttab=parseInt(tabid.replace("id",""));
	chrome.tabs.get(lasttab,function callback() {if (chrome.runtime.lastError) { console.log(chrome.runtime.lastError.message);} else {
		chrome.tabs.get(lasttab,function(tabb) {
			su=gettabsource(tabb);
			if(allowpopup(tabb)){
				registernewtab(tab);
				return ;
			}
			if(popupdanger(su) && !isabrowserpage(tab.url)){
				var s=isasearch(tab.url);
				if(sb_rc!=tab.url && !isnotdefinedyet(tab.url) && !s){
					tryremove(tab.id);
					notify(tabb.id,tab.url);
					return 0;
				}
				if(isdangerforbidden(tab.url)){
					tryremove(tab.id);
					notify(tabb.id,tab.url);
					return 0;
				}
			var samedomain=(su==rutt  && !isnotdefinedyet(tab.url));
			var se=istargetwhitelisted(rutt);
			se=se || isexpected(tab.url);
			se=se || isabrowserpage(tab.url);
			se=se || s;
			se=se || (su in wt);
			if(!isnotdefinedyet(tab.url) && !samedomain && !letgo && !isabrowserpage(tab.url) && tab.active==true && !se){
				tryremove(tab.id);
				notify(tabb.id,tab.url);
				return 0;
			}    
			else{
				if(isnotdefinedyet(tab.url) && !se){
					followtab[tab.id+"id"]="ok";
					popuptab=tab;
					sourcetab=tabb;
				}  
				else{
				}
			}
			}
		});	
	}});
});

chrome.tabs.onActivated.addListener(function(tabId, changeInfo, tab) {
newtabanalysis();
});

chrome.windows.onFocusChanged.addListener(function(tabId, changeInfo, tab) {
newtabanalysis();
});

function addelement(){
  chrome.storage.local.set({"site": "o"}, function() {
		  readelement();
        });
}
function readelement(){
        chrome.storage.local.get(["site"], function(result) {
        });
}

