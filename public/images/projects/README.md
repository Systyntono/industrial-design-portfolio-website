# Project photos

One folder per project. The folder name **must** match the project's `slug`
in `data/projects.ts`.

```
public/images/projects/
  helmet-1/            <- slug "helmet-1"
    hero.jpg
    research-01.jpg
    final-hero.jpg
    awards/
      red-dot.svg
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

Reference them anyway. A file that isn't there renders as a **coloured block**
at the right size and position, labelled with the filename — so you can build
the whole page layout first and drop files in later. Nothing to change when
you do; just add the file.

## Award logos

Drop them in the project folder (an `awards/` subfolder works too) and list
the filenames:

```ts
overview: {
  awards: ["red-dot.svg", { src: "idsa.png", alt: "IDSA", href: "https://…" }],
}
```

They're normalised to a common height, so logos of different sizes still line
up. SVG or PNG with a transparent background works best.

## Video

Drop an `.mp4` in the folder and use a `feature` block:

```ts
{ type: "feature", video: "final.mp4" }
```

## Cover images

The card in the More Projects grid and the home page gallery uses the `image`
field in `data/projects.ts`. Hero-gallery projects point at
`/images/hero/<slug>.jpg`; everything else points at
`/images/projects/<slug>/cover.jpg`, so adding a `cover.jpg` to the folder is
all it takes to light that card up.

## A note on file size

Photos are served through Next's image optimizer, so large sources still
*display* fine — but they slow every build and dev refresh, and they live in
git history forever. Exporting at around **2400px on the long edge** is plenty
for full-bleed web use.
