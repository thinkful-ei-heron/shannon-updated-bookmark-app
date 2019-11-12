//const base_url = 'https://thinkful-list-api.herokuapp.com/shannon/bookmarks';
//attempting to see if this can communicate with my server without changing any current code.
//With the exception of needing to provide an api key in any request.

//refactored again to connect with heroku instead of local host .
const base_url = 'https://fast-castle-08589.herokuapp.com/api/bookmarks'; 

//const base_url= 'http://localhost:8000/api/bookmarks';

const bookmarkApiFetch = function (...request) {
  let err;
  return fetch(...request)
    .then(response => {
      if(!response.ok){
        err = { code: response.status };
        if(!response.headers.get('conent-type').includes('json')) {
          err.message = response.statusText;
          return Promise.reject(err);
        }
      }
      if(response.status === 204 ) {
        return null;
      }
      return response.json();
    })
    .then(result => {
      if (err) {
        err.message = result.message;
        return Promise.reject(err);
      }
      return result;
    });
};

//adding API KEY- the below commented out code was what i originally had used
// const getAllBookmarks = function (){
//   return bookmarkApiFetch(`${base_url}`);
// };

const getAllBookmarks = function (){
  return bookmarkApiFetch(`${base_url}`, {
    headers: {'Authorization': 'Bearer b38ef67a-061c-46d6-b68f-c256f2772d69'}
  });
};

//original:
// const postNewBookmarkToServer = function (data) {
//   return bookmarkApiFetch(`${base_url}`, {
//     method: 'POST',
//     headers:  { 'Content-Type': 'application/json' }, 
//     body: data,
//   });
// };

//new with API key header:
const postNewBookmarkToServer = function (data) {
  return bookmarkApiFetch(`${base_url}`, {
    method: 'POST',
    headers:  { 'Content-Type': 'application/json', 
      'Authorization': 'Bearer b38ef67a-061c-46d6-b68f-c256f2772d69'}, 
    body: data,
  });
};

//original:
// const deleteBookmarkFromServer = function (id){
//   return bookmarkApiFetch(`${base_url}/${id}`, {
//     method: 'DELETE',
//   });
// };

//new with API key header::
const deleteBookmarkFromServer = function (id){
  return bookmarkApiFetch(`${base_url}/${id}`, {
    method: 'DELETE',
    headers: {'Authorization': 'Bearer b38ef67a-061c-46d6-b68f-c256f2772d69'}
  });
};

export default {
  getAllBookmarks,
  postNewBookmarkToServer,
  deleteBookmarkFromServer,
};