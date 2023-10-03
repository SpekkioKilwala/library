"use strict";

// DOM-finding stuff
const recordTable = document.querySelector(".section-table").querySelector("table");
const recordTableBody = recordTable.querySelector("tbody");
const submitButton = document.querySelector("#addBookButton");
const formAddBook = document.querySelector(".form-add-book");

submitButton.addEventListener("click", (e) => {
	if (!formAddBook.checkValidity()) {
		console.log("Fail!");
		return;
	}
	console.log("Success!");
	return;
});

/**
 * Makes a book object.
 * @param {number} id
 * @param {string} title
 * @param {string} author
 * @param {string} pages
 * @param {boolean} read
 */
const Book = function(id, title, author, pages, read) {
	const info = function() {
		return (`${this.title}, by ${this.author}, ${this.pages} pages, read: ${this.read}`)
	}

	return {
		id,
		title,
		author,
		pages,
		read,
		info,
	}
}

// this could be an object
const books = [];

books.push(Book(
	1,
	"The Hobbit",
	"Jolkien Rolkien Rolkien Tolkien",
	310,
	true
));

books.push(Book(
	2,
	"Howl's Moving Castle",
	"Diana Wynne Jones",
	329,
	true
));

books.push(Book(
	3,
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

// Unavoidable:
// Data is being presented from raw objects to the user,
// I need a definition of how that data is presented somewhere.
// Like a query on a table;
// for a single boolean, do you display TRUE/FALSE? A checkbox? 0 and -1?
// The "data presentation" connects three pieces of information:
// 	- the table column
//	- the source of the data
//	- the formatting of the data
// That object needs to be closely linked to the table
// itself - one defines the other.

// So I need osme kind of "table definition" objec?
// Giving you an order of column headers and how to get each one.

// you'll need node.parentElement


// these make too many assumptions but making a singular general
// form would be 3x as many lines for no benefit.
// Alternatively, this logic could be known to the book objects themselves.
// 	"book, tell me what that member looks like as a table row."
// But I'm pretty sure THAT'S a violation of separation of concerns.
// (books don't give a shit about how that data is presented. That's another layer out.)
/**
 * express string-able data as a Table Element (td or th)
 * @param {string} datum 
 * @param {string} elementType
 * @returns HTMLElement
 */
const toTE = function(datum, elementType) {
	// console.log(`${datum} : ${elementType}`);
	const te = document.createElement(elementType);
	te.textContent = datum;
	return te;
}

const toCBTD = function(datum, elementID) {
	const td = document.createElement("td");
	const cb = td.appendChild(document.createElement("input"));
	cb.setAttribute("type", "checkbox");
	cb.setAttribute("id", elementID);
	cb.checked = datum;
	return td;
}

/**
 * Clears and re-adds all the child notes to the given <tr>
 * @param {HTMLElement} tr
 * @param {Book} book 
 */
const populateBookRow = function(tr, book) {
	tr.removeAttribute("data-id"); // in case you are reallocating the row
	tr.replaceChildren(); // remove all children
	tr.setAttribute("data-id", book.id);

	tr.appendChild(toTE(book.id, "th")); // ID column
	tr.appendChild(toTE(book.title, "td")); // Title column
	tr.appendChild(toTE(book.author, "td")); // Author
	tr.appendChild(toTE(book.pages, "td")); // Pages
	tr.appendChild(toCBTD(book.read, `read-${book.id}`)) // Checkbox
	tr.appendChild(toTE("Remove", "td")) // Remove thingy
}

/**
 * Makes a table row from an object.
 * @param {Book} book
 */
const bookToRow = function(book) {
	// Given a book object,
	// create a table row (tr > th td td td)
	// and return that node.
	const tr = document.createElement("tr");
	populateBookRow(tr, book);
	return tr;
}

// note that Array.prototype.forEach() can be used in many ways
// including getting the index of the thing directly
// you could use (book, i) => {function guts here} and that gives you the index as well
// and use that in your function guts.
books.forEach((book) => recordTableBody.append(bookToRow(book)));