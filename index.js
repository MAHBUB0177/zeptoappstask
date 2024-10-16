let allBooks = []; // Store all fetched books
let currentPage = 1; // Start on the first page
let totalPages = 0; // Total number of pages
let nextPageUrl = null; // URL for the next page
let previousPageUrl = null; // URL for the previous page






async function fetchBooks(url = `https://gutendex.com/books/?page=1`) {
    try {
        const loader = document.getElementById('loader'); // Show loader while fetching data
        const numberList = document.getElementById('numberList');
        const pagination = document.getElementById('paginationContainer'); 

        // Clear previous book data and show loader
        numberList.innerHTML = ''; // Clear previous content
        loader.style.display = 'block';
        pagination.style.display = 'none';

        const response = await fetch(url); // Fetch data from API
        const data = await response.json();
        
        loader.style.display = 'none'; 
        pagination.style.display = 'block';// Hide loader after data is fetched

        // Extract the current page from the URL or default to 1
        const urlParams = new URLSearchParams(url.split('?')[1]);
        currentPage = parseInt(urlParams.get('page')) || 1;
        
        allBooks = data.results;
        nextPageUrl = data.next; // URL for the next page
        previousPageUrl = data.previous; // URL for the previous page
        totalPages = Math.ceil(data.count / 32); // Assuming 32 items per page
        displayBooks(allBooks);

        const allSubjects = allBooks.flatMap(book => book.subjects);
        Genre = [...new Set(allSubjects)];

        // Populate the genre dropdown
        const genreSelect = document.getElementById('genreSelect');
        Genre.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            genreSelect.appendChild(option);
        });
        updatePaginationButtons(); // Update pagination buttons based on the current state
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('numberList').innerHTML = '<p class="text-red-600">Error loading books. Please try again later.</p>';
    }
}




// Function to toggle book in local storage

function displayBooks(books) {
    const numberList = document.getElementById('numberList');
    if (!books || books.length === 0) {
        numberList.innerHTML = '<div class="flex justify-center items-center  w-full text-gray-500">No books found.</div>';
        return;
    }

    let favoriteBooks = JSON.parse(localStorage.getItem('favoriteBooks')) || [];
    
    // Generate the HTML for each book
    const bookElements = books.map((book, index) => {
        const truncatedTitle = book.title.length > 100 ? book.title.slice(0, 70) + '...' : book.title;
        const isFavorite = favoriteBooks.some(favBook => favBook.id === book.id);
        const heartIconClass = isFavorite ? 'fas' : 'far'; // 'fas' for filled heart, 'far' for outline heart

        return `
        <div class="bg-white m-2 rounded-lg overflow-hidden shadow-2xl" id="book-${index}">
           <a href="bookDetails.html" >  
        <img class="h-48 w-full object-fit" src="${book.formats['image/jpeg'] || 'https://via.placeholder.com/150'}" alt="Book Image" />
      </a>
        <div class="pt-2 px-2">
            <div class='flex justify-between'>
              <p class='text-left'>ID: ${book.id}</p>
              <p class='text-left text-red-500'>
                <i class="${heartIconClass} fa-heart cursor-pointer" id="heart-${index}"></i>
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
            // Optionally, redirect to a book details page or update the UI
            // window.location.href = '/book-details.html'; // Uncomment this if you have a separate book details page
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
    } else {
        // Add the book to favorites
        favoriteBooks.push(book);
        localStorage.setItem('favoriteBooks', JSON.stringify(favoriteBooks));
        heartIcon.classList.remove('far'); // Remove outline heart
        heartIcon.classList.add('fas'); // Set to filled heart
    }

    localStorage.setItem('bookDetails', JSON.stringify(book));



}


   // Function to update the favorite count badge
   function updateFavoriteCount() {
    const favoriteBooks = JSON.parse(localStorage.getItem('favoriteBooks')) || [];
    const favoriteCountElement = document.getElementById('favorite-count');
    
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

// Function to filter books by search term and genre
function filterBooks() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const selectedGenre = document.getElementById('genreSelect').value;

    // Filter the books based on the search term and genre
    const filteredBooks = allBooks.filter(book => {
        const matchesTitle = book.title.toLowerCase().includes(searchInput);
        const matchesGenre = selectedGenre ? book.subjects.includes(selectedGenre) : true;

        return matchesTitle && matchesGenre;
    });

    displayBooks(filteredBooks); // Display the filtered books
}

// Function to clear filters and reset to the first page
function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('genreSelect').value = '';

    // Fetch books from the first page
    fetchBooks('https://gutendex.com/books/?page=1');
}




// Update pagination buttons with numbered pages
function updatePaginationButtons() {
    const paginationContainer = document.getElementById('paginationContainer');
    paginationContainer.innerHTML = ''; // Clear existing buttons

    // Previous button
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.className = 'bg-gray-500 text-white px-4 py-2 rounded mr-2';
    prevButton.disabled = currentPage === 1; // Disable if on the first page
    prevButton.onclick = () => {
        if (currentPage > 1) fetchBooks(`https://gutendex.com/books/?page=${currentPage - 1}`);
    };
    paginationContainer.appendChild(prevButton);

    // Page numbers
    const totalPagesToShow = 5; // Limit the number of page buttons to show at once
    let startPage = Math.max(currentPage - Math.floor(totalPagesToShow / 2), 1);
    let endPage = Math.min(startPage + totalPagesToShow - 1, totalPages);

    if (endPage - startPage < totalPagesToShow) {
        startPage = Math.max(endPage - totalPagesToShow + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.className = `px-4 py-2 rounded mx-1 ${i === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`;
        pageButton.onclick = () => fetchBooks(`https://gutendex.com/books/?page=${i}`);
        paginationContainer.appendChild(pageButton);
    }

    // Next button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.className = 'bg-gray-500 text-white px-4 py-2 rounded';
    nextButton.disabled = currentPage === totalPages; // Disable if on the last page
    nextButton.onclick = () => {
        if (currentPage < totalPages) fetchBooks(`https://gutendex.com/books/?page=${currentPage + 1}`);
    };
    paginationContainer.appendChild(nextButton);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    fetchBooks(); // Fetch the first page of books on page load
    updateFavoriteCount();
});
