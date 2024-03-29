let rostercreate = [true, false] // second one doesn't exist. 
let rostercol = [true, true, true, true, true, false, false]; // if any defaulted to false, it will break because adjustRosters() has not ran yet
let rostertrades = [false, false, false, false] // first one for trades needs to be true. see comment above
let rclicked;
let pos = ['QB', 'RB', 'WR', 'TE', 'PK', 'DT', 'DE', 'LB', 'CB', 'S'];
let poscol = [true, true, true, true, true, true, true, true, true, true, true, true, true, true];


function getRosters() {
//	$.get(baseURLDynamic + "/" + year + "/options?L=" + league_id + "&O=07&PRINTER=1", function(data, status){
	url = baseURLDynamic + "/" + year + "/options?L=" + league_id + "&O=07&PRINTER=1";
	$.ajax({
		url: url,
		type: "GET",
		dataType: "html",
		async: false,
		success: function (data) {
//		roster = $(data).find('table .report');
//		$(roster).prependTo('#roster_hidden');
//	createRosters();
			roster = $(data).find('table .report');
			$(roster).prependTo('#roster_hidden');
			createRosters();
		}
	});
}
getRosters();


function createRosters() {
	$('#roster_hidden a').attr('href', function (i, href) {
		return href.replace('&PRINTER=1', '');
	});
	// Define user roster
	if (franchise_id == '0000' || typeof franchise_id == 'undefined') {
		$('#noroster').show();
	}else{
		$('#roster_hidden .myfranchise').closest('table').wrapAll('<div class="roster myroster"></div>');
	}
	// move logged in roster
	$('#roster_hidden .myroster').prependTo('#roster_right');
	// move team icons to tabs
	$('#roster_hidden .report caption img').clone().prependTo('#roster_icons');
	$('#roster_icons img:first-child').addClass('selected');
	// move first roster
	$('#roster_hidden .report:first-of-type').wrapAll('<div class="roster roster0"></div>');
	$('.roster').prependTo('#roster_right');
	$('#roster_hidden .report').each(function(index){
		let num =  index + 1;
		$(this).wrapAll('<div class="roster roster' + num + '"></div>');
	});


	let tid;
	$('.roster').each(function(index){
		tid = $(this).find('.withfranchiseicon a').attr('class');
		$(this).addClass(tid);
//		$(this).find('.report tr:last-child').after('<tr><td colspan="8"><table align="center" cellspacing="1" class="draftpicks"></table></td></tr>');
		$(this).find('.report tr:last-child').after('<tr class="dft_header"><th colspan="8" class="col8">Draft Picks</th></tr>');
		$(this).find('.report tr:last-child').after('<tr class="draftpicks"><th colspan="8" class="col8"><span>0</span> Total Draft Picks</th></tr>');
	});


	// add player popup
	try {
		MFLPlayerPopupNewsIcon('rosters')
	} catch (er) {};

	setTimeout(function (){
//		$('#roster_loader').hide();
//		$('#loadingbar').html('<span>Formatting Rosters</span>');
		setTimeout(function (){
//			$('#roster_icons, #roster_left, #roster_right').show();
getAssets(); // advanced toggle is running before getassets finishes fetching
createToggles();
		}, 10);
	}, 10);
}

function createToggles() {
	for (let i = 0; i < pos.length; ++i) {
		let newspan = '<span><i class="fa" aria-hidden="true"></i>' + pos[i] + '</span>';
		$('#roster_pos').append(newspan);
	}
	$('#roster_pos').append('<span><i class="fa" aria-hidden="true"></i>IR</span>');
	$('#roster_pos').append('<span><i class="fa" aria-hidden="true"></i>Taxi</span>');
	$('#roster_pos').append('<span><i class="fa" aria-hidden="true"></i>Draft</span>');
//	$('#roster_pos').append('<span><i class="fa" aria-hidden="true"></i>All</span>');
}


function advancedToggle() {
// this shouldn't be a toggle. it either loads or doesn't 
	if (rostercreate[0]){
		if( $('#roster_right .roster' + rclicked + ' .col3').length < 1 ){
			// start the loader again
			$('#roster_loader').show();
//			$('#loadingbar').html('<span>Loading Roster</span>');
			setTimeout(function (){
				adjustRosters();
			}, 10);
		}else{
			sortFunction();
//			columnToggle();
			posFill();
		}
	}
}


