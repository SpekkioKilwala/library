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

const addRow = function() {
	// recordTableBody
	const tr = document.createElement("tr");
	let td = tr.appendChild(document.createElement("td"))
	td.textContent = "000"
	recordTableBody.append(tr)
}
