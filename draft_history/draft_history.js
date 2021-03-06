let loadOnClick = true;				// true if you want the tabs to load the content when you click them. false will load everything when the page loads. Not recommended, it takes a long time to load. 

/* DO NOT EDIT BELOW */

/*
Order of Loading:
1) Print the table wrapper. 
2) a) Get league history JSON. 
   b) Extract home page links, change them into draft results JSON links, and store them in an object. (cant get draft, player, player score JSONs without this)
   c) print tabs that display each year. 
3) a) Get current tab's draft results JSON. (todo: turn this into objects)
   b) Extract current tab's draft results JSON link, change them into player JSON links and player scores JSON links, and store them in a variable. (todo: do this at the same time as step 2b and store them in an array)
   c) Add player id's to the end of player JSON links and player scores JSON links. 
   d) Get player scores JSON and don't do anything with it. (todo: add YTD scores to table cell)
   e) Get player JSON for current tab.
   d) Define and print draft pick data. (todo: add position cell)
4) format comments
5) add odd and even rows
onload) click event on year tabs

Json Links:
I dont see a reason to use this one: player profile:  https://api.myfantasyleague.com/2021/export?TYPE=playerProfile&P=15237%2C15239&JSON=0
                                     player:        https://www68.myfantasyleague.com/2021/export?TYPE=players&L=36134      &DETAILS=1&SINCE=&JSON=0                           &PLAYERS= 15237%2C15239
I have not implemented this one yet: player scores: https://www68.myfantasyleague.com/2021/export?TYPE=playerScores&L=36134 &W=YTD&YEAR=&POSITION=&STATUS=&RULES=&COUNT=&JSON=0&PLAYERS= 15237%2C15239

To do: 
-instead of looping through object arrays to match players, try .find : let car = cars.find(car => car.color === "red");
-try not to delete arrays. see if you can keep them stored instead. Need to define the year in the object. 
-fetch all files together in a loop 

-set var for drafthistoryloading 
-add player link title
-add player popup
-make points sortable

-store json data in objects. this way you don't have loops in loops
-figure out what to do with player links that do not exist
-see if you can wrap text from: "Pick traded from" to: "." for 2017-2018 since they aren't wrapped in brackets 
-add status to player link, since not all leagues are rookie drafts. 

Updated: 10/20/21
*/

const historyLinks = []; // change name to draftLinks. This is links to draft results json
const playerLinks = []; // Links to player json for all years
const pScoreLinks = []; // links to player score json for all years
const allDrafts = []; // this stores draft results for one year and all years

let loadtheyear = baseURLDynamic + "/" + year + "/export?TYPE=draftResults&L=" + league_id + "&JSON=1"; // draft results json link for year that has been clicked 
let whatyear = year; // the year that has been clicked
let whatposition; // the position that has been clicked
let whatfranchise; // the team that has been clicked
let leaguePositions; // league position storage 
let draftdata; // draft json storage
let leaguedata; // player score json storage
let playerdata; // player json storage
let pscoredata; // player score json storage

let playerpoints = '0'; // temporary as a placeholder until player points block is written

function historyTable(){
// layout
	$('#drafthistory').append('<div id="drafthistoryloading"><div>Loading...</div></div><span class="reportnavigation"><span class="reportnavigationheader">Display:</span><span class="currentweek">History</span><a href="//%HOST%/%YEAR%/options?L=%LEAGUEID%&O=17&&DISPLAY=LEAGUE&CMD=LIST">List</a><a href="//%HOST%/%YEAR%/options?L=%LEAGUEID%&O=113&CMD=GRID&DISPLAY=LEAGUE&ARCHIVE=*">Grid</a><a href="//%HOST%/%YEAR%/options?L=%LEAGUEID%&O=209&CMD=SB&DISPLAY=LEAGUE&ARCHIVE=*">Steals and Busts (BETA)</a><a href="//%HOST%/%YEAR%/options?L=%LEAGUEID%&O=182&CMD=RECAP&DISPLAY=LEAGUE&ARCHIVE=*">Recap</a></span><div id="yeartabs" class="drafttabs mobile-wrap"></div><div id="positiontabs" class="drafttabs mobile-wrap"><a class="All">All</a></div><div id="franchisetabs" class="mobile-wrap"><a><span class="all">All Teams</span></a></div><div id="loadinginfo"><div>Loading:</div><div></div></div><div class="mobile-wrap"><table id="drafthistoryreport" class="homepagemodule report"><tbody><caption><span>'+year+' Draft</span></caption><tr><th>Pick</th><th class="points">Ovr</th><th class="franchisename">Franchise</th><th class="playerpos">Pos</th><th class="player">Player</th><th class="playerpoints">Points</th><th>Comment</th></tbody></table></div>');
	getHistory();
}
historyTable();


