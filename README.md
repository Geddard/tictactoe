# TIC TAC TOE

Technology Stack: ReactJS, Redux, NodeJS, SASS, Socket.io.

1) Setup:

* Make sure you have the latest stable Node (5.10.1 and later are ok) and NPM versions.

* For development builds you need to have Ruby and the scss-lint gem installed:

    Steps:

    a) sudo apt-get install ruby
    b) gem install scss_lint

* Run "npm install".

2) Start the app:

    Option 1) Run "gulp heroku:production" for production build, then "node server.js" to start the server.

    Option 2) Run "gulp" for dev build, nodemon will start node by itself.

3) Open "http://localhost:3000" in any browser to start the app.

- For multiplayer, this has a very simple socket.io setup, if yuo start messing around with page refresh and
several browsers/devices, it will not work properly.
