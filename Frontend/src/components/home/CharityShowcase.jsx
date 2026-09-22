import React, { useEffect, useState } from 'react';
import { charityApi } from '../../api/charities';
import Button from '../common/Button';
import { ArrowRight, Sparkles } from 'lucide-react';

const CharityShowcase = () => {
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const res = await charityApi.getCharities();
        if (res.data?.success && res.data.data?.charities?.length > 0) {
          setCharities(res.data.data.charities.slice(0, 3));
        } else {
          // Fallback curated preview if database empty
          setCharities([
            {
              id: 'c1',
              name: 'Green Fairways Conservation',
              description:
                'Preserving indigenous flora, wetlands, and bio-diverse habitats across suburban and rural golf corridor estates.',
              image_url:
                'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=800&q=80',
              category: 'Environment',
            },
            {
              id: 'c2',
              name: 'Youth In Sport Foundation',
              description:
                'Providing underprivileged junior players with equipment, certified PGA mentorship, and tournament sponsorships.',
              image_url:
                'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
              category: 'Youth Athletics',
            },
            {
              id: 'c3',
              name: 'Veterans Healing Greens',
              description:
                'Therapeutic outdoor recreational rehabilitation and community golf sessions for wounded service members.',
              image_url:
                'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80',
              category: 'Veterans & Health',
            },
          ]);
        }
      } catch (err) {
        setCharities([
          {
            id: 'c1',
            name: 'Green Fairways Conservation',
            description:
              'Preserving indigenous flora, wetlands, and bio-diverse habitats across golf corridors.',
            image_url:
              'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=800&q=80',
            category: 'Environment',
          },
          {
            id: 'c2',
            name: 'Youth In Sport Foundation',
            description:
              'Providing underprivileged junior players with golf equipment and mentorship.',
            image_url:
              'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
            category: 'Youth Athletics',
          },
          {
            id: 'c3',
            name: 'Veterans Healing Greens',
            description:
              'Therapeutic outdoor recreational golf rehabilitation for military veterans.',
            image_url:
              'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80',
            category: 'Veterans & Health',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCharities();
  }, []);

  return (
    <section className="py-28 sm:py-36 bg-[#F9F8F6] border-t border-[#1A1A1A]/10 relative">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#D4AF37] font-semibold block mb-3">
              PHILANTHROPY &bull; ACCREDITED CAUSES
            </span>
            <h2 className="font-serif text-4xl sm:text-6xl text-[#1A1A1A] tracking-tight leading-none">
              Choose Your <span className="italic font-light">Purpose.</span>
            </h2>
          </div>
          <Button to="/charities" variant="text" icon={<ArrowRight size={16} />}>
            View All Accredited Causes
          </Button>
        </div>

        {/* 3 Column Portrait Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {charities.map((charity) => (
            <div
              key={charity.id}
              className="bg-[#F9F8F6] border border-[#1A1A1A]/15 overflow-hidden flex flex-col group hover:border-[#1A1A1A] transition-all duration-500 shadow-sm"
            >
              {/* Image Container with 1800ms Grayscale-to-Color Reveal */}
              <div className="relative aspect-[4/3] overflow-hidden bg-[#EBE5DE]">
                <img
                  src={
                    charity.image_url ||
                    'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={charity.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[1800ms] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/60 via-transparent to-transparent opacity-60" />
                <div className="absolute top-4 left-4">
                  <span className="text-[10px] font-mono tracking-[0.2em] uppercase bg-[#F9F8F6] text-[#1A1A1A] px-3 py-1 border border-[#1A1A1A]/20 font-medium">
                    {charity.category || 'Philanthropy'}
                  </span>
                </div>
              </div>

              {/* Text Info */}
              <div className="p-7 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-2xl text-[#1A1A1A] mb-3 group-hover:text-[#D4AF37] transition-colors duration-300 font-normal tracking-tight">
                    {charity.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6C6863] leading-relaxed line-clamp-3 font-sans">
                    {charity.description}
                  </p>
                </div>

                <div className="mt-8 pt-5 border-t border-[#1A1A1A]/10 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#D4AF37] flex items-center gap-1.5 font-semibold">
                    <Sparkles size={13} />
                    Min 10% Contribution
                  </span>
                  <Button to="/charities" variant="text" size="sm">
                    Select Cause
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CharityShowcase;
