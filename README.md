syndicate-g
===========

A Node.js based webapp that converts Google+ _Public_ posts to RSS feed.

## Requirements

Required software:
  
  * Redis >= 2.4

Also, you need to get a Google [API key](https://code.google.com/apis/console/) to be able to fetch posts.

## Getting Started

To install the required dependencies run:

    npm install

Copy `config-empty.js` to `config.js`. Open the config file and adjust the server, db and Google+ settings.

To start the server run:

    npm start 

To start the server under Windows run:

    npm run-script start_win

## Build

TODO

## Usage

Open `http://localhost:8008` in browser.

## License

[MIT License](LICENSE)