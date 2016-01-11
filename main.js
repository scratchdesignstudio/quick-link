var studioid = 1788915;

function getLastComment(){
  
}

function formatLink(lastCommentId){
  return "scratch.mit.edu/studios/" + studioid + "/comments/#comments-" + lastCommentId; 
}

function changeLink(link){
  document.getElementById("link").href=link;
}