function adjustRosters() {
	let tdiv;
	if (rclicked == undefined){
		// define the first 2 rosters
		tdiv = '#roster_right .roster .report';
		rclicked = 0;
	}else{
		tdiv = '#roster_right .roster' + rclicked + ' .report';
	}
	$(tdiv + ' td').css("white-space", "nowrap");
//	$(tdiv + ' .newposition').addClass('new_newposition').removeClass('newposition');
	$(tdiv + ' .newposition').removeClass('newposition');
	$(tdiv + ' .trade').remove();
	$(tdiv).find('td.points:contains(" ‐ ")').html('<a>0.0</a>');
	$(tdiv + ' tr').find('.player a:contains("Salary Adjustments")').closest('tr').addClass('s_adjust_row').removeClass('oddtablerow eventablerow');
	$(tdiv + ' .s_adjust_row td').wrapInner('<th></th>');
	$(tdiv + ' .s_adjust_row th').unwrap();
	$(tdiv + ' .s_adjust_row th:nth-of-type(2), .s_adjust_row th:nth-of-type(3)').remove();
	$(tdiv + ' .s_adjust_row th:first-of-type').attr('colspan',3);

	$(tdiv).each(function() {
		$(this).find('.salary_cap_row').eq(0).find('th:nth-of-type(3)').addClass('year_cap');
		let yearcap = $(this).find('.salary_cap_row').eq(1).find('th:nth-of-type(3)').text();
		$(this).find('.year_cap').append(yearcap);
		$(this).find('.cap_room_available_row').eq(0).find('th:nth-of-type(3)').addClass('cap_avail');
		let avail = $(this).find('.cap_room_available_row').eq(1).find('th:nth-of-type(3)').text();
		$(this).find('.cap_avail').append(avail);
		$(this).find('.salary_cap_row').eq(1).remove();
		$(this).find('.cap_room_available_row').eq(1).remove();

	});

	//make table adjustments 
	$(tdiv + ' tr:first-of-type').addClass('roster_header');
	$(tdiv + ' th:contains("Injured Reserve")').closest('tr').addClass('ir_header');
	$(tdiv + ' th:contains("Players on IR")').closest('tr').addClass('ir_footer');
	$(tdiv + ' th:contains("Taxi Squad")').not(":contains(on)").closest('tr').addClass('ts_header');
	$(tdiv + ' th:contains("Players on Taxi Squad")').closest('tr').addClass('ts_footer');
	$(tdiv + ' .s_adjust_row th:last-of-type, ' + tdiv + ' .total_salary_row th:last-of-type, ' + tdiv + ' .salary_cap_row th:last-of-type, ' + tdiv + ' .cap_room_available_row th:last-of-type').remove();
	$(tdiv + ' .s_adjust_row th:nth-of-type(1), ' + tdiv + ' .total_salary_row th:nth-of-type(1), ' + tdiv + ' .salary_cap_row th:nth-of-type(1), ' + tdiv + ' .cap_room_available_row th:nth-of-type(1)').addClass('col3');
	$(tdiv + ' .s_adjust_row th:nth-of-type(2), ' + tdiv + ' .total_salary_row th:nth-of-type(2), ' + tdiv + ' .salary_cap_row th:nth-of-type(2), ' + tdiv + ' .cap_room_available_row th:nth-of-type(2)').addClass('thsalary');
	$(tdiv + ' .s_adjust_row th:nth-of-type(3), ' + tdiv + ' .total_salary_row th:nth-of-type(3), ' + tdiv + ' .salary_cap_row th:nth-of-type(3), ' + tdiv + ' .cap_room_available_row th:nth-of-type(3)').addClass('thcontractyear');
	$(tdiv + ' .s_adjust_row th:nth-of-type(4), ' + tdiv + ' .total_salary_row th:nth-of-type(4), ' + tdiv + ' .salary_cap_row th:nth-of-type(4), ' + tdiv + ' .cap_room_available_row th:nth-of-type(4)').addClass('thcontractinfo');
	$(tdiv + ' .s_adjust_row th:nth-of-type(5), ' + tdiv + ' .total_salary_row th:nth-of-type(5), ' + tdiv + ' .salary_cap_row th:nth-of-type(5), ' + tdiv + ' .cap_room_available_row th:nth-of-type(5)').addClass('thdrafted');
	$(tdiv + ' .s_adjust_row, ' + tdiv + ' .report tr:first-of-type, ' + tdiv + ' .total_salary_row, ' + tdiv + ' .salary_cap_row, ' + tdiv + ' .cap_room_available_row').prepend('<th class="tradebox"></th>');
// does this .report need to go? duplicate .report? 
	$(tdiv + ' .report tr:first-of-type th:first-of-type').prepend('<i class="fa fa-exchange" aria-hidden="true"></i>');
//move one of these to trade table after its coded 
//	$(tdiv + ' .oddtablerow, ' + tdiv + ' .eventablerow').not(tdiv + ' .s_adjust_row').prepend('<td class="tradebox"><i class="fa fa-toggle-off" aria-hidden="true"></i></td>');
	$(tdiv + ' .oddtablerow, ' + tdiv + ' .eventablerow').not(tdiv + ' .s_adjust_row').not('.draftpick').prepend('<td class="tradebox"><i class="fa fa-toggle-off" aria-hidden="true"></i><input type="checkbox"></td>');
//<input type="checkbox" name="" value="">

	$(tdiv + ' tr').each(function(){
		//get playerid. and add to checkbox (not done yet)
		let playernum;
		$(this).find('.player a').attr('href', function (i, href) {
			playernum = href.replace('player?L=' + league_id + '&P=', '');
		});
		$(this).find('.tradebox input').val(playernum);
		//add class to long colspan
		if ( $(this).find('th').length == 1 ){ $(this).find('th').addClass('col8'); };
		//add ir & taxi classes
		$('.ir_header').nextUntil('.ir_footer').addBack().addClass('ir_player');
		$('.ts_header').nextUntil('.ts_footer').addBack().addClass('ts_player');
		$('.ir_header').removeClass('ir_player');
		$('.ts_header').removeClass('ts_player');
	});

//do i need the each function? 
	$(tdiv).each(function(index) {
		for (let i = 0; i < pos.length; ++i) {
			let posn = pos[i].toLowerCase();
//			let header = '<tr class="section' + pos[i] + ' section' + pos[i] + '_' + index + '"><th class="tradebox"><i class="fa fa-exchange" aria-hidden="true"></i></th><th class="player">' + pos[i] + '</th>';
//			header += '<th class="points">YTD Pts</th><th class="week">Bye</th><th class="salary">Salary</th><th class="contractyear">Years</th><th class="contractinfo">Drafted by</th><th class="drafted" style="">Acquired</th></tr>';
			let header = '<tr><td colspan="8"><table align="center" cellspacing="1" class="report"><tr class="section' + pos[i] + ' section' + pos[i] + '_' + index + '"><th class="tradebox"><i class="fa fa-exchange" aria-hidden="true"></i></th><th class="player">' + pos[i] + '</th>';
			header += '<th class="points">YTD Pts</th><th class="week">Bye</th><th class="salary">Salary</th><th class="contractyear">Years</th><th class="contractinfo">Drafted by</th><th class="drafted" style="">Acquired</th></tr></table></td></tr>';
			$(this).find('.roster_header').before(header);
//			$(this).prepend(header);
			$(this).find('a.position_' + posn).closest('tr').not('.ir_player,.ts_player').insertAfter(tdiv + ' .section' + pos[i] + '_' + index);
		}
	});
	$(tdiv + ' .roster_header').remove();
	$('#roster_right .myroster').prependTo('#roster_left');
	$('#roster_icons, #roster_left, #roster_right').show();
//	rostertrades[0] = !rostertrades[0];
//	rostercol[4] = !rostercol[4];
//	rostercol[5] = !rostercol[5];
	sortFunction();
//	columnToggle();
	posFill();
}


