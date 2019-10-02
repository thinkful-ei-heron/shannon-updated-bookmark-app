import api from './api.js';
import store from './store.js';


const errorHtmlRender = function (error) {
  return `<p>Sorry, something went wrong. We have experienced the following error:<span class="errorMessage"> ${error}</span></p>
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

const createBookmarkListHTML = function (item) {
  $('.js-listOfBookmarks').append(`
  <li id= "${item.id}">
  <div class="titleAndRating">
  Title:  <span class= "js-titleSpan">${item.title}</span>
  Rating:  <span class= "js-ratingSpan">${item.rating}</span>
  </div>
  <div class= "js-expandContent hidden" aria-live='polite'>
    <form action= "${item.url}" target="_blank">
      <label for= "visitSite" class="hidden">Visit Site</label>
      <input type="submit" value="Visit Site" id= "visitSite"/>
    </form>
    <p>
      ${item.desc}
    </p>
    <form class= "js-DeleteButton">
      <button type= "submit">Delete Bookmark?</button>
    </form>
  </div>
</li>
  `);
};
//    <form class="js-EditButton">
//<button type= "submit"> Edit Bookmark?</button>
//</form>

/*
Will render the main page by calling to the api server to get the list of bookmarks
and render the page with the list of bookmarks*/

const initializeStoreBookmarkList = function () {
  api.getAllBookmarks()
    .then(data => {
      Object.assign(store.DATA.allBookmarks, data);
    })
    .then(() => store.DATA.allBookmarks.forEach(item => createBookmarkListHTML(item)))
    .catch(error => {
      store.defineErrorMessage(error);
      renderErrorMessage();
    });
};


const render = function () {
  console.log(store.DATA.filter);
  renderErrorMessage();
  $('.js-listOfBookmarks').html('');
  initializeStoreBookmarkList();
};

/*Will listen for a submit event on the new bookmark button. When clicked it will
push the form into the main html section element. This way you can still see your other 
bookmarks when creating the new bookmark. */

const handleNewBookmarkButtonSubmit = function () {
  $('.js-bookmarkTools').submit(function () {
    event.preventDefault();
    $('.js-displayCreateBookmarkForm').html(`
    <form class= js-addNewBookmarkForm>
      <fieldset class= "bookmarkDetails">
        <div>
          <label for="addNewBookmarkUrl">Add New Bookmark:</label>
          <input id= "addNewBookmarkUrl" type= url name="url" placeholder= "example: http://www.sample.com" required>
        </div>
        <div>
          <label for= "addBookmarkTitle">Name your Bookmark:</label>
          <input type= "text" id= "addBookmarkTitle" name="title" placeholder= "Site Name" required>
        </div>
        <div>
          <label for= "addBookmarkRating">Rate your Bookmark:</label>
          <select id= "addBookmarkRating" name="rating" required>
            <option selected disabled>How Many Stars?</option>
            <option value=5>5 stars</option>
            <option value=4>4 stars</option> 
            <option value=3>3 stars</option> 
            <option value=2>2 stars</option> 
            <option value=1>1 star</option> 
          </select>
        </div>
        <div>
          <label for="addBookmarkDescription">Description:</label>
          <textarea id="addBookmarkDescription" name="desc" placeholder= "Add your bookmark description here..." required></textarea>
        </div>
        <button type=submit> Create </button>
        <button type=reset>Cancel</button>
    </fieldset>
    </form>
    `);
  });
};

/* will listen for a selection being made in the filter list.
It will assess the value of the user's selection and will only display the bookmarks 
from the server that have a rating higher than or equal to the value selected. */

const filterBookmarkList = function () {
  const filterRatingsValue = store.DATA.filter;
  const filteredItems = store.DATA.allBookmarks.filter(item => item.rating >= filterRatingsValue);
  $('.js-listOfBookmarks').html('');
  filteredItems.forEach(item => createBookmarkListHTML(item));
};


const handleFilterBySelectionMade = function () {
  $('.filterByRating').change(function () {
    const filterByValue = $(this).val();
    store.DATA.filter = filterByValue;
    filterBookmarkList();
  });
};

function serializeJson(form) {
  const formData = new FormData(form);
  const obj = {};
  formData.forEach((val, name) => obj[name] = val);
  return JSON.stringify(obj);
}

/* Will listen for a submit in the create new Bookmark form. 
It will replace the section.html('') so that the form disappears.
It will take the data and make a post call to the API to store the data to the server.
It will also call a function that updates the local store with the value of the data from the server.
*/


const makePostToApi = function (newData) {
  api.postNewBookmarkToServer(newData)
    .then(res => {
      store.addItems(res);
      createBookmarkListHTML(res);
      filterBookmarkList();
    }).catch(error => {
      store.defineErrorMessage(error);
      renderErrorMessage();
    });
};

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

/* This will listen for a click on the li element that contains the title and rating of the bookmark.
when clicked it will remove the .hidden class from the element therefore expanding the view allowing the user
to see the description and the link to the sit. When clicked again it will toggle the hidden class back on
to allow it to shrink back down. */

const handleClickToExpandListElement = function () {
  $('.js-listOfBookmarks').on('click', '.titleAndRating', function (event) {
    $(event.currentTarget).closest('li').children('.js-expandContent').toggleClass('hidden');
  });
};

/*This will listen for a submit on the delete button. When clicked it will make a call to the API
to delete the bookmark from the server. It will then do the same for the local store so that the item is removed from the list
*/


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


const handleDeleteBookmarkSubmit = function () {
  $('.js-listOfBookmarks').on('submit', '.js-DeleteButton', function (event) {
    event.preventDefault();
    const currentBookmarkId = $(event.currentTarget).closest('li').attr('id');
    deleteFromServer(currentBookmarkId);
  });
};


// const handleEditBookmarkSubmit = function (){
//   $('.js-listOfBookmarks').on('submit', '.js-EditButton', function(event){
//     event.preventDefault();
//     $(event.currentTarget).parent('li').children('.js-titleSpan').html(`
//     <input type=text>`);
  
//   })
// }


const bindEventListeners = function () {
  handleNewBookmarkButtonSubmit();
  handleFilterBySelectionMade();
  handleCreateBookmarkSubmit();
  handleCancelButtonSubmit();
  handleClickToExpandListElement();
  handleDeleteBookmarkSubmit();
  //handleEditBookmarkSubmit();
  closeErrorMessage();
};

export default {
  bindEventListeners,
  render,
};