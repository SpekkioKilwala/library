"use strict";

// DOM-finding stuff
const recordTable = document.querySelector(".section-table").querySelector("table");
const recordTableBody = recordTable.querySelector("tbody");

const newBookButton = document.querySelector('#add-book-open') // open dialog
const addBookDialog = document.querySelector('#add-book-dialog')

// testing only!
const dialogClose = document.querySelector('#dialog-close')

const formAddBook = document.querySelector(".form-add-book");
const formTitle = document.querySelector("#book-title");
const formAuthor = document.querySelector("#author");
const formPages = document.querySelector("#pages");
const formRead = document.querySelector("#read");
const submitButton = document.querySelector("#add-book-submit");

newBookButton.addEventListener("click", (e) => {
	addBookDialog.showModal();
	formAddBook.reset();
});

dialogClose.addEventListener("click", (e) => {
	addBookDialog.close();
});

// this could be an object
const books = [];

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
// (books don't know about how that data is presented. That's another layer out.)
//	So, books could have some kind of wrapper, or I make a tabular-object composed oject.
//		The latter might not be efficient at scale.
//		I might actually need to use inheritance.
// 		Or, don't structure your UI that way.
// It just circles back to the fundamental problem:
// how to represent an object on the screen.
// I thought htmx was semi- insane but this kind of problem really makes it look good.
/**
 * express string-able data as a Table Element (td or th)
 * @function
 * @todo Redo these so that they're not factories at all.
 * Making a new node is free, putting things inside them is awkward.
 * Your factory just takes a form node and whatever should go inside it.
 * 	The insides are in an array.
 * So you can call it with a node that you just constructed inside the call,
 * Or give it an existing node.
 * Which means it's reusable for an entire row?
 * @param {string} datum 
 * @param {string} elementType
 * @returns {HTMLElement}
 */
const toTE = function(datum, elementType) {
	const te = document.createElement(elementType);
	te.textContent = datum;
	return te;
}

/**
 * Express boolean as a checkbox input inside a <td>
 * ALSO adds the event listener.
 * @function
 * @todo Rename to align to factory style
 * @param {string} datum 
 * @param {function} handler
 * @param {string} elementID
 * @returns {HTMLElement}
 */
const toCBTD = function(datum, handler, elementID) {
	const td = document.createElement("td");
	const cb = td.appendChild(document.createElement("input"));
	cb.setAttribute("type", "checkbox");
	cb.setAttribute("id", elementID);
	cb.checked = datum;
	// Because you can always move nodes around, the event listener
	// has to be attached correctly (in this case, also created)
	// when the checkbox is.
	cb.addEventListener("click", (e) => {
		// I'm still assuming that every checkbox will need a click handler
		console.log(`${cb.id} : ${cb.checked}`);
		//book.read = cb.checked;
		handler(e, cb.checked, cb.id);
	});
	return td;
}

/**
 * Creates an element with extra methods, for more concise code.
 * The whole point being that now I can chain dot operations,
 * or make an element, do a bunch of operations on it, and then pass that to something else.
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
	Object.defineProperty(element, 'setAtt', {
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

	return element;
}

const populateBookRow2 = function(tr, book) {
	tr.removeAttribute("data-id"); // in case you are reallocating the row
	// Wait. What happens if the tr has OTHER attributes?
	// Well, that's just a completely different set of concerns.
	// All I care about is what data it contains and what object that's associated with.
	tr.replaceChildren(); // remove all children
	tr.setAttribute("data-id", book.id);

	// concise alias
	const El = DotElement; // the document.createElement + methods factory

	tr.append(
			El("th")
				.setAtt("id", book.id)
				.xAppend(book.id),
			El("td")
				.xAppend(book.title),
			El("td")
				.xAppend(book.author),
			El("td")
				.xAppend(book.pages),
			El("td")
				.xAppend("X"),
			El("td")
				.xAppend("Remove")
	)

	// tr.appendChild(toTE(book.id, "th")); // ID column
	// tr.appendChild(toTE(book.title, "td")); // Title column
	// tr.appendChild(toTE(book.author, "td")); // Author
	// tr.appendChild(toTE(book.pages, "td")); // Pages
	// tr.appendChild(toCBTD(book.read, (e, newState, cbID) => {book.read = newState}, `read-${book.id}`)) // Checkbox
	// tr.appendChild(toTE("Remove", "td")) // Remove thingy
}



/**
 * Clears and re-adds all the child notes to the given <tr>
 * This is specifically for a book, and assumes that you want to do things
 * in this particular order. If you want things to happen in an order,
 * you'll need to pass that in.
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
	tr.appendChild(toCBTD(book.read, (e, newState, cbID) => {book.read = newState}, `read-${book.id}`)) // Checkbox
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
	populateBookRow2(tr, book);
	return tr;
}

submitButton.addEventListener("click", (e) => {
	if (!formAddBook.checkValidity()) {
		console.log("Fail!");
		return;
	}
	const newBook = Book(
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
	books.push(book);
	recordTableBody.append(bookToRow(book));
	return true;
}

addBook(Book(
	idGenerator.next().value,
	"The Hobbit",
	"Jolkien Rolkien Rolkien Tolkien",
	310,
	true
));

addBook(Book(
	idGenerator.next().value,
	"Howl's Moving Castle",
	"Diana Wynne Jones",
	329,
	true
));

addBook(Book(
	idGenerator.next().value,
	"The Well of Lost Plots",
	"Jasper Fforde",
	360,
	true
));

// note that Array.prototype.forEach() can be used in many ways
// including getting the index of the thing directly
// you could use (book, i) => {function guts here} and that gives you the index as well
// and use that in your function guts.
// books.forEach((book) => recordTableBody.append(bookToRow(book)));