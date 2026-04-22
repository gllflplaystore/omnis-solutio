// CurrencyCircle.jsx
import "../styles/App.css";
import Favicon from "../../public/Omnis_Favicon.svg";

const CurrencyCircle = () => {
  const items = [
    { type: "flag", src: "https://flagcdn.com/it.svg" },
    { type: "text", val: "$" },
    { type: "flag", src: "https://flagcdn.com/xk.svg" },
    { type: "text", val: "₽" },
    { type: "flag", src: "https://flagcdn.com/gb.svg" },
    { type: "text", val: "₦" },
    { type: "flag", src: "https://flagcdn.com/ae.svg" },
    { type: "text", val: "€" },
    { type: "flag", src: "https://flagcdn.com/ch.svg" },
    { type: "text", val: "£" },
    { type: "flag", src: "https://flagcdn.com/gr.svg" },
    { type: "text", val: "¥" },
  ];

  const radius = 240; // Distance from center (in pixels)

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="relative w-[980px] h-[680px] flex items-center justify-center">
        {/* Center Logo */}
        <div className="z-10 p-4 rounded-full border border-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
          <img src={Favicon} alt="Omnis Logo" className="w-12 h-12" />
        </div>

        {/* The Moving Ring */}
        <div className="absolute w-full h-full animate-circle">
          {items.map((item, index) => {
            // Calculating the initial position of each icon
            const angle = (index * 360) / items.length;
            const x = radius * Math.cos((angle * Math.PI) / 180);
            const y = radius * Math.sin((angle * Math.PI) / 180);

            return (
              <div
                key={index}
                className="absolute"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {/* Each icon counters the main rotation to stay upright */}
                <div className="w-14 h-14 bg-[#111] border border-gray-800 rounded-full flex items-center justify-center shadow-xl animate-icon-upright">
                  {item.type === "flag" ? (
                    <img
                      src={item.src}
                      className="w-8 h-8 rounded-full object-cover"
                      alt="icon"
                    />
                  ) : (
                    <span className="text-white text-xl font-bold">
                      {item.val}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Visual guide line (Optional) */}
        <div className="absolute w-[480px] h-[480px] border border-white/5 rounded-full pointer-events-none" />
      </div>
    </div>
  );
};

export default CurrencyCircle;
