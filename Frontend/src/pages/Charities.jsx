import React, { useState, useEffect } from 'react';
import { charityApi } from '../api/charities';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import { Search, Heart, Check, Sparkles, AlertCircle } from 'lucide-react';

const Charities = () => {
  const { isAuthenticated } = useAuth();

  const [charities, setCharities] = useState([]);
  const [myCharity, setMyCharity] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Selection Modal
  const [selectedCharityForModal, setSelectedCharityForModal] = useState(null);
  const [contributionPct, setContributionPct] = useState(15);
  const [savingSelection, setSavingSelection] = useState(false);
  const [selectionModalOpen, setSelectionModalOpen] = useState(false);
  const [modalError, setModalError] = useState(null);

  const fetchCharities = async (search = '') => {
    setLoading(true);
    try {
      const res = await charityApi.getCharities(search);
      if (res.data?.success) {
        setCharities(res.data.data.charities || []);
      }
    } catch (err) {
      setError(err.customMessage || 'Failed to load charities.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyCharity = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await charityApi.getMyCharity();
      if (res.data?.success) {
        setMyCharity(res.data.data);
      }
    } catch (err) {
      setMyCharity(null);
    }
  };

  useEffect(() => {
    fetchCharities();
    fetchMyCharity();
  }, [isAuthenticated]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCharities(searchTerm);
  };

  const openSelectModal = (charity) => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    setSelectedCharityForModal(charity);
    setContributionPct(
      myCharity?.charity_id === charity.id ? myCharity.contribution_percentage : 15
    );
    setModalError(null);
    setSelectionModalOpen(true);
  };

  const handleSaveSelection = async (e) => {
    e.preventDefault();
    setModalError(null);

    const pct = Number(contributionPct);
    if (isNaN(pct) || pct < 10) {
      setModalError('Contribution percentage must be at least 10%.');
      return;
    }

    setSavingSelection(true);
    try {
      const res = await charityApi.selectCharity({
        charity_id: selectedCharityForModal.id,
        contribution_percentage: pct,
      });

      if (res.data?.success) {
        setSuccessMsg(`Successfully designated ${selectedCharityForModal.name} as your charity.`);
        setSelectionModalOpen(false);
        fetchMyCharity();
        setTimeout(() => setSuccessMsg(null), 4000);
      }
    } catch (err) {
      setModalError(err.customMessage || 'Failed to update designated charity.');
    } finally {
      setSavingSelection(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] pt-28 pb-24 px-6 sm:px-12">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#1A1A1A]/10">
          <div>
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#D4AF37] font-semibold block mb-2">
              PHILANTHROPY &bull; ACCREDITED CAUSES
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl text-[#1A1A1A] font-normal tracking-tight">
              Designate Your <span className="italic font-light">Cause.</span>
            </h1>
            <p className="text-sm sm:text-base text-[#6C6863] mt-2 font-sans max-w-2xl">
              Choose an accredited partner charity. A guaranteed portion of your monthly membership (min. 10%) is automatically transferred directly to power their mission.
            </p>
          </div>

          {/* Search bar with underline aesthetic */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search causes by name..."
                className="w-full bg-transparent border-b border-[#1A1A1A]/30 py-2 pl-7 pr-2 text-xs text-[#1A1A1A] placeholder-[#6C6863]/60 focus:outline-none focus:border-[#D4AF37] transition-colors font-sans"
              />
              <Search size={14} className="absolute left-0 top-2.5 text-[#6C6863]" />
            </div>
            <Button type="submit" variant="outline" size="sm">
              Filter
            </Button>
          </form>
        </div>

        {/* Global Notifications */}
        {successMsg && (
          <div className="p-4 border border-[#D4AF37]/50 bg-[#D4AF37]/10 text-[#1A1A1A] text-xs font-mono flex items-center gap-2 font-medium">
            <Check size={16} className="text-[#D4AF37]" />
            <span>{successMsg}</span>
          </div>
        )}
        {error && (
          <div className="p-4 border border-rose-500/30 bg-rose-50 text-rose-800 text-xs font-mono flex items-center gap-2">
            <AlertCircle size={16} className="text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Current User Selection Banner */}
        {isAuthenticated && myCharity && (
          <div className="p-8 bg-[#F9F8F6] border-t-4 border-[#D4AF37] border-x border-b border-[#1A1A1A]/15 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 border border-[#D4AF37] bg-[#F9F8F6] flex items-center justify-center text-[#D4AF37] shrink-0">
                <Heart size={22} />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#D4AF37] font-semibold block mb-1">
                  YOUR ACTIVE DESIGNATED CAUSE
                </span>
                <div className="font-serif text-2xl text-[#1A1A1A] tracking-tight">
                  {myCharity.charities?.name}
                </div>
                <p className="text-xs sm:text-sm text-[#6C6863] mt-1 font-sans">
                  Allocating{' '}
                  <strong className="text-[#1A1A1A] font-semibold">
                    {myCharity.contribution_percentage}%
                  </strong>{' '}
                  of your membership fee on every billing cycle.
                </p>
              </div>
            </div>

            <Badge variant="gold">ACTIVE RECIPIENT</Badge>
          </div>
        )}

        {/* Charities Grid */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-[#1A1A1A] border-t-transparent animate-spin" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#6C6863]">
              Loading Accredited Causes...
            </span>
          </div>
        ) : charities.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-serif text-2xl text-[#1A1A1A]">No causes found</p>
            <p className="text-xs text-[#6C6863] mt-2 font-sans">
              Try adjusting your search criteria or clearing the search query.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {charities.map((charity) => {
              const isSelected = myCharity?.charity_id === charity.id;

              return (
                <div
                  key={charity.id}
                  className={`
                    flex flex-col justify-between border transition-all duration-500 bg-[#F9F8F6] group
                    ${
                      isSelected
                        ? 'border-t-4 border-[#D4AF37] border-x border-b border-[#1A1A1A]/20 shadow-[0_20px_50px_rgba(26,26,26,0.06)]'
                        : 'border border-[#1A1A1A]/15 hover:border-[#1A1A1A]'
                    }
                  `}
                >
                  <div>
                    {/* Image with Grayscale hover reveal */}
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

                      {isSelected && (
                        <div className="absolute top-4 right-4 bg-[#1A1A1A] text-[#D4AF37] text-[10px] font-mono font-semibold uppercase tracking-[0.2em] px-3 py-1 border border-[#D4AF37]/50 flex items-center gap-1.5 shadow-md">
                          <Check size={12} />
                          DESIGNATED
                        </div>
                      )}
                    </div>

                    {/* Text Details */}
                    <div className="p-7">
                      <h3 className="font-serif text-2xl text-[#1A1A1A] mb-3 group-hover:text-[#D4AF37] transition-colors duration-300 font-normal tracking-tight">
                        {charity.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#6C6863] leading-relaxed font-sans line-clamp-4">
                        {charity.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-7 pt-0">
                    <div className="pt-5 border-t border-[#1A1A1A]/10 flex items-center justify-between">
                      <span className="text-xs font-mono text-[#D4AF37] flex items-center gap-1.5 font-semibold">
                        <Sparkles size={13} />
                        Min 10% Share
                      </span>

                      <Button
                        onClick={() => openSelectModal(charity)}
                        variant={isSelected ? 'outline' : 'primary'}
                        size="sm"
                      >
                        {isSelected ? 'Update %' : 'Designate Cause'}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Select Charity Contribution Modal */}
      <Modal
        isOpen={selectionModalOpen}
        onClose={() => setSelectionModalOpen(false)}
        title={selectedCharityForModal?.name || 'Designate Charity'}
        subtitle="CHARITABLE CONTRIBUTION"
      >
        {modalError && (
          <div className="mb-6 p-3 border border-rose-500/30 bg-rose-50 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle size={15} className="text-rose-600" />
            <span>{modalError}</span>
          </div>
        )}

        <p className="text-xs sm:text-sm text-[#6C6863] leading-relaxed mb-6 font-sans">
          Specify what percentage of your membership fee you wish to allocate to{' '}
          <strong className="text-[#1A1A1A] font-semibold">{selectedCharityForModal?.name}</strong>. The minimum requirement is 10%.
        </p>

        <form onSubmit={handleSaveSelection} className="flex flex-col gap-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#1A1A1A] font-semibold">
                Contribution Percentage
              </label>
              <span className="font-serif text-3xl text-[#1A1A1A] tracking-tight">
                {contributionPct}%
              </span>
            </div>

            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={contributionPct}
              onChange={(e) => setContributionPct(Number(e.target.value))}
              className="w-full accent-[#D4AF37] cursor-pointer h-1.5 bg-[#EBE5DE]"
            />
            <div className="flex items-center justify-between text-[10px] font-mono text-[#6C6863] mt-2 uppercase tracking-wider">
              <span>10% (Min)</span>
              <span>50%</span>
              <span>100% (Full Impact)</span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1A1A1A]/10 flex items-center justify-end gap-3">
            <Button onClick={() => setSelectionModalOpen(false)} variant="ghost" size="sm">
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" disabled={savingSelection}>
              {savingSelection ? 'Saving...' : 'Confirm Allocation'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Charities;
