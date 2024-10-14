// // Function to fetch books from the Gutendex API
// async function fetchBooks() {
//     try {
//         const loader = document.getElementById('loader'); // Get the loader element
//         loader.style.display = 'block'; // Show loader before fetch starts

//         const response = await fetch('https://gutendex.com/books/');
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response?.json();
//         loader.style.display = 'none'; // Hide the loader after the data is fetched
//         displayBooks(data.results); // Pass the results (books) to the displayBooks function
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         document.getElementById('numberList').innerHTML = '<p class="text-red-600">Error loading books. Please try again later.</p>';
//     }
// }

// // Function to display books as cards
// function displayBooks(books) {

//     // Use map to create HTML for each book
//     const bookElements = books?.map(book => {
//     return `
//     <div class="bg-gray-200  m-2 rounded-lg overflow-hidden shadow-2xl">
//       <img class="h-48 w-full object-fit object-end" src="${book?.formats['image/jpeg'] || 'https://via.placeholder.com/150'}" alt="Book Image" />
//       <div class="p-6 flex-1 flex flex-col">
//         <div class="flex items-baseline">
//           <span class="inline-block bg-teal-200 text-teal-800 py-1 px-4 text-xs rounded-full uppercase font-semibold tracking-wide">Book ID: ${book.id}</span>
//           <div class="ml-2 text-gray-600 text-xs uppercase font-semibold tracking-wide">
//             ${book.authors.map(author => author.name).join(', ')}
//           </div>
//         </div>
//         <h4 class="mt-2 font-semibold text-lg leading-tight truncate">${book.title}</h4>
//         <div class="mt-1">
//           <span>${book.languages.join(', ')}</span> <!-- Fixed languages -->
//         </div>
//         <div class="mt-2 flex items-center">
//           <a href="${book.formats['text/plain']}" class="text-teal-600 font-semibold" target="_blank">Read Online</a>
//         </div>
//       </div>
//     </div>`;
// }).join('');
// // Join all the cards into a single HTML string

//     const numberList = document.getElementById('numberList'); // Ensure this is inside the DOMContentLoaded event
//     numberList.innerHTML = bookElements; // Set the innerHTML of the container to the generated HTML
// }

// document.addEventListener('DOMContentLoaded', () => {
//     fetchBooks(); // Call the fetchBooks function to load the data
// });


async function fetchBooks() {
    try {
        const loader = document.getElementById('loader'); // Get the loader element
        loader.style.display = 'block'; // Show loader before fetch starts

        const response = await fetch('https://gutendex.com/books/');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response?.json();
        loader.style.display = 'none'; // Hide the loader after the data is fetched
        displayBooks(data.results); // Pass the results (books) to the displayBooks function
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('numberList').innerHTML = '<p class="text-red-600">Error loading books. Please try again later.</p>';
    }
}

// Function to display books or handle empty data
function displayBooks(books) {
    const numberList = document.getElementById('numberList'); // Ensure this is inside the DOMContentLoaded event

    if (!books || books.length === 0) {
        numberList.innerHTML = '<p class="text-gray-500">No books found.</p>'; // Display message if no books found
        return;
    }

    // Use map to create HTML for each book
    const bookElements = books.map(book => {
        return `
        <div class="bg-white  m-2 rounded-lg overflow-hidden shadow-2xl">
          <img class="h-48 w-full object-cover" src="${book?.formats['image/jpeg'] || 'https://via.placeholder.com/150'}" alt="Book Image" />
          <div class="pt-2 px-2" >
          <p class='flex flex-start '>${book?.title} </p>
            
          
           
          </div>
        </div>`;
    }).join(''); // Join all the cards into a single HTML string

    numberList.innerHTML = bookElements; // Set the innerHTML of the container to the generated HTML
}

document.addEventListener('DOMContentLoaded', () => {
    fetchBooks(); // Call the fetchBooks function to load the data
});