async function getHistory() {
// layout
	$('#loadinginfo div:last-child').html('League History Files');
	const historyurl = baseURLDynamic + "/" + year + "/export?TYPE=league&L=" + league_id + "&JSON=1";
	const response = await fetch(historyurl);
	if(response.status !== 200){throw new Error('missing file');}
	const data = await response.json();
//console.log(data);

	const historydata = data.league.history.league;
	// loop through league json history
	const l = historydata.length;
	for (let i = 0; i < l; i++) {
		// push items into historyLinks Object
		historyLinks[i] = { "year": historydata[i].year, "url": historydata[i].url };
		// edit items in historyLinks Object
		historyLinks[i].url = historyLinks[i].url + '&JSON=1';
		historyLinks[i].url = historyLinks[i].url.replace("http:", "https:").replace("home/", "export?TYPE=draftResults&L=");
		//create the tabs.
		const tablinks = '<a>' + historydata[i].year + '</a>'; 
		$('#yeartabs').prepend(tablinks);
	} // end loop
	// MFL put the current year at the beginning of the history list. this moves it into order.
	$('#yeartabs a:last-child').prependTo('#yeartabs');

	leaguePositions = data.league.rosterLimits.position;
	// loop through league json positions 
	const lp = leaguePositions.length;
	for (let i = 0; i < lp; i++) {
		//create the tabs.
		leaguePositions[i].name = leaguePositions[i].name.replace(new RegExp("\\+","g"),'-')
		const tablinks = '<a>' + leaguePositions[i].name + '</a>'; 
		$('#positiontabs').append(tablinks);
	} // end loop

	const franchise = data.league.franchises.franchise;
	// loop through league json franchises  
	const lf = franchise.length;
	for (let i = 0; i < lf; i++) {
		//create the tabs.
		let teamicon;
		if( franchise[i].icon === undefined ){
			teamicon = '<span class="franchise_' + franchise[i].id + '" title="' + franchise[i].name + '">' + franchise[i].name + '</span>';
		}else{
			teamicon = '<img src="' + franchise[i].icon + '" title="' + franchise[i].name + '" class="franchise_' + franchise[i].id + '">';
		}
		const tablinks = '<a>' + teamicon + '</a>'; 
		$('#franchisetabs').append(tablinks);
	} // end loop

	$('.drafttabs a:first-of-type').addClass('selectedtab');
	$('#franchisetabs a:first-of-type').addClass('selectedtab');

	if(loadOnClick){getPicks();}else{storePlayerData();}
//console.log(historyLinks);
//	return data;
} // end gethistory 



async function getPicks(){
// 1 year at a time
	$('#loadinginfo div').slideDown('slow');
	if(whatyear === undefined){
		$('#loadinginfo div:last-child').html(year + ' Draft');
	}else{
		$('#loadinginfo div:last-child').html(whatyear + ' Draft');
	}
	// Get draft data
	const draftres = await fetch(loadtheyear);
	if(draftres.status !== 200){throw new Error('missing file');}
	draftdata = await draftres.json();

	// Create link for player JSON and player score JSON for each drafted player
	let leagueurl = loadtheyear.replace("draftResults&L=", "league&L=");
	let playerurl = loadtheyear.replace("draftResults&L=", "players&L=").replace("&JSON=1", "&DETAILS=1&SINCE=&JSON=1&PLAYERS=");
	let playerscore = loadtheyear.replace("draftResults&L=", "playerScores&L=").replace("&JSON=1", "&W=YTD&YEAR=&POSITION=&STATUS=&RULES=&COUNT=&JSON=1&PLAYERS=");
	let playerNumber = '';
	const l = draftdata.draftResults.draftUnit.draftPick.length;
	for (let i = 0; i < l; i++) {
		const player = draftdata.draftResults.draftUnit.draftPick[i].player;
		playerNumber += player + '%2C';

	} // end loop
	playerurl += playerNumber;
	playerscore += playerNumber;

	// Get league data
	const leagueres = await fetch(leagueurl);
	if(leagueres.status !== 200){throw new Error('missing file');}
	leaguedata = await leagueres.json();

	// Get player data
	const playerres = await fetch(playerurl);
	if(playerres.status !== 200){throw new Error('missing file');}
	playerdata = await playerres.json();

	// Get player score data. this isn't being used. 
	const pscoreres = await fetch(playerscore);
	if(pscoreres.status !== 200){throw new Error('missing file');}
	pscoredata = await pscoreres.json();
//console.log(playerdata);
//console.log(pscoredata);

	displayPicks();
}


