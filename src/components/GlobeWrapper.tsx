export default function GlobeWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      dir="ltr"
      style={{
        direction: "ltr",
        unicodeBidi: "isolate",
        width: "100%",
        height: "100%",
      }}
    >
      {children}
    </div>
  );
}
