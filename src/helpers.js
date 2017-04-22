STORAGEKEY = "SmallWorld";

var setCurrency = function(n) {
  window.localStorage.setItem(STORAGEKEY, n);  
}

var modifyCurrency = function(n) {
  window.localStorage.setItem(STORAGEKEY,
    n + parseInt(window.localStorage.getItem(STORAGEKEY))
  )
}

var getCurrency = function() {
  return parseInt(window.localStorage.getItem(STORAGEKEY));
}
