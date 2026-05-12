
## Project Structure

```bash
vanshbhatia2007-hotel_booking_website/
├── README.md
├── package.json
└── Backend/
    ├── README.md
    ├── app.js
    ├── cloudConflict.js
    ├── middleware.js
    ├── package.json
    ├── schema.js
    ├── controllers/
    │   ├── listing.js
    │   ├── reviews.js
    │   └── user.js
    ├── init/
    │   ├── data.js
    │   └── index.js
    ├── models/
    │   ├── listing.js
    │   ├── review.js
    │   └── user.js
    ├── public/
    │   ├── css/
    │   │   ├── rating.css
    │   │   └── style.css
    │   └── js/
    │       └── script.js
    ├── routes/
    │   ├── listing.js
    │   ├── reviews.js
    │   └── user.js
    ├── utils/
    │   ├── expresserror.js
    │   └── wrapasync.js
    └── views/
        ├── error.ejs
        ├── includes/
        │   ├── flash.ejs
        │   ├── footer.ejs
        │   └── navbar.ejs
        ├── layouts/
        │   └── boilerplate.ejs
        ├── listings/
        │   ├── edit.ejs
        │   ├── index.ejs
        │   ├── new.ejs
        │   └── show.ejs
        └── users/
            ├── login.ejs
            └── signup.ejs
