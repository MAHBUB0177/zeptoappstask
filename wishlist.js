

function updateFavoriteCount() {
    const favoriteBooks = JSON.parse(localStorage.getItem('favoriteBooks')) || [];
    const favoriteCountElement = document.getElementById('favorite-count');
    displayBooks(favoriteBooks)
    
    // Update the badge with the number of favorite books
    const count = favoriteBooks.length;
    favoriteCountElement.textContent = count;

    // Show or hide the badge based on whether there are any favorites
    if (count > 0) {
        favoriteCountElement.classList.remove('hidden'); // Show the badge
    } else {
        favoriteCountElement.classList.add('hidden'); // Hide the badge
    }
}

function displayBooks(books) {
    const numberList = document.getElementById('numberList');
    if (!books || books.length === 0) {
        numberList.innerHTML = '<p class="text-gray-500">No books found.</p>';
        return;
    }
   
    // Generate the HTML for each book
    const bookElements = books.map((book, index) => {
        const truncatedTitle = book.title.length > 100 ? book.title.slice(0, 70) + '...' : book.title;
        // Check if the current book is in favorites to set the heart icon accordingly
      

        return `
        <div class="bg-white m-2 rounded-lg overflow-hidden shadow-2xl" id="book-${index}">
           <a href="bookDetails.html" >  
        <img class="h-48 w-full object-fit" src="${book.formats['image/jpeg'] || 'https://via.placeholder.com/150'}" alt="Book Image" />
        </a>
          <div class="pt-2 px-2">
            <div class='flex justify-between'>
              <p class='text-left'>ID: ${book.id}</p>
             
            </div>
            <p class='text-left'>${truncatedTitle}</p>
            <p class='text-left'>${book.authors[0]?.name}</p>
            <p class='text-left'>Genre</p>
          </div>
        </div>`;
    }).join('');

    numberList.innerHTML = bookElements; // Render the books in the grid

    books.forEach((book, index) => {
        const bookDetails = document.getElementById(`book-${index}`);
        // Book details listener
        bookDetails.addEventListener('click', () => {
            localStorage.setItem('bookDetails', JSON.stringify(book));
        });
    });

    
}
document.addEventListener('DOMContentLoaded', () => {
    updateFavoriteCount();
});
