const base_url = 'https://thinkful-list-api.herokuapp.com/shannon/bookmarks';




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



//this will be called by render to get all the data.
const getAllBookmarks = function (){
  return bookmarkApiFetch(`${base_url}`);
};




const postNewBookmarkToServer = function (data) {
  return bookmarkApiFetch(`${base_url}`, {
    method: 'POST',
    headers:  { 'Content-Type': 'application/json' }, 
    body: data,
  });
};

const deleteBookmarkFromServer = function (id){
  return bookmarkApiFetch(`${base_url}/${id}`, {
    method: 'DELETE',
  });
};

export default {
  getAllBookmarks,
  postNewBookmarkToServer,
  deleteBookmarkFromServer,
};