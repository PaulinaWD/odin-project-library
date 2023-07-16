const newBookBtn = document.getElementById("btn-new-book");
const newForm = document.querySelector(".add-book-modal");
const overlay = document.querySelector(".add-book-overlay");
const form = document.querySelector(".add-book-form-content");
const closeModal = document.querySelector(".close-modal");
const libraryGrid = document.querySelector(".library-grid");

// ----------- Show Add New Book Modal ------------- //

const newBook = newBookBtn.addEventListener("click", function () {
  newForm.classList.remove("hidden");
  overlay.classList.remove("hidden");

  closeModal.addEventListener("click", closeAddBookModal);

  overlay.addEventListener("click", closeAddBookModal);
});

// ----------- Close New Book Modal ------------- //

const closeAddBookModal = function () {
  form.reset();
  newForm.classList.add("hidden");
  overlay.classList.add("hidden");
};

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeAddBookModal();
  }
});

// ----------- Book & Library Constructors ------------- //

class Book {
  constructor(
    bookName = "Unknown",
    bookAuthor = "Unknown",
    pagesNumber = "0",
    finished = false
  ) {
    this.bookName = bookName;
    this.bookAuthor = bookAuthor;
    this.pagesNumber = pagesNumber;
    this.finished = finished;
  }
}

class Library {
  constructor() {
    this.books = [];
  }

  addBook(newBook) {
    if (!this.isInLibrary(newBook)) {
      this.books.push(newBook);
    }
  }

  isInLibrary(newBook) {
    return this.books.some((book) => book.bookName === newBook.bookName);
  }

  removeBookfromLibrary(bookName) {
    this.books = this.books.filter((book) => book.bookName !== bookName);
  }

  getBook(bookName) {
    return this.books.find((book) => book.bookName === bookName);
  }

  changeStatus(bookName) {
    let book = this.getBook(bookName);
    if (book.finished === false) {
      book.finished = true;
    } else {
      book.finished = false;
    }
  }
}

const library = new Library();

// ----------- Update Library Grid ------------- //

const updateBooksGrid = function () {
  resetLibraryGrid();
  for (let book of library.books) {
    createBookCard(book);
  }
};

const resetLibraryGrid = function () {
  libraryGrid.innerHTML = "";
};

// -----------  Create New Book Card ------------- //

const createBookCard = (book) => {
  const bookCard = document.createElement("div");
  const bookImage = document.createElement("img");
  const bookDetails = document.createElement("div");
  const removeBook = document.createElement("div");
  const bookName = document.createElement("p");
  const bookAuthor = document.createElement("p");
  const pagesNumber = document.createElement("p");
  const toggleBtn = document.createElement("input");
  const switchButton = document.createElement("label");
  const fbtn = document.createElement("div");

  removeBook.innerHTML = "&times;";

  bookCard.classList.add("book-card");
  bookImage.classList.add("book-image");
  bookDetails.classList.add("book-details-container");
  removeBook.classList.add("remove-book");
  bookName.classList.add("book-title");
  bookAuthor.classList.add("book-author");
  pagesNumber.classList.add("number-of-pages");
  toggleBtn.classList.add("read-toggle");
  switchButton.classList.add("switch");
  switchButton.setAttribute("for", `switch${book.bookName}`);
  toggleBtn.setAttribute("id", `switch${book.bookName}`);
  toggleBtn.setAttribute("type", "checkbox");
  fbtn.classList.add("fbtn");

  if (book.finished) {
    toggleBtn.checked = true;
  } else {
    toggleBtn.checked = false;
  }

  bookImage.src = `/assets/book1.jpg`;

  bookName.textContent = `${book.bookName}`;
  bookAuthor.textContent = `${book.bookAuthor}`;
  pagesNumber.textContent = `${book.pagesNumber}`;

  bookDetails.appendChild(bookName);
  bookDetails.appendChild(bookAuthor);
  bookDetails.appendChild(pagesNumber);
  bookDetails.appendChild(fbtn);
  bookDetails.appendChild(toggleBtn);
  bookDetails.appendChild(switchButton);
  bookCard.appendChild(removeBook);
  bookCard.appendChild(bookImage);
  bookCard.appendChild(bookDetails);
  libraryGrid.appendChild(bookCard);
};

// -----------  Clear User Input ------------- //

// -----------  Add New Book From User Input ------------- //

const addBookfromInput = function () {
  let bookName = document.getElementById("book_name").value;
  let bookAuthor = document.getElementById("book_author").value;
  let pagesNumber = document.getElementById("pages_number").value;
  let finished = document.getElementById("finished").checked;
  if (bookAuthor === "") {
    bookAuthor = undefined;
  }
  if (bookName === "") {
    bookName = undefined;
  }
  if (pagesNumber === "") {
    pagesNumber = undefined;
  }

  return new Book(bookName, bookAuthor, pagesNumber, finished);
};

const addBook = function (e) {
  e.preventDefault();
  const newBook = addBookfromInput();
  if (library.isInLibrary(newBook)) {
    errorMsg.textContent = "This book already exists";
    errorMsg.classList.add("active");
    return;
  }
  library.addBook(newBook);
  updateBooksGrid();
  closeAddBookModal();
};

form.addEventListener("submit", addBook);

// -----------  Remove Book from Library ------------- //

const removeBookfromLibraryGrid = function (e) {
  const removeBook = document.querySelectorAll(".remove-book");
  removeBook.forEach((book) => {
    if (e.target === book) {
      //Remove Book from Library
      const bookName = e.target.parentNode.children[2].firstChild.textContent;
      library.removeBookfromLibrary(bookName);
      //Remove Book from DOM
      e.target.parentNode.parentNode.removeChild(e.target.parentNode);
    }
  });
};

libraryGrid.addEventListener("click", removeBookfromLibraryGrid);

// ---- Toggle Finished Status ---- //

const toggleBtn = function (e) {
  const bookName = e.target.parentNode.firstChild.textContent;
  library.changeStatus(bookName);
};

libraryGrid.addEventListener("change", toggleBtn);