function sortFunction() {
	var table, rows, switching, i, x, y, shouldSwitch;
	$("#rosters_wrapper .report .report").each( function(){
		table = $(this);
		switching = true;
		//Make a loop that will continue until no switching has been done:
		while (switching) {
		//start by saying: no switching is done:
		switching = false;
		rows = $(this).find('tr');
		// Loop through all table rows (except the first, which contains table headers):
		for (i = 1; i < (rows.length - 1); i++) {
			//start by saying there should be no switching:
			shouldSwitch = false;
			//Get the two elements you want to compare one from current row and one from the next:
//			x = $(rows[i]).find(".week").text();
//			y = $(rows[i + 1]).find(".week").text();
			x = $(rows[i]).find(".points a").text();
			y = $(rows[i + 1]).find(".points a").text();
			//check if the two rows should switch place:
			if (parseInt(x) < parseInt(y)) {
				//if so, mark as a switch and break the loop:
				shouldSwitch = true;
				break;
				}
			}
			if (shouldSwitch) {
				//If a switch has been marked, make the switch and mark that a switch has been done:
				rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
				switching = true;
			}
		}
	});
}


function posFill() {
	$('#rosters_wrapper .addedrow').remove();
	let leftpos = [];	let rightpos = [];	let left = [];  	let right = [];
	leftpos.length = 0;	rightpos.length = 0;	left.length = 0;	right.length = 0;
	for (let i = 0; i < pos.length; ++i) {
		let posn = pos[i].toLowerCase();
		leftpos[i]  =  $('#roster_left').find('a.position_' + posn).closest('tr').not('.ir_player,.ts_player').length;
		rightpos[i]  =  $('#roster_right .roster' + rclicked).find('a.position_' + posn).closest('tr').not('.ir_player,.ts_player').length;
//console.log('left of this position ' + leftpos[i]);
//console.log('right of this position ' + rightpos[i]);
		left[i] = rightpos[i] - leftpos[i];
		right[i] = leftpos[i] - rightpos[i];
//console.log('left i ' + left[i]);
//console.log('right i ' + right[i]);
		let newrow = '<tr class="eventablerow addedrow"><td colspan="8"> - </td></tr>';
		let newrowr;
		let newrowl;
		if ( right[i] > 0 ) {newrowr = newrow.repeat(right[i]);}else{newrowr = newrow;}
		if ( left[i] > 0 ) {newrowl = newrow.repeat(left[i]);}else{newrowl = newrow;}

		if (leftpos[i] > rightpos[i]) {
			let rowpos = rightpos[i] - 1;
			if ( $('#roster_right .roster' + rclicked + ' tr').not('.ir_player,.ts_player').find('a.position_' + posn).length < 1 ) {
				$('#roster_right .section' + pos[i]).after(newrowr);
			} else {
				$('#roster_right .roster' + rclicked + ' tr').not('.ir_player,.ts_player').find('a.position_' + posn).closest('tr').eq(rowpos).after(newrowr);
			}
		}else if (rightpos[i] > leftpos[i]) {
//			$('#roster_left .section' + pos[i]).after(newrow);
			let rowpos = leftpos[i] - 1;
			if ( $('#roster_left tr').not('.ir_player,.ts_player').find('a.position_' + posn).length < 1 ) {
				$('#roster_left .section' + pos[i]).after(newrowl);
			} else {
				$('#roster_left tr').not('.ir_player,.ts_player').find('a.position_' + posn).closest('tr').eq(rowpos).after(newrowl);
			}
		}
//		$('#rosters_wrapper .section' + pos[i]).not('#roster_wrapper .sectionQB').before(newrow);
		}
	// ir logic
	let leftir  =  $('#roster_left').find('.ir_player').length;
	let rightir  =  $('#roster_right .roster' + rclicked).find('.ir_player').length;
	let leftirt = rightir - leftir;
	let rightirt = leftir - rightir;
	let irnewrow = '<tr class="eventablerow addedrow ir_player"><td colspan="8"> - </td></tr>';
	let newirrow;
//	if ( rightirt > 0 ) {newirrow = irnewrow.repeat(rightirt);}
//	if ( leftirt > 0 ) {newirrow = irnewrow.repeat(leftirt);}
//	$('#roster_right .ir_footer').before(newirrow);
	if ( rightirt > 0 ) {newirrow = irnewrow.repeat(rightirt);$('#roster_right .ir_footer').before(newirrow);}
	if ( leftirt > 0 ) {newirrow = irnewrow.repeat(leftirt);$('#roster_left .ir_footer').before(newirrow);}

	// ts logic
	let leftts  =  $('#roster_left').find('.ts_player').length;
	let rightts  =  $('#roster_right .roster' + rclicked).find('.ts_player').length;
	let lefttst = rightts - leftts;
	let righttst = leftts - rightts;
	let tsnewrow = '<tr class="eventablerow addedrow ts_player"><td colspan="8"> - </td></tr>';
	let newtsrow;
//	if ( righttst > 0 ) {newtsrow = tsnewrow.repeat(righttst);}
//	if ( lefttst > 0 ) {newtsrow = tsnewrow.repeat(lefttst);}
//	$('#roster_right .ts_footer').before(newtsrow);
	if ( righttst > 0 ) {newtsrow = tsnewrow.repeat(righttst);$('#roster_right .ts_footer').before(newtsrow);}
	if ( lefttst > 0 ) {newtsrow = tsnewrow.repeat(lefttst);$('#roster_left .ts_footer').before(newtsrow);}

/* working block
	let newirrowr;
	let newirrowl;
	if ( rightirt > 0 ) {newirrowr = newrow.repeat(rightirt);}else{newirrowr = newrow;}
	if ( leftirt > 0 ) {newirrowl = newrow.repeat(leftirt);}else{newirrowl = newrow;}
	if (leftir > rightir) {
		let rowir = rightir - 1;
		$('#roster_right .ir_footer').before(newirrowr);
	}
*/
//	$('#rosters_wrapper .report .report tr:odd.eventablerow').addClass('oddtablerow').removeClass('eventablerow');
//	$('#rosters_wrapper .report .report tr:even.oddtablerow').addClass('eventablerow').removeClass('oddtablerow');
	$('#rosters_wrapper .report tr:odd.eventablerow').addClass('oddtablerow').removeClass('eventablerow');
	$('#rosters_wrapper .report tr:even.oddtablerow').addClass('eventablerow').removeClass('oddtablerow');


	setTimeout(function (){
//		$('#roster_right .myroster').prependTo('#roster_left');
//		$('#loadingbar').html('<span>Loading Complete</span>');
		$('#roster_right .roster' + rclicked).show();
		$('#roster_col, #roster_trade').show();
		$('#roster_loader').hide();
	}, 10);
	columnToggle();
}


