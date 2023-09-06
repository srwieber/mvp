// my team Name & Icon
let myTeamName = document.createTextNode('Guest');
let myDivision = '';
const myTeamNameSpan = document.createElement('span');
const myTeamIcon = document.createElement('img');

// current week
let currentWeek = 1;
if(liveScoringWeek > completedWeek){
  currentWeek = liveScoringWeek;
}else if(completedWeek === 0){
  // keep currentWeek = 1;
}else{
  currentWeek = completedWeek;
}


/* === adjust the reusable fetch function === */
const adjustFetch = (moduleName) => {

//my lineup
  if (moduleName === 'my_lineup'){
    const myLineup = document.getElementById('my_lineup');
    const links = myLineup.querySelectorAll('a');
    //change links to remove home by inserting year
    for(var i = 0; i < links.length ; i++) {
      const a = links[i].getAttribute("href");
      links[i].href = `/${year}/${a}`; 
    }
    $(myLineup).find('th:contains("Non-Starters")').closest('tr').prev().addClass('total_players');
    const myStarters = $('.total_players').find('td:first-child').text().replace(' players','');

    let validLineup = true;
    const rows = myLineup.getElementsByTagName('tr');
    for (let i = 1; i < rows.length; i++) {
      if( rows[i].classList.contains('total_players') ){
        break;
      }else{
        const warning = rows[i].querySelectorAll('.warning')[0];
        if(warning){
          var warningText = warning.textContent;
        }
        if( warningText === 'O' || warningText === 'D' || warningText === 'S' || warningText === 'I' ){
          validLineup = false;
console.log( rows[i].querySelectorAll('.player')[0].querySelectorAll('a')[0].textContent );
        }
        rows[i].classList.add('starter');
      }
    }

    const checklistLineup = document.getElementById('checklist_lineup');
    const checklistLineupI = checklistLineup.getElementsByTagName('i')[0];
    if( !validLineup || myStarters != 26 ){
      checklistLineup.classList.add('notdone');
      checklistLineupI.classList.add('fa-circle-xmark');
    }else{
      checklistLineup.classList.add('done');
      checklistLineupI.classList.add('fa-circle-check');
    }
  }

//nfl pickem
  else if(moduleName === 'nfl_pickem'){
    const checklistNflPickem = document.getElementById('checklist_nfl_pickem');
    const checklistNflPickemI = checklistNflPickem.getElementsByTagName('i')[0];
    const checklistNflPickemSpan = checklistNflPickem.getElementsByTagName('span')[0];

    function validateTable() {
      const nflPickem = document.getElementById('nfl_pickem');
      const nflPickemRows = nflPickem.getElementsByTagName('tr');
      for (var i = 1; i < nflPickemRows.length; i++) {
        const inputs = nflPickemRows[i].getElementsByTagName('input');
        let isChecked = false;
        for (var j = 0; j < inputs.length; j++) {
          if (inputs[j].type === 'radio' && inputs[j].checked) {
            isChecked = true;
            break; // Exit the inner loop if a checked radio input is found
          }
        }
        if (!isChecked) {
          return false;
        }
      }
      return true;
    }
    let isTableValid = validateTable();
    if (isTableValid) {
      checklistNflPickem.classList.add('done');
      checklistNflPickemI.classList.add('fa-circle-check');
      checklistNflPickemSpan.textContent = 'Submitted';
    }else{
      checklistNflPickem.classList.add('notdone');
      checklistNflPickemI.classList.add('fa-circle-xmark');
      checklistNflPickemSpan.textContent = 'Missing';
    }
  }

//fantasy pickem
  else if(moduleName === 'fantasy_pickem'){
    const checklistFantasyPickem = document.getElementById('checklist_fantasy_pickem');
    const checklistFantasyPickemI = checklistFantasyPickem.getElementsByTagName('i')[0];
    const checklistFantasyPickemSpan = checklistFantasyPickem.getElementsByTagName('span')[0];

//combine with validateTable above
    function validateFantasyTable() {
      const fantasyPickem = document.getElementById('fantasy_pickem');
      const fantasyPickemRows = fantasyPickem.getElementsByTagName('tr');
      for (var i = 1; i < fantasyPickemRows.length; i++) {
        const inputs = fantasyPickemRows[i].getElementsByTagName('input');
        let isChecked = false;
        for (var j = 0; j < inputs.length; j++) {
          if (inputs[j].type === 'radio' && inputs[j].checked) {
            isChecked = true;
            break; // Exit the inner loop if a checked radio input is found
          }
        }
        if (!isChecked) {
          return false;
        }
      }
      return true;
    }
    let isFantasyTableValid = validateFantasyTable();
    if (isFantasyTableValid) {
      checklistFantasyPickem.classList.add('done');
      checklistFantasyPickemI.classList.add('fa-circle-check');
      checklistFantasyPickemSpan.textContent = 'Submitted';
    }else{
      checklistFantasyPickem.classList.add('notdone');
      checklistFantasyPickemI.classList.add('fa-circle-xmark');
      checklistFantasyPickemSpan.textContent = 'Missing';
    }
  }

}

