var studioid = 1788915;
var curators = ["technoboy10", "The_Grits", "4LeafClovR", "puppymk", "Malik44", "CrazyNimbus", "fmtfmtfmt2", "GreenIeaf", "st19_galla"]; //Probably more than this
var foobar;
function getLastComment(page){
  var commentList;
  //Grab
  var xml = new XMLHttpRequest();
  xml.onreadystatechange = function(){
    if (xml.readyState = 4){
      var container = document.implementation.createHTMLDocument().documentElement;
      container.innerHTML = xml.responseText;
      commentList = Array.from(container.querySelectorAll('.top-level-reply > .replies')).reverse();
    }
  }
  xml.open("GET", "https://crossorigin.me/https://scratch.mit.edu/site-api/comments/gallery/" + studioid + "/?page=" + page , false);
  xml.send(null);

  //Parse through array
  var lastReply = -1;
  for (i = 0; i < commentList.length; i++){
    var replyList = commentList[i].querySelectorAll('.reply > .comment'); //Get all comments
    for (j = 0; j < replyList.length; j++){ //go through replies
      if(curators.indexOf(replyList[j].querySelector(".info > .name > a").innerHTML) != -1){ //pick comment by a curator
        lastReply = i;

        //TODO: Check for 'added to studio' or 'added for you'
      }
    }
  }
  if (lastReply == commentList.length-1){
    return false; //All comments on page have been checked, so this should return the first comment (commentList[0]) if the next page *isn't* done
  } else {
    return commentList[lastReply+1].getAttribute('data-thread'); // last unread link
  }

}

function formatLink(lastCommentId){
  return "https://scratch.mit.edu/studios/" + studioid + "/comments/#comments-" + lastCommentId;
}

function changeLink(link){
  document.getElementById("link").href=link;
}
