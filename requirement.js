/*
BOOKS
ISBN, title, pub Date, language, num page, author[], category

AUTHORS 
id, name, books[]

PUBLICATIONS
id name, books[]
---------------------------------------------

WE HAVE TO DESIGN AND CODE API OVER THIS...(GET)....

1. BOOKS
We need an API:-
To get all the books
To get specific books 
To get a list of books based on category
To get a list of books based on language

2. AUTHORS
We need an API:-
To get all the authors
To get a specifc author based on id
To get a list of authors based on books

3. PUBLICATIONS
We need an API:-
To get all the publications
To get a specific publication
To get a list of publications based on books


/****POST REQUEST****/

//1. ADD NEW BOOK
//2. ADD NEW AUTHOR
//3. ADD NEW PUBLICATION

/********PUT********/
//Update book detail if author is changed

/**********DELETE*********/
//1. Delete the book
//2. Delete author from book
//3. Delete author from book and related book from author


//Schema - Blueprint of how data to be constructed
//MongoDB is schemaless
//mongoose has schema
//mongoose - validation, relationship with other data
//model -> document model of MongoDB

//Schema-> Model-> use them