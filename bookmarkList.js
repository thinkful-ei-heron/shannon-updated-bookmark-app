/* Will render the main page by calling to the api server to get the list of bookmarks
and render the page with the list of bookmarks*/

const render = function() {
  console.log('render worked');
};

/*Will listen for a submit event on the new bookmark button. When clicked it will
push the form into the main html section element. This way you can still see your other 
bookmarks when creating the new bookmark. */

const handleNewBookmarkButtonSubmit = function (){
  console.log('handleNewBookmarkButtonSubmit worked');
};

/* will listen for a selection being made in the filter list.
It will assess the value of the user's selection and will only display the bookmarks 
from the server that have a rating higher than or equal to the value selected. */

const handleFilterBySelectionMade = function (){
  console.log('handleFilterBySelectionMade worked');
};

/* Will listen for a submit in the create new Bookmark form. 
It will replace the section.html('') so that the form disappears.
It will take the data and make a post call to the API to store the data to the server.
It will also call a function that updates the local store with the value of the data from the server.
*/

const handleCreateBookmarkSubmit = function (){
  console.log('handleCreateBookmarkSubmit worked');
};

/* this will listen for a submit on the cancel button. It will use jquery:
section.html(''); to remove the form from the page and return to the previous view. */

const handleCancelButtonSubmit = function (){
  console.log('handleCancelButtonSubmit worked');
};


/* This will listen for a click on the li element that contains the title and rating of the bookmark.
when clicked it will remove the .hidden class from the element therefore expanding the view allowing the user
to see the description and the link to the sit. When clicked again it will toggle the hidden class back on
to allow it to shrink back down. */

const handleClickToExpandListElement= function (){
  console.log('handleClickToExpandListElement worked');
};

/*This will listen for a submit on the delete button. When clicked it will make a call to the API
to delete the bookmark from the server. It will then do the same for the local store so that the item is removed from the list
*/

const handleDeleteBookmartSubmit = function(){
  console.log('handleDeleteBookmarkSubmit worked');
};


const bindEventListeners = function () {
  handleNewBookmarkButtonSubmit();
  handleFilterBySelectionMade();
  handleCreateBookmarkSubmit();
  handleCancelButtonSubmit();
  handleClickToExpandListElement();
  handleDeleteBookmartSubmit();
};

export default {
  bindEventListeners,
  render,
};