async function storePlayerData(){
// all years

// make sure this function is called after json files have been loaded. if you include current year here, then this will need to be loaded sooner

// step 1: loop through historyLinks, get draft restults data, store in object (you dont need to store in object if you find a way to call each year on tab click)
// step 2: get player data, loop to find player id, add the following to the player object: (id (if not already), stats_id (i dont actually know what this is for) name, team, draft_team, draft_year, position, status)
// step 3: get player score data, loop to find player id, add "score" to player object

	$('#loadinginfo div:last-child').html('League Draft Files');
	//loop through history links
	//step #1
	let l = historyLinks.length;
	for (let i = 0; i < l; i++) {
		if (i === 50) { break; } // cancel the loop if it thinks there are over 50 years 
//console.log(historyLinks[i].url);
		// Get all draft data
		let draftres = await fetch(historyLinks[i].url);
		if(draftres.status !== 200){throw new Error('missing file');}
		draftdata[i] = await draftres.json();
//console.log(draftdata[i]); // result = draft picks

		// create object to store all draft data
		allDrafts[i] = { "results": draftdata[i].draftResults.draftUnit.draftPick };
//console.log(allDrafts); // result = all drafts in an object

		//step #2 pscoredata & playerdata
		// create object to store all player and player score json links
		playerLinks[i] = { "year": historyLinks[i].year, "url": historyLinks[i].url };
		playerLinks[i].url = playerLinks[i].url.replace("draftResults&L=", "players&L=").replace("&JSON=1", "&DETAILS=1&SINCE=&JSON=1&PLAYERS=");
		pScoreLinks[i] = { "year": historyLinks[i].year, "url": historyLinks[i].url };
		pScoreLinks[i].url = pScoreLinks[i].url.replace("draftResults&L=", "playerScores&L=").replace("&JSON=1", "&W=YTD&YEAR=&POSITION=&STATUS=&RULES=&COUNT=&JSON=1&PLAYERS=");

		//loop through allDrafts object, but i cant because i cant define m correctly
		let playerNumber = '';
		let m = allDrafts[i].results.length; // add .draftPick before .length?
		for (let j = 0; j < m; j++) {
			if (j === 2000) { break; } // cancel the loop if it thinks there are over 2000 players. this number may need to be increased
			const player = draftdata.draftResults.draftUnit.draftPick[j].player;
			playerNumber += player + '%2C';
		} // end loop
		playerLinks[i].url = playerLinks[i].url + playerNumber;
		pScoreLinks[i].url = pScoreLinks[i].url + playerNumber;

	$('#loadinginfo div:last-child').html('Player Files');
		// Get player data out of links. what am i doing with this info? match player id and add to array. then you can move onto new displayPicks function
		// todo: Group the await with player scores.
		let playerres = await fetch(playerLinks[i].url);
		if(playerres.status !== 200){throw new Error('missing file');}
		newplayerdata = await playerres.json();

	$('#loadinginfo div:last-child').html('Player Scores');
		// Get player score data out of links
		let pscoreres = await fetch(pScoreLinks[i].url);
		if(pscoreres.status !== 200){throw new Error('missing file');}
		newpscoredata = await pscoreres.json();

/* not working
		// loop to find player name
		const pT = newplayerdata.players.player.length;
		for (let j = 0; j < pT; j++) {
			let playername = '';let playerteam = '';let playerpos = '';
			if (newplayerdata.players.player[j].id == player){
				
			} // end if
		} // end loop
*/

	} // end history links loop
//console.log(playerLinks);
//console.log(allDrafts);

	displayPicks();
}



