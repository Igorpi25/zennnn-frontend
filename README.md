# zennnn-frontend

```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Compiles and hot-reloads Paper app for development
```
npm run serve:admin
```
Builds Admin app for development with `--mode admin.dev`, using `.env`, `.env.admin.dev` and `.env.admin.dev.local` if they are present.

### Compiles and minifies Paper app for production
```
npm run build:admin
```
Builds Paper app for production with `--mode admin`, using `.env`, `.env.admin` and `.env.admin.local` if they are present.

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Previewing locally
```
# install serve package globally
npm install -g serve
# build and preview locally
npm run build && serve -s dist
```
See [Docs](https://cli.vuejs.org/guide/deployment.html#previewing-locally).

### Environment Variables
See [Docs](https://cli.vuejs.org/guide/mode-and-env.html).

### Date parse on safari
Parsing ISO 8601 or format like YYYY-MM-DD return Invalid Date on safari. Solved by using `date-fns/parseISO` for safely parse ISO 8601.

### pdfMake plugin custom fonts
Used [v0.1](https://github.com/bpampuch/pdfmake/tree/0.1).
```
git clone --branch 0.1 https://github.com/bpampuch/pdfmake.git
cd pdfmake
npm install
```
For build `vfs_fonts.js` with custom fonts, see [docs](https://pdfmake.github.io/docs/fonts/custom-fonts-client-side/).
`vfs_fonts.js` copied to `src/plugins/pdfmake/vfs_fonts.js`

For print in `zh-Hans` used custom font `NotoSansCJKsc`, for `zh-Hant` used `NotoSansCJKtc`, others used `MyriadPro`.
Builded by `gulp buildFonts` custom fonts files for Noto can't import from `.js` files (perhaps due to file size ~44MB). Custom fonts for Noto generated with custom script, to `.json` file and loaded from s3, path to files `<process.env.VUE_APP_IMAGE_DOWNLOAD_HOSTNAME>/pdf/vfs/vfs_fonts_<FONT NAME>.json`.
TODO: not work `.open()` method with Noto font, blocked by browser.
