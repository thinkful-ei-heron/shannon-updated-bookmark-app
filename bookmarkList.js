import api from './api.js';
import store from './store.js';

/*The following three functions will work together to render an error message to the user and 
log the error to the store. */

const errorHtmlRender = function (error) {
  return`
  <p> Sorry, something went wrong. We have experienced the following error:<span class="errorMessage"> ${error}</span></p>
  <form class="exitErrorMessage">
    <button class= "exitError" type= submit>Close</button>
  </form>`;
};

const renderErrorMessage = function () {
  if (store.DATA.error) {
    const message = errorHtmlRender(store.DATA.error);
    $('.displayErrorMessage').html(message);
  } else {
    $('.displayErrorMessage').html('');
  }
};

const closeErrorMessage = function () {
  $('.displayErrorMessage').on('submit', '.exitErrorMessage', function () {
    event.preventDefault();
    store.DATA.error = null;
    renderErrorMessage();
  });
};

/*The following function generates the HTML for the page of bookmarks by looking at the Store.DATA */

const createBookmarkListHTML = function (item) {
  $('.js-listOfBookmarks').append(`
  <li id= "${item.id}">
    <form class= "expandElementButton">
      <button type="submit" class="titleAndRatingButton" aria-expanded="false"> 
        <div class="titleAndRating">
          <div class= "title"> 
            Title:<span class= "js-titleSpan"> ${item.title}</span>
          </div>
          <div class = "rating">
            Rating:<span class= "js-ratingSpan">${item.rating} Stars</span>
          </div>
        </div>
      </button>
    </form>
    <div class= "js-expandContent hidden" aria-live='polite'>
      <form action= "${item.url}" target="_blank">
        <label for= "visitSite" class="hidden">Visit Site</label>
        <input class= "visitSiteButton" type="submit" value="Visit Site" id= "visitSite"/>
      </form>
      <p>${item.desc}</p>
      <form class= "js-DeleteButton">
        <button type= "submit" class="deleteBookmarkButton">Delete Bookmark?</button>
      </form>
    </div>
  </li>
  `);
};

/*This will be called by render() in order to get all the bookmarks from the server with an API call and then add them
to our store.DATA.allBookmarks. It will then call createBookmarkListHTML in order to obtain the HTML
for each bookmark element for the page. 
*/

const initializeStoreBookmarkList = function () {
  api.getAllBookmarks()
    .then(data => Object.assign(store.DATA.allBookmarks, data))
    .then(() => store.DATA.allBookmarks.forEach(item => createBookmarkListHTML(item)))
    .catch(error => {
      store.defineErrorMessage(error);
      renderErrorMessage();
    });
};

/*
Will render the main page by calling initializeStoreBookmarkList (api call) get the HTML for our list of bookmarks 
It will also render the error message if one if present 
*/

const render = function () {
  renderErrorMessage();
  $('.js-listOfBookmarks').html('');
  initializeStoreBookmarkList();
};

/*Will listen for a submit event on the new bookmark button. When clicked it will
push the form into the html section element which is above the list of bookmarks. This way you can still see your other 
bookmarks when creating the new bookmark. */

const handleNewBookmarkButtonSubmit = function () {
  $('.js-bookmarkTools').submit(function () {
    event.preventDefault();
    $('.js-displayCreateBookmarkForm').html(`
    <form class= js-addNewBookmarkForm>
      <fieldset class= "bookmarkDetails">
        <div>
          <label for="addNewBookmarkUrl">Bookmark URL:</label>
        </div>
        <div>
          <input id= "addNewBookmarkUrl" type= url name="url" placeholder= "http://www.example.com" required>
        </div>
        <div>
          <label for= "addBookmarkTitle">Site Name:</label>
        </div>
        <div>
          <input type= "text" id= "addBookmarkTitle" name="title" placeholder= "Site Name" required>
        </div>
        <div>
          <label for= "addBookmarkRating">Rating:</label>
        </div>
        <div>
          <select id="addBookmarkRating" name="rating" required>
            <option disabled>Stars</option>
            <option value=5>★★★★★</option>
            <option value=4>★★★★☆</option> 
            <option value=3>★★★☆☆</option> 
            <option value=2>★★☆☆☆</option> 
            <option value=1>★☆☆☆☆</option> 
          </select> 
        </div>
        <div>
          <label for="addBookmarkDescription">Description:</label>
        </div>
        <div>
          <textarea id="addBookmarkDescription" name="desc" placeholder= "Add your bookmark description here..." required></textarea>
        </div>        
        <button type=submit> Create </button>
        <button type=reset>Cancel</button>
      </fieldset>
    </form>
    `);
  });
};