function displayPicks(){
// 1 year at a time
	allDrafts.length = 0; // reset the array
	// Data
	const pickDetails = draftdata.draftResults.draftUnit.draftPick;
	const pscoreTarget = pscoredata.playerScores.playerScore; // playerscoreTarget[i].score;
	const playerTarget = playerdata.players.player;
	const franchise = leaguedata.league.franchises.franchise;

	const l = draftdata.draftResults.draftUnit.draftPick.length;

//console.log(franchise);
	// loop to store draft pick and player info to array
	// loop to add draft pick info to array
	for (let i = 0; i < l; i++) {
//console.log(pickDetails[i]);
//console.log(playerTarget[i]);
//console.log(pscoreTarget[i]);

		allDrafts.push(pickDetails[i]);
		allDrafts[i].formattedpick = parseInt(pickDetails[i].round) +'.'+pickDetails[i].pick;
		allDrafts[i].ovr = i + 1;
		// add player details to the array items
		for (let j = 0; j < l; j++) {
			if (allDrafts[i].player == playerTarget[j].id){
				// more player data can be added here: 
				allDrafts[i].name = playerTarget[j].name;
				allDrafts[i].position = playerTarget[j].position;
				allDrafts[i].draft_team = playerTarget[j].draft_team;
				allDrafts[i].team = playerTarget[j].team;
				allDrafts[i].draft_year = playerTarget[j].draft_year;
				allDrafts[i].status = playerTarget[j].status;
			}
			if (allDrafts[i].player == pscoreTarget[j].id){
				// more player data can be added here: 
				allDrafts[i].score = pscoreTarget[j].score;
			}
		}
		// loop through league json positions to add position groups to draft pick array
		const lp = leaguePositions.length;
		for (let j = 0; j < lp; j++) {
			if(leaguePositions[j].name.indexOf(allDrafts[i].position) != -1){
				allDrafts[i].posgroup = leaguePositions[j].name;
			}
		} // end loop
		// loop to add franchise icon to draft pick array
		const lf = franchise.length;
		for (let j = 0; j < lf; j++) {
			if (allDrafts[i].franchise == franchise[j].id){
					allDrafts[i].franchiseicon = franchise[j].icon;
					allDrafts[i].franchisename = franchise[j].name;
			}
		}
	}


	// loop to display draft pick info
	for (let i = 0; i < l; i++) {
		// add player link
		const playerlink = '<a href="'+baseURLDynamic+'/'+year+'/player?L='+league_id+'&P='+allDrafts[i].player+'">' + allDrafts[i].name + ' ' + allDrafts[i].team + ' ' + allDrafts[i].position + '</a> (' + allDrafts[i].status + ')';
		// add player score link
		const playerscore = '<a href="' + baseURLDynamic + '/' + year + '/options?L=' + league_id + '&O=08&PLAYER_ID=' + allDrafts[i].player + '">' + allDrafts[i].score + '</a>';
		// add franchise icon/name and link
		let myteam; 
		if (allDrafts[i].franchise == franchise_id){
			// add myfranchise class name
			myteam = allDrafts[i].franchise +' myfranchise';
		}else{
			myteam = allDrafts[i].franchise;
		}
		let teamicon;
		if(allDrafts[i].franchiseicon === undefined){
			teamicon = '<a href="' + baseURLDynamic + '/' + year + '/options?L=' + league_id + '&F=' + allDrafts[i].franchise + '&O=07"';
			teamicon += ' title="' + allDrafts[i].franchisename + '" class="franchise_' + myteam + '">';
			teamicon += allDrafts[i].franchisename + '</a>';
		}else{
			teamicon = '<a href="' + baseURLDynamic + '/' + year + '/options?L=' + league_id + '&F=' + allDrafts[i].franchise + '&O=07"';
			teamicon += ' title="' + allDrafts[i].franchisename + '" class="franchise_' + myteam + '">';
			teamicon += '<img src="' + allDrafts[i].franchiseicon + '" title="' + allDrafts[i].franchisename + '" class="franchise_' + allDrafts[i].franchise + '">';
		}

/* dont need this, but the setup could be used for future use
		let teamicon;
		if(franchiseDatabase['fid_' + allDrafts[i].franchise].icon === undefined){
			teamicon = '<a href="' + baseURLDynamic + '/' + year + '/options?L=' + league_id + '&F=' + allDrafts[i].franchise + '&O=07"';
			teamicon += ' title="' + franchiseDatabase['fid_' + allDrafts[i].franchise].name + '" class="franchise_' + myteam + '">';
			teamicon += franchiseDatabase['fid_' + allDrafts[i].franchise].name + '</a>';
		}else{
			teamicon = '<a href="' + baseURLDynamic + '/' + year + '/options?L=' + league_id + '&F=' + allDrafts[i].franchise + '&O=07"';
			teamicon += ' title="' + franchiseDatabase['fid_' + allDrafts[i].franchise].name + '" class="franchise_' + myteam + '">';
			teamicon += '<img src="' + franchiseDatabase['fid_' + allDrafts[i].franchise].icon + '"';
			teamicon += ' alt="' + franchiseDatabase['fid_' + allDrafts[i].franchise].name + '" id="franchiseicon_' + allDrafts[i].franchise + '" class="franchiseicon"></a>';
		}
*/
		let newRow = '<tr class="pickrow"><td>' + allDrafts[i].formattedpick + '</td>';
		newRow += '<td class="points">' + allDrafts[i].ovr + '</td>';
		newRow += '<td class="franchisename">' + teamicon + '</td>';
		newRow += '<td class="playerpos"><span class="' + allDrafts[i].posgroup + '">' + allDrafts[i].position + '</span></td>';
		newRow += '<td class="playername">' + playerlink + '</td>';
		newRow += '<td class="playerpoints">' + playerscore + '</td>';
		newRow += '<td class="comment"><div class="overflow">' + allDrafts[i].comments + '</div></td></tr>';
		$(newRow).insertAfter('#drafthistoryreport tr:last-child');
		if (whatposition != undefined && whatposition != 'All'){
			$('#drafthistoryreport .playerpos span').not( $('.' + whatposition) ).closest('tr').remove();
		} // end if
		if (whatfranchise != undefined && whatfranchise != 'all'){
			$('#drafthistoryreport .franchisename a').not( $('.' + whatfranchise) ).closest('tr').remove();
		} // end if
	}
//console.log(allDrafts);
	commentInfo(); 
	rowClass();
// doesn't work			try { MFLPlayerPopupNewsIcon("#drafthistoryreport"); } catch(er) {};
// doesnt work  try { MFLPlayerPopupNewsIcon("drafthistoryreport") } catch(er) {};
} // End getpicks


