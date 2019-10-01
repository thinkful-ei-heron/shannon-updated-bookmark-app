import bookmarkList from './bookmarkList.js';


const main = function() {
  bookmarkList.bindEventListeners();
  bookmarkList.render();
};


$(main);


