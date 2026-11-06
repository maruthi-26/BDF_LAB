const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "books.db");
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

// GET ALL BOOKS (with query parameters)
app.get("/books/", async (request, response) => {
  const {search_q = "",order_by = "id",order = "ASC",limit = 10,offset = 0,min_price,max_price,} = request.query;

  let getBooksQuery = `
    SELECT * FROM book
    WHERE title LIKE '%${search_q}%'`;

  // Price range filter
  if (min_price !== undefined && max_price !== undefined) {
    getBooksQuery += ` AND price BETWEEN ${min_price} AND ${max_price}`;
  } else if (min_price !== undefined) {
    getBooksQuery += ` AND price >= ${min_price}`;
  } else if (max_price !== undefined) {
    getBooksQuery += ` AND price <= ${max_price}`;
  }

  // Sorting
  getBooksQuery += ` ORDER BY ${order_by} ${order}`;

  // Limit and Offset
  getBooksQuery += ` LIMIT ${limit} OFFSET ${offset};`;

  const books = await db.all(getBooksQuery);
  response.send(books);
});

// GET SINGLE BOOK
app.get("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  const getBookQuery = `SELECT * FROM book WHERE id = ?;`;
  const book = await db.get(getBookQuery, [bookId]);

  if (book === undefined) {
    response.status(404).send({ message: "Book not found" });
  } else {
    response.send(book);
  }
});

// POST - CREATE BOOK (with validation)
app.post("/books/", async (request, response) => {
  const { title, author, price, pages } = request.body;

  // Validation
  if (!title || !author) {
    return response.status(400).send({
      message: "Title and Author are required",
    });
  }

  if (typeof price !== "number" || isNaN(price)) {
    return response.status(400).send({
      message: "Price must be a number",
    });
  }

  const addBookQuery = `
    INSERT INTO book (title, author, price, pages)
    VALUES (?, ?, ?, ?); 
    `;
  const dbResponse = await db.run(addBookQuery, [title, author, price, pages]);
  
  response.status(201).send({
    message: "Book created successfully",
    bookId: dbResponse.lastID,
  });
});

// PUT - UPDATE BOOK
app.put("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  const { title, author, price, pages } = request.body;

  // Check if book exists
  const checkQuery = `SELECT * FROM book WHERE id = ?;`;
  const book = await db.get(checkQuery, [bookId]);

  if (book === undefined) {
    return response.status(404).send({ message: "Book not found" });
  }

  const updateBookQuery = `
    UPDATE book
    SET title = ?, author = ?, price = ?, pages = ?
    WHERE id = ?;
  `;
  await db.run(updateBookQuery, [title, author, price, pages, bookId]);

  response.status(200).send({ message: "Book updated successfully" });
});

// DELETE BOOK
app.delete("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;

  const checkQuery = `SELECT * FROM book WHERE id = ?;`;
  const book = await db.get(checkQuery, [bookId]);

  if (book === undefined) {
    return response.status(404).send({ message: "Book not found" });
  }

  const deleteBookQuery = `DELETE FROM book WHERE id = ?;`;
  await db.run(deleteBookQuery, [bookId]);

  response.status(200).send({ message: "Book deleted successfully" });
});