"use strict";

// DOM-finding stuff
const recordTable = document.querySelector(".section-table").querySelector("table");
const recordTableBody = recordTable.querySelector("tbody");
const newBookButton = document.querySelector('#add-book-open') // open dialog
const addBookDialog = document.querySelector('#add-book-dialog')
const dialogClose = document.querySelector('#dialog-close')

const formAddBook = document.querySelector(".form-add-book");
const formTitle = document.querySelector("#book-title");
const formAuthor = document.querySelector("#author");
const formPages = document.querySelector("#pages");
const formRead = document.querySelector("#read");
const submitButton = document.querySelector("#add-book-submit");

const addFiveButton = document.querySelector("#add-5");
addFiveButton.addEventListener("click", (e) => {
	addBook(new Book(idGenerator.next().value, "Moby Dick", "Ishmael", "20", false));
	addBook(new Book(idGenerator.next().value, "Moby Dick", "Ishmael", "20", false));
	addBook(new Book(idGenerator.next().value, "Moby Dick", "Ishmael", "20", false));
	addBook(new Book(idGenerator.next().value, "Moby Dick", "Ishmael", "20", false));
	addBook(new Book(idGenerator.next().value, "Moby Dick", "Ishmael", "20", false));
});

newBookButton.addEventListener("click", (e) => {
	addBookDialog.showModal();
	formAddBook.reset();
});

dialogClose.addEventListener("click", (e) => {
	addBookDialog.close();
});

// books are saved using their ID as the key:
// No collisions, makes it trivial to get the book if you have the key.
const books = {};

/**
 * Given a book, adds that to the JS-level data
 * AND the DOM table. Prefer using this over
 * separate operations!
 * @function addBook
 * @todo return false if the process failed ("failed" not defined)
 * @todo checking for duplicates in either case.
 * @todo throw errors?
 * @param {Book} book
 * @returns {boolean}
 */
const addBook = function(book) {
	books[book.id] = book;
	recordTableBody.append(bookToRow(book));
	return true;
}

/**
 * Generates new ID numbers.
 * @generator
 * @yields {number}
 */
function* counter() {
	let index = 1;
	while (true) {
		yield index++;
	}
}
const idGenerator = counter(); // not a singleton!
// if you want to be safer about this, you could
// use time-based IDs or the singleton pattern.

/**
 * Makes a book object.
 * @param {number} id
 * @param {string} title
 * @param {string} author
 * @param {string} pages
 * @param {boolean} read
 */
class Book {
	constructor(id, title, author, pages, read) {
		this.id = id;
		this.title = title;
		this.author = author;
		this.pages = pages;
		this.read = read;
	}

	info() {
		return (`${this.title}, by ${this.author}, ${this.pages} pages, read: ${this.read}`)
	}

	// class examples for reference
	
	// 	diet = "jam";
	// 	// This is a direct class field
	// 	// They exist in the object itself, not in the object's prototype.
	// 	// I'm not sure what difference that practically makes.

	// 	get name() { // getter methods have the parens on the declaration, not when used
	// 		return this._name;
	// 	}

	// 	set name(value) {
	// 		if (value.length < 4) {
	// 			alert("Name is too short.");
	// 			return;
	// 		}
	// 		this._name = value;
	// 	}
}

const dataSet = [
	new Book(
		idGenerator.next().value,
		"The Hobbit",
		"Jolkien Rolkien Rolkien Tolkien",
		310,
		true
	),
	new Book(
		idGenerator.next().value,
		"Howl's Moving Castle",
		"Diana Wynne Jones",
		329,
		true
	),
	new Book(
		idGenerator.next().value,
		"The Well of Lost Plots",
		"Jasper Fforde",
		360,
		true
	)
];

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

// So I need osme kind of "table definition" object?
// Giving you an order of column headers and how to get each one.
// you'll need node.parentElement


/**
 * Creates an element with extra methods, for more concise code.
 * The whole point being that now I can chain dot operations,
 * and/or make an element, do a bunch of operations on it,
 * and then pass that to something else.
 * @factory
 * @param {string} tagName
 * @returns {Element} element
 * @todo the optional "options" parameter of .createElement
 * @todo work out whether you ever call .createElement on anything OTHER than the document
 */
const DotElement = function(tagName) {
	const element = document.createElement(tagName);

	// Beware: declaring this in HERE, these will all end up as DIFFERENT functions per object!
	// So actually I want this to just be a reference to an function on the outside.
	// I am not quite sure how to declare that one.
	// Aside: I actually cannot believe that I apparently wrote this correctly on the first try.
	Object.defineProperty(element, 'xSetAttribute', {
		value: (attribute, value) => {
			element.setAttribute(attribute, value);
			return element;
		},
		writable: false
	});

	Object.defineProperty(element, 'xAppend', {
		value: (child) => {
			element.append(child);
			return element;
		},
		writable: false
	});

	Object.defineProperty(element, 'xAddEventListener', {
		value: (type, handler) => {
			element.addEventListener(type, handler);
			return element;
		},
		writable: false
	});

	return element;
}

/**
 * Clears and re-adds all the child notes to the given <tr>
 * This is specifically for a book, and assumes that you want the
 * columns to go in this particular order.
 * @param {HTMLElement} tr
 * @param {Book} book 
 */
const populateBookRow = function(tr, book) {
	tr.setAttribute("data-id", book.id);
	// I'm not concerned with other attributes, only the one that says
	// what item this row is associated with.
	tr.replaceChildren();
	// Consider: returning all the existing children.
	// Also consider: if you want to rearrange/reassign rows, just move the whole row.
	
	// Do not try to convert this to dot-notation.
	const readCheckbox = DotElement("input")
		.xSetAttribute("type", "checkbox")
		.xSetAttribute('id', `read-${book.id}`);
	readCheckbox.checked = book.read;
	readCheckbox.addEventListener("click", (e) => {
		book.read = readCheckbox.checked;
	});

	const removeButton = DotElement("button")
		.xSetAttribute("type", "button")
		.xSetAttribute("id", `remove-${book.id}`)
		.xAppend("Remove");
	removeButton.addEventListener("click", (e) => {
		console.log(`Attempted removal on ${removeButton.id}`);
		// Books exist in the underlying data and as a DOM row.
		// - the books object (find the book, remove it)
		// - the table row.
		delete books[book.id];
		tr.remove();
	});

	tr.append(
			DotElement("th")
				.xSetAttribute("id", book.id)
				.xAppend(book.id),
			DotElement("td")
				.xAppend(book.title),
			DotElement("td")
				.xAppend(book.author),
			DotElement("td")
				.xAppend(book.pages),
			DotElement("td")
				.xAppend(readCheckbox),
			DotElement("td")
				.xAppend(removeButton)
	)
}

/**
 * Makes a table row from an object.
 * @param {Book} book
 * @return {Element}
 */
const bookToRow = function(book) {
	// Given a book object,
	// create a table row (tr > th td td td)
	// and return that node.
	const tr = document.createElement("tr");
	populateBookRow(tr, book);
	return tr;
}

submitButton.addEventListener("click", (e) => {
	if (!formAddBook.checkValidity()) {
		console.log("Fail!");
		return;
	}
	const newBook = new Book(
		idGenerator.next().value,
		formTitle.value,
		formAuthor.value,
		formPages.value,
		formRead.checked
	);
	console.log(newBook);
	if (addBook(newBook)) {
		addBookDialog.close();
	}
	return;
});

dataSet.forEach((book) => {addBook(book)});
// note that Array.prototype.forEach() can be used in many ways
// including getting the index of the thing directly
// you could use (book, i) => {function guts here} and that gives you the index as well