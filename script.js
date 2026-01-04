const API_URL = "http://localhost:3000/books";

async function loadBooks() {
  try {
    const res = await fetch(API_URL);
    const books = await res.json();
    displayBooks(books);
  } catch (err) {
    alert("Failed to load books");
  }
}

function displayBooks(books) {
  const tbody = document.getElementById("bookTable");
  tbody.innerHTML = "";
  books.forEach(b => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${b.title}</td>
      <td>${b.author}</td>
      <td>${b.category}</td>
      <td>${b.publishedYear}</td>
      <td>${b.availableCopies}</td>
    `;
    tbody.appendChild(tr);
  });
}

document.getElementById("bookForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const newBook = {
    title: document.getElementById("title").value.trim(),
    author: document.getElementById("author").value.trim(),
    category: document.getElementById("category").value.trim(),
    publishedYear: Number(document.getElementById("year").value),
    availableCopies: Number(document.getElementById("copies").value),
  };
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBook),
    });
    if (!res.ok) throw new Error();
    e.target.reset();
    loadBooks();
  } catch {
    alert("Failed to add book. Check fields and server.");
  }
});

document.getElementById("filterCategory").addEventListener("change", async (e) => {
  const cat = e.target.value;
  if (cat === "All") return loadBooks();
  try {
    const res = await fetch(`${API_URL}/category/${encodeURIComponent(cat)}`);
    const books = await res.json();
    displayBooks(books);
  } catch {
    alert("Failed to filter");
  }
});

loadBooks();