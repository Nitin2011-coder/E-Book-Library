// Generate book cards
const bookGrid = document.querySelector('.book-grid');

books.forEach((book) => {
    const bookCard = document.createElement('div');
    bookCard.classList.add('book-card');
    bookCard.innerHTML = `
        <h2>${book.title}</h2>
        <p>by ${book.author}</p>
        <img src="${book.cover}" alt="${book.title} cover">
    `;
    bookGrid.appendChild(bookCard);
});

function searchBooks() {
  // 1. Get the search text
  let input = document.getElementById('search-input').value.toLowerCase();
 
  // 2. Get all book items
  let books = document.getElementsByClassName('book-item');

  // 3. Loop through each book
  for (let i = 0; i < books.length; i++) {
    let title = books[i].textContent.toLowerCase();
   
    // 4. If title matches search, show it. Otherwise, hide it.
    if (title.includes(input)) {
      books[i].style.display = "";
    } else {
      books[i].style.display = "none";
    }
  }
}

