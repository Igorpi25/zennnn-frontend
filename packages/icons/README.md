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
- `colorfull` - colored icons
- `flags` - flags icons

## Scripts

### generate-icons.js

Generate `index.ts` file with paths of svg icons from `source` folder.

### get-svg-path.js

Get path from svg file, params `--name` - filename.

### generate-image-placeholder.js

Generate base64 string with `sharp`(peerDependencies) from image, params `--name` - filename, `--size` - size, default 20.

### generate-favicon.js

Generate favicon with `sharp` and `to-ico`(peerDependencies), input file `temp/favicon.svg`, output `dist/favicon.svg`.

### Optimize colorfull icons with svgo

```
yarn svgo -f ./colorfull -o ./colorfull
```

## Notes

- `Common/No..svg` copied to `common/No.svg`. TODO: rename to `common/No.svg` and remove `common/No..svg`
- `Common/Edit.svg` (line 6) -> `common/Edit-alt.svg` (reversed path, removed \*-rule tags)
- `Common/Reply.svg` (line 6) -> `common/Reply-alt.svg`
- `Common/Users.svg` (line 6) -> `common/Users-alt.svg`
- `Common/Th-large-outlines.svg` (reversed path, removed \*-rule tags)

icon-big

- `Icon Big/User32.svg` -> `icon-big/User-circle.svg`
- `Icon Big/Arrow32.svg` -> `icon-big/Arrow.svg`
- `Icon Big/Stop32.svg` -> `icon-big/Stop.svg`
- `Icon Big/Template32.svg` -> `icon-big/Template.svg` (removed \*-rule tags)
- `Icon Big/Video32.svg` -> `icon-big/Video.svg` (removed \*-rule tags)
- `Icon Big/Check48.svg` -> `colorfull/Check48.svg`, figma incorrect export, outline circle should be child object
- `Icon Big/Hello.svg` -> `colorfull/Hello.svg`

colorfull

- `Colorfull/Checked-sm.svg` -> `Common/Checked-sm.svg`

missing

- `missing/checkbox-marked.svg` and `missing/minus.svg` used in checkboxs
- `status-point` and `status-point-sm` used for inputs validation status and radio buttons
- added file `missing/Moon-outline.svg` to `missing`
