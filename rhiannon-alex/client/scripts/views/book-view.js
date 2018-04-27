'use strict';
var app = app || {};

(function (module) {
  $('.icon-menu').on('click', function (event) {
    $('.nav-menu').slideToggle(350);
  })

  function resetView() {
    $('.container').hide();
    $('.nav-menu').slideUp(350);
  }

  const bookView = {};

  bookView.initIndexPage = function (ctx, next) {
    console.log('app', app)
    console.log('app Book', app.Book)
    console.log('app Book All', app.Book.all)
    console.log('app Book Create', app.Book.create)
    resetView();
    $('.book-view').show();
    $('#book-list').empty();
    module.Book.all.forEach(book => $('#book-list').append(book.toHtml()));
    next()
  }

  bookView.initDetailPage = function (ctx, next) {
    resetView();
    $('.detail-view').show();
    $('.book-detail').empty();
    let template = Handlebars.compile($('#book-detail-template').text());
    $('.book-detail').append(template(ctx.book));

    $('#update-btn').on('click', function () {
      page(`/books/${$(this).data('id')}/update`);
    });

    $('#delete-btn').on('click', function () {
      module.Book.destroy($(this).data('id'));
    });
    next()
  }

  bookView.initCreateFormPage = function () {
    resetView();
    $('.create-view').show();
    $('#create-form').on('submit', function (event) {
      event.preventDefault();

      let book = {
        title: event.target.title.value,
        author: event.target.author.value,
        isbn: event.target.isbn.value,
        image_url: event.target.image_url.value,
        description: event.target.description.value,
      };

      module.Book.create(book);
    })
  }

  bookView.initUpdateFormPage = function (ctx) {
    resetView();
    $('.update-view').show()
    $('#update-form input[name="title"]').val(ctx.book.title);
    $('#update-form input[name="author"]').val(ctx.book.author);
    $('#update-form input[name="isbn"]').val(ctx.book.isbn);
    $('#update-form input[name="image_url"]').val(ctx.book.image_url);
    $('#update-form textarea[name="description"]').val(ctx.book.description);

    $('#update-form').on('submit', function (event) {
      event.preventDefault();

      let book = {
        book_id: ctx.book.book_id,
        title: event.target.title.value,
        author: event.target.author.value,
        isbn: event.target.isbn.value,
        image_url: event.target.image_url.value,
        description: event.target.description.value,
      };

      module.Book.update(book, book.book_id);
    })
  };

  // COMMENT: What is the purpose of this method?
  // initializes the search form of the page
  bookView.initSearchFormPage = function () {
    resetView();
    $('.search-view').show();
    $('#search-form').on('submit', function (event) {
      // COMMENT: What default behavior is being prevented here?
      // AUTO RELOAD OF THE BLOODY PAGE, NO MORE
      event.preventDefault();

      // COMMENT: What is the event.target, below? What will happen if the user does not provide the information needed for the title, author, or isbn properties?
      // event.target is the form, just a object representing the form. then all props of book will be empty strings, if the user does not provide the info.
      let book = {
        title: event.target.title.value || '',
        author: event.target.author.value || '',
        isbn: event.target.isbn.value || '',
      };

      module.Book.find(book, bookView.initSearchResultsPage);

      // COMMENT: Why are these values set to an empty string?
      // to fit with the above object form thing. 
      event.target.title.value = '';
      event.target.author.value = '';
      event.target.isbn.value = '';
    })
  }

  // COMMENT: What is the purpose of this method?
  // to give the user the stuff that they were hoping for when the form was filled.
  bookView.initSearchResultsPage = function () {
    resetView();
    $('.search-results').show();
    $('#search-list').empty();

    // COMMENT: Explain how the .forEach() method is being used below.
    // appending all the books to the html. oh, and including a button or two.
    module.Book.all.forEach(book => $('#search-list').append(book.toHtml()));
    $('.detail-button a').text('Add to list').attr('href', '/');
    $('.detail-button').on('click', function (e) {
      // COMMENT: Explain the following line of code.
      // to be honest, this looks like something john would call cute. 
      // we found the book element in question, went up 3 parents from it, aand got the book with the same book id as ^^this^^
      module.Book.findOne($(this).parent().parent().parent().data('bookid'))
    });
  }

  module.bookView = bookView;
})(app)

