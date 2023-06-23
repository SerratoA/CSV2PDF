# CSV2PDF


A graphical user interface for converting a CSV files filled with URL entries into a PDF file with screencaps of the sites.
<img width="433" alt="Cat" src="https://github.com/SerratoA/CSV2PDF/assets/78953056/8e5ee266-b744-4d79-84b5-a11b0f5576cb">



## Usage

Install dependencies:

```bash

npm install
```

Run:

```bash
npm start
```

You can also use `Electronmon` to constantly run and not have to reload after making changes

```bash
npx electronmon .
```

## Packaging

There are multiple ways to package Electron apps. I would suggest [Electron Forge](https://www.electronforge.io/). I did not implement any packaging into this app.

## Developer Mode

If your `NODE_ENV` is set to `development` then you will have the dev tools enabled and available in the menu bar. It will also open them by default.

When set to `production`, the dev tools will not be available.
