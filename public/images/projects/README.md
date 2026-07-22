# Project photos

One folder per project. The folder name **must** match the project's `slug`
in `data/projects.ts`.

```
public/images/projects/
  helmet-1/          <- slug "helmet-1"
    hero.jpg
    shell-detail.jpg
    process-01.jpg
  base24/
    ...
```

## Using a photo

In the project's content file (`data/projectContent/<slug>.ts`) reference the
**filename only** — the folder is implied by the project:

```ts
{ type: "image", src: "hero.jpg", alt: "..." }
```

A path starting with `/` is used as-is, for the rare shared image.

## Photos you haven't taken yet

Reference them anyway. A file that isn't there renders as a dashed
placeholder box labelled with the filename, at the right size and in the
right position — so you can build the whole page layout before the shoot and
just drop files in later.

## Cover images

The card in the More Projects grid uses the `image` field in
`data/projects.ts`. Hero-gallery projects point at `/images/hero/<slug>.jpg`;
everything else points at `/images/projects/<slug>/cover.jpg`, so adding a
`cover.jpg` to the folder is all it takes to light that card up.

## A note on file size

Photos are served through Next's image optimizer, so huge sources still
*display* fine — but they slow every build and dev refresh. Exporting at
around 2400px on the long edge is plenty for full-bleed web use.
