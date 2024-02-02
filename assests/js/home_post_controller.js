// This class would be initialized for every post on the page
// 1. When the page loads
// 2. Creation of every post dynamically via AJAX

class PostComments {
  // Constructor is used to initialize the instance of the class whenever a new instance is created
  constructor(postId) {
    this.postId = postId;
    this.postContainer = $(`#post-${postId}`);
    this.newCommentForm = $(`#post-${postId}-comments-form`);

    this.createComment(postId);

    let self = this;
    // Call for all the existing comments
    $(" .delete-comment-button", this.postContainer).each(function () {
      self.deleteComment($(this));
    });
  }

  createComment(postId) {
    let pSelf = this;
    this.newCommentForm.submit(function (e) {
      e.preventDefault();
      let self = this;
      $.ajax({
        type: "post",
        url: "/comments/create",
        data: $(self).serialize(),
        success: function (data) {
          let comment = data.data.comment;
          const newComment = pSelf.createCommentDom(comment);
          $(`#post-comments-${postId}`).prepend(newComment);
          pSelf.deleteComment($(" .delete-comment-button", newComment));
          new ToggleLike($(" .toggle-like-button", newComment));
          $(`#post-${postId}-comments-form>input`).val("");
          new Noty({
            theme: "relax",
            text: "Comment published!",
            type: "success",
            layout: "topRight",
            timeout: 1500,
          }).show();
        },
        error: function (err) {
          console.log(err.responseText);
        },
      });
    });
  }

  createCommentDom(comment) {
    return $(`<li id="comment-${comment._id}">
      <p>
        <small>
          <a class="delete-comment-button" href="/comments/destroy/${comment._id}">X</a>
        </small>
        ${comment.content}
        <br />
        <small> Comment from: ${comment.user.name} </small>
        <br />
        <small>
          <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${comment._id}&type=Comment">
            0 Likes
          </a>
        </small>
      </p>
    </li>`);
  }

  deleteComment(deleteLink) {
    $(deleteLink).click(function (e) {
      e.preventDefault();
      $.ajax({
        type: "get",
        url: $(deleteLink).prop("href"),
        success: function (data) {
          $(`#comment-${data.data.comment_id}`).remove();
          new Noty({
            theme: "relax",
            text: "Comment Deleted",
            type: "success",
            layout: "topRight",
            timeout: 1500,
          }).show();
        },
        error: function (err) {
          console.log(err.responseText);
        },
      });
    });
  }
}
