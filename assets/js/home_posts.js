{
	// method to submit the form data for new post using AJAX
	let createPost = function () {
		let newPostForm = $("#new-post-form");

		newPostForm.submit(function (e) {
			e.preventDefault();

			$.ajax({
				type: "post",
				url: "/posts/create",
				data: newPostForm.serialize(),
				success: function (data) {
					let newPost = newpostDom(data.data.post);
					$("#posts-list-container").prepend(newPost);
					new Noty({
						theme: "relax",
						text: "Post Published!!!",
						type: "success",
						layout: "topRight",
						timeout: 1500,
					}).show();
					deletePost($(" .delete-post-button", newPost));
				},
				error: function (error) {
					console.log(error.responseText);
				},
			});
		});
	};

	$(document).on("click", ".likeButton", async (event) => {
		const button = $(event.target);
		const postId=getPostIdfromElement(button);
		const postData=await axios.patch(`/posts/${postId}/like`);
		button.find(".like-cnt").text('('+postData.data.likes.length+')');
	});

	function getPostIdfromElement(element) {
		const isRoot = element.hasClass("post");
		const rootElement = isRoot === true ? element : element.closest(".post");
		const postId=rootElement.data().id;
		return postId;
	}

	// method to create a post in DOM
	let newpostDom = function (post) {
		return $(`<div class="post" id="post-${post._id} " data-id=${post._id}>
        <div class="d-flex justify-content-center row">
            <div class="col-md-12">
                <div class="d-flex flex-column comment-section" >
                    <div class="bg-white p-2 " >
                        <div class="d-flex flex-row user-info" style="padding-left: 10px;"><img class="rounded-circle" src="/images/sj.jpeg" width="40">
                            <div class="d-flex flex-column justify-content-start ml-2"><span class="d-block font-weight-bold name">${post.user.name}</span><span class="date text-black-50">Shared publicly - ${post.createdAt}</span></div>
                        </div>
                        <div class="mt-2" style="padding-left: 10px;">
                            <p class="comment-text">${post.content}</p>
                        </div>
                    </div>
                    <div class="bg-white">
                        <div class="d-flex flex-row fs-12" style="padding-left: 10px;">
                            <div class="like p-2 cursor likeButton"><i class="fa fa-heart"></i><span class="ml-1">Like <span class="like-cnt">(${post.likes.length})</span></span></div>
                            <div class="like p-2 cursor action-collapse" data-toggle="collapse" aria-expanded="true" aria-controls="collapse-${post._id}" href="#collapse-${post._id}"><i class="fa fa-comment"></i><span class="ml-1">Comment</span></div>
                            <!-- <div class="like p-2 cursor"><i class="fa fa-commenting-o"></i><span class="ml-1">Comment</span></div> -->
                            <div class="like p-2 cursor"><i class="fa fa-share"></i><span class="ml-1">Share</span></div>
                            
                            <div class="like p-2 cursor"><a href="/posts/destroy/${post._id}"   class="like cursor delete-post-button"><i class="fa fa-trash-alt"></i><span class="ml-1">Delete</span></a></div>
                            
                        </div>
                    </div>
                    <div class="bg-light p-2" >
                      <form action="/comments/create" id="new-comment-form" method="POST">
                        <div class="d-flex flex-row align-items-start" style="padding-left: 10px;"><img class="rounded-circle" src="/images/sj.jpeg" width="35">
                            <textarea class="form-control ml-1 shadow-none textarea" name="content" placeholder="Add a comment..." required></textarea>
                            <input type="hidden" name="post" value="${post._id}">
                        </div>
                        <div class="mt-2 text-right"><button class="btn btn-primary btn-sm shadow-none" type="submit">Post comment</button></div>
                        </form>
                        
                        <div id="collapse-${post._id}" class="bg-light p-2 collapse" data-parent="#myGroup">
                        <div id="comments-list-container">
                        </div>
                        </div>
                      </div>
                </div>
            </div>
        </div>
        <div class="col-md-12" style="background-color:navy; height: 5px;"></div>
    </div>
    `);
	};

	// method to delete a post from DOM
	let deletePost = function (deleteLink) {
		$(deleteLink).click(function (e) {
			e.preventDefault();

			$.ajax({
				type: "get",
				url: $(deleteLink).prop("href"),
				success: function (data) {
					$(`#post-${data.data.post_id}`).remove();
					new Noty({
						theme: "relax",
						text: "Post deleted!!!",
						type: "success",
						layout: "topRight",
						timeout: 1500,
					}).show();
				},
				error: function (error) {
					new Noty({
						theme: "relax",
						text: error.responseText,
						type: "error",
						layout: "topRight",
						timeout: 1500,
					}).show();
				},
			});
		});
	};

	// method to create a comment using AJAX
	let createComment = function () {
		let newCommentForm = $("#new-comment-form");

		newCommentForm.submit(function (e) {
			e.preventDefault();
			$.ajax({
				type: "post",
				url: "/comments/create",
				data: newCommentForm.serialize(),
				success: function (data) {
					let newComment = newCommentDom(data.data.comment);
					$("#comments-list-container").prepend(newComment);
					new Noty({
						theme: "relax",
						text: "Comment added!!!",
						type: "success",
						layout: "topRight",
						timeout: 1500,
					}).show();
					deleteComment($(" .delete-comment-button", newComment));
				},
				error: function (error) {
					console.log(error.responseText);
				},
			});
		});
	};

	// method to create a comment in DOM
	let newCommentDom = function (comment) {
		return $(`<div class="card p-3 mb-2" id="comment-${comment._id}">
        <div class="d-flex flex-row"> <img src="/images/sj.jpeg" height="35" width="35" class="rounded-circle" style="margin-right: 10px;">
            <div class="d-flex flex-column ms-2">
                <h6 class="mb-1 text-primary">${comment.user.name}</h6>
                <p class="comment-text">${comment.content}</p>
            </div>
        </div>
        <div class="d-flex flex-row fs-12" style="padding-left: 35px;">
                <div class="like p-2 cursor"><a href="/comments/destroy/${comment._id}"  class="like cursor delete-comment-button"><i class="fa fa-trash-alt"></i><span class="ml-1">Delete</span></a></div>
        </div>
    </div>`);
	};

	// method to delete a comment from Dom
	let deleteComment = function (deleteLink) {
		$(deleteLink).click(function (e) {
			e.preventDefault();

			$.ajax({
				type: "get",
				url: $(deleteLink).prop("href"),
				success: function (data) {
					$(`#comment-${data.data.comment_id}`).remove();
					new Noty({
						theme: "relax",
						text: "Comment deleted!!!",
						type: "success",
						layout: "topRight",
						timeout: 1500,
					}).show();
				},
				error: function (error) {
					new Noty({
						theme: "relax",
						text: error.responseText,
						type: "error",
						layout: "topRight",
						timeout: 1500,
					}).show();
				},
			});
		});
	};

	createPost();
	createComment();
}
