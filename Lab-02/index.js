const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
app.use(express.json()); // Important for reading JSON body in POST and PUT

const dbPath = path.join(__dirname, "books.db");
let db = null;

// Initialize Database and Server
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
  console.log(`Server Running at http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

// ---------- ROUTES ----------

// 1. GET all books
app.get("/books/", async (request, response) => {
  const getBooksQuery = `SELECT * FROM book ORDER BY id;`;
  const booksArray = await db.all(getBooksQuery);
  response.send(booksArray);
});

// 2. GET a single book by ID
app.get("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  const getBookQuery = `SELECT * FROM book WHERE id = ?;`;
  const book = await db.get(getBookQuery, [bookId]);

  if (book === undefined) {
    response.status(404).send({ error: "Book not found" });
  } else {
    response.send(book);
  }
});

// 3. POST - Add a new book
app.post("/books/", async (request, response) => {
  const { title, author, price, pages } = request.body;
  const addBookQuery = `
    INSERT INTO book (title, author, price, pages)
    VALUES (?, ?, ?, ?);
  `;
  const dbResponse = await db.run(addBookQuery, [title, author, price, pages]);
  const bookId = dbResponse.lastID;
  response.send({ message: "Book Added Successfully", bookId: bookId });
});

// 4. PUT - Update a book
app.put("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  const { title, author, price, pages } = request.body;

  const updateBookQuery = `
    UPDATE book
    SET title = ?, author = ?, price = ?, pages = ?
    WHERE id = ?;
  `;
  await db.run(updateBookQuery, [title, author, price, pages, bookId]);
  response.send({ message: "Book Updated Successfully" });
});

// 5. DELETE - Remove a book
app.delete("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  const deleteBookQuery = `DELETE FROM book WHERE id = ?;`;
  await db.run(deleteBookQuery, [bookId]);
  response.send({ message: "Book Deleted Successfully" });
});