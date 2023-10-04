# library
The Odin Project: Library assignment

The app has three main interactions.
1. Data input (add new books via a modal) (done)
2. Generate a displayed table from the data. (done)
3. Editing and deleting the data via that same table. (done)

There's also a half-dozen little UI/UX issues which would be nice to clean up if I can find out how.
- Placeholders on all input fields
- Nice scrolling if you have a LOT of books
- The text fields and brackets don't seem to want to line up the same on different devices, though they're both Chrome.
- Using autofill on my home (fedora) computer applies a white background to the field, though this is not seen on the work (windows) computer (again, both Chrome)
- Figure out what to do with the sidebar and top bar

Furthermore, there's some points that would be valuable to work out for a full-scale project:
- Modals for detailed information on different items
- Ensuring that the row construction scales when you have 10,000 of them loaded at once (I have an *actual project* that will need this)
- Saving, loading to a proper backend