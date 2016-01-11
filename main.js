var studioid = 1788915;

getLastComment();

function getLastComment(){
  changeLink(formatLink(18200431)); //filler comment id, just a test
}

function formatLink(lastCommentId){
  return "scratch.mit.edu/studios/" + studioid + "/comments/#comments-" + lastCommentId; 
}

function changeLink(link){
  document.getElementById("link").href=link;
}
