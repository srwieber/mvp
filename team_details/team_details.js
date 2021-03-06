let sortCol = "td:nth-child(4) a";
let funrun = 0;

function getRecord() {
	url = baseURLDynamic + "/" + year + "/options?L=" + league_id + "&O=208&PRINTER=1";
	$.ajax({
		url: url,
		type: "GET",
		dataType: "html",
		async: false,
		success: function (data) {
			record = $(data).find('.report .franchisename .myfranchise').closest('tr');
			$(record).prependTo('#hiddenreports').addClass('career_record');
			$('.career_record a').attr('href', function (i, href) {
				return href.replace('&PRINTER=1', '');
			});
			recordFormat();
		}
	});
}
setTimeout(function (){
	getRecord();
}, 10);

function recordFormat() {
	let overviewtable = '<tr><td id="team"></td><td id="history"></td><td id="matchup"><center><a href="//%HOST%/%YEAR%/ajax_ls?L=%LEAGUEID%">Week ' + liveScoringWeek + ' Matchup</a></center><table><tr><td class="left"></td><td class="right"></td></tr></table></td><td id="last_week"><center><a href="//%HOST%/%YEAR%/options?L=%LEAGUEID%&O=22">Week ' + completedWeek + ' Results</a></center><table><tr><td class="left"></td><td class="right"></td></tr></table></td></tr>';
	$('#team_overview').append(overviewtable);
	let icon = $('#hiddenreports .career_record').find('td:nth-of-type(2)').html();
	let wins = $('#hiddenreports .career_record').find('td:nth-of-type(3)').text();
	let losses = $('#hiddenreports .career_record').find('td:nth-of-type(4)').text();
	let perc = $('#hiddenreports .career_record').find('td:nth-of-type(6)').text();
	let avgpoints = $('#hiddenreports .career_record').find('td:nth-of-type(8)').text();
	let est = $('#hiddenreports .career_record').find('td:last-of-type a:last-of-type').text();
	let estyears = $('#hiddenreports .career_record').find('td:last-of-type a').length;
	$('#team_overview #team').append(icon);
	$('#team_overview #history').append('<span class="highlight_topic">Established: </span>' + est + '<br /><span class="highlight_topic">Year: </span>#' + estyears + '<br /><span class="highlight_topic">Career Record: </span>' + wins + ' - ' + losses + '<br /><span class="highlight_topic">Winning %: </span>' + perc + '<br /><span class="highlight_topic">Avg Points: </span>' + avgpoints);

	$('#standings tr').find('a[href*="' + franchise_id +
 '"]').closest('tr').addClass('myfranchise');
	let myrecord = $('#standings tr.myfranchise').find('td:nth-of-type(2)').text();
	let myperc = $('#standings tr.myfranchise').find('td:nth-of-type(7)').text();
	let mypoints = $('#standings tr.myfranchise').find('td:nth-of-type(8)').text();
	$('#team_overview #team').append('<br /><span class="highlight_topic">Record: </span>' + myrecord + '<br /><span class="highlight_topic">Winning %: </span>' + myperc + '<br /><span class="highlight_topic">Avg Points: </span>' + mypoints + '<br /><br /><br /><br /><br /><br />');

	let awardfirst = $('#my_trophy_case tr').find('td:contains("League Champion")').length;
	let awardsecond = $('#my_trophy_case tr').find('td:contains("Second Place Overall")').length;
	let awardthird = $('#my_trophy_case tr').find('td:contains("Third Place Overall")').length;
	let awardtoilet = $('#my_trophy_case tr').find('td:contains("Toilet Bowl Champ")').length;
	let awardpoints = $('#my_trophy_case tr').find('td:contains("Most Points")').length;
	let award = '<i class="fa fa-trophy" aria-hidden="true"></i>'; 
	$('#team_overview #history').append('<br /><span class="highlight_topic">League Champ: </span><span class="gold">' + award.repeat(awardfirst) + '</span><br /><span class="highlight_topic">2nd Place: </span><span class="silver">' + award.repeat(awardsecond) + '</span><br /><span class="highlight_topic">3rd Place: </span><span class="bronze">' + award.repeat(awardthird) + '</span><br /><span class="highlight_topic">Toilet Champ: </span><span class="white">' + award.repeat(awardtoilet) + '</span><br /><span class="highlight_topic">Most Points: </span><span class="green">' + award.repeat(awardpoints) + '</span>');

getScore();
}

