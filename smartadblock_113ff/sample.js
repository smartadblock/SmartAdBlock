var sam=[];

function notaroot(ro){
if(!ro.includes(".")){return true;}
if(ro.endsWith(".")){return true;}
return false;
}

function treatrule(origtxt){
	var s=false;
	var txt=origtxt.split('').join('');
	var or=txt;
	var rootarr;
	txt=txt.toLowerCase();
	txt=txt.trim();
	if(txt.includes("cbsnews") && txt.includes("imasdk")){track=true;}
	if(txt.length<3){return false;}
	if(txt.includes("{")){return false;}
	if(txt.includes("[")){return false;}
	if(txt.includes("#")){return false;}
	if(txt.startsWith("!")){return false;}
	if(txt.startsWith("[")){return false;}
	if(txt.includes("csp=script-src")){return false;}
	txt=txt.replaceAll('^^','^$third-party');
	var a=[];
	a["white"]="normal";
	a["longest"]=longest(txt);
	if(txt.startsWith("@@")){
		a["white"]="exception";
		txt=txt.replace("@@","");
	}
	if(txt.includes("$")){
		var parr = txt.substring(txt.lastIndexOf("$") + 1, txt.length);
		txt = txt.substring(0, txt.lastIndexOf("$"));
	}
	if(txt.startsWith("/") && txt.endsWith("/")){return false;}
	a["root"]="";
	a["or"]=or;
	a["domtarget"]=true;
	var roo=txt;
	if(roo.includes("^")){rootarr=roo.split("^");roo=rootarr[0];}
	if(roo.includes("*")){rootarr=roo.split("*");roo=rootarr[0];}
	roo=roo.replaceAll("|","");
	roo=roo.replaceAll("@","");
	var ro=rooturl(roo);
	if(notaroot(ro)){a["domtarget"]=false;}
	if(!txt.startsWith("|")){pref=".*";a["domtarget"]=false;}
	if(notaroot(ro)){a["domtarget"]=false;}
	if(txt.startsWith("||")){
		var pref="^[A-Za-z0-9\\-]*:\/\/[A-Za-z0-9\\-]*\\.*";
		txt=txt.replace("||www.","||");
		txt=txt.replace("||www2.","||");
		txt=txt.replace("||www3.","||");
		txt=txt.substr(2);
		a["root"]=ro;
		}
	else{
		if(txt.startsWith("|"))
		{pref="^";txt=txt.substr(1);a["root"]=ro;
		}
	}
	var suff=".*";
	if(txt.includes("|")){
	arr=txt.split("|");
	txt=arr[0];
	suff="$";
	}
		txt=txt.replaceAll("\\","\\\\");
		txt=txt.replaceAll(".","\\"+".");
		txt=txt.replaceAll("*",".*");
		txt=txt.replaceAll("?","\\?");
		txt=txt.replaceAll("(","\\(");
		txt=txt.replaceAll(")","\\)");
		txt=txt.replaceAll("/","\\/");
		txt=txt.replaceAll("^","(\\?|\\/|).*");
		txt=txt.replaceAll("+","\.");
		var fin=pref+txt+suff;
		fin=fin.replaceAll(".*.*",".*");		
	//var r= new RegExp(fin);
	a["reg"]=fin;
	a["tp"]=false;
	a["onsite"]=false;
	a["domainw"]=[];
	a["domainb"]=[];
	a["typew"]=[];
	a["typeb"]=[];
	if (typeof parr != 'undefined'){
		var p_arr=parr.split(',');
		var ne = p_arr.length;
		for (var i = 0; i < ne; i++) {
			k=p_arr[i];
			if(k=="third-party"){a["tp"]=true;}
			if(k=="~third-party"){a["onsite"]=true;}
			if(k.includes("domain=")){
				var res=extractdom(k);
				a["domainw"]=res["dw"];
				a["domainb"]=res["db"];
				}
			if(!k.includes("domain=") && !k.includes("=") && k!="third-party"){
				if(k.includes('~')){
					a["typeb"].push(k.replace("~",""));
					if(k.replace("~","")=="subdocument"){
						a["typeb"].push("main_frame");
					}
				}
				else{
					a["typew"].push(k);
					if(k=="subdocument"){
						a["typew"].push("main_frame");
					}
				}
			}
		}
	}
	//if(track){console.log(a);}
	return a;
}

function matchregex(m,n){
	if(typeof m == "undefined"){return false;}
	if(m==null){return false;}
	if(m.includes(n)){return true;}
	return false;
}

function checkreq(req,txt,whiteonly){
	var rule=treatrule(txt);
	var track=false;
	if(whiteonly && rule["white"]=="normal"){return ;}
	var source_root=rooturl(req["initiator"]);
	var target_root=rooturl(req["url"]);
	if(rule["tp"]){
		if(source_root==target_root){return "nomatch"+rule["white"];}
	}
	if(rule["onsite"]){
		if(source_root!=target_root){return "nomatch"+rule["white"];}
	}
	if(rule["domainw"].length>0){
		if(!rule["domainw"].includes(source_root)){return "nomatch"+rule["white"];}
	}
	if(rule["domainb"].length>0){
		if(rule["domainb"].includes(source_root)){return "nomatch"+rule["white"];}
	}
	if(rule["typew"].length>0){
		if(!rule["typew"].includes(req["type"])){return "nomatch"+rule["white"];}
	}
	if(rule["typeb"].length>0){
		if(rule["typeb"].includes(req["type"])){return "nomatch"+rule["white"];}
	}
	n=req["url"].toLowerCase();
	var nnp=rule["longest"].length;
	for (var i = 0; i < nnp; i++) {
		if(!n.includes(rule["longest"][i])){return "nomatch"+rule["white"];}
	}
	//console.log(n);
	//console.log(rule["or"]);
	//console.log(rule["longest"]);
	//console.log("***********************");
	//console.log("**********REGEX********");
	//console.log("***********************");
	var r= new RegExp(rule["reg"]);
	m=n.match(r);
	if(matchregex(m,n)){
			return "match"+rule["white"];
	}
	else{
		return "nomatch"+rule["white"];
	}
}

function extractdom(txt){
	txt=txt.replace("domain=","");
	var arr=txt.split("|");
	var res=[];
	res["dw"]=[];
	res["db"]=[];
	var ne = arr.length;
	for (var i = 0; i < ne; i++) {
		if(arr[i].includes('~')){
			res["db"].push(arr[i].replace("~",""));
		}
		else
		{
			res["dw"].push(arr[i]);;
		}
	}
	return res;
}

function longest(str){
	var longarr=[];
	if(str.startsWith("@@")){
		str=str.substr(2);
	}
	else{
		if(str.startsWith("@"))
		{str=str.substr(1);}
	}
	if(str.startsWith("||")){
		str=str.substr(2);
	}
	else{
		if(str.startsWith("|"))
		{str=str.substr(1);}
	}
	var buff="";
	var wasforb=true;
	for (var i = 0; i < str.length; i++) {
		var l=str.charAt(i);
		if(l=="$"){break; }
		if(l=="|" && i>1){break; }
		var forb=["|","*","$","@","^"];
		if(forb.includes(l)){
			if(!wasforb){
				longarr.push(buff);
				buff="";
			}
			wasforb=true;
		}
		else{
			wasforb=false;
			buff=buff+l;
		}
	}
	if(!wasforb){
		longarr.push(buff);
	}
	return longarr;
}