function commentInfo(){
// layout
	// wrap text for traded pick information
	$('#drafthistoryreport .comment .overflow').html(function(i, h) {
		return h.replace(/\[+([^\][]+)]+/g,"<div class='commentinfo'>$1</div>");
	});
	// wrap text in parentheses. comments added... 
	$('#drafthistoryreport .comment .overflow').html(function(i, h) {
		return h.replace(/\(([^\)]+)\)/g, "(<div class='commentinfo'>$1</div>)"); 
	});
	// wrap text in made from pre-draft list 
	$("#drafthistoryreport .comment .overflow:contains('Pick made based on Pre-Draft List')").html(function(_, html) {
		return html.replace(/(Pick made based on Pre-Draft List)/g, '<div class="commentinfo">$1</div>');
	});
	// delete parentheses because they didn't get wrapped in the code above
	$('#drafthistoryreport .comment .overflow:contains("(")').each(function(){
		$(this).html($(this).html().split("(").join(""));
		$(this).html($(this).html().split(")").join(""));
	});
	// move all of the wrapped text to the bottom of the cell so you can read the comments
	$('#drafthistoryreport .comment .overflow .commentinfo').each(function(){
		const theparent = $(this).parent();
		$(this).appendTo(theparent);
	});
}


function rowClass(){
// layout
	$('.report tr:odd').addClass('oddtablerow');
	$('.report tr:even').addClass('eventablerow');
	// hide the loading notification
	$('#drafthistoryloading').hide();
	$('#loadinginfo div:last-child').html('Complete');
	$('#loadinginfo div').slideUp('slow');
		try { MFLPlayerPopupNewsIcon()} catch(er) {};
}


$(document).on('click', '#yeartabs a', function () {
	whatyear = this.text;
	// replace table caption with year 
	$('#drafthistoryreport caption span').html(whatyear + ' Draft');
	// remove table rows in order to start over
	$('#drafthistoryreport .pickrow').slideUp("slow", function() {
		$(this).remove();
	});
	$('#yeartabs a').removeClass('selectedtab');
	$(this).addClass('selectedtab');
	// loop to find the draft json for the link clicked
	const dT = $('#yeartabs a').length;
	for (let i = 0; i < dT; i++) {
		if (whatyear == historyLinks[i].year){
			loadtheyear = historyLinks[i].url;
		}
	};
	// Timeout delay to make sure the loading div shows 
	setTimeout(function (){
		getPicks();
	}, 10);
}); // end on click event

$(document).on('click', '#positiontabs a', function () {
	whatposition = this.text;
//console.log(whatposition);
	$('#drafthistoryreport .pickrow').remove();
	$('#positiontabs a').removeClass('selectedtab');
	$(this).addClass('selectedtab');
	displayPicks();
}); // end on click event

$(document).on('click', '#franchisetabs a', function () {
	whatfranchise = this.children[0].className;
//console.log(whatfranchise);
	$('#drafthistoryreport .pickrow').remove();
	$('#franchisetabs a').removeClass('selectedtab');
	$(this).addClass('selectedtab');
	displayPicks();
}); // end on click event


