function updateFavoriteCount() {
  const bookDetails = JSON.parse(localStorage.getItem("bookDetails")) || {};
  displayBookDetails(bookDetails);
}

function displayBookDetails(book) {
  const numberList = document.getElementById("numberList");

  const bookElement = `
    <div class="bg-white m-2 rounded-lg overflow-hidden shadow-2xl flex justify-start gap-4  p-20">
<div>
 <img class="h-48 w-full md:w-[400px] object-cover" src="${
   book.formats["image/jpeg"] || "https://via.placeholder.com/150"
 }" alt="Book Image" />

</div>

<div>
<div class="pt-2 px-2">
            <div class='flex justify-between'>
              <p class='text-left'>ID: ${book.id}</p>
             
            </div>
            <p class='text-left'>${book.title}</p>
            <p class='text-left font-semibold'>${book.authors[0]?.name} (${
    book.authors[0]?.birth_year
  }-${book.authors[0]?.death_year})</p>
            <p class='text-left underline font-semibold'>Genre :</p>
            <ul>
            ${book?.subjects?.map((genre) => `<li>${genre}</li>`).join("")}

            </ul>
          </div>
</div>
    </div>`;

  numberList.innerHTML = bookElement; 
}

document.addEventListener("DOMContentLoaded", () => {
  updateFavoriteCount();
});
