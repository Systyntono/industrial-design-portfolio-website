import { GRID, LAYOUT, SPACE } from "./projectTokens";

/**
 * The page's outer measure: centred, capped, with consistent side padding.
 * Use `bleed` for a section that runs edge to edge.
 */
export function Container({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`mx-auto w-full ${className}`}
      style={{
        maxWidth: LAYOUT.contentMax,
        paddingLeft: SPACE.pagePad,
        paddingRight: SPACE.pagePad,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/**
 * A 12-column grid. Gutters are 20% of a column width and expressed as a
 * percentage, so the rhythm holds at any window size or orientation.
 *
 * Children are <Col> elements. Row spacing is separate from the column
 * gutter — vertical rhythm follows the type scale, not the column width.
 */
export function Grid({
  children,
  className = "",
  rowGap,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  rowGap?: string | number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`grid ${className}`}
      style={{
        gridTemplateColumns: `repeat(${GRID.columns}, minmax(0, 1fr))`,
        columnGap: GRID.gutter,
        rowGap: rowGap ?? SPACE.block,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/**
 * A grid child.
 *
 * `className` carries the column span, as static Tailwind strings so the
 * compiler can see them — e.g. "col-span-12 md:col-span-6". Everything
 * defaults to the full 12 on phones and splits at a breakpoint, which is
 * what keeps text legible on a narrow screen instead of squeezing it into
 * a fraction of an already-narrow viewport.
 */
export function Col({
  children,
  className = "col-span-12",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}

/** Container + Grid together, the common case. */
export function GridSection({
  children,
  className = "",
  rowGap,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  rowGap?: string | number;
  style?: React.CSSProperties;
}) {
  return (
    <Container style={style}>
      <Grid className={className} rowGap={rowGap}>
        {children}
      </Grid>
    </Container>
  );
}