/* === reusable fetch function === */
//  fetchFunction(`${baseURLDynamic}/${year}/home/${league_id}?MODULE=TRADES`, '.mobile-wrap', printFetchLocation);
const fetchFunction = (fetchURL, elementsToFetch, printFetchLocation, moduleName) => {
//  let fetchURL = `${baseURLDynamic}/${year}/all_reports?L=${league_id}`;
  fetch(fetchURL)
    .then(function(response) {
      if (response.ok) {
        return response.text();
      } else {
        console.log("No data retrieved");
      }
    })
    .then(function(text) {
      const parser = new DOMParser();
      const parsed = parser.parseFromString(text, "text/html");
      let element = $(parsed).find(elementsToFetch).closest('.report');
      element = element[0].outerHTML;
      const newCard = document.createElement("div");
      newCard.setAttribute("id", moduleName);
      newCard.classList.add("card");
      newCard.innerHTML = element;
      newCard.querySelector('.report').classList.remove('report');
      printFetchLocation.prepend(newCard);
/*
      var parser = new DOMParser();
      var html = parser.parseFromString(text, "text/html");
      var items = html.querySelectorAll(elementsToFetch);
      if (items) {
        for (let i = 0; i < items.length; i++) {
          const newDiv = document.createElement("div");
          newDiv.classList.add("card");
          newDiv.classList.add("loading");
          newDiv.appendChild(items[i]);
          printFetchLocation.prepend(newDiv);
        }
        if (items.length < 1) {
          console.log("This isn't available. Check the league Calendar or try again.");
        }
      }else {
        console.log("Nothing To See Here");
      }
*/
  })
    .then(function() {
      adjustFetch(moduleName);
  })
    .catch(function(error) {
      console.log(error);
  });
}


const updateGlobal = () => {
  if (typeof franchise_id != "undefined") {
    myTeamName = document.createTextNode(franchiseDatabase['fid_' + franchise_id + ''].name);
    myTeamIcon.src = franchiseDatabase['fid_' + franchise_id + ''].icon;
    myDivision += franchiseDatabase['fid_' + franchise_id + ''].division;
  }else{
    myTeamIcon.src = 'https://i.ibb.co/1YCMFqq/bguest.png';
    myDivision += '00';
  }
  if(myDivision === 'undefined'){
    myDivision = '00';
  }
  myTeamNameSpan.appendChild(myTeamName);
}

const appendToHeadSection = () => {
  let linkElement = document.createElement('link');

  // Set the required attributes for the link element
  linkElement.rel = 'stylesheet';
  linkElement.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
  linkElement.dataset.autoReplaceSvg = 'nest';

  // Get the head element and append the new link element to it
  let headElement = document.getElementsByTagName('head')[0];
  headElement.appendChild(linkElement);
}