function columnToggle() {
	let colThreeSize = 3;
	let colEightSize = 8;

//column toggles
	if (rostercol[0]){
		$('#roster_col span:nth-of-type(1) i').addClass('fa-toggle-on').removeClass('fa-toggle-off');
		$('#rosters .report .tradebox, #roster_trade span:nth-of-type(1), #roster_trade span:nth-of-type(2), #roster_trade span:nth-of-type(3), #roster_trade span:nth-of-type(4)').show();
		$('#propose_trade_buttons').show();
		$('#email_message').show();
		if (typeof franchise_id != 'undefined' && franchise_id != '' && franchise_id == '0000') { // For Commish login show perform Trade button
			$('[name=Perform]').show();
		}
		if( $('#to_me .report').length < 1 && franchise_id != '0000' && typeof franchise_id != 'undefined'){
			getTrades();
		}
	}else {
		colEightSize += -1;
		$('#roster_col span:nth-of-type(1) i').addClass('fa-toggle-off').removeClass('fa-toggle-on');
		$('#rosters .report .tradebox').hide();
		$('#propose_trade_buttons').hide();
		$('#email_message').hide();
	}
	if (rostercol[1]){
		$('#roster_col span:nth-of-type(2) i').addClass('fa-toggle-on').removeClass('fa-toggle-off');
		$('#rosters .report .points').show();
	}else {
		colThreeSize += -1;
		colEightSize += -1;
		$('#roster_col span:nth-of-type(2) i').addClass('fa-toggle-off').removeClass('fa-toggle-on');
		$('#rosters .report .points').hide();
	}
	if (rostercol[2]){
		$('#roster_col span:nth-of-type(3) i').addClass('fa-toggle-on').removeClass('fa-toggle-off');
		$('#rosters .report .week').show();
	}else {
		colThreeSize += -1;
		colEightSize += -1;
		$('#roster_col span:nth-of-type(3) i').addClass('fa-toggle-off').removeClass('fa-toggle-on');
		$('#rosters .report .week').hide();
	}
	if (rostercol[3]){
		$('#roster_col span:nth-of-type(4) i').addClass('fa-toggle-on').removeClass('fa-toggle-off');
		$('#rosters .report .salary, #rosters .report .thsalary').show();
	}else {
		colEightSize += -1;
		$('#roster_col span:nth-of-type(4) i').addClass('fa-toggle-off').removeClass('fa-toggle-on');
		$('#rosters .report .salary, #rosters .report .thsalary').hide();
	}
	if (rostercol[4]){
		$('#roster_col span:nth-of-type(5) i').addClass('fa-toggle-on').removeClass('fa-toggle-off');
		$('#rosters .report .contractyear, #rosters .report .thcontractyear').show();
	}else {
		colEightSize += -1;
		$('#roster_col span:nth-of-type(5) i').addClass('fa-toggle-off').removeClass('fa-toggle-on');
		$('#rosters .report .contractyear, #rosters .report .thcontractyear').hide();
	}
	if (rostercol[5]){
		$('#roster_col span:nth-of-type(6) i').addClass('fa-toggle-on').removeClass('fa-toggle-off');
		$('#rosters .report .contractinfo, #rosters .report .thcontractinfo').show();
	}else {
		colEightSize += -1;
		$('#roster_col span:nth-of-type(6) i').addClass('fa-toggle-off').removeClass('fa-toggle-on');
		$('#rosters .report .contractinfo, #rosters .report .thcontractinfo').hide();
	}
	if (rostercol[6]){
		$('#roster_col span:nth-of-type(7) i').addClass('fa-toggle-on').removeClass('fa-toggle-off');
		$('#rosters .report .drafted, #rosters .report .thdrafted').show();
	}else {
		colEightSize += -1;
		$('#roster_col span:nth-of-type(7) i').addClass('fa-toggle-off').removeClass('fa-toggle-on');
		$('#rosters .report .drafted, #rosters .report .thdrafted').hide();
	}

//position toggles
//	for (let i = 0; i < pos.length; ++i) {
	for (let i = 0; i < poscol.length; ++i) {
		let postype = i + 1;
		if (poscol[i]){
			$('#roster_pos span:nth-of-type(' + postype + ') i').addClass('fa-toggle-on').removeClass('fa-toggle-off');
			$('#rosters_wrapper .report .report tr.section' + pos[i]).closest('table').show();
		}else {
			$('#roster_pos span:nth-of-type(' + postype + ') i').addClass('fa-toggle-off').removeClass('fa-toggle-on');
			$('#rosters_wrapper .report .report tr.section' + pos[i]).closest('table').hide();
		}
	}
	if (poscol[10]){
		$('.ir_header, .ir_player, .ir_footer').show();
	}else{
		$('.ir_header, .ir_player, .ir_footer').hide();
	}
	if (poscol[11]){
		$('.ts_header, .ts_player, .ts_footer').show();
	}else{
		$('.ts_header, .ts_player, .ts_footer').hide();
	}
	if (poscol[12]){
		$('.dft_header, .draftpick, .draftpicks').show();
	}else{
		$('.dft_header, .draftpick, .draftpicks').hide();
	}
/*
	if (poscol[13] && poscol[1]){
		$('#rosters_wrapper .report .report tr.sectionQB, #rosters_wrapper .report .report tr.sectionRB, #rosters_wrapper .report .report tr.sectionWR, #rosters_wrapper .report .report tr.sectionTE, #rosters_wrapper .report .report tr.sectionPK, #rosters_wrapper .report .report tr.sectionDT, #rosters_wrapper .report .report tr.sectionDE, #rosters_wrapper .report .report tr.sectionLB, #rosters_wrapper .report .report tr.sectionCB, #rosters_wrapper .report .report tr.sectionS, #rosters_wrapper .ir_header, #rosters_wrapper .ir_player, #rosters_wrapper .ir_footer, #rosters_wrapper .ts_header, #rosters_wrapper .ts_player, #rosters_wrapper .ts_footer, #rosters_wrapper .dft_header, #rosters_wrapper .draftpick, #rosters_wrapper .draftpicks').closest('table').show();
	}else if (!poscol[13] && !poscol[1]){
		$('#rosters_wrapper .report .report tr.sectionQB, #rosters_wrapper .report .report tr.sectionRB, #rosters_wrapper .report .report tr.sectionWR, #rosters_wrapper .report .report tr.sectionTE, #rosters_wrapper .report .report tr.sectionPK, #rosters_wrapper .report .report tr.sectionDT, #rosters_wrapper .report .report tr.sectionDE, #rosters_wrapper .report .report tr.sectionLB, #rosters_wrapper .report .report tr.sectionCB, #rosters_wrapper .report .report tr.sectionS, #rosters_wrapper .ir_header, #rosters_wrapper .ir_player, #rosters_wrapper .ir_footer, #rosters_wrapper .ts_header, #rosters_wrapper .ts_player, #rosters_wrapper .ts_footer, #rosters_wrapper .dft_header, #rosters_wrapper .draftpick, #rosters_wrapper .draftpicks').closest('table').hide();
	}
*/

//trade toggles
	if (rostertrades[0]){
		$('#to_me').show();
	}else {
		$('#to_me').hide();
	}
	if (rostertrades[2]){
		$('#from_me').show();
	}else {
		$('#from_me').hide();
	}

//change colspan
	$('#rosters .report .col3').attr('colspan',colThreeSize);
	$('#rosters .report .col8').attr('colspan',colEightSize);
}