/* This will be called if the filter selection has been made, or if a new item is being 
added or deleted. This way, if a user has the list filters and adds a new item/deletes an item, the
filter settings will still be in place and apply to any new items. The function accesses the store.DATA.allBookmarks
and filters for items with ratings at or above the user selected filter value. */

const filterBookmarkList = function () {
  const filterRatingsValue = store.DATA.filter;
  const filteredItems = store.DATA.allBookmarks.filter(item => item.rating >= filterRatingsValue);
  $('.js-listOfBookmarks').html('');
  filteredItems.forEach(item => createBookmarkListHTML(item));
};

/* will listen for a selection being made in the filter list.
It will assess the value of the user's selection and change the value of filter in store.DATA. It will
then call the function to filter the list */

const handleFilterBySelectionMade = function () {
  $('.filterByRating').change(function () {
    const filterByValue = $(this).val();
    store.DATA.filter = filterByValue;
    filterBookmarkList();
  });
};
/* this will take form data and create key value pairs based on the name of the input. It will then return 
this data as a json string so that we can post it to the API server. */

function serializeJson(form) {
  const formData = new FormData(form);
  const obj = {};
  formData.forEach((val, name) => obj[name] = val);
  return JSON.stringify(obj);
}

/*this will post our new form data to the API server. It will then add the items
to store.DATA.allBookmarks. It will then filter the Bookmark list which will
access all of the bookmark objects in the store (including the new one), and generate
the html for it. */

const makePostToApi = function (newData) {
  api.postNewBookmarkToServer(newData)
    .then(res => {
      store.addItems(res);
      filterBookmarkList();
    }).catch(error => {
      store.defineErrorMessage(error);
      renderErrorMessage();
    });
};

/* Will listen for a submit in the create new Bookmark form. 
It will send the form data to the serizalizeJson function. 
It will replace the section.html('') so that the form disappears.
It will send returned data to the makePostToAPI function. 
*/

const handleCreateBookmarkSubmit = function () {
  $('.js-displayCreateBookmarkForm').on('submit', '.js-addNewBookmarkForm', function () {
    event.preventDefault();
    const formElement = $('.js-addNewBookmarkForm')[0];
    const newData = serializeJson(formElement);
    $('.js-displayCreateBookmarkForm').html('');
    makePostToApi(newData);
  });
};

/* this will listen for a submit on the cancel button. It will use jquery:
section.html(''); to remove the form from the page and return to the previous view. */

const handleCancelButtonSubmit = function () {
  $('.js-displayCreateBookmarkForm').on('reset', '.js-addNewBookmarkForm', function () {
    $('.js-displayCreateBookmarkForm').html('');
  });
};

/* This will listen for a submit on the title and rating button.
when clicked it will remove the .hidden class from the element therefore expanding the view allowing the user
to see the description and the link to the site. When clicked again it will toggle the hidden class back on
to allow it to shrink back down. */

const handleClickToExpandListElement = function () {
  $('.js-listOfBookmarks').on('submit', '.expandElementButton', function (event) {
    event.preventDefault();
    $(event.currentTarget).closest('li').children('.js-expandContent').toggleClass('hidden');
  });
};

/* This function Deletes the item from the server. It then deletes the item
from the store.DATA.bookmarks. The page is then filtered again which will remove the deleted 
item from the page */


const deleteFromServer = function (currentBookmarkId) {
  api.deleteBookmarkFromServer(currentBookmarkId)
    .then(() => {
      store.removeItems(currentBookmarkId);
      filterBookmarkList();
    }).catch(error => {
      store.defineErrorMessage(error);
      renderErrorMessage();
    });
};

/*This will listen for a submit on the delete button. When clicked it call the function that will make a call to the API
to delete the bookmark from the server. 
*/
const handleDeleteBookmarkSubmit = function () {
  $('.js-listOfBookmarks').on('submit', '.js-DeleteButton', function (event) {
    event.preventDefault();
    const currentBookmarkId = $(event.currentTarget).closest('li').attr('id');
    deleteFromServer(currentBookmarkId);
  });
};


const bindEventListeners = function () {
  handleNewBookmarkButtonSubmit();
  handleFilterBySelectionMade();
  handleCreateBookmarkSubmit();
  handleCancelButtonSubmit();
  handleClickToExpandListElement();
  handleDeleteBookmarkSubmit();
  closeErrorMessage();
};

export default {
  bindEventListeners,
  render,
};