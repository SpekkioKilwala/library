# library
The Odin Project: Library assignment

The app has three main interactions.
1. Data input (add new books via a modal) (done)
2. Generate a displayed table from the data. (done)
3. Editing and deleting the data via that same table. (done)

I elected to use an actual table to format the information, on the
basis that the information has clear relationships to the topmost
and leftmost cells. This however has certainly not made the styling
easy, or provide any easy methods of accessing those header
cells programmatically, so I plan on experimenting with a grid
next time.

There's a few little little UI/UX issues which would be nice to clean up if I can find out how.
- The text fields and brackets don't seem to want to line up the same on different devices, though they're both Chrome.
- Similarly, the sizing of the checkboxes and the "remove" button doesn't seem quite consistent either.
- Using autofill on my home (fedora) computer applies a white background to the field, though this is not seen on the work (windows) computer (again, both Chrome)
- Nice scrolling if you have a LOT of books. (sticky top line)

Furthermore, there's some points that would be valuable to work out for a full-scale project:
- Modals for detailed information on different items
- Ensuring that the row construction scales when you have 10,000 of them loaded at once (I have an *actual project* that will need this)
- Saving, loading to a proper backend