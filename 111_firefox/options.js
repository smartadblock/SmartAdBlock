var filterjson;

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
read_rules("rules","customrule");
read_rules("filters","customfilter");

document.getElementById('addrule').addEventListener("click", addrule);
document.getElementById('removerule').addEventListener("click", removerule);
document.getElementById('addurl').addEventListener("click", addfilter);
document.getElementById('removeurl').addEventListener("click", removefilter);
document.getElementById('reinit').addEventListener("click", reinitmessage);

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



function display_filters(){
	var n=filterjson.length;
	var m=countfilter();
	var j=0;
	for (let i = 0; i < n; i++) {
		var c=Math.floor((3*j)/(m))+1;
		if(notforbid(i)){
			j=j+1;
			var div = document.getElementById('r'+c);
			div.innerHTML += checkb(filterjson[i]["name"]);
		}
	}
}

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 20; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}
