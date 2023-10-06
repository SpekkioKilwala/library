# library
The Odin Project: Library assignment

The app has three main interactions.
1. Data input (add new books via a modal) (done)
2. Generate a displayed table from the data. (done)
3. Editing and deleting the data via that same table. (done)

A button to add 5 hardcoded books is provided to see
the scrolling behaviour.

I elected to use an actual table to format the information, on the
basis that the information has clear relationships to the topmost
and leftmost cells. This however has certainly not made the styling
easy, or provide any easy methods of accessing those header
cells programmatically, so I plan on experimenting with a grid
next time.

Known bugs:
- The text fields and brackets don't seem to want to line up the same on different devices (both running Chrome)
- Similarly, the sizing of the checkboxes and the "remove" button doesn't seem quite consistent either.
- Using autofill on my home (fedora) computer applies a white background to the field, though this is not seen on the work (windows) computer (again, both Chrome)

Planned features:
- Nice scrolling if you have a LOT of books. (sticky top line)
- Styled scrollbar on non-chrome browsers
- Modals for detailed information on different items
- Ensure row construction is still performative with 20,000 rows
- Saving, loading to a proper backend