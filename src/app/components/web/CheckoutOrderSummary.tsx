const orderItems = [
  { img: "/assets/best-selling.png", name: "Handmade Velvet Poshak (Size 4)", price: "₹349.00", qty: 1, total: "₹349.00" },
  { img: "/assets/pagdi.png", name: "Royal Zardozi Pagdi", price: "₹180.00", qty: 1, total: "₹180.00" },
  { img: "/assets/kundan.png", name: "Pure Kundan Haar & Tilak Set", price: "₹320.00", qty: 1, total: "₹320.00" },
];

export default function CheckoutOrderSummary() {
  return (
    <div className="w-full lg:w-5/12 rounded border border-[#fff0ad] bg-[#fff0ad] p-5 sm:p-6">
      <h3 className="heading-font text-lg font-bold text-[#d20b4f] mb-4 border-b border-[#d20b4f]/20 pb-2">
        Order Summary
      </h3>

      {/* Items list */}
      <div className="space-y-3 divide-y divide-[#d20b4f]/10">
        {orderItems.map((item, i) => (
          <div key={i} className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded bg-white p-1 flex items-center justify-center">
                <img
                  src={item.img}
                  className="h-full w-full object-contain"
                  alt={item.name}
                />
              </div>
              <div>
                <h6 className="heading-font text-xs font-bold text-black mb-0">
                  {item.name}
                </h6>
                <span className="text-[10px] text-black">Qty: {item.qty}</span>
              </div>
            </div>
            <span className="text-xs font-bold text-[#d20b4f]">
              {item.total}
            </span>
          </div>
        ))}
      </div>

      {/* Price breakdown */}
      <div className="mt-4 border-t border-[#d20b4f]/20 pt-3 space-y-1.5 text-xs text-black font-bold">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>₹849.00</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery:</span>
          <span>Free</span>
        </div>
        <div className="border-t border-[#d20b4f]/20 pt-2 flex justify-between items-center text-sm">
          <span className="text-black">Total:</span>
          <span className="text-[#d20b4f] text-base">₹849.00</span>
        </div>
      </div>

      {/* Payment methods */}
      <div className="mt-6 space-y-2">
        <h4 className="heading-font text-xs font-bold text-[#d20b4f] mb-2">
          Payment Method :
        </h4>

        {[
          { id: "upi", label: "Instant UPI (Google Pay, PhonePe, Paytm, QR)" },
          { id: "card", label: "Credit / Debit Card / Net Banking" },
          { id: "cod", label: "Cash on Delivery (COD)" },
        ].map((m, idx) => (
          <label
            key={m.id}
            className="flex items-center gap-2 rounded bg-white p-2 text-xs font-bold text-black cursor-pointer"
          >
            <input
              type="radio"
              name="payment"
              defaultChecked={idx === 0}
              className="text-[#d20b4f]"
            />
            <span>{m.label}</span>
          </label>
        ))}
      </div>

      {/* Place Order button */}
      <div className="mt-6">
        <button
          type="button"
          className="w-full rounded bg-[#d20b4f] py-2.5 text-center text-sm font-bold text-black transition hover:bg-[#b80943] border-0 cursor-pointer"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}
