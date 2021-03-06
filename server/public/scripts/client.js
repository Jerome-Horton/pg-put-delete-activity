$(document).ready(function(){
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);
  $('#bookShelf').on('click', '.deleteBtn', deleteBooks); // Created click listeners for deleteBtn.
  $('#bookShelf').on('click', '.isReadBtn', booksRead);   // Created click listeners for isReadbtn.
}

function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  addBook(book);
}

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
    }).then(function(response) {
      console.log('Response from server.', response);
      refreshBooks();
    }).catch(function(error) {
      console.log('Error in POST', error)
      alert('Unable to add book at this time. Please try again later.');
    });
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books'
  }).then(function(response) {
    console.log(response);
    renderBooks(response);
  }).catch(function(error){
    console.log('error in GET', error);
  });
}


// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();

  for(let i = 0; i < books.length; i += 1) {
    let book = books[i];
    // For each book, append a new row to our table
    $('#bookShelf').append(`
      <tr>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isRead}</td>
        <td><button class="deleteBtn" data-id="${book.id}">Delete</button></td>
        <td><button class="isReadBtn" data-id="${book.id}" data-read="${book.isRead}">Mark As Read</button></td> 
      </tr>
    `);
    // Line 67, need to pass button data for req.body of the "PUT"
    // Line 66, need to pass button data for req.body of the "DELETE"
  }
}

function deleteBooks() {
  const booksIdToDelete = $(this).data('id');
  console.log('bookid = ', booksIdToDelete);
  $.ajax({
    type: 'DELETE',
    url: `/books/${booksIdToDelete}`
  }).then((response) => {
    console.log(response);
    refreshBooks();
  })
};

function booksRead() {
  const booksIdToMark = $(this).data('id');
  const booksIsRead = $(this).data('read');
  console.log('bookIdToMark', booksIdToMark);
  console.log('bookIsRead', booksIsRead);

  $.ajax({
    type: 'PUT',
    url: `/books/${booksIdToMark}`,
    data:{isRead: booksIsRead}// needs data object // The server will repackage this as req.body.
  }).then((res) => {
    refreshBooks();
  }).catch((err) => {
    console.error(err);
  })
}
