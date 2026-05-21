HOW TO ADD PHOTOS — mcgill-tech-fair
=================================================

1. Drop your image files into this folder.

   Naming convention:
     cover.jpg      → thumbnail on the portfolio grid
     01.jpg         → first gallery image
     02.jpg         → second gallery image
     (and so on...)

   Supported formats: .jpg  .jpeg  .png  .webp

2. Open events/mcgill-tech-fair.html in a text editor.

3. Update the EVENT_IMAGES array:

   const EVENT_IMAGES = [
     "01.jpg",
     "02.jpg",
     "03.jpg",
   ];

4. Save the file. The gallery builds itself automatically.

No other changes needed.
