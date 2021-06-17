# zennnn-icons

ZENNNN icons package

### Build icons from source and compile to es5 and commonjs

```
yarn build
```

`gen:icons` - generate `index.ts` file with paths of `source` icons, `es5` and `commonjs` generate js files.

## Folders structure

- `source`
  - `common` - default icons
  - `icon-big` - icons not included in `common`
  - `missing` - missing in figma icons
  - `only-blue` - icons not included in `common`
  - `social` - social icons
  - `special` - icons needed for components and not presented in figma
- `scripts` - scripts folder

## Scripts

### generate-icons.js

Generate `index.ts` file with paths of svg icons from `source` folder.

### get-svg-path.js

Get path from svg file, params `--name` - filename.

### generate-image-placeholder.js

Generate base64 string with `sharp`(peerDependencies) from image, params `--name` - filename, `--size` - size, default 20.

### generate-favicon.js

Generate favicon with `sharp` and `to-ico`(peerDependencies), input file `temp/favicon.svg`, output `dist/favicon.svg`.