function getScore() {
	let weeklink = '';
	if (funrun == 1) { weeklink = weeklink + '&W=' + completedWeek; }

	url = baseURLDynamic + "/" + year + "/weekly?L=" + league_id + weeklink + "&PRINTER=1";
	$.ajax({
		url: url,
		type: "GET",
		dataType: "html",
		async: false,
		success: function (data) {
			let score = $(data).find('.report:eq(2)');
			let visitscore = $(data).find('.report:eq(3)');
			let teamsection;
				if (funrun === 0) { teamsection = '#matchup'; }
				if (funrun === 1) { teamsection = '#last_week'; }
			$(teamsection + ' .left').prepend(score);
			$(teamsection + ' .right').prepend(visitscore);
			$(teamsection + ' .oddtablerow, ' + teamsection + ' .eventablerow, ' + teamsection + ' .report tr.reportfooter, ' + teamsection + ' .report tr:nth-of-type(1)').remove();
			$(teamsection + ' .report tr').has('th:contains("Non-Starter")').remove();
			funrun++;
			if (funrun === 1) {
				getScore();
 				$('#matchup').append('<center><a href="//%HOST%/%YEAR%/options?L=%LEAGUEID%&O=207">Preview</a></center>');
				$('#last_week').append('<center><a href="//%HOST%/%YEAR%/options?L=%LEAGUEID%&O=177">View Recap</a></center>');
				getLineup();
			}
		}
	});
}

function getLineup() {
	url = baseURLDynamic + "/" + year + "/lineup?L=" + league_id;
	$.ajax({
		url: url,
		type: "GET",
		dataType: "html",
		async: false,
		success: function (data) {
			lineup = $(data).find('#contentframe form');
			$(lineup).prependTo('#custom_lineup');

// see if you can load the roster first and then attach the form to it. 
			if ( $('#custom_lineup form').length < 1 ) {
				rosterurl = baseURLDynamic + "/" + year + "/options?L=" + league_id + "&O=07&F=" + franchise_id;
				$.ajax({
					url: rosterurl,
					type: "GET",
					dataType: "html",
					async: false,
					success: function (ndata) {
						roster = $(ndata).find('#contentframe .report');
						$(roster).prependTo('#custom_lineup');
					}
				});
			}

			adjustLineup();
		}
	});
}

