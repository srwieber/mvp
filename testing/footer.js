// my team Name & Icon
let myTeamName = document.createTextNode('Guest');
let myDivision = '';
const myTeamNameSpan = document.createElement('span');
const myTeamIcon = document.createElement('img');


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

  // attach header to section
  sectionEl.prepend(newHeader);

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
    });
    const removeTable = tabContent.querySelector('#homepagecolumns');
    removeTable.remove();
  });

  // remove mobile-wrap class
  const pagebodyMobileWraps = document.querySelectorAll('.mobile-wrap');
  pagebodyMobileWraps.forEach(function(pagebodyMobileWrap) {
    pagebodyMobileWrap.classList.add('card');
    pagebodyMobileWrap.classList.remove('mobile-wrap');
    const mobileWrapTable = pagebodyMobileWrap.querySelector('table');
    mobileWrapTable.classList.remove('homepagemodule');
    mobileWrapTable.classList.remove('report');
  });


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

const removeElements = () => {
  var elementsToRemove = document.querySelectorAll('noscript, .pageheader, .leaguelogo, nav > span, li.mfl-icon, .main_tabmenu');
  elementsToRemove.forEach(function(element) {
    element.parentNode.removeChild(element);
  });

  document.addEventListener('DOMContentLoaded', function() {
    const pagefooter = document.querySelector('.pagefooter');
    pagefooter.remove();
  });
}



const init = () => {
  updateGlobal();
  appendToHeadSection();
  moveMFLMenu();
  editPagebody();
  if( thisProgram === "home" ) {
    homepageTabs();
    editStandings();
  }
  removeElements();
}
init();
