
function addrule() {
	sel = document.getElementById('customrule');
	var opt = document.createElement('option');
	txt=document.getElementById('inputrule').value
    opt.value = txt;
    opt.innerHTML = txt;
    sel.appendChild(opt);
	write_rules("rules","customrule");
}

function removerule(){
	var x = document.getElementById("customrule");
	x.remove(x.selectedIndex);
	write_rules("rules","customrule");
}

function addfilter() {
	sel = document.getElementById('customfilter');
	var opt = document.createElement('option');
	txt=document.getElementById('inputfilter').value
    opt.value = txt;
    opt.innerHTML = txt;
    sel.appendChild(opt);
	write_rules("filters","customfilter");
}

function removefilter(){
	var x = document.getElementById("customfilter");
	x.remove(x.selectedIndex);
	write_rules("filters","customfilter");
}

function read_rules(key,target) {
	chrome.storage.local.get(key, function(result) {
	if(typeof result != 'undefined'){
		try{
		var res=JSON.parse(result[key]);
		for(i = 0; i < res.length; i++) {
			sel = document.getElementById(target);
			var opt = document.createElement('option');
			opt.value = res[i];
			opt.innerHTML = res[i];
			sel.appendChild(opt);
		}
	}catch{}
	}else{}
	});
}

function write_rules(key,target) {
	var rel=[];
    var trends = document.querySelectorAll('#'+target+' > option');
     for(i = 0; i < trends.length; i++) {
       rel.push(trends[i].value);
       }
		var myJsonString = JSON.stringify(rel);
		var res={};
		res[key]=myJsonString;
		chrome.storage.local.set(res, function() {
        });
}

function clearfilterlist(){
	var inputs = document.getElementsByTagName('input');
	for(var i = 0; i < inputs.length; i++) {
		if(inputs[i].type.toLowerCase() == 'checkbox') {
			inputs[i].checked=false;
		}
	}
}

function read_filterlist() {
	chrome.storage.local.get("filterlist", function(result) {
	if(typeof result["filterlist"] == 'undefined'){
		var res=["sab","fc","el"];
		for(i = 0; i < res.length; i++) {
			sel = document.querySelectorAll('[name="'+res[i]+'"]');
			sel[0].checked=true;
		}
	}
	if(typeof result != 'undefined'){
		try{
		var res=JSON.parse(result["filterlist"]);
		if(res.length==0){res=["sab","fc","el"];}
		for(i = 0; i < res.length; i++) {
			sel = document.querySelectorAll('[name="'+res[i]+'"]');
			sel[0].checked=true;
		}
	}catch{}
	}else{}
	});
}

function write_filterlist(){
	var rel=[];
	var inputs = document.getElementsByTagName('input');
	for(var i = 0; i < inputs.length; i++) {
		if(inputs[i].type.toLowerCase() == 'checkbox') {
			if(inputs[i].checked==true){
				rel.push(inputs[i].name);
			}
		}
	}
	var myJsonString = JSON.stringify(rel);
	var res={};
	res["filterlist"]=myJsonString;
	chrome.storage.local.set(res, function() {
    });
}

function reset_all_rules(){
	var r = confirm("Reset all custom filters and return to original settings?");
	if (r == true) {
	} else {return;}
	document.getElementById("customrule").innerHTML = "";
	document.getElementById("customfilter").innerHTML = "";
	var rel=["sab","el","fc"];
	var myJsonString = JSON.stringify(rel);
	var res={};
	res["filterlist"]=myJsonString;
	chrome.storage.local.set(res, function() {
		clearfilterlist();
		read_filterlist();
    });
	var rel=[];
	var myJsonString = JSON.stringify(rel);
	var res={};
	res["filters"]=myJsonString;
	console.log(res);
	chrome.storage.local.set(res, function() {
		read_rules("filters","customfilter");
    });
	var rel=[];
	var myJsonString = JSON.stringify(rel);
	var res={};
	res["rules"]=myJsonString;
	chrome.storage.local.set(res, function() {
		read_rules("rules","customrule");
    });
}
read_rules("rules","customrule");
read_rules("filters","customfilter");

clearfilterlist();
read_filterlist();

document.getElementById('addrule').addEventListener("click", addrule);
document.getElementById('removerule').addEventListener("click", removerule);
document.getElementById('addurl').addEventListener("click", addfilter);
document.getElementById('removeurl').addEventListener("click", removefilter);
document.getElementById('reinit').addEventListener("click", reinitmessage);
document.getElementById('resetall').addEventListener("click", reset_all_rules);

function reinitmessage(){
chrome.runtime.sendMessage({reload:true});
}

function checkb(url){
res='<div style="line-height:25px;">';
res+='<input type="checkbox" id="horns" name="horns">';
res+='<label for="horns">'+url+'</label>';
res+='</div>';
return res;
}

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 20; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

var inputs = document.getElementsByTagName('input');

for(var i = 0; i < inputs.length; i++) {
    if(inputs[i].type.toLowerCase() == 'checkbox') {
        //alert(inputs[i].value);
		inputs[i].addEventListener("click", tick);
    }
}

function tick(t){
 write_filterlist();
}