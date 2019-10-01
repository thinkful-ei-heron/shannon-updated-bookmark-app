const base_url = 'https://thinkful-list-api.herokuapp.com/shannon/bookmarks';

//this will be called by render to get all the data.
const getAllBookmarks = function (){
  return fetch(`${base_url}`);
};


const postNewBookmarkToServer = function (data) {
  return fetch(`${base_url}`, {
    method: 'POST',
    headers:  { 'Content-Type': 'application/json' }, 
    body: data,
  });
};

const deleteBookmarkFromServer = function (id){
  return fetch(`${base_url}/${id}`, {
    method: 'DELETE',
  });
};

export default {
  getAllBookmarks,
  postNewBookmarkToServer,
  deleteBookmarkFromServer,
};