const moveMFLMenu = () => {
  // move mfl menu
  const mflMenu = document.querySelector('.myfantasyleague_menu');
  const mflMenuLinks = document.querySelectorAll('.myfantasyleague_menu a');

  // add logo image/league name to menu
  const leaguelogolocation = document.querySelector('.leaguelogo');
  let leaguelogo = null;
  if (leaguelogolocation != null){
    leaguelogo = leaguelogolocation.cloneNode(true);
    leaguelogo.classList.remove('leaguelogo');
  }
  const leagueNameBR = document.querySelector('.pagetitle h1').childNodes[0].textContent;
  leagueName = leagueNameBR.trim().replace(/[\r\n]+/gm, '');
  mflMenuLinks.forEach(link => {
    if (link.textContent === 'Home') {
      link.classList.add('logo');
      if (leaguelogo === null){
        link.textContent = leagueName;
      }else{
        link.innerHTML = '';
        link.appendChild(leaguelogo);
      }
    }
  });
  // create nav 
  const newNav = document.createElement('nav');
  newNav.innerHTML = mflMenu.innerHTML;
  mflMenu.parentNode.replaceChild(newNav, mflMenu);

  document.body.prepend(newNav);

  // create menu close button
  const menuBars = document.createElement('i');
  menuBars.setAttribute("id", "close_main_menu");
  menuBars.className = 'fa-solid';
  menuBars.classList.add('fa-xmark');
  menuBars.addEventListener("click", function() {
    newNav.style.display = "none";
  });
  newNav.appendChild(menuBars);

  // move nav to body
  document.body.prepend(newNav);

}

const createPlayerSearch = (newHeader) => {
  // create player search container
  const searchContainer = document.createElement('div');
  searchContainer.classList.add('search_container');

  // create menu open button
  const menuBars = document.createElement('i');
  menuBars.setAttribute("id", "main_menu");
  menuBars.className = 'fa-solid';
  menuBars.classList.add('fa-bars');
  menuBars.addEventListener("click", function() {
    const mainMenu = document.querySelector("nav");
    mainMenu.style.display = "block";
  });
  searchContainer.appendChild(menuBars);

  // Create the form element
  const playerSearchForm = document.createElement('form');
  playerSearchForm.method = 'get';
  playerSearchForm.action = `${baseURLDynamic}/${year}/player_search`;

  // Create the hidden input element for league_id
  const hiddenInput = document.createElement('input');
  hiddenInput.type = 'hidden';
  hiddenInput.name = 'L';
  hiddenInput.value = league_id;

  // Create the text input element for player's last name
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.name = 'NAME';
  nameInput.size = '15';
  nameInput.placeholder = "Player's Last Name";

  // Create the icon element for the submit button
  const icon = document.createElement('i');
  icon.className = 'fa-solid';
  icon.classList.add('fa-magnifying-glass');

  // Create the submit button element
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.appendChild(icon);

  // Append the input elements to the form element
  playerSearchForm.appendChild(hiddenInput);
  playerSearchForm.appendChild(nameInput);
  playerSearchForm.appendChild(submitBtn);

  // Append the form element to the container 
  searchContainer.appendChild(playerSearchForm);

  // append search to the header
  newHeader.appendChild(searchContainer);
}

const createProfile = (newHeader) => {
  // create profile container
  const profileContainer = document.createElement('div');
  profileContainer.classList.add('profile_container');
  profileContainer.appendChild(myTeamIcon);
  profileContainer.appendChild(myTeamNameSpan);

  // create profile edit button
  const profileEditButton = document.createElement('button');
  const profileEditArrow = document.createElement('i');
  profileEditArrow.classList.add('fa-solid');
  profileEditArrow.classList.add('fa-angle-down');
  profileEditButton.appendChild(profileEditArrow);
  profileContainer.appendChild(profileEditButton);

  // welcome
  const welcomeCell = document.querySelector('.welcome');
  const welcomeDiv = document.createElement('div');
  welcomeDiv.classList.add('profile_edit');
  welcomeDiv.innerHTML = welcomeCell.innerHTML;
  welcomeDiv.innerHTML = welcomeCell.innerHTML.replace(/\(/g, '<br>').replace(/\)/g, '');
  welcomeCell.replaceWith(welcomeDiv);
  profileContainer.appendChild(welcomeDiv);

  // append search to the header
  newHeader.appendChild(profileContainer);
}