function getTrades() {
//	$.get(baseURLDynamic + "/" + year + "/options?L=" + league_id + "&O=05&PRINTER=1", function(data, status){
	url = baseURLDynamic + "/" + year + "/options?L=" + league_id + "&O=05&PRINTER=1";
	$.ajax({
		url: url,
		type: "GET",
		dataType: "html",
		async: false,
		success: function (data) {
			fromme = $(data).find('.report').eq(0);
			tome = $(data).find('.report').eq(1);
			$(fromme).prependTo('#from_me');
			$(tome).prependTo('#to_me');
			createTrades();
		}
	});
}


function createTrades() {
	$('#to_me a, #from_me a').attr('href', function (i, href) {
		return href.replace('&PRINTER=1', '');
	});
//	let tome = $('#to_me .report tr').length - 1;
//	tome = tome / 2;
	let tome = $('#to_me .report tr:contains("Comments:")').length;
	let fromme = $('#from_me .report tr:contains("Comments:")').length;
//	let fromme = $('#from_me .report tr').length - 2;
//	fromme = fromme / 2;
	if (fromme > 0){
		$('#roster_trade span.fromme').append('<span class="newnotification">' + fromme + '</span>');
	}else {
		$('#roster_trade span.fromme').append('<span></span>');
	}
	if (tome > 0){
		$('#roster_trade span.tome').append('<span class="newnotification">' + tome + '</span>');
	}else {
		$('#roster_trade span.tome').append('<span></span>');
	}
	$('#email_message').html('<table class="report" align="center" cellspacing="1"><tbody><tr><th>Optional Message to Include With Trade Offer Email:</th></tr><tr><td><' + 'textarea cols="70" rows="5" name="msg"></' + 'textarea' + '></td></tr></tbody></table>');
loadTradeModule();

	// add player popup
	try {
		MFLPlayerPopupNewsIcon('to_me')
		MFLPlayerPopupNewsIcon('from_me')
	} catch (er) {};

//delete 
//autorun(); 
}


