import Link from "next/link";

export default function CartSummary() {
  return (
    <div className="mt-6 flex justify-end">
      <div className="w-full sm:w-80 rounded border border-[#fff0ad] bg-[#fff0ad] p-5">
        <h3 className="heading-font text-lg font-bold text-[#d20b4f] mb-3 border-b border-[#d20b4f]/20 pb-2">
          Cart Total
        </h3>

        <div className="space-y-2 text-xs sm:text-sm text-black font-bold">
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

        <Link
          href="/checkout"
          className="mt-4 block w-full rounded bg-[#d20b4f] py-2 text-center text-sm font-bold text-black transition hover:bg-[#b80943] no-underline"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