const editPagebody = () => {
  // create header
  const newHeader = document.createElement('div');
  newHeader.classList.add('header');

  createPlayerSearch(newHeader);
  createProfile(newHeader);

  // pagebody
  const pagebody = document.querySelector('.pagebody');
  const sectionEl = document.createElement('section');
  sectionEl.appendChild(pagebody.cloneNode(true));
  pagebody.parentNode.replaceChild(sectionEl, pagebody);

  // move random h3 to pagebody
  $('body > h3').prependTo('.pagebody');

  // attach header to section
  sectionEl.prepend(newHeader);

// edit home page modules
  $('#waiver_request_list caption').wrapInner('<span>');
  $('.mobile-wrap:has(#trade_bait) > div').remove();
  $('#trade_bait tr:last-of-type').after(`<tr class="reportfooter"><td colspan="4"><a href="${baseURLDynamic}/${year}/options?L=${league_id}&O=133">Edit</a> | <a href="${baseURLDynamic}/${year}/options?L=${league_id}&O=133&DELETE=1">Delete</a></td></tr>`);

  const homepageTabContents = document.querySelectorAll('.homepagetabcontent');
  homepageTabContents.forEach(function(tabContent) {
    const mobileWraps = tabContent.querySelectorAll('.mobile-wrap');
    mobileWraps.forEach(function(mobileWrap) {
      tabContent.appendChild(mobileWrap);
      mobileWrap.classList.add('card');
      mobileWrap.classList.remove('mobile-wrap');
      const mobileWrapTable = mobileWrap.querySelector('table');
      mobileWrapTable.classList.remove('homepagemodule');
      mobileWrapTable.classList.remove('report');
      const captionSpan = mobileWrap.querySelector('table caption span');
      captionSpan.textContent = captionSpan.textContent.replace('10 Newest ', '');
      captionSpan.textContent = captionSpan.textContent.replace('Head-To-Head', '');
      captionSpan.textContent = captionSpan.textContent.replace(' for ', '');
    });
    const removeTable = tabContent.querySelector('#homepagecolumns');
    removeTable.remove();
  });

  // remove mobile-wrap class
if( !$('#body_options_05').length ){
  const pagebodyMobileWraps = document.querySelectorAll('.mobile-wrap');
  pagebodyMobileWraps.forEach(function(pagebodyMobileWrap) {
    pagebodyMobileWrap.classList.add('card');
    pagebodyMobileWrap.classList.remove('mobile-wrap');
    const mobileWrapTable = pagebodyMobileWrap.querySelector('table');
    mobileWrapTable.classList.remove('homepagemodule');
    mobileWrapTable.classList.remove('report');
  });
}


}

const homepageTabs = () => {
  const ulElement = document.getElementById('homepagetabs');
  if (ulElement) {
    ulElement.removeAttribute('id');
    const headElement = document.querySelector('.search_container');
    headElement.appendChild(ulElement);
  }
}