function loadTradeModule() {
	var oneWeek = currentServerTime * 1000 + 60 * 60 * 24 * 7 * 1000;
	var d = new Date(oneWeek);
	jQuery('#proposeTradeForm').attr('action', baseURLDynamic + '/' + year + '/trade_offer');
	jQuery('#LEAGUE_ID').val(league_id);
	jQuery('#TRADE_EXPIRES_MONTH').val(d.getMonth());
	jQuery('#TRADE_EXPIRES_DAY').val(d.getDate());
	jQuery('#TRADE_EXPIRES_YEAR').val(d.getFullYear());
}

function proposeTrade() {
	tradeAction('Perform');
}

function performTrade() {
	tradeAction('Propose');
}


//delete 
function autorun() {
	let left = $('#roster_left .roster .withfranchiseicon a').attr('class');
	if (left == undefined) { left = '0000';}else{  left = left.replace('franchise_', '').replace('myfranchise ', '').replace(' ', '');}
	let right = $('#roster_right .roster:visible .withfranchiseicon a').attr('class');
	right = right.replace(' ', '').replace('franchise_', '');
		jQuery('#FRANCHISE_ID').val(left + ',' + right);
let q = jQuery('#FRANCHISE_ID').val();
console.log(left + ',' + right);
console.log(q+'end');
}

