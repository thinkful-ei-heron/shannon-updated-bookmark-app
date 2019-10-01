const allBookmarks = [];

const addItems = function (data){
  //console.log(data);
  this.allBookmarks.push(data);
  //console.log(allBookmarks);
};

const removeItems = function(itemId) {
  const currentItem = allBookmarks.find(objects => objects.id === itemId);
  const position = allBookmarks.indexOf(currentItem);
  allBookmarks.splice(position,1);
};

export default {
  allBookmarks,
  addItems,
  removeItems,
};