const editStandings = () => {
  const numRows = 5;
  const standings = document.getElementById('standings');
  const rows = standings.getElementsByTagName('tr');
  standings.parentNode.setAttribute("id", "standings_card");
  const newStandings = document.getElementById('standings_card');
  let divisionIndex = 0;
  const standingsHeader = document.createElement('h3');
  standingsHeader.setAttribute("id", "standings_header");
  standings.parentNode.prepend(standingsHeader);
  const tableContainer = document.createElement('div');
  tableContainer.setAttribute("id", "standings_container");
  standings.parentNode.append(tableContainer);
  for (let i = 0; i < 4; i++) {
    const header = $(`<div id="division_0${divisionIndex}_link">${leagueDivisions['0' + divisionIndex].name}</div>`);
    const newTable = $(`<table id="division_0${divisionIndex}"></table>`);
    const footerRow = $(`<tr class="reportfooter"><td colspan="14"><a href="${baseURLDynamic}/${year}/standings?L=${league_id}">View Full Standings</a></td></tr>`);
    let currentRow = null;
    for (let j = 0; j < numRows; j++) {
      currentRow = $('#standings tr:first-child');
      $(newTable).append(currentRow);
      if(j === 4) {
        $(newTable).append(footerRow);
      }
    }
    $('#standings_header').append(header);
    $(newTable).appendTo(tableContainer);
    divisionIndex++;
  }
  $('#division_' + myDivision).addClass('active');
  $('#division_' + myDivision + '_link').addClass('active');
  $(tableContainer).before('<div id="standings_left"><i class="fa-solid fa-chevron-left"></i></div>');
  $(tableContainer).after('<div id="standings_right"><i class="fa-solid fa-chevron-right"></i></div>');
  const standingsLeft = document.getElementById('standings_left');
  const standingsRight = document.getElementById('standings_right');
  let activeTableID = newStandings.querySelector('table.active').id;
  let activeTable = document.getElementById(activeTableID);
  const headerLinks = standingsHeader.querySelectorAll('div');
  let activeHeaderLink = document.getElementById(activeTableID + '_link');
  const tables = newStandings.querySelectorAll('table');
  standingsLeft.addEventListener("click", function() {
    headerLinks.forEach(headerLinks => {
      headerLinks.classList.remove('active');
    });   
    tables.forEach(tables => {
      tables.classList.remove('active');
    });   
    if( activeTableID === 'division_00'){
      document.getElementById('division_03_link').classList.add('active');
      document.getElementById('division_03').classList.add('active');
    }else{
      activeHeaderLink.previousSibling.classList.add('active');
      activeTable.previousSibling.classList.add('active');
    }
    activeTableID = newStandings.querySelector('table.active').id;
    activeHeaderLink = document.getElementById(activeTableID + '_link');
    activeTable = document.getElementById(activeTableID);
  });
  standingsRight.addEventListener("click", function() {
    headerLinks.forEach(headerLinks => {
      headerLinks.classList.remove('active');
    });   
    tables.forEach(tables => {
      tables.classList.remove('active');
    });   
    if( activeTableID === 'division_03'){
      document.getElementById('division_00_link').classList.add('active');
      document.getElementById('division_00').classList.add('active');
    }else{
      activeHeaderLink.nextSibling.classList.add('active');
      activeTable.nextSibling.classList.add('active');
    }
    activeTableID = newStandings.querySelector('table.active').id;
    activeHeaderLink = document.getElementById(activeTableID + '_link');
    activeTable = document.getElementById(activeTableID);
  });
  standingsHeader.addEventListener("click", function(e) {
    activeTableID = e.target.id.replace("_link", "");
    activeHeaderLink = document.getElementById(activeTableID + '_link');
    activeTable = document.getElementById(activeTableID);
    headerLinks.forEach(headerLinks => {
      headerLinks.classList.remove('active');
      e.target.classList.add('active');
    });   
    tables.forEach(tables => {
      tables.classList.remove('active');
      activeTable.classList.add('active');
    });   
  });
  $(standings).remove();
}

