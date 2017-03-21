# QSF examples

[![license](https://img.shields.io/github/license/eskypl/qsf-examples.svg)](https://raw.githubusercontent.com/eskypl/qsf-examples/master/LICENSE)
[![GitHub watchers](https://img.shields.io/github/watchers/eskypl/qsf-examples.svg?style=social&label=Watch)](https://github.com/eskypl/qsf-examples)

This guide is designed for website owners who became eSky.pl affiliates and
want to implement eSky's QSF (Quick Search Form). This guide will introduce to you
basic concepts required to correctly implement QSF.

Any technical questions or suggestions should be posted as issues on GitHub.

## How to use this repository?

This repository provides both, an working example of QSF and a developer guide
which describes in details, how QSF is constructed.

Examples are located in [docs](./docs) folder which contains index off
all possible QSFs. Each QSF has its own developer guide.

> Guide and example are focused only on technical aspects of building QSF. Any
> design & usability topics are not covered here.

## Using examples

Each example is a working HTML page, containing a sample implementation. You can
use it on your webpage, however we strongly encourage you to adapt QSF for your
own needs.

### Requirements

You should have GIT, Node.js with npm installed on your system.

### Installation

1. Clone this repository:

    ```
    git clone https://github.com/eskypl/qsf-examples.git
    ```

1. Run installation:

    ```
    npm install
    ```

### Running

1. Start local server:

    ```
    npm start
    ```

    You should see something like:
    
    ```
    [BS] Access URLs:
     ----------------------------------
           Local: http://localhost:3000
        External: http://10.0.75.1:3000
     ----------------------------------
              UI: http://localhost:3001
     UI External: http://10.0.75.1:3001
     ----------------------------------
    [BS] Serving files from: ./
    [BS] Watching files...
    ```

1. Open `http://localhost:3000` in your browser to see list of provided examples.

## License and liability

&copy; 2017 eSky.pl S.A.

As stated in [license](./LICENSE), eSky.pl S.A does not provide any guaranty or support
for this repository.