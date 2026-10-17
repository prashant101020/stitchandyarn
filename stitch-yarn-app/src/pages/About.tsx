import { Link } from 'react-router-dom';
import { ArrowRight, Heart } from 'lucide-react';
import { FadeUp, SectionHeading } from '@/components/UI';
import { SectionDivider } from '@/components/Motifs';

export function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-b from-surface to-cream py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <FadeUp>
            <span className="font-script text-3xl text-primary block mb-2">the story behind</span>
            <h1 className="font-heading text-4xl md:text-5xl font-semibold text-cocoa mb-6">
              Stitch & Yarn
            </h1>
          </FadeUp>
        </div>
      </section>

      {/* About Deepa */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="md:flex items-start gap-12">
          <FadeUp className="md:w-2/5 mb-10 md:mb-0">
            <div className="sticky top-24">
              <div className="rounded-3xl overflow-hidden shadow-card border-2 border-rose-line/20">
                <img
                  src="/logo.jpeg"
                  alt="Deepa, the creator of Stitch & Yarn"
                  className="w-full aspect-square object-cover"
                />
              </div>
              <div className="mt-4 text-center">
                <p className="font-script text-2xl text-primary">Deepa</p>
                <p className="label-caps text-cocoa-light text-xs">Founder & Maker</p>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.15} className="md:w-3/5">
            <div className="space-y-5 text-cocoa-light leading-relaxed">
              <p className="text-lg text-cocoa font-heading font-medium">
                It started with a single hook and a ball of yarn.
              </p>
              <p>
                On a quiet evening in 2024, I picked up a crochet hook for the first time — just to try something new, something away from screens. That first wobbly little flower changed everything. Within weeks, my evenings were filled with yarn in every colour, and my tiny desk was covered in flowers, letters, and half-finished ideas.
              </p>
              <p>
                Friends started asking for pieces. "Can you make one for me?" turned into "Can you make one for my sister?" and slowly, what began as a hobby became something much more meaningful.
              </p>
              <p>
                <strong className="text-cocoa">Stitch & Yarn</strong> was born from that feeling — the joy of making something with your hands, the quiet pride of creating something beautiful stitch by stitch, and the happiness of seeing someone smile when they receive it.
              </p>
              <p>
                Every piece here is made by me, at my little workspace, with carefully chosen yarn and a whole lot of patience. Nothing is factory-made. Nothing is rushed. Each flower has the right number of petals. Each letter is shaped and reshaped until it looks just right. Each bead is strung with intention.
              </p>
              <p>
                I believe handmade things carry a kind of warmth that nothing else can. When you hold one of my pieces, I hope you feel that — the time, the care, the love that went into every single stitch.
              </p>
              <p className="text-cocoa font-medium">
                Thank you for being here, and for choosing handmade. It means the world to me. 💕
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-6">
              {[
                { number: '500+', label: 'Happy customers' },
                { number: '1,200+', label: 'Pieces crafted' },
                { number: '100%', label: 'Handmade with love' },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <p className="font-heading text-2xl font-semibold text-primary">{stat.number}</p>
                  <p className="text-xs text-cocoa-light label-caps">{stat.label}</p>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      <SectionDivider />

      {/* Values */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <FadeUp>
          <SectionHeading
            scriptAccent="what we believe"
            title="Made with Intention"
          />
        </FadeUp>
        <div className="grid md:grid-cols-3 gap-8 mt-8">
          {[
            {
              emoji: '🧶',
              title: 'Truly Handmade',
              desc: 'No machines, no shortcuts. Every piece is crocheted by hand from start to finish — each one slightly unique, and that\'s the beauty of it.',
            },
            {
              emoji: '🌿',
              title: 'Thoughtful Materials',
              desc: 'I choose soft, vibrant, durable yarn and quality hardware. Each bead, each pearl, each ring is picked to last and look beautiful.',
            },
            {
              emoji: '🎁',
              title: 'Gift-Ready Always',
              desc: 'Every order is wrapped with care in pretty packaging. Because the unboxing should feel just as special as the piece inside.',
            },
          ].map((val, i) => (
            <FadeUp key={val.title} delay={i * 0.1}>
              <div className="text-center bg-surface rounded-2xl p-8 shadow-soft border border-rose-line/10">
                <span className="text-4xl block mb-4">{val.emoji}</span>
                <h3 className="font-heading text-xl font-medium text-cocoa mb-2">{val.title}</h3>
                <p className="text-sm text-cocoa-light leading-relaxed">{val.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <FadeUp>
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-cocoa mb-4">
            Ready to find your piece?
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/shop" className="btn btn-primary">
              Shop the collection <ArrowRight size={16} />
            </Link>
            <Link to="/custom-order" className="btn btn-secondary">
              <Heart size={16} /> Request something custom
            </Link>
          </div>
        </FadeUp>
      </section>
    </main>
  );
}
