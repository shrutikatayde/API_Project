require("dotenv").config();
const express = require("express");
const mongooose = require("mongoose");
var bodyParser = require("body-parser"); //to access the post data-->> to read the entire body and parse 
//it and convert it into the json format

//database
const database = require("./database/database");

//Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");


//Initialize express
const booky = express();

booky.use(bodyParser.urlencoded({ extended: true })); //req url can contain any type of data string object
booky.use(bodyParser.json()); //to error free code

//MongoDB CONNECTION
mongooose.connect(process.env.MONGO_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(() => {
    console.warn("Db connection established!!");
});


/*
Route         /
Description   Get all the books
Acess         PUBLIC
Parameter     NONE
Methods       GET
*/
booky.get("/", async (req, res) => {
    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);
});

/*
Route         /is
Description   Get specific book on ISBN
Acess         PUBLIC
Parameter     isbn
Methods       GET
*/
booky.get("/is/:isbn", async (req, res) => {
    const getSpecificBook = await BookModel.findOne({ ISBN: req.params.isbn });

    //null !0 = 1, !1 = 0
    if (!getSpecificBook) {
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
booky.get("/c/:category", async (req, res) => {
    const getSpecificBook = await BookModel.findOne({ category: req.params.category });

    if (!getSpecificBook) {
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
booky.get("/l/:language", async (req, res) => {
    const getSpecificBook = await BookModel.findOne({ language: req.params.language }
    );
    if (!getSpecificBook) {
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
booky.get("/author", async (req, res) => {
    const getAllAuthors = await AuthorModel.find();
    return res.json(getAllAuthors);
});

/*
Route         /author
Description   Get all authors based on id
Acess         PUBLIC
Parameter     id
Methods       GET
*/
booky.get("/author/:id", async (req, res) => {
    const getSpecificAuthor = await AuthorModel.findOne({ author: req.params.id }
    );

    if (!getSpecificAuthor) {
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
booky.get("/author/book/:isbn", async (req, res) => {
    const getSpecificAuthor = await AuthorModel.findOne({ authors: req.params.isbn }
    );
    if (!getSpecificAuthor) {
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
booky.get("/publications", async (req, res) => {
    const getAllPublications = await PublicationModel.find();
    return res.json(getAllPublications);
});

/*
Route         /publications
Description   Get a specific publications 
Acess         PUBLIC
Parameter     id
Methods       GET
*/
booky.get("/publications/:id", async (req, res) => {
    const getSpecificPublication = await PublicationModel.findOne({ publications: req.params.id }
    );
    if (!getSpecificPublication) {
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
booky.get("/publications/book/:isbn", async (req, res) => {
    const getSpecificPublication = await PublicationModel.findOne({ publications: req.params.isbn }
    );
    if (!getSpecificPublication) {
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

booky.post("/book/new", async (req, res) => {
    const { newBook } = req.body;
    const addNewBook = BookModel.create(newBook);
    return res.json({
        books: addNewBook,
        message: "Book was added !!!"
    });
});

/*
Route         /author/new
Description   add new author
Acess         PUBLIC
Parameter     None
Methods       POST
*/
booky.post("/author/new", async (req, res) => {
    const { newAuthor } = req.body;
    const addNewAuthor = AuthorModel.create(newAuthor);
    return res.json({
        author: addNewAuthor,
        message: "Author was added !!!"
    });
});

/*
Route         /publications/new
Description   add new publication
Acess         PUBLIC
Parameter     None
Methods       POST
*/
booky.post("/publications/new", async (req, res) => {
    const { newPublication } = req.body;
    const addNewPublication = PublicationModel.create(newPublication);
    return res.json({
        publication: addNewPublication,
        message: "Publication was added !!!"
    });
});


/********  PUT  ********/

/*
Route         /publications/update/book
Description   update book on isbn
Acess         PUBLIC
Parameter     isbn
Methods       PUT
*/

booky.put("/book/update/:isbn", async (req, res) => {
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
            title: req.body.bookTitle
        },
        {
            new: true
        }
    );
    return res.json({ books: updatedBook });
});

/*********** updatating new author ***********/

/*
Route         book/author/update
Description   update / add new author
Acess         PUBLIC
Parameter     isbn
Methods       PUT
*/

booky.put("/book/author/update/:isbn", async (req, res) => {
    //Update book database
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
            $addToSet: {
                author: req.body.newAuthor
            }
        },
        {
            new: true
        }
    );


    //Update author database
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: req.body.newAuthor
        },
        {
            $addToSet: {
                books: req.params.isbn
            }
        },
        {
            new: true
        }
    );
    return res.json({
        boooks: updatedBook,
        authors: updatedAuthor,
        message: "New Author was added !!!"
    })
});


/*
Route         /publications/update/book
Description   update / add new publication
Acess         PUBLIC
Parameter     isbn
Methods       PUT
*/

booky.put("/publication/update/book/:isbn", async (req, res) => {
    //update the publication database


    const updatedPublication = await PublicationModel.findOneAndUpdate(
        {
            id: req.body.newPublication
        },
        {
            $addToSet: {
                books: req.params.isbn
            }
        },
        {
            new: true
        }
    );

    //update the books database
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
            $addToSet: {
                publications: req.body.newPublication
            }
        },
        {
            new: true
        }
    );


    return res.json({
        publications: updatedPublication,
        books: updatedBook,
        message: "Successfully updated publications"
    })
});

/********* DELETE ************/

/*
Route         /delete/book
Description   delete the book
Acess         PUBLIC
Parameter     isbn
Methods       Delete
*/

booky.delete("/book/delete/:isbn/", async (req, res) => {
    //whichever book that doesnot match with isbn , just send it to an updatedBookDatabase array
    // and rest will be filtered out
    const updatedBookDatabase = await BookModel.findOneAndDelete(
        {
            ISBN: req.params.isbn
        }
    );

    return res.json({ books: updatedBookDatabase });
});

//Remaining undone

/*
Route         /delete/book
Description   delete author from book
Acess         PUBLIC
Parameter     isbn
Methods       Delete
*/
booky.delete("/book/author/delete/:isbn/:authorId", async (req, res) => {
    //Update the book database
    const updatedBook = await BookModel.findOneAndDelete(
        {
            ISBN: req.params.isbn
        },
        {
            $pull: {
                authors: parseInt(req.params.authorId)
            }
        },
        {
            new: true
        }
    ); return res.json({
        book: updatedBook,
        message: "Author was deleted!!"
    });
});



/*
Route         /book/delete/author
Description   Delete author from book and related book from author
Acess         PUBLIC
Parameter     isbn
Methods       Delete
*/
booky.delete("/book/author/delete/:isbn/:authorId", async (req, res) => {
    //Update the book database
    const updatedBook = await BookModel.findOneAndDelete(
        {
            ISBN: req.params.isbn
        },
        {
            $pull: {
                authors: parseInt(req.params.authorId)
            }
        },
        {
            new: true
        }
    );
    //Update the author database
    const updatedAuthor = await AuthorModel.findOneAndDelete(
        {
            authors: parseInt(req.params.authorId)

        },
        {
            $pull: {
                books: req.params.isbn

            }
        },
        {
            new: true
        }
    );
    // database.author.forEach((eachAuthor) => {
    //     if (eachAuthor.id === parseInt(req.params.authorId)) {
    //         const newBookList = eachAuthor.books.filter(
    //             (book) => book !== req.params.isbn
    //         );
    //         eachAuthor.books = newBookList;
    //         return;
    //     }
    // });
    return res.json({
        book: updatedBook,
        author: updatedAuthor,
        message: "Author was deleted!!"
    });
});


booky.listen(3000, () => {
    console.log("Server is Up and Running");
});




// const updatedPublicationDatabase = await PublicationModel.findOneAndDelete(
//     {
//         ID: req.body.id
//     }
// );

// const updatedBookDatabase = await BookModel.findOneAndDelete(
//     {
//         ISBN: req.params.isbn
//     }
// );