const myChecklist = () => {
  const mainTab = document.getElementById('tabcontent0');
  let checklist = '<div id="checklist" class="card">';
  checklist += '<h3>My Checklist</h3>';
  checklist += '<div>';

  // valid lineup
  const printFetchLocation = document.getElementById('tabcontent1');
//need to change myTeam to logged in owner
  myTeam = 'caption .franchise_0009';
  fetchFunction(`${baseURLDynamic}/${year}/options?L=${league_id}&O=06`, myTeam, printFetchLocation, "my_lineup");
  checklist += `<a id="checklist_lineup" href="${baseURLDynamic}/${year}/options?L=${league_id}&O=02"><i class="fa-solid"></i> Valid Lineup</a>`;

  // IR compliance
  if( !$('#roster').length ){
    checklist += `<a href="${baseURLDynamic}/${year}/options?L=${league_id}&O=18">Error: Add My Roster Module</a>`;
  }else if( $('#roster b.warning').length ){
    checklist += `<a href="${baseURLDynamic}/${year}/options?L=${league_id}&O=18" class="notdone"><i class="fa-solid fa-circle-xmark"></i> IR Violation</a>`;
  }else{
    checklist += `<a href="${baseURLDynamic}/${year}/options?L=${league_id}&O=18" class="done"><i class="fa-solid fa-circle-check"></i> IR Compliant</a>`;
  }

  // nfl pickem
  nflPickemTable = '.pagebody .report caption';
  fetchFunction(`${baseURLDynamic}/${year}/options?L=${league_id}&O=121`, nflPickemTable, printFetchLocation, "nfl_pickem");
  checklist += `<a id="checklist_nfl_pickem" href="${baseURLDynamic}/${year}/options?L=${league_id}&O=121"><i class="fa-solid"></i> NFL Pick\'em <span></span></a>`;

  // fantasy pickem
  fantasyPickemTable = '.pagebody .report caption';
  fetchFunction(`${baseURLDynamic}/${year}/options?L=${league_id}&O=179`, fantasyPickemTable, printFetchLocation, "fantasy_pickem");
  checklist += `<a id="checklist_fantasy_pickem" href="${baseURLDynamic}/${year}/options?L=${league_id}&O=179"><i class="fa-solid"></i> Fantasy Pick\'em <span></span></a>`;

  // survivor
//need to find a better way to get the current week
  const survivorCell = currentWeek + 1;
  if( !$('#nfl_survivor_pool').length ){
    checklist += `<a href="${baseURLDynamic}/${year}/options?L=${league_id}&O=05">Error: Add NFL Survivor Pool Module</a>`;
//  }else if( $('#nfl_survivor_pool .myfranchise').closest('tr').find(`td:nth-of-type(${survivorCell}`).text() === '' ){
  }else if( $('#nfl_survivor_pool .myfranchise').closest('tr').find(`td:nth-of-type(${survivorCell})`).text() === '' ){
    checklist += `<a href="${baseURLDynamic}/${year}/options?L=${league_id}&O=120" class="notdone"><i class="fa-solid fa-circle-xmark"></i> Survivor Pick Missing</a>`;
  }else {
    checklist += `<a href="${baseURLDynamic}/${year}/options?L=${league_id}&O=120" class="done"><i class="fa-solid fa-circle-check"></i> Survivor Pick Submitted</a>`;
  }

  // respond to trades
  if(leagueAttributes['PendingTradesToMe'] === undefined){
    checklist += `<a href="${baseURLDynamic}/${year}/options?L=${league_id}&O=05">Error: Add Pending Trades Module</a>`;
  }else if( leagueAttributes['PendingTradesToMe'] > 0 ) {
    let plural = ''; if(leagueAttributes['PendingTradesToMe'] > 1){plural = 's'}
    checklist += `<a href="${baseURLDynamic}/${year}/options?L=${league_id}&O=05" class="notdone"><i class="fa-solid fa-circle-xmark"></i> Respond To ${leagueAttributes['PendingTradesToMe']} Trade${plural}</a>`;
  }else{
    checklist += `<a href="${baseURLDynamic}/${year}/options?L=${league_id}&O=05" class="done"><i class="fa-solid fa-circle-check"></i> Respond To Trades</a>`;
  }

  // offer trades
  if( leagueAttributes['PendingTradesFromMe'] === undefined ) {
    checklist += `<a href="${baseURLDynamic}/${year}/options?L=${league_id}&O=05">Error: Add Pending Trades Module</a>`;
  }else if( leagueAttributes['PendingTradesFromMe'] > 0 ) {
    let plural = ''; if(leagueAttributes['PendingTradesFromMe'] > 1){plural = 's'}
    checklist += `<a href="${baseURLDynamic}/${year}/options?L=${league_id}&O=05" class="done"><i class="fa-solid fa-circle-check"></i> Offered ${leagueAttributes['PendingTradesFromMe']} Trade${plural}</a>`;
  }else{
    checklist += `<a href="${baseURLDynamic}/${year}/options?L=${league_id}&O=05" class="notdone"><i class="fa-solid fa-circle-xmark"></i> Offer A Trade</a>`;
  }

  // update trade bait
  if( !$('#trade_bait').length ){
    checklist += `<a href="${baseURLDynamic}/${year}/options?L=${league_id}&O=05">Error: Add Trade Bait Module</a>`;
  }else if( $('#trade_bait .myfranchise').length ){
    checklist += `<a href="${baseURLDynamic}/${year}/options?L=${league_id}&O=133" class="done"><i class="fa-solid fa-circle-check"></i> Trade Bait Updated</a>`;
  }else{
    checklist += `<a href="${baseURLDynamic}/${year}/options?L=${league_id}&O=133" class="notdone"><i class="fa-solid fa-circle-xmark"></i> Update Trade Bait</a>`;
  }

  // submit waiver claim
  const waiverTable = document.getElementById('waiver_request_list');
  let waiverList = null;
  if(waiverTable){
    waiverList = waiverTable.getElementsByTagName('td')[0].textContent;
  }
  if( !waiverTable ){
    checklist += `<a href="${baseURLDynamic}/${year}/options?L=${league_id}&O=05">Error: Add My Pending Waiver Module</a>`;
  }else if( waiverList === "You don't have any waiver claims submitted into the system at this time." ){
    checklist += `<a href="${baseURLDynamic}/${year}/add_drop?L=${league_id}" class="notdone"><i class="fa-solid fa-circle-xmark"></i> Submit Waiver Claim</a>`;
  }else{
    checklist += `<a href="${baseURLDynamic}/${year}/add_drop?L=${league_id}" class="done"><i class="fa-solid fa-circle-check"></i> Waiver Claim Submitted</a>`;
  }

  // vote on poll
  if( !$('#poll').length ){
    checklist += `<a href="${baseURLDynamic}/${year}/options?L=${league_id}&O=05">Error: Add Newest League Poll Module</a>`;
  }else if( $('#poll label').length ){
    checklist += `<a href="${baseURLDynamic}/${year}/options?L=${league_id}&O=69" class="notdone"><i class="fa-solid fa-circle-xmark"></i> Vote on Poll</a>`;

  }else {
    checklist += `<a href="${baseURLDynamic}/${year}/options?L=${league_id}&O=69" class="done"><i class="fa-solid fa-circle-check"></i> Vote on Poll</a>`;
  }

  checklist += '</div>';
  checklist += '</div>';
  $(mainTab).append(checklist);
}

const removeElements = () => {
  var elementsToRemove = document.querySelectorAll('noscript, .pageheader, .leaguelogo, nav > span, li.mfl-icon, .main_tabmenu');
  elementsToRemove.forEach(function(element) {
    element.parentNode.removeChild(element);
  });

  document.addEventListener('DOMContentLoaded', function() {
    const pagefooter = document.querySelector('.pagefooter');
    pagefooter.remove();
    document.getElementsByTagName('body')[0].style.display = "flex";
  });
}



const init = () => {
  updateGlobal();
  appendToHeadSection();
  moveMFLMenu();
  editPagebody();
  const isHome = document.getElementsByClassName('homepagetabcontent');
  if( thisProgram === "home" && isHome.length ) {
    homepageTabs();
    editStandings();
    myChecklist();
  }
  removeElements();
}
init();
