let allBooks = []; // Global variable to store all fetched books
let Genre = []; // Array to store unique genres

async function fetchBooks() {
    try {
        const loader = document.getElementById('loader'); // Get the loader element
        loader.style.display = 'block'; // Show loader before fetch starts

        const response = await fetch('https://gutendex.com/books/');
        console.log(response, 'response++++++');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        loader.style.display = 'none'; // Hide the loader after the data is fetched
        
        allBooks = data.results; // Store the fetched results in the global variable
        displayBooks(allBooks); // Initially display all books

        const allSubjects = allBooks.flatMap(book => book.subjects);
        // Step 2: Create a Set to get unique subjects
        Genre = [...new Set(allSubjects)];

        // Populate the genre dropdown
        const genreSelect = document.getElementById('genreSelect');
        Genre.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            genreSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('numberList').innerHTML = '<p class="text-red-600">Error loading books. Please try again later.</p>';
    }
}

function filterBooks() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const selectedGenre = document.getElementById('genreSelect').value; // Get the selected genre

    console.log(searchInput, 'searchInput++++++++++');
    console.log(selectedGenre, 'selectedGenre++++++++++');

    // Filter books based on title and selected genre
    const filteredBooks = allBooks.filter(book => {
        const matchesTitle = book.title.toLowerCase().includes(searchInput);
        const matchesGenre = selectedGenre ? book.subjects.includes(selectedGenre) : true; // Check if the book's genre matches

        return matchesTitle && matchesGenre; // Return true if both conditions are met
    });
    
    displayBooks(filteredBooks); // Display filtered books
}

function clearFilters() {
    // Reset the search input
    document.getElementById('searchInput').value = '';
    // Reset the genre selection
    document.getElementById('genreSelect').value = '';
    // Call filterBooks to display all books
    displayBooks(allBooks); // Display all books
}

// Function to display books or handle empty data
function displayBooks(books) {
    const numberList = document.getElementById('numberList'); 

    if (!books || books.length === 0) {
        numberList.innerHTML = '<p class="text-gray-500">No books found.</p>'; // Display message if no books found
        return;
    }

    const bookElements = books.map(book => {
        const truncatedTitle = book.title.length > 100 ? book.title.slice(0, 70) + '...' : book.title;

        return `
        <div class="bg-white m-2 rounded-lg overflow-hidden shadow-2xl">
          <img class="h-48 w-full object-cover" src="${book.formats['image/jpeg'] || 'https://via.placeholder.com/150'}" alt="Book Image" />
          <div class="pt-2 px-2">
            <p class='text-left'>ID: ${book.id}</p>
            <p class='text-left'>${truncatedTitle}</p>
            <p class='text-left'>${book.authors[0]?.name}</p>
            <p class='text-left'>Genre</p>
          </div>
        </div>`;
    }).join('');

    numberList.innerHTML = bookElements; // Set the innerHTML of the container to the generated HTML
}

document.addEventListener('DOMContentLoaded', () => {
    fetchBooks(); // Call the fetchBooks function to load the data
});
