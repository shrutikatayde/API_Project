require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require("body-parser"); //to access the post data-->> to read the entire body and parse 
//it and convert it into the json format

//database
const database = require("./database");

//Initialize express
const booky = express();

booky.use(bodyParser.urlencoded({ extended: true })); //req url can contain any type of data string object
booky.use(bodyParser.json()); //to error free code


mongoose.connect(process.env.MONGO_URL,
).then(() => console.log("connection established!!"));
/*
Route         /
Description   Get all the books
Acess         PUBLIC
Parameter     NONE
Methods       GET
*/
booky.get("/", (req, res) => {
    return res.json({ books: database.books });
});

/*
Route         /is
Description   Get specific book on ISBN
Acess         PUBLIC
Parameter     isbn
Methods       GET
*/
booky.get("/is/:isbn", (req, res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.ISBN === req.params.isbn
    );

    if (getSpecificBook.length === 0) {
        return res.json({
            error: `No book found for the ISBN of ${req.params.isbn}`,
        });
    }
    return res.json({ book: getSpecificBook });
});

/*
Route         /c
Description   Get list of book based on category
Acess         PUBLIC
Parameter     category
Methods       GET
*/
booky.get("/c/:category", (req, res) => {
    const getSpecificBook = database.books.filter((book) =>
        book.category.includes(req.params.category)
    );
    if (getSpecificBook.length === 0) {
        return res.json({
            error: `No book found for the category of ${req.params.category}`,
        });
    }
    return res.json({ book: getSpecificBook });
});

/*
Route         /c
Description   Get list of book based on language
Acess         PUBLIC
Parameter     language
Methods       GET
*/
booky.get("/l/:language", (req, res) => {
    const getSpecificBook = database.books.filter((book) =>
        book.language.includes(req.params.language)
    );
    if (getSpecificBook.length === 0) {
        return res.json({
            error: `No book found for the language of ${req.params.language}`,
        });
    }
    return res.json({ book: getSpecificBook });
});

/*
Route         /author
Description   Get all the authors
Acess         PUBLIC
Parameter     NONE
Methods       GET
*/
booky.get("/author", (req, res) => {
    return res.json({ author: database.author });
});

/*
Route         /author
Description   Get all authors based on id
Acess         PUBLIC
Parameter     id
Methods       GET
*/
booky.get("/author/:id", (req, res) => {
    const getSpecificAuthor = database.author.filter(
        (author) => author.id == req.params.id
    );

    if (getSpecificAuthor.length === 0) {
        return res.json({ error: `No author found for id of ${req.params.id}` });
    }
    return res.json({ author: getSpecificAuthor });
});

/*
Route         /author/book
Description   Get all authors based on books
Acess         PUBLIC
Parameter     isbn
Methods       GET
*/
booky.get("/author/book/:isbn", (req, res) => {
    const getSpecificAuthor = database.author.filter((author) =>
        author.books.includes(req.params.isbn)
    );
    if (getSpecificAuthor.length === 0) {
        return res.json({
            error: `No author found for book of ${req.params.isbn}`,
        });
    }
    return res.json({ authors: getSpecificAuthor });
});

/*
Route         /publications
Description   Get all the publications
Acess         PUBLIC
Parameter     NONE
Methods       GET
*/
booky.get("/publications", (req, res) => {
    return res.json({ publications: database.publication });
});

/*
Route         /publications
Description   Get a specific publications 
Acess         PUBLIC
Parameter     id
Methods       GET
*/
booky.get("/publications/:id", (req, res) => {
    const getSpecificPublication = database.publication.filter(
        (publication) => publication.id == req.params.id
    );
    if (getSpecificPublication.length === 0) {
        return res.json({
            error: `No publication found for id of ${req.params.id}`,
        });
    }
    return res.json({ publication: getSpecificPublication });
});

/*
Route         /publications/book
Description   Get a specific publications based on books
Acess         PUBLIC
Parameter     isbn
Methods       GET
*/
booky.get("/publications/book/:isbn", (req, res) => {
    const getSpecificPublication = database.publication.filter((publication) =>
        publication.books.includes(req.params.isbn)
    );
    if (getSpecificPublication.length === 0) {
        return res.json({
            error: `No publication found for id of ${req.params.isbn}`,
        });
    }
    return res.json({ publication: getSpecificPublication });
});

/****POST REQUEST****/

/*
Route         /book/new
Description   add new book
Acess         PUBLIC
Parameter     None
Methods       POST
*/

booky.post("/book/new", (req, res) => {
    const newBook = req.body;
    database.books.push(newBook);
    return res.json({ updatedBooks: database.books });
});

/*
Route         /author/new
Description   add new author
Acess         PUBLIC
Parameter     None
Methods       POST
*/
booky.post("/author/new", (req, res) => {
    const newAuthor = req.body;
    database.author.push(newAuthor);
    return res.json({ author: database.author });
});

/*
Route         /publications/new
Description   add new publication
Acess         PUBLIC
Parameter     None
Methods       POST
*/
booky.post("/publications/new", (req, res) => {
    const newPublication = req.body;
    database.publication.push(newPublication);
    return res.json({ author: database.publication });
});


/********  PUT  ********/

/*
Route         /publications/update/book
Description   update / add new publication
Acess         PUBLIC
Parameter     isbn
Methods       PUT
*/

booky.put("/publication/update/book/:isbn", (req, res) => {
    //update the ppublication database
    database.publication.forEach((pub) => {
        if (pub.id === req.body.pubId) {
            return pub.books.push(req.params.isbn);
        }
    });

    //update the books database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            book.publications = req.body.pubId;
            return;
        }
    });
    return res.json({
        books: database.books,
        publications: database.publication,
        message: "Successfully updated publications"
    })
});

/********* DELETE ************/

/*
Route         /delete/book
Description   delete the book
Acess         PUBLIC
Parameter     isbn
Methods       PUT
*/

booky.delete("/book/delete/:isbn/:authorId", (req, res) => {
    //whichever book that doesnot match with isbn , just send it to an updatedBookDatabase array
    // and rest will be filtered out
    const updatedBookDatabase = database.books.filter(
        (book) => book.ISBN !== req.params.isbn
    )
    database.books = updatedBookDatabase;
    return res.json({ books: database.books });
});

/*
Route         /delete/book
Description   delete author from book
Acess         PUBLIC
Parameter     isbn
Methods       PUT
*/
booky.delete("/book/author/delete/:isbn/:authorId", (req, res) => {
    //Update the book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            const newAuthorList = book.author.filter(
                (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
            );
            book.author = newAuthorList;
            return;
        }
    });
    return res.json({
        book: database.books,
        message: "Author was deleted!!"
    });
});



/*
Route         /book/delete/author
Description   Delete author from book and related book from author
Acess         PUBLIC
Parameter     isbn
Methods       PUT
*/
booky.delete("/book/author/delete/:isbn/:authorId", (req, res) => {
    //Update the book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            const newAuthorList = book.author.filter(
                (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
            );
            book.author = newAuthorList;
            return;
        }
    });
    //Update the author database
    database.author.forEach((eachAuthor) => {
        if (eachAuthor.id === parseInt(req.params.authorId)) {
            const newBookList = eachAuthor.books.filter(
                (book) => book !== req.params.isbn
            );
            eachAuthor.books = newBookList;
            return;
        }
    });
    return res.json({
        book: database.books,
        author: database.author,
        message: "Author was deleted!!"
    });
});


booky.listen(3000, () => {
    console.log("Server is Up and Running");
});
