

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
    

      // If no books are found
      if (!books || books.length === 0) {
        numberList.innerHTML = `
            <div class="flex justify-center items-center h-screen w-full">
                <p class="text-gray-500 text-xl">No books found.</p>
            </div>
        `;
        return;
    }
    
    // Generate the HTML for each book
    const bookElements = books.map((book, index) => {
        const truncatedTitle = book.title.length > 100 ? book.title.slice(0, 70) + '...' : book.title;
       
        

        return `
        <div class="bg-white m-2 rounded-lg overflow-hidden shadow-2xl" id="book-${index}">
           <a href="bookDetails.html" >  
        <img class="h-48 w-full object-fit" src="${book.formats['image/jpeg'] || 'https://via.placeholder.com/150'}" alt="Book Image" />
        </a>
          <div class="pt-2 px-2">
            <div class='flex justify-between'>
              <p class='text-left'>ID: ${book.id}</p>
              
              <p class='text-left text-red-500 underline cursor-pointer' id="heart-${index}">
                Remove
              </p>
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
        const heartIcon = document.getElementById(`heart-${index}`);

        heartIcon.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent triggering the bookDetails click event
            toggleBookInLocalStorage(book, heartIcon);
            updateFavoriteCount();
        });

        // Book details listener
        bookDetails.addEventListener('click', () => {
            localStorage.setItem('bookDetails', JSON.stringify(book));
           
        });
    });

    
}

function toggleBookInLocalStorage(book, heartIcon) {
    let favoriteBooks = JSON.parse(localStorage.getItem('favoriteBooks')) || [];
    // Check if the book is already in favorites
    const bookIndex = favoriteBooks.findIndex(favBook => favBook.id === book.id);
    
    if (bookIndex !== -1) {
        // Remove the book from favorites
        favoriteBooks.splice(bookIndex, 1);
        localStorage.setItem('favoriteBooks', JSON.stringify(favoriteBooks));
        heartIcon.classList.remove('fas'); // Remove filled heart
        heartIcon.classList.add('far'); // Set to outline heart
    } 

    localStorage.setItem('bookDetails', JSON.stringify(book));

}
document.addEventListener('DOMContentLoaded', () => {
    updateFavoriteCount();
});


function removeWishist (){
    localStorage.setItem('favoriteBooks',[])
    displayBooks([])
}