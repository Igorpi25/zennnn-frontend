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
