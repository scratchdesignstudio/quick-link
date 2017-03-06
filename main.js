var backupID = 3479432;
var backupCurators = ["technoboy10*", "The_Grits", "4LeafClovR", "puppymk", "Malik44", "CrazyNimbus", "fmtfmtfmt2", "GreenIeaf", "st19_galla", "joletole", "Hamish752", "Abstract-", "getbent", "Ionosphere", "Thinking_Upward", "PackersRuleGoPack", "Csoup", "coke11", "Thomas1-1", "-NinjaNarwhal-", "BY147258369", "-MidnightStudios", "samirathecatlol", "mundofinkyenglish", "natalie*", "ceebee*", "speakvisually*"];

function getID() {
    return axios.get('https://api.scratch.mit.edu/proxy/featured')
    .then(function (response) {
        return response.data.scratch_design_studio[0].gallery_id;
    })
    .catch(function (error) {
        return backupID;
    });
}

function getPeople(type, idPromise) { // "curators" or "owners" (managers)
    return idPromise().then(function (id) {
        console.log(id);
        return axios.get("https://crossorigin.me/https://scratch.mit.edu/site-api/users/" + type + "-in/" + id + "/1/", {responseType: 'document'})
            .then(function(response) {
                return parsePeople(response.data);
            });
    });
}

function parsePeople(page) {
    return Array.from(page.querySelectorAll('li > .avatar > .title > a')).map(
      function(person){
        return person.innerHTML;
      }
    )
}

function nextLink(id, curators, page, count, previous) {
    if (id) {
        console.log(page);
        return axios.get("https://crossorigin.me/https://scratch.mit.edu/site-api/comments/gallery/" + id, {responseType: 'document', params: {page: page}}).then(function (response) {
            result = parseComments(id, curators, response.data, count);
            if (result[0]) { // There's more comments to find!
                return nextLink(id, curators, ++page, result[1], result);
            } else {
                console.log(previous);
                return previous;
            }
        });
    } else {
        return [0, 0];
    }
}

function parseComments(id, curators, doc, currentCount) {
    var commentList = Array.from(doc.querySelectorAll('.top-level-reply')).reverse().filter( //Get only comments with links in them
      function(comment){
        var c = comment.querySelector(".comment > .info > .content");
        if (c){
          return c.innerHTML.match(/projects\/[0-9]+/) != null;
        }
      }
    ).map(
      function(comment){
        return comment.querySelector('.replies');
      }
    )

    //Parse through array
    var tempCount = commentList.length;
    var lastReply = -1;
    for (i = 0; i < commentList.length; i++){
      var replyList = commentList[i].querySelectorAll('.reply > .comment'); //Get all comments
      for (j = 0; j < replyList.length; j++){ //go through replies
        if(curators.indexOf(replyList[j].querySelector(".info > .name > a").innerHTML) != -1){ //pick comment by a curator
          lastReply = i;
          tempCount--;
          break;
        }
      }
    }
    if (lastReply == commentList.length-1){
      return [false, currentCount]; //All comments on page have been checked, so this should return the first comment of the next page (commentList[0]) if the next page *isn't* done
    } else {
      return [formatLink(id, commentList[lastReply+1].getAttribute('data-thread')), currentCount += tempCount]; // last unread link
    }
}

function formatLink(id, lastCommentId){
  return "https://scratch.mit.edu/studios/" + id + "/comments/#comments-" + lastCommentId;
}

function changeLink(link){
  document.getElementById("link").href=link;
}

function changeCount(count){
  document.getElementById("projectcount").innerHTML = count + " projects left to review!";
}

axios.all([getID(), getPeople('owners', getID), getPeople('curators', getID)])
    .then(function(info) {
        document.getElementById("projectcount").innerHTML = "Loading latest data...";
        id = info[0];
        nextLink(info[0], info[1].concat(info[2]), 1, 0, ["https://scratch.mit.edu/studios/" + info[0], 0]).then(function (result) {
            changeLink(result[0]);
            changeCount(result[1]);
        });
    });
