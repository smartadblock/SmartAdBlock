var ob = ["allreqrules", "csswhite", "allwhite", "reqwhite","sublongest"];
ob=ob.concat(["subrules", "popuprisk",  "veryquick","sab_all","popupsourcewhite"]);
ob=ob.concat(["sab_all_v", "sab_iframe", "cssrulewhite", "dangerrules","cookierules"]);
ob=ob.concat(["dangerforbrules", "targetwhitelist", "cssdelay", "reqforce","reqforceinclude"]);
ob=ob.concat(["nomulti", "topazf", "topazs", "topazdelay","tarif","skipcss","jsrule"]);
var ma = ["cssrule", "reqdom", "reqdomtarget", "reqsub"];

const map_to_obj = ( aMap => {
    const obj = {};
    aMap.forEach ((v,k) => { obj[k] = v });
    return obj;
});

const obj_to_map = ( obj => {
    const mp = new Map;
    Object.keys ( obj ). forEach (k => { mp.set(k, obj[k]) });
    return mp;
});

function store_obj(varlbl,lbl){
	var myJsonString = JSON.stringify(window[varlbl+"_s"]);
	var res={};
	res[lbl]=myJsonString;
		//console.log("storing "+lbl);
		//console.log(window[varlbl]);
		//console.log(myJsonString);
	chrome.storage.local.set(res, function() {
		window[varlbl]=window[varlbl+"_s"];
		window[varlbl+"_s"]=[];
		window[varlbl+"_s"]["all"]=[];
		//console.log("stored "+lbl);
		//console.log(myJsonString);
	});
}

function store_map(varlbl,lbl){
	var obj=map_to_obj(window[varlbl+"_s"]);
	var myJsonString = JSON.stringify(obj);
	var res={};
	res[lbl]=myJsonString;
	chrome.storage.local.set(res, function() {
		window[varlbl]=window[varlbl+"_s"];
		window[varlbl+"_s"]=new Map();
		var res={};
		res["stored"]="in";
		chrome.storage.local.set(res, function() {
		});
	});
}

function restore_obj(varlbl,lbl){
	chrome.storage.local.get(lbl, function(result) {
		if(typeof result != 'undefined'){
			try{
				var res=JSON.parse(result[lbl]);
				//console.log("restoring "+lbl);
				//console.log(res);
				window[varlbl]=res;
			}catch{}
		}else{}
	});
}

function restore_map(varlbl,lbl){
	chrome.storage.local.get(lbl, function(result) {
		if(typeof result != 'undefined'){
			try{
				var res=JSON.parse(result[lbl]);
				var mp=obj_to_map (res);
				//console.log("restoring "+lbl);
				//console.log(mp);
				window[varlbl]=mp;
			}catch{}
		}else{}
	});
}

function restore_rules(){
	for(var i = 0; i < ma.length; i++){
		restore_map(ma[i],ma[i]);
	}
	for(var i = 0; i < ob.length; i++){
		restore_obj(ob[i],ob[i]);
	}
}
function store_rules(){
	for(var i = 0; i < ma.length; i++){
		store_map(ma[i],ma[i]);
	}
	for(var i = 0; i < ob.length; i++){
		store_obj(ob[i],ob[i]);
	}
}
