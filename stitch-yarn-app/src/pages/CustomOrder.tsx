import { useState } from 'react';
import { Upload, Sparkles, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { FadeUp } from '@/components/UI';
import { siteSettings } from '@/data';

export function CustomOrderPage() {
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    description: '', colours: '', deadline: '',
  });
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit number';
    if (!form.description.trim()) e.description = 'Tell us what you\'d like!';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be under 5MB');
        return;
      }
      setReferenceImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Build WhatsApp message
    const msg = [
      `Hi Deepa! 💕 I'd love a custom piece:`,
      '',
      `👤 Name: ${form.name}`,
      `📱 Phone: ${form.phone}`,
      form.email ? `📧 Email: ${form.email}` : '',
      '',
      `📝 What I'd like:`,
      form.description,
      '',
      form.colours ? `🎨 Colours: ${form.colours}` : '',
      form.deadline ? `📅 Need by: ${form.deadline}` : '',
      referenceImage ? `📷 (I have a reference image I'll share)` : '',
    ].filter(Boolean).join('\n');

    window.open(
      `https://wa.me/${siteSettings.whatsapp_number}?text=${encodeURIComponent(msg)}`,
      '_blank'
    );
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-20 text-center">
        <FadeUp>
          <div className="text-5xl mb-4">✨</div>
          <h1 className="font-heading text-3xl font-semibold text-cocoa mb-3">
            Request sent!
          </h1>
          <p className="text-cocoa-light mb-6 max-w-md mx-auto">
            Your custom order request has been opened in WhatsApp. Deepa will review it and get back to you within 24 hours. If you have a reference image, send it in the chat!
          </p>
          <button onClick={() => setSubmitted(false)} className="btn btn-secondary">
            Submit another request
          </button>
        </FadeUp>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-20">
      <FadeUp>
        <div className="text-center mb-10">
          <span className="font-script text-3xl text-primary block mb-2">imagine it</span>
          <h1 className="font-heading text-4xl md:text-5xl font-semibold text-cocoa mb-3">
            Custom Order Request
          </h1>
          <p className="text-cocoa-light max-w-lg mx-auto">
            Have something special in mind? Describe your dream piece and I'll bring it to life with yarn and love. Pricing depends on complexity — I'll share a quote before starting.
          </p>
        </div>
      </FadeUp>

      <FadeUp delay={0.1}>
        <form onSubmit={handleSubmit} className="bg-surface rounded-2xl p-6 md:p-8 border border-rose-line/20 shadow-card space-y-5">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Sparkles size={20} />
            <h2 className="font-heading text-xl font-medium text-cocoa">Tell me about your piece</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Your Name *" id="co-name" value={form.name} error={errors.name}
              onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="Priya" />
            <Field label="Phone *" id="co-phone" value={form.phone} error={errors.phone} type="tel"
              onChange={v => setForm(f => ({ ...f, phone: v }))} placeholder="9876543210" />
            <Field label="Email" id="co-email" value={form.email} className="sm:col-span-2"
              onChange={v => setForm(f => ({ ...f, email: v }))} placeholder="priya@example.com" />
          </div>

          <div>
            <label htmlFor="co-desc" className="label-caps text-cocoa-light block mb-1.5">
              What would you like? *
            </label>
            <textarea
              id="co-desc"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={4}
              placeholder="e.g., A crochet bouquet of 5 sunflowers with green leaves, in a cream pot, as a birthday gift for my friend..."
              className={`w-full px-4 py-2.5 rounded-xl border bg-cream text-cocoa placeholder:text-cocoa-light/50 focus:outline-none text-sm resize-none transition-colors ${
                errors.description ? 'border-red-400' : 'border-rose-line/40 focus:border-primary'
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Preferred Colours" id="co-colours" value={form.colours}
              onChange={v => setForm(f => ({ ...f, colours: v }))} placeholder="Pink, yellow, sage green" />
            <div>
              <label htmlFor="co-deadline" className="label-caps text-cocoa-light block mb-1.5">
                Need it by
              </label>
              <input
                id="co-deadline"
                type="date"
                value={form.deadline}
                onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-rose-line/40 bg-cream text-cocoa focus:border-primary focus:outline-none text-sm"
              />
            </div>
          </div>

          {/* Reference image upload */}
          <div>
            <label className="label-caps text-cocoa-light block mb-1.5">
              Reference Image (optional)
            </label>
            <div className="relative">
              {previewUrl ? (
                <div className="relative rounded-xl overflow-hidden border border-rose-line/30">
                  <img src={previewUrl} alt="Reference preview" className="w-full max-h-48 object-contain bg-cream-dark" />
                  <button
                    type="button"
                    onClick={() => { setReferenceImage(null); setPreviewUrl(null); }}
                    className="absolute top-2 right-2 w-8 h-8 bg-cocoa/70 text-cream rounded-full flex items-center justify-center hover:bg-cocoa transition-colors text-sm"
                    aria-label="Remove image"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="co-image"
                  className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-rose-line/30 rounded-xl bg-cream/50 hover:bg-cream-dark cursor-pointer transition-colors"
                >
                  <Upload size={24} className="text-cocoa-light mb-2" />
                  <p className="text-sm text-cocoa-light">Click to upload a reference image</p>
                  <p className="text-xs text-cocoa-light/60 mt-1">PNG, JPG up to 5MB</p>
                  <input
                    id="co-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="sr-only"
                  />
                </label>
              )}
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full justify-center mt-4">
            <Sparkles size={18} /> Submit Request via WhatsApp
          </button>

          <p className="text-xs text-cocoa-light/60 text-center">
            Your request will open WhatsApp so Deepa can discuss details directly with you.
          </p>
        </form>
      </FadeUp>
    </main>
  );
}

function Field({
  label, id, value, onChange, error, placeholder = '', type = 'text', className = '',
}: {
  label: string; id: string; value: string; onChange: (v: string) => void;
  error?: string; placeholder?: string; type?: string; className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="label-caps text-cocoa-light block mb-1.5">{label}</label>
      <input
        id={id} type={type} value={value}
        onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className={`w-full px-4 py-2.5 rounded-xl border bg-cream text-cocoa placeholder:text-cocoa-light/50 focus:outline-none text-sm transition-colors ${
          error ? 'border-red-400' : 'border-rose-line/40 focus:border-primary'
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{error}</p>}
    </div>
  );
}