function tradeAction(clickedName) {
	let left = $('#roster_left .roster .withfranchiseicon a').attr('class');
	if (left == undefined) { left = '0000';}else{  left = left.replace('franchise_', '').replace('myfranchise ', '').replace(' ', '');}
	let right = $('#roster_right .roster:visible .withfranchiseicon a').attr('class');
	right = right.replace(' ', '').replace('franchise_', '');

	let leftFranPlayers = jQuery('#roster_left input:checkbox:checked');                                    //I don't see where this is being used
	let rightFranPlayers = jQuery('#roster_right .franchise_' + right + ' input:checkbox:checked');         //I don't see where this is being used
	if (validateTradeForm()) {
		jQuery('#roster_right div:not(:visible) input:checkbox').prop('checked', false);
		jQuery('#FRANCHISE_ID').val(left + ',' + right);
		jQuery('#roster_left input:checkbox:checked').attr('name', 'drop' + left);
		jQuery('#roster_right input:checkbox:checked').attr('name', 'drop' + right);
		var action = jQuery('#proposeTradeForm').attr('action');
		action = action + '?' + clickedName + '=' + jQuery('name=' + clickedName).val();                //I don't see where clickedname is declared
		jQuery('#proposeTradeForm').attr('action', action);
		jQuery('#proposeTradeForm').submit();
		return true;
	}
}


function validateTradeForm() {
	jQuery('#roster_right div:not(:visible) input:checkbox').prop('checked', false);
//	if (jQuery('#rosters_wrapper input:checkbox:checked').length == 0) {
	if (jQuery('#rosters_wrapper .tradebox .fa-toggle-on').length == 0) {
//		alert('Please select Players for trade');
//		return false;
	}
	return true;
}