function adjustLineup() {
// this if is a dummy placement. replace it with the id of the lineup report
if (completedWeek < endWeek) {
	let pos = ['qb', 'rb', 'wr', 'te', 'pk', 'dt', 'de', 'lb', 'cb', 's'];
	let poslow =  [1, 2, 2, 1, 1, 3, 3, 4, 2, 3];
	let poshigh = [2, 4, 5, 2, 1, 5, 5, 6, 3, 6];
	let lutable = $('#custom_lineup .report');
	let luheader = '<tr class="lineup_header_top"><th rowspan="2">Roster<br>Status</th><th rowspan="2">Player</th><th colspan="2">Fantasy Pts</th><th colspan="7">WEEK #' + liveScoringWeek + '</th><th rowspan="2">Injury<br>Details</th><th rowspan="2">Bye</th><th rowspan="2">GP</th></tr><tr class="lineup_header_bottom"><th><a class="avg_sort">Avg</a></th><th><a class="tot_sort">Total</a></th><th><a class="proj_sort">Proj.</a></th><th><a class="rank_sort">Rank<a></th><th><a class="starts_sort">% Starts</a></th><th>OPP</th><th>KICKOFF</th><th title="Opponent fantasy average versus player position">OPP-AVG</th><th title="Opponent fantasy ranking versus player position">OPP-RNK</th></tr>';
	$(lutable).find('tr:first-of-type').remove();
	$(lutable).find('tr th:first-of-type').not('.lineup_header_top th:first-of-type, .lineup_header_bottom th:first-of-type').remove();
	$(lutable).find('tr.oddtablerow td:first-of-type, tr.eventablerow td:first-of-type').not('tr:last-of-type td:first-of-type').before('<td style="width:0;"><div class="benchbox">Bench<div></td>');
	$(lutable).find('tr:nth-of-type(1)').addClass('newposition');

	$(lutable).find('tr').each(function(index){
		if ( $(this).hasClass('newposition') ) {
			for (let i = 0; i < pos.length; ++i) {
				if ( $(this).find('a').hasClass('position_' + pos[i]) ) {
					$(this).closest('tr').before('<tr class="lineup_header_blank"><td colspan="14"> </td></tr><tr class="posheader pos_' + pos[i] + '"><th colspan="14">Start <span class="low">' + poslow[i] + '</span>-<span class="high">' + poshigh[i] + '</span> ' + pos[i] + '\'s<span class="offense_count"><span></span>/11 Offense Started</span><span class="defense_count"><span></span>/15 Defense Started</span></th></tr>');
				}
			}
			$(this).before(luheader);
		}
		let luPlayer = $(this).find('td:nth-child(2)');
		let luOpp = $(this).find('td:nth-child(3)');
		let luInjury = $(this).find('td:nth-child(4)');
		let luBye = $(this).find('td:nth-child(5)');
		let luOppAvgVpos = $(this).find('td:nth-child(6)');
		let luOppRankVpos = $(this).find('td:nth-child(7)');
		let luPoints = $(this).find('td:nth-child(8)');
		let luAvgPoints = $(this).find('td:nth-child(9)');
		let luProj = $(this).find('td:nth-child(10)');
		let luRank = $(this).find('td:nth-child(11)');
		let luStart = $(this).find('td:nth-child(12)');
		let luNews = $(this).find('td:nth-child(13)');
		$(this).find('td:nth-child(4) .warning:contains(O), td:nth-child(4) .warning:contains(I), td:nth-child(4) .warning:contains(S)').closest('tr').find('.benchbox').addClass('out');
		$(this).find('td:nth-child(4) b').wrap('<span class="istatus"></span>');
		$(this).find('.istatus').appendTo(luPlayer);
		$(luPlayer).after(luRank).after(luBye).after(luInjury).after(luOppRankVpos).after(luOppAvgVpos).after(luNews).after(luOpp).after(luStart).after(luRank).after(luProj).after(luPoints).after(luAvgPoints);

		$(this).find('td:nth-of-type(3):empty').text('0.0')
		$(this).find('td:nth-of-type(4):empty').text('<a href="#">0.0</a>')
		$(this).find('td:nth-of-type(5):empty').text('0.0')
		$(this).find('td:nth-of-type(6):empty').text('200')

$(this).find('input:disabled:disabled').closest('tr').find('.benchbox').addClass('disabled');
		$(this).has('input:disabled:disabled').addClass('gameover');
		$(this).find('input:checkbox:checked').closest('tr').find('.benchbox').addClass('startbox').removeClass('benchbox').html('Start');
	});
	$('.istatus').prepend(' (').append(')');
} // closes the dummy if statement
	sortRows();
	countStarters();
}

