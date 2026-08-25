export default function Spinner() {
  return (
    <div
      id="spinner"
      className="show w-100 vh-100 bg-white position-fixed translate-middle top-50 start-50 d-flex flex-column align-items-center justify-content-center"
      style={{ zIndex: 99999 }}
    >
      <div className="relative flex items-center justify-center">
        <div className="absolute -inset-3 rounded-full bg-[#fff0ad]/60 animate-pulse blur-md" />
        <img
          src="/assets/logo.png"
          alt="Makhan Chor"
          className="relative w-28 h-auto object-contain animate-pulse"
        />
      </div>
    </div>
  );
}

