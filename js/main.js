//TODO:
//no jquery
//handlebars for the insertion of table rows
$(document).ready(function() {

  var page = 1;
  var url = "https://api.github.com/search/repositories?q=language:javascript&sort=stars&order=desc&per_page=20";
  var source = $("#table-template").html();
  var template = Handlebars.compile(source);

  var makeCall = function(url) {
    $.getJSON(url, function(data) {
    var html = template(data);
    document.getElementById("table").innerHTML = html;
    }); 
  };

  //display the first page of the results
  makeCall(url);

  //add event handlers for the buttons
  document.getElementById("next").onclick=function() {
    if(page < 49) {
    page += 1;
    makeCall(url + "&page=" + page);
 $('body').animate({scrollTop:$('table').offset().top},500);
    updateCount();
    }
  }

    document.getElementById("prev").onclick=function() {
    if(page > 1) {
      page -= 1; 
      makeCall(url + "&page=" + page);
 $('body').animate({scrollTop:$('table').offset().top},500);
      updateCount();
    }
  }
  
  var updateCount = function() {
    $("#pageCount").html("Page " + page + " of 49");
  }
  
});