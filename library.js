"use strict";

// DOM-finding stuff
const recordTable = document.querySelector(".section-table").querySelector("table")
const recordTableBody = recordTable.querySelector("tbody")

// (yes, the original task was with a constructor)
// (but I like factories better)
const Book = function(title, author, pages, read) {
	const info = function() {
		return (`${this.title}, by ${this.author}, ${this.pages} pages, read: ${this.read}`)
	}

	return {
		title,
		author,
		pages,
		read,
		info,
	}
}

// this could be an object
const books = []

// it seems silly for this to be its own function, but whatever
const addBook = function(_book) {
	books.push(_book)
}

addBook(Book(
	"The Hobbit",
	"Jolkien Rolkien Rolkien Tolkien",
	310,
	true
));

addBook(Book(
	"Howl's Moving Castle",
	"Diana Wynne Jones",
	329,
	true
));

addBook(Book(
	"The Well of Lost Plots",
	"Jasper Fforde",
	360,
	true
));

// What I'd really, really want is the ability
// to look for the appropriate header for any
// given table-cell that is nominated.
//	You'd think this would be a one-step job, but it
//	actually doesn't seem to exist in such a format.
// I see a few methods.
//	From a cell:
//		Get the parent (row),
//		determine own position in row,
//		Get parent's parent (table) -> get headers,
//		walk along headers same distance, get header.
// 	Create an array that positively links *position* to *object member*.
//		Right now that's hard-coded.
//		For creating a row, you iterate over that array
//		and take the appropriate object member for each row.
//	For convenience I should definitely put the member into the td's class.
//	and each row (tr) can have the object ID for class too.
//		The ID column is just for user information.

// you'll need node.parentElement


const addRow = function() {
	// recordTableBody
	const tr = document.createElement("tr");
	let td = tr.appendChild(document.createElement("td"))
	td.textContent = "000"
	recordTableBody.append(tr)
}
