import Image from "next/image";
import { rowAspectSum, type PhotoSeries } from "@/lib/photography";
import { SPACE, type as t } from "./projectTokens";

const GAP_PX = 12;

export default function PhotoGallery({
  series,
  targetRowHeight,
  notes = {},
}: {
  series: PhotoSeries[];
  targetRowHeight: number;
  notes?: Record<string, string>;
}) {
  return (
    <div className="flex flex-col" style={{ gap: 112 }}>
      {series.map((set) => (
        <section key={set.key || "opening"}>
          {set.title && (
            <header className="mb-8">
              <h2
                className="font-medium tracking-tight"
                style={{ ...t.h2, color: "var(--pp-fg)" }}
              >
                {set.title}
              </h2>
              {notes[set.key] && (
                <p className="mt-2" style={{ ...t.caption, color: "var(--pp-muted)" }}>
                  {notes[set.key]}
                </p>
              )}
            </header>
          )}

          <div className="flex flex-col" style={{ gap: GAP_PX }}>
            {set.rows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="flex flex-col sm:flex-row"
                style={{
                  gap: GAP_PX,
                  // A final short row would otherwise stretch to full width and
                  // blow its photos up past everything above. Capping the row
                  // at the width it would naturally occupy keeps it in scale.
                  maxWidth: rowAspectSum(row) * targetRowHeight + GAP_PX * (row.length - 1),
                }}
              >
                {row.map((photo) => (
                  <div
                    key={photo.src}
                    // Width in proportion to aspect, so every photo in the row
                    // resolves to the same height with no cropping.
                    style={{ flexGrow: photo.aspect, flexBasis: 0, minWidth: 0 }}
                  >
                    <Image
                      src={photo.src}
                      alt=""
                      width={photo.width}
                      height={photo.height}
                      sizes="(max-width: 640px) 100vw, 60vw"
                      className="h-auto w-full"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
