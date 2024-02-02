{
  let makeFriend = function () {
    let toggleFriend = $("#toggle-friend");
    toggleFriend.click(function (e) {
      e.preventDefault();
      $.ajax({
        type: "POST",
        url: $(toggleFriend).attr("href"),
      })
        .done(function (data) {
          if (data.data.deleted == false) red();
          else green();
        })
        .fail(function (errData) {
          console.log("error in completing the request");
        });
    });
  };

  let green = function () {
    let friendStyle = document.getElementById("friend-style");
    let toggleFriend = document.getElementById("toggle-friend");
    toggleFriend.innerText = "Add Friend";
  };

  let red = function () {
    let friendStyle = document.getElementById("friend-style");
    let toggleFriend = document.getElementById("toggle-friend");
    toggleFriend.innerText = "Remove Friend";
    friendStyle.style.color = "white";
  };

  makeFriend();
}
