import { Star } from "lucide-react";
import { getTestimonials } from "@/lib/admin-data";

export default function ProductReviews({ productName }: { productName?: string }) {
  const { testimonials } = getTestimonials();
  const published = testimonials.filter((t) => !t.pending);

  // Priorité aux avis mentionnant ce produit, sinon les 4 derniers
  const specific = productName
    ? published.filter(
        (t) =>
          t.product &&
          (t.product.toLowerCase().includes(productName.toLowerCase()) ||
            productName.toLowerCase().includes(t.product.toLowerCase()))
      )
    : [];

  const reviews = specific.length >= 2 ? specific.slice(0, 6) : published.slice(0, 4);

  if (reviews.length === 0) return null;

  const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-stone-100">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h2 className="font-serif text-3xl font-bold text-bakery-black">
          Avis clients
        </h2>
        <div className="flex items-center gap-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-5 h-5 ${s <= Math.round(avgRating) ? "fill-bakery-gold text-bakery-gold" : "text-stone-200"}`}
              />
            ))}
          </div>
          <span className="font-semibold text-bakery-black">{avgRating.toFixed(1)}</span>
          <span className="text-stone-400 text-sm">({reviews.length} avis)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {reviews.map((r) => (
          <div key={r.id} className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm">
            <div className="flex mb-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-4 h-4 ${s <= r.rating ? "fill-bakery-gold text-bakery-gold" : "text-stone-200"}`}
                />
              ))}
            </div>
            <p className="text-stone-600 text-sm leading-relaxed italic mb-4">
              &ldquo;{r.text}&rdquo;
            </p>
            <div className="mt-auto">
              <p className="font-semibold text-sm text-bakery-black">{r.name}</p>
              {r.role && <p className="text-xs text-stone-400">{r.role}</p>}
              {r.date && <p className="text-xs text-stone-300 mt-0.5">{r.date}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
