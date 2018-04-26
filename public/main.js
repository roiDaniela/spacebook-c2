var STORAGE_ID = 'spacebook';
var SpacebookApp = function () {
  var posts;

  // Private methods
  /**
   * render posts to page
   * this function empties the posts div,
   * then adds each post them from the posts array
   * along with the appropriate HTML
   */
  var _renderPosts = function () {
    // variable for storing our posts div
    var $posts = $('.posts');

    $posts.empty();

    for (var i = 0; i < posts.length; i += 1) {
      var post = posts[i];
      var commentsContainer = '<div class="comments-container">' + '<ul class=comments-list></ul>' +
        '<input type="text" class="comment-name">' +
        '<button class="btn btn-sm btn-primary add-comment post-comment">Post Comment</button> </div>';

      $posts.append('<li class="post">' +
          '<a href="#" class="show-comments"><i class="right"></i></a> ' +
        post.text + '<button class="btn btn-danger btn-sm remove">X</button> ' + commentsContainer + '</li>');
    }
  }

    /**
     * update posts array from localstorage
     */
  var _getFromLocalStorage = function () {
      posts = JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
  }

  /**
   * save local posts array to localstorage
   */
  var _saveToLocalStorage = function () {
      localStorage.setItem(STORAGE_ID, JSON.stringify(posts));
  }

  /**
   * render comments to page
   * this function empties the comments div,
   * then adds each comment
   */
  var _renderComments = function () {
    //empty all the comments - from all posts!!!
    $('.comments-list').empty();

    for (var i = 0; i < posts.length; i += 1) {
      // the current post in the iteration
      var post = posts[i];

      // finding the "post" element in the page that is "equal" to the
      // current post we're iterating on
      var $post = $('.posts').find('.post').eq(i);

      // iterate through each comment in our post's comments array
      for (var j = 0; j < post.comments.length; j += 1) {
        // the current comment in the iteration
        var comment = post.comments[j];

        // append the comment to the post we wanted to comment on
        $post.find('.comments-list').append(
          '<li class="comment">' + comment.text +
          '<button class="btn btn-danger btn-sm remove-comment">X</button>' +
          '</li>'
        );
      };
    };
  };

  // Public methods
  /**
   * build a single post object and push it to array
   * @param {string} text - The text of the post.
   */
  var createPost = function (text) {
    posts.push({ text: text, comments: [] });
    _saveToLocalStorage();
    _renderPosts();
    _renderComments();
  };

  /**
   * Remove post from array
   * @param {jquery} $clickedPost - The clicked post.
   * @param {integer} index - the index of the the wanted post to remove
   */
  var removePost = function ($clickedPost, index) {
    posts.splice(index, 1);
    _saveToLocalStorage();
    $clickedPost.remove();
  };

  /**
   * Create comment and update
   * @param {string} text - The text of the post.
   * @param {integer} postIndex - The index of the new post in posts array
   */
  var createComment = function (text, postIndex) {
    var comment = { text: text };

    // pushing the comment into the correct posts array
    posts[postIndex].comments.push(comment);
    _saveToLocalStorage();
    //render comments
    _renderComments();
  };

  /**
   * Create comment and update
   * @param {jquery} $clickedComment - The wanted element
   * @param {integer} commentIndex - The index of the comment to remove.
   * @param {integer} postIndex - The index of the post to remove.
   */
  var removeComment = function ($clickedComment, commentIndex, postIndex) {
    // remove the comment from the comments array on the correct post object
    posts[postIndex].comments.splice(commentIndex, 1);
    _saveToLocalStorage();
    // removing the comment from the page
    $clickedComment.remove();
  };

  //  invoke the render method on app load
  _getFromLocalStorage();
  _renderPosts();
  _renderComments();

  return {
    createPost: createPost,
    removePost: removePost,
    createComment: createComment,
    removeComment: removeComment
  };
};

var app = SpacebookApp();

// Event Handlers

$('.add-post').on('click', function (e) {
  var text = $('#post-name').val();
  app.createPost(text);
});

$('.posts').on('click', '.remove', function () {
  var $clickedPost = $(this).closest('.post');
  var index = $clickedPost.index();

  app.removePost($clickedPost, index);
});

$('.posts').on('click', '.add-comment', function () {
  var text = $(this).siblings('.comment-name').val();
  // finding the index of the post in the page... will use it in #createComment
  var postIndex = $(this).closest('.post').index();

  app.createComment(text, postIndex);
});

$('.posts').on('click', '.remove-comment', function () {
  // the comment element that we're wanting to remove
  var $clickedComment = $(this).closest('.comment');
  // index of the comment element on the page
  var commentIndex = $clickedComment.index();
  // index of the post in the posts div that the comment belongs to
  var postIndex = $clickedComment.closest('.post').index();

  app.removeComment($clickedComment, commentIndex, postIndex);
});

$('.posts').on('click', '.show-comments', function () {
  var $clickedPost = $(this).closest('.post');
  $clickedPost.find('.comments-container').toggleClass('show');
});
