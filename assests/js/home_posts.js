{
    let createPost = function(){
        let newPostFrom = $('#new-post-form');

        newPostFrom.submit(function(e){
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostFrom.serialize(),
                success: function(data){
                    let newPost = newPostDom(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button', newPost));
                },
                error: function(error){
                    console.log(error.responseText); 
                }
            });
        });
    }

    // method to create a post in DOM

    let newPostDom = function(post){
        return $(`<li id="post-${post._id}">
        <p>
                <small>
                    <a class="delete-post-button" href="/posts/destroy/${post._id}">X</a>
                </small>
            ${post.content}
            <br>
            <small>
                ${post.user.name}
            </small>
            <br> 
            <div class="post-comments">
                    <form action="/comments/create" method="POST">
                        <input type="text" name="content" placeholder="Write a comment..." required>
                        <input type="hidden" name="post" value="${post._id}">
                        <input type="submit" value="Comment">
                    </form>
                <div class="post-comments-list">
                    <ul id="post-comments-${ post._id }">
                    </ul>
                </div>
            </div>
        </p>
    </li>
    `)
    }

    // method to delete a post from DOM
    let deletePost = function(deleteLink)
    {
        $(deleteLink).click(function(event)
        {
            event.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data)
                {
                    $(`#post-${data.data.post_id}`).remove();
                    new Noty
                    ({
                        theme: 'relax',
                        text: 'Post Deleted',
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();
                },
                error: function(error)
                {
                    console.log(error.responseText);
                }
            });
        });
    }
    

    createPost();
}