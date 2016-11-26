syndicate-g
===========

A Node.js based web app that converts Google+ _Public_ posts to RSS feed.

## Requirements

Get a Google [API key](https://code.google.com/apis/console/) to be able to fetch G+ posts.

Optional Requirements:

  * Redis >= 2.4

## Getting Started

To install the required dependencies run:

    npm install

Copy `config-empty.js` to `config.js`. Adjust the server, db and google API key settings.

To start run:

    npm start

To start on Windows run:

    npm run-script start_win

Open `http://localhost:8008` in your browser.

## License

[MIT](LICENSE)
