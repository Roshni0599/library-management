const express = require("express");
const router = express.Router();
const Book = require("../models/book");

// ✅ Get all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

// ✅ Add a new book (with negative stock prevention)
router.post("/", async (req, res) => {
  try {
    const { title, author, category, publishedYear, availableCopies } = req.body;

    if (!title || !author || !category || !publishedYear || availableCopies == null) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (availableCopies < 0) {
      return res.status(400).json({ error: "Available copies cannot be negative" });
    }

    const newBook = new Book({ title, author, category, publishedYear, availableCopies });
    await newBook.save();
    res.status(201).json({ message: "Book added successfully", book: newBook });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Filter books by category
router.get("/category/:cat", async (req, res) => {
  try {
    const books = await Book.find({ category: req.params.cat });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: "Failed to filter books" });
  }
});

// ✅ Seed sample books
router.post("/seed", async (req, res) => {
  try {
    const sample = [
      { title: "Clean Code", author: "Robert C. Martin", category: "Programming", publishedYear: 2008, availableCopies: 5 },
      { title: "Introduction to Algorithms", author: "Thomas H. Cormen", category: "Computer Science", publishedYear: 2009, availableCopies: 3 },
      { title: "The Alchemist", author: "Paulo Coelho", category: "Fiction", publishedYear: 2016, availableCopies: 4 },
      { title: "Atomic Habits", author: "James Clear", category: "Self Help", publishedYear: 2018, availableCopies: 6 },
      { title: "Deep Work", author: "Cal Newport", category: "Self Help", publishedYear: 2017, availableCopies: 2 },
      { title: "Data Science Handbook", author: "Jake VanderPlas", category: "Data Science", publishedYear: 2015, availableCopies: 1 },
      { title: "Python Crash Course", author: "Eric Matthes", category: "Programming", publishedYear: 2019, availableCopies: 7 }
    ];
    await Book.deleteMany({});
    const inserted = await Book.insertMany(sample);
    res.json({ message: "Seeded", count: inserted.length });
  } catch (err) {
    res.status(500).json({ error: "Failed to seed" });
  }
});

// ✅ Get book by ID (Book Not Found)
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Update book by ID (Invalid Update + Negative Stock Prevention)
router.put("/:id", async (req, res) => {
  try {
    const { title, author, category, publishedYear, availableCopies } = req.body;

    if (!title || !author || !category || !publishedYear || availableCopies == null) {
      return res.status(400).json({ error: "Invalid update: all fields required" });
    }

    if (availableCopies < 0) {
      return res.status(400).json({ error: "Available copies cannot be negative" });
    }

    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, category, publishedYear, availableCopies },
      { new: true }
    );

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json({ message: "Book updated successfully", book });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Delete book by ID (Book Not Found)
router.delete("/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;