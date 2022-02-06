  
  var startEvent = 'no';	
  var whatEvent = '';			// auctioncountdown, auction, draftcountdown, draft, poll
  var showMondayReport = 'yes';		// no will keep the Monday Report off. yes will only show the event center on Mondays
  
var leagueName = $('.leaguelogo').prop('title');
var startEvent;
var whatEvent;
var showMondayReport;
var leagueName;

document.getElementById("leaguename").innerHTML=leagueName;

if (startEvent == 'yes') {
	document.getElementById("eventcenter").style.display="block";
}else{
}

if (whatEvent == 'auction') {
	document.getElementById("auction").style.display="block";
}else if (whatEvent == 'auctioncountdown') {
	document.getElementById("auctioncountdown").style.display="block";
}else if (whatEvent == 'draft') {
	document.getElementById("draft").style.display="block";
}else if (whatEvent == 'draftcountdown') {
	document.getElementById("draftcountdown").style.display="block";
}else if (whatEvent == 'poll') {
	document.getElementById("pollevent").style.display="block";
}else {
}

if (showMondayReport == 'yes') {
	var isNotMonday = $('#mondayreport td').hasClass('warning').toString();
	if (isNotMonday == 'true') {
		document.getElementById("mondayreport").style.display="none";
		document.getElementById("eventcenter").style.display="none";
	}else if (isNotMonday == 'false') {
		document.getElementById("eventcenter").style.display="block";
		document.getElementById("mondayreport").style.display="block";
	}else{
	}
}else {
}

$(document).ready(function(){

$('#mvpmenu li:nth-of-type(1) > a').addClass('mvpmenuactive');
$('#mvpmenu li:nth-of-type(1) dd:nth-of-type(1) a').addClass('mvpmenuactive');
setTimeout(function(){
	$('#mvpsubmenu dd:nth-of-type(1) a').removeClass('mvpmenuactive').addClass('mvpsubmenuactive');
}, 200);

});
