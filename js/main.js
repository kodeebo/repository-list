document.addEventListener('DOMContentLoaded', function() {

  /**
   * variable to track current page
   */
  var page = 1;

  /**
   * API URL with 20 results pr page
   */
  var url = "https://api.github.com/search/repositories?q=language:javascript&sort=stars&order=desc&per_page=20";

  /**
   * compile the handlebars template
   */
  var source = document.getElementById("table-template").innerHTML;
  var template = Handlebars.compile(source);
  
  /**
   * reusable function to make a XMLrequest and execute a callback
   */
  var getJSON = function(url, onSuccess, onError) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200) {
          /**
           * check if a callback function is provided and valid
           */
          if (typeof onSuccess == "function") {
            /*
             ** convert result to javascript
             */
            var data;
            try {
              data = JSON.parse(request.responseText);
            } catch (err) {
              return onError(err);
            }
            /**
             * run the callback
             */
            onSuccess(data);
          }
        } else {
          return onError("Request failed with status: " + request.status);
        }
      }
    };
    request.open('GET', url, true);
    request.send();
  };

/**
 * Function to run when successfully loaded data
 */
  var handleResults = function(json) {
    /**
     * give the response as context for the handlebars template
     */
    var html = template(json);
    /**
     * add the generated html to the DOM
     */
    updateTable(html);
    /**
     * Update the page counter and scroll to top of page
     */
    updateCount();
    window.scrollTo(0, 0);
  } 

/**
 * Function to run if there is errors when loading the data
 */
  var handleErrors = function(err) {
    console.log("Failed with error: " + err);
  }

  /**
   * Helper function to update the table contents
   */
  var updateTable = function(html) {
    document.getElementById("table").innerHTML = html;
  }

  /**
   * Helper function to update the pagination text
   */
  var updateCount = function() {
    document.getElementById("pageCount").innerHTML = "Page " + page + " of 49";
  }

  /**
   * Helper function to create a paged URL
   */
  var getPageUrl = function(url, page) {
    return url + "&page=" + page;
  }

/**
 * Eventhandlers to update page number and reload table
 */
  document.getElementById("next").onclick = function() {
    if (page < 49) {
      page += 1;
      getJSON(getPageUrl(url, page), handleResults, handleErrors);
    }
  }

  document.getElementById("prev").onclick = function() {
    if (page > 1) {
      page -= 1;
      getJSON(getPageUrl(url, page), handleResults, handleErrors);
    }
  }

  /**
   * display the first page of the results
   */
  getJSON(getPageUrl(url, page), handleResults, handleErrors);
});