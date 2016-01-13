var studioid = 1788915;

function getLastComment(page){
  var replyList;
  //Grab
  var xml = new XMLHttpRequest();
  xml.onreadystatechange = function(){
    if (xml.readyState = 4){
      var container = document.implementation.createHTMLDocument().documentElement;
      container.innerHTML = xml.responseText;
      replyList = container.querySelectorAll('.top-level-reply > .replies');
    }
  }
  xml.open("GET", "https://crossorigin.me/https://scratch.mit.edu/site-api/comments/gallery/" + studioid + "/?page=" + page , false);
  xml.send(null);

  //Parse through array
  for (i = 0; i < replyList.length; i++){
    var commentList = replyList[i].querySelectorAll('.reply > .comment'); //Get all comments
    for (j = 0; j < commentList.length; j++){
      if(commentList[j].querySelector(".info > .name > a").innerHTML == "technoboy10"){ //pick comment by me
        console.log(commentList[j].querySelector('.info > .content').textContent); //log comment
      }
    }
  }

}

function formatLink(lastCommentId){
  return "https://scratch.mit.edu/studios/" + studioid + "/comments/#comments-" + lastCommentId;
}

function changeLink(link){
  document.getElementById("link").href=link;
}
