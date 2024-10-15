let allBooks = []; 
let Genre = []; 

async function fetchBooks() {
    try {
        const loader = document.getElementById('loader'); // Get the loader element
        loader.style.display = 'block'; // Show loader before fetch starts

        const response = await fetch('https://gutendex.com/books/');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        loader.style.display = 'none'; // Hide the loader 
        
        allBooks = data.results; 
        displayBooks(allBooks); // Initially display all books

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
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('numberList').innerHTML = '<p class="text-red-600">Error loading books. Please try again later.</p>';
    }
}

function filterBooks() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const selectedGenre = document.getElementById('genreSelect').value; // Get the selected genre

    // Filter title and selected genre
    const filteredBooks = allBooks.filter(book => {
        const matchesTitle = book.title.toLowerCase().includes(searchInput);
        const matchesGenre = selectedGenre ? book.subjects.includes(selectedGenre) : true; 

        return matchesTitle && matchesGenre; // Return true if both conditions are true
    });
    displayBooks(filteredBooks); 
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('genreSelect').value = '';
    displayBooks(allBooks); // Display all books
}


function displayBooks(books) {
    const numberList = document.getElementById('numberList'); 

    if (!books || books.length === 0) {
        numberList.innerHTML = '<p class="text-gray-500">No books found.</p>'; 
        return;
    }

    const bookElements = books.map(book => {
        const truncatedTitle = book.title.length > 100 ? book.title.slice(0, 70) + '...' : book.title;

        return `
        <div class="bg-white m-2 rounded-lg overflow-hidden shadow-2xl">
          <img class="h-48 w-full object-fit" src="${book.formats['image/jpeg'] || 'https://via.placeholder.com/150'}" alt="Book Image" />
          <div class="pt-2 px-2">
            <p class='text-left'>ID: ${book.id}</p>
            <p class='text-left'>${truncatedTitle}</p>
            <p class='text-left'>${book.authors[0]?.name}</p>
            <p class='text-left'>Genre</p>
          </div>
        </div>`;
    }).join('');

    numberList.innerHTML = bookElements; 
}

document.addEventListener('DOMContentLoaded', () => {
    fetchBooks();
});