function sortRows() {
	var table, rows, switching, i, x, y, shouldSwitch;
	$("#custom_lineup .report").each( function(){
		switching = true;
		while (switching) {
			switching = false;
			rows = $(this).find('tr');
			for (i = 1; i < (rows.length - 1); i++) {
				shouldSwitch = false;
				x = $(rows[i]).find(sortCol).text();
				y = $(rows[i + 1]).find(sortCol).text();
				if (parseInt(x) < parseInt(y)) {
					shouldSwitch = true;
					break;
				}
			}
			if (shouldSwitch) {
				rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
				switching = true;
			}
		}
		$(this).find('tr:nth-child(even).oddtablerow').addClass('eventablerow').removeClass('oddtablerow');
		$(this).find('tr:nth-child(odd).eventablerow').addClass('oddtablerow').removeClass('eventablerow');
	});
}

function countStarters() {
	let offensecount = 0;
	let defensecount = 0;
	let offense = $('tr').find('.position_qb, .position_rb, .position_wr, .position_te, .position_pk').closest('tr').find('.startbox');
	let defense = $('tr').find('.position_dt, .position_de, .position_lb, .position_cb, .position_s').closest('tr').find('.startbox');
	let ocount = offense.length;
	let dcount = defense.length;
	offensecount = offensecount + ocount;
	defensecount = defensecount + dcount;
	$('.offense_count span').html(offensecount);
	$('.defense_count span').html(defensecount);
	if (offensecount !== 11) {
		$('.offense_count span').css('color','#f00');
	}else {
		$('.offense_count span').css('color','#fff');
	}
	if (defensecount !== 15) {
		$('.defense_count span').css('color','#f00');
	}else {
		$('.defense_count span').css('color','#fff');
	}


	let pos = ['qb', 'rb', 'wr', 'te', 'pk', 'dt', 'de', 'lb', 'cb', 's'];
	let poslow =  [1, 2, 2, 1, 1, 3, 3, 4, 2, 3];
	let poshigh = [2, 4, 5, 2, 1, 5, 5, 6, 3, 6];
	for (let i = 0; i < pos.length; ++i) {
		let qbs = $('tr').find('.position_' + pos[i]).closest('tr').find('.startbox');
		let qbnum = qbs.length;

		let de = $('tr').find('.position_de').closest('tr').find('.startbox');
		let denum = de.length;
		if (i == 5) {qbnum = qbnum + denum;}

		if (qbnum < poslow[i]) {
			$('.pos_' + pos[i] + ' .low').css('color','#f00');
		}else {
			$('.pos_' + pos[i] + ' .low').css('color','#fff');
		}
		if (qbnum > poshigh[i]) {
			$('.pos_' + pos[i] + ' .high').css('color','#f00');
		}else {
			$('.pos_' + pos[i] + ' .high').css('color','#fff');
		}
	}
	setTimeout(function (){
		$('#team_loader').hide();
	}, 10);
}




$(document).on('click', '.benchbox:not(.disabled)', function () {
	$(this).closest('tr').find('input:checkbox').prop('checked', true);
	$(this).addClass('startbox').removeClass('benchbox').html('Start');
	countStarters();
});
$(document).on('click', '.startbox:not(.disabled)', function () {
	$(this).closest('tr').find('input:checkbox').prop('checked', false);
	$(this).addClass('benchbox').removeClass('startbox').html('Bench');
	countStarters();
});
$(document).on('click', '.avg_sort', function () {
	sortCol = "td:nth-child(3)";
	sortRows();
});
$(document).on('click', '.tot_sort', function () {
	sortCol = "td:nth-child(4) a";
	sortRows();
});
$(document).on('click', '.proj_sort', function () {
	sortCol = "td:nth-child(5)";
	sortRows();
});
$(document).on('click', '.rank_sort', function () {
	sortCol = "td:nth-child(6)";
	sortRows();
});
$(document).on('click', '.starts_sort', function () {
	sortCol = "td:nth-child(7)";
	sortRows();
});


$(document).ready(function(){

$('#mvpmenu li:nth-child(2) > a').addClass('mvpmenuactive');
$('#mvpmenu li:nth-of-type(2) dd.menuteamdetails a').addClass('mvpmenuactive');
setTimeout(function(){
$('#mvpsubmenu dd.menuteamdetails a').addClass('mvpsubmenuactive');
}, 100);

});
