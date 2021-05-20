
// opens ham
$("body").attr("class", "static-bg");
$(".sidenav").sidenav();
$('.tap-target').tapTarget();
let storedTitles = "";
  function displayBookmarks() {

    if (JSON.parse(localStorage.getItem("showTitle")) !== null){
    storedTitles = JSON.parse(localStorage.getItem("showTitle"));

    for (let i = 0; i < storedTitles.length; i++) {
      let titleLi = $("<li class='collection-item'>");
      titleLi.text(storedTitles[i]);
      $("#stored-titles").append(titleLi);
    }
    if (storedTitles !== "") {
      $("#stored-titles").attr("class", "collection")
    }
  }
  }

displayBookmarks();



