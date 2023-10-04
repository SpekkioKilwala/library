# library
The Odin Project: Library assignment


Three main, independent arms that all need development.
1. Data input. Interrupt submit, capture input, if it's good make the object and clear elements, if it's bad toss an error. ALSO needs to be a modal.
2. Non-terrible way of generating your table from your data.
3. Editing existing data (or deleting).
    An edit should work very similarly to the original creation because you just want
    to re-create that html element from the underlying object.


Status:
1: Done?
2: Done?
3: In progress

There's also a half-dozen little UI/UX issues which would be nice to clean up if I can find out how.
- Placeholders on all input fields
- Nice scrolling if you have a LOT of books
- The text fields and brackets don't seem to want to line up the same on different devices, though they're both Chrome.
- Using autofill on my home (fedora) computer applies a white background to the field, though this is not seen on the work (windows) computer (again, both Chrome)

Furthermore, there's some points that would be valuable to work out for a full-scale project:
- Modals for detailed information on different items
- Ensuring that the row construction scales when you have 10,000 of them loaded at once (I have an *actual project* that will need this)
- Saving, loading to a proper backend