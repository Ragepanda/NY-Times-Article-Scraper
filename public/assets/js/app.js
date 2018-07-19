
$(document).ready(function () {

  var articleContainer = $(".article-container");
  $(document).on("click", ".btn.save", handleArticleSave);
  $(document).on("click", ".scrape-new", handleArticleScrape);
  $(document).on("click", ".note-submit", handleArticleNote);
  $(".clear").on("click", handleArticleClear);
  $(document).on("click", ".delete-note", handleNoteDelete);

  function handleNoteDelete(){
    var noteToDelete = $(this).parents("li").data();
    console.log(noteToDelete);

    $.ajax({
      method: "DELETE",
      url: "/api/note/" + noteToDelete._id,
    }).then(function(response){
      location.reload();
    })
  }


  function handleArticleNote() {
    var noteToSave = $(this).parents("form").children(".note-field").val();
    var articleId = $(this).parents(".card").data();

    console.log(
      `
      Note Contents: ${noteToSave}
      Article ID: ${articleId._id}
      `      
    );

    $.ajax({
      method: "PUT",
      url: "/api/note/" + articleId._id,
      data: {body: noteToSave}
    }).then(function(response){
      console.log(response);
      location.reload();
    })


  }

  function handleArticleSave() {
    // This function is triggered when the user wants to save an article
    // When we rendered the article initially, we attached a javascript object containing the headline id
    // to the element using the .data method. Here we retrieve that.
    var articleToSave = $(this)
      .parents(".card")
      .data();

    // Remove card from page
    $(this)
      .parents(".card")
      .remove();

    articleToSave.saved = true;
    // Using a patch method to be semantic since this is an update to an existing record in our collection
    $.ajax({
      method: "PUT",
      url: "/api/save/" + articleToSave._id,
      data: articleToSave
    }).then(function (data) {
      // If the data was saved successfully
      if (data.saved) {
        // Run the initPage function again. This will reload the entire list of articles
        location.reload();
      }
    });
  }

  function handleArticleScrape() {
    $.get("/api/fetch").then(function (data) {
      $(".caption").html("<div id='loader'></div>");
      setTimeout(function(){ location.reload() }, 8000);
      
    });
  }

  function handleArticleClear() {
    $.ajax({
      method: "DELETE",
      url: "/api/clear",
    }).then(function () {
      articleContainer.empty();
      location.reload();
    });
  }
});