function getAssets() {
console.log('Assets API')
	$.get(baseURLDynamic + "/" + year + "/export?TYPE=assets&L=" + league_id + "&JSON=1", function(data, status){
/* draft picks have been removed from this document by mfl
console.log(baseURLDynamic + "/" + year + "/export?TYPE=assets&L=" + league_id + "&JSON=1")
//console.log(data.assets.franchise[0].futureYearDraftPicks.draftPick[0].description);
let numberOfPicks = 0;
	for (let i = 0; i < data.assets.franchise.length; ++i) {
		let team = data.assets.franchise[i].id; // result = 0001...
		if ( data.assets.franchise[i].futureYearDraftPicks.draftPick.length > 0 ) {
			numberOfPicks = data.assets.franchise[i].futureYearDraftPicks.draftPick.length;
		}
		if (numberOfPicks == undefined) {numberOfPicks = 0;}
		for (let j = 0; j < numberOfPicks; ++j) {
			let pickcode = data.assets.franchise[i].futureYearDraftPicks.draftPick[j].pick;
			let description = data.assets.franchise[i].futureYearDraftPicks.draftPick[j].description;
			let pickrows = '<tr class="oddtablerow draftpick"><td class="tradebox"><i class="fa fa-toggle-off" aria-hidden="true"></i></td><td colspan="7"><input type="checkbox" name="drop' + team + '" value="' + pickcode + '">' + description + '</td></tr>';
//			$('.roster.franchise_' + team + ' .report:first-of-type').append(pickrows);
//			$('#rosters div.franchise_' + team + ' .report .ts_footer').after(pickrows);
			$('#rosters div.franchise_' + team + ' .report .draftpicks').before(pickrows);
			$('#rosters div.franchise_' + team + ' .report .draftpicks span').html(data.assets.franchise[i].futureYearDraftPicks.draftPick.length);
		}
	}
*/
advancedToggle();

	});
}


$(document).on('click', '#roster_icons img', function (index) {
	$('#roster_icons img').removeClass('selected');
	$(this).addClass('selected');
//	let num = $('#roster_icons img').index(this) + 1;
//	$('#roster_right .report').hide();
//	$('#roster_right .report:nth-of-type('+num+')').show();
	rclicked = $('#roster_icons img').index(this);
	$('#roster_right .roster').hide();
	$('#roster_hidden .roster' + rclicked).prependTo('#roster_right').hide();
//	rclicked = $('#roster_right .roster' + rclicked);
advancedToggle();
//	adjustRosters();
//delete 
//autorun();
});

$(document).on('click', '#rosters .report td.tradebox', function (index) {
	$(this).find('i').toggleClass('fa-toggle-on fa-toggle-off');
	$(this).closest('tr').toggleClass('selected');
	$(this).closest('tr').find('input[type=checkbox]').each(function(){
		this.checked = !this.checked;
	});
});

// this block is not needed if there isn't an advanced layout link to click
$(document).on('click', '#roster_create span', function (index) {
	$(this).find('i').toggleClass('fa-toggle-on fa-toggle-off');
	let settingnum = $('#roster_create span').index(this);
	rostercreate[settingnum] = !rostercreate[settingnum]; 
	advancedToggle();
});
$(document).on('click', '#roster_col span', function (index) {
//	$(this).find('i').toggleClass('fa-toggle-on fa-toggle-off');
	let settingnum = $('#roster_col span').index(this);
	rostercol[settingnum] = !rostercol[settingnum]; 
	columnToggle();
});
$(document).on('click', '#roster_pos span', function (index) {
	let settingnum = $('#roster_pos span').index(this);
	poscol[settingnum] = !poscol[settingnum]; 
	columnToggle();
});
$(document).on('click', '#roster_trade span', function (index) {
	$(this).find('i').toggleClass('fa-toggle-on fa-toggle-off');
	let settingnum = $('#roster_trade span').index(this);
	rostertrades[settingnum] = !rostertrades[settingnum]; 
	columnToggle();
});


$(document).ready(function(){
	setTimeout(function(){
//		$('#mvpmenu li:nth-child(1) > a, #mvpmenu li:nth-of-type(1) dd:nth-of-type(2) a').addClass('mvpmenuactive');
//		$('#mvpsubmenu dd:nth-child(2) a').addClass('mvpsubmenuactive');
		$('#mvpmenu li:nth-child(1) > a, #mvpmenu li:nth-of-type(1) dd.menurosters a').addClass('mvpmenuactive');
		$('#mvpsubmenu dd.menurosters a').addClass('mvpsubmenuactive');
	}, 100);
});
