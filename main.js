// Constants and Selectors
const bookForm = document.getElementById('bookForm');
const searchForm = document.getElementById('searchBook');
const incompleteBookList = document.getElementById('incompleteBookList');
const completeBookList = document.getElementById('completeBookList');

const STORAGE_KEY = 'BOOKSHELF_APP';
let books = [];

// Utility Functions
function isStorageAvailable() {
  return typeof Storage !== 'undefined';
}

function saveBooksToStorage() {
  if (isStorageAvailable()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }
}

function loadBooksFromStorage() {
  if (isStorageAvailable()) {
    const storedBooks = localStorage.getItem(STORAGE_KEY);
    if (storedBooks) {
      books = JSON.parse(storedBooks);
    }
  }
}

function generateBookId() {
  return +new Date();
}

function createBookObject(id, title, author, year, isComplete) {
  return { id, title, author, year, isComplete };
}

function findBookById(bookId) {
  return books.find(book => book.id === bookId);
}

function removeBookById(bookId) {
  books = books.filter(book => book.id !== bookId);
}

function toggleBookCompletion(bookId) {
  const book = findBookById(bookId);
  if (book) {
    book.isComplete = !book.isComplete;
    saveBooksToStorage();
  }
}

// Render Functions
function renderBooks() {
  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  books.forEach(book => {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  });
}

function createBookElement({ id, title, author, year, isComplete }) {
  const bookContainer = document.createElement('div');
  bookContainer.setAttribute('data-bookid', id);
  bookContainer.setAttribute('data-testid', 'bookItem');

  const bookTitle = document.createElement('h3');
  bookTitle.setAttribute('data-testid', 'bookItemTitle');
  bookTitle.innerText = title;

  const bookAuthor = document.createElement('p');
  bookAuthor.setAttribute('data-testid', 'bookItemAuthor');
  bookAuthor.innerText = `Penulis: ${author}`;

  const bookYear = document.createElement('p');
  bookYear.setAttribute('data-testid', 'bookItemYear');
  bookYear.innerText = `Tahun: ${year}`;

  const buttonContainer = document.createElement('div');

  const toggleButton = document.createElement('button');
  toggleButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
  toggleButton.innerText = isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
  toggleButton.addEventListener('click', () => {
    toggleBookCompletion(id);
    renderBooks();
  });

  const deleteButton = document.createElement('button');
  deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
  deleteButton.innerText = 'Hapus Buku';
  deleteButton.addEventListener('click', () => {
    removeBookById(id);
    saveBooksToStorage();
    renderBooks();
  });

  buttonContainer.appendChild(toggleButton);
  buttonContainer.appendChild(deleteButton);

  bookContainer.appendChild(bookTitle);
  bookContainer.appendChild(bookAuthor);
  bookContainer.appendChild(bookYear);
  bookContainer.appendChild(buttonContainer);

  return bookContainer;
}

// Event Listeners
bookForm.addEventListener('submit', event => {
  event.preventDefault();

  const title = document.getElementById('bookFormTitle').value;
  const author = document.getElementById('bookFormAuthor').value;
  const year = parseInt(document.getElementById('bookFormYear').value, 10);
  const isComplete = document.getElementById('bookFormIsComplete').checked;

  const newBook = createBookObject(generateBookId(), title, author, year, isComplete);
  books.push(newBook);
  saveBooksToStorage();
  renderBooks();

  bookForm.reset();
});

searchForm.addEventListener('submit', event => {
  event.preventDefault();

  const query = document.getElementById('searchBookTitle').value.toLowerCase();
  const filteredBooks = books.filter(book => book.title.toLowerCase().includes(query));

  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  filteredBooks.forEach(book => {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  });
});

// Initialize Application
loadBooksFromStorage();
renderBooks();
