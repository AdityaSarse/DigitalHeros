import React, { useState, useEffect } from 'react';
import { winnerApi } from '../api/winners';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { Trophy, Upload, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

const Winners = () => {
  const [winnings, setWinnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Proof Modal
  const [proofModalOpen, setProofModalOpen] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState(null);
  const [proofFileUrl, setProofFileUrl] = useState('');
  const [proofFileName, setProofFileName] = useState('');
  const [submittingProof, setSubmittingProof] = useState(false);
  const [modalError, setModalError] = useState(null);

  const fetchWinnings = async () => {
    setLoading(true);
    try {
      const res = await winnerApi.getMyWinnings();
      if (res.data?.success) {
        setWinnings(res.data.data.winners || []);
      }
    } catch (err) {
      setError(err.customMessage || 'Could not load your winnings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWinnings();
  }, []);

  const openProofModal = (winnerRecord) => {
    setSelectedWinner(winnerRecord);
    setProofFileUrl('');
    setProofFileName('');
    setModalError(null);
    setProofModalOpen(true);
  };

  const handleSubmitProof = async (e) => {
    e.preventDefault();
    setModalError(null);

    if (!proofFileUrl.trim()) {
      setModalError('Please enter a valid document or scorecard image URL.');
      return;
    }

    setSubmittingProof(true);
    try {
      const res = await winnerApi.submitProof(selectedWinner.id, {
        file_url: proofFileUrl.trim(),
        file_name: proofFileName.trim() || 'Scorecard_Verification.pdf',
      });

      if (res.data?.success) {
        setSuccessMsg('Scorecard proof submitted. Verification team will review within 48 hours.');
        setProofModalOpen(false);
        fetchWinnings();
        setTimeout(() => setSuccessMsg(null), 4000);
      }
    } catch (err) {
      setModalError(err.customMessage || 'Failed to submit scorecard verification.');
    } finally {
      setSubmittingProof(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] pt-28 pb-24 px-6 sm:px-12">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#1A1A1A]/10">
          <div>
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#D4AF37] font-semibold block mb-2">
              REWARDS &bull; WINNER VERIFICATION PORTAL
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl text-[#1A1A1A] font-normal tracking-tight">
              My Prize <span className="italic font-light">Claims.</span>
            </h1>
            <p className="text-sm sm:text-base text-[#6C6863] mt-2 font-sans">
              Track your draw matches, submit official scorecard verification, and monitor payout fulfillment.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37] font-semibold uppercase tracking-wider">
            <Trophy size={16} />
            <span>DISCREET DIRECT DISBURSEMENT</span>
          </div>
        </div>

        {/* Global Notifications */}
        {successMsg && (
          <div className="p-4 border border-[#D4AF37]/50 bg-[#D4AF37]/10 text-[#1A1A1A] text-xs font-mono flex items-center gap-2 font-medium">
            <CheckCircle2 size={16} className="text-[#D4AF37]" />
            <span>{successMsg}</span>
          </div>
        )}
        {error && (
          <div className="p-4 border border-rose-500/30 bg-rose-50 text-rose-800 text-xs font-mono flex items-center gap-2">
            <AlertCircle size={16} className="text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* List of Winnings */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-[#1A1A1A] border-t-transparent animate-spin" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#6C6863]">
              Loading Member Winnings...
            </span>
          </div>
        ) : winnings.length === 0 ? (
          <div className="bg-[#F9F8F6] border border-[#1A1A1A]/15 p-16 text-center shadow-sm">
            <Trophy size={40} className="text-[#D4AF37]/50 mx-auto mb-4" />
            <h3 className="font-serif text-2xl text-[#1A1A1A]">No Active Prize Claims</h3>
            <p className="text-sm text-[#6C6863] max-w-md mx-auto mt-2 mb-8 font-sans">
              When your five logged rounds match 3, 4, or 5 balls in any monthly draw, your winnings will automatically populate here for verification and payout.
            </p>
            <Button to="/scores" variant="primary" size="md">
              Log Your Next Round
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {winnings.map((w) => {
              const drawInfo = w.draws;
              const proofs = w.winner_proofs || [];
              const hasSubmittedProof = proofs.length > 0;

              return (
                <div
                  key={w.id}
                  className="bg-[#F9F8F6] border border-[#1A1A1A]/15 p-8 sm:p-10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8 hover:border-[#1A1A1A] transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                    <div className="w-16 h-16 border border-[#D4AF37] bg-[#F9F8F6] flex items-center justify-center text-[#D4AF37] shrink-0 shadow-sm">
                      <Trophy size={26} />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className="font-serif text-3xl text-[#1A1A1A] tracking-tight">
                          ₹{Number(w.prize_amount).toLocaleString('en-IN')}
                        </span>
                        <Badge variant="gold" size="sm">
                          {w.match_type?.replace('_', ' ') || 'WINNER'}
                        </Badge>
                      </div>

                      <p className="text-xs text-[#6C6863] font-mono uppercase tracking-wider">
                        Draw: <strong className="text-[#1A1A1A]">{drawInfo?.draw_month || 'Monthly Draw'}</strong>
                        {w.won_at && ` \u2022 Awarded on ${new Date(w.won_at).toLocaleDateString('en-IN')}`}
                      </p>

                      {/* Proof status note */}
                      <div className="mt-3 text-xs flex items-center gap-2 font-mono uppercase tracking-wider">
                        {hasSubmittedProof ? (
                          <span className="text-[#1A1A1A] flex items-center gap-1.5 font-medium">
                            <CheckCircle2 size={13} className="text-[#D4AF37]" />
                            Scorecard Proof Submitted ({proofs.length} document)
                          </span>
                        ) : (
                          <span className="text-[#D4AF37] flex items-center gap-1.5 font-semibold">
                            <Clock size={13} />
                            Scorecard proof required for verification
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status Badges & Action */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-[#1A1A1A]/10">
                    <div className="flex flex-col gap-1.5 sm:text-right">
                      <div className="flex items-center sm:justify-end gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#6C6863]">
                          Verification:
                        </span>
                        <Badge
                          variant={
                            w.verification_status === 'APPROVED'
                              ? 'approved'
                              : w.verification_status === 'REJECTED'
                              ? 'rejected'
                              : 'pending'
                          }
                          size="sm"
                        >
                          {w.verification_status}
                        </Badge>
                      </div>

                      <div className="flex items-center sm:justify-end gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#6C6863]">
                          Payout:
                        </span>
                        <Badge
                          variant={w.payout_status === 'PAID' ? 'paid' : 'default'}
                          size="sm"
                        >
                          {w.payout_status}
                        </Badge>
                      </div>
                    </div>

                    {w.verification_status !== 'APPROVED' && (
                      <Button
                        onClick={() => openProofModal(w)}
                        variant="outline"
                        size="sm"
                        icon={<Upload size={14} />}
                      >
                        {hasSubmittedProof ? 'Update Proof' : 'Upload Proof'}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Proof Submission Modal */}
      <Modal
        isOpen={proofModalOpen}
        onClose={() => setProofModalOpen(false)}
        title="Submit Scorecard Proof"
        subtitle="VERIFY WINNING ROUNDS"
      >
        {modalError && (
          <div className="mb-6 p-3 border border-rose-500/30 bg-rose-50 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle size={15} className="text-rose-600" />
            <span>{modalError}</span>
          </div>
        )}

        <p className="text-xs sm:text-sm text-[#6C6863] leading-relaxed mb-6 font-sans">
          To maintain club fairness and ensure all drawn balls correspond to authentic rounds, please provide a link to a digital scorecard snapshot or club handicapping sheet.
        </p>

        <form onSubmit={handleSubmitProof} className="flex flex-col gap-6">
          <div>
            <label className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#1A1A1A] block mb-2 font-semibold">
              Scorecard Document / Image URL
            </label>
            <input
              type="url"
              value={proofFileUrl}
              onChange={(e) => setProofFileUrl(e.target.value)}
              placeholder="https://storage.supabase.co/... or image link"
              required
              className="w-full bg-transparent border-b border-[#1A1A1A]/30 py-2 px-0 text-xs text-[#1A1A1A] placeholder-[#6C6863]/50 focus:outline-none focus:border-[#D4AF37] transition-colors font-sans"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#1A1A1A] block mb-2 font-semibold">
              Document Label (Optional)
            </label>
            <input
              type="text"
              value={proofFileName}
              onChange={(e) => setProofFileName(e.target.value)}
              placeholder="e.g. October_Scorecard_Round4.jpg"
              className="w-full bg-transparent border-b border-[#1A1A1A]/30 py-2 px-0 text-xs text-[#1A1A1A] placeholder-[#6C6863]/50 focus:outline-none focus:border-[#D4AF37] transition-colors font-sans"
            />
          </div>

          <div className="pt-4 border-t border-[#1A1A1A]/10 flex items-center justify-end gap-3">
            <Button onClick={() => setProofModalOpen(false)} variant="ghost" size="sm">
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" disabled={submittingProof}>
              {submittingProof ? 'Submitting...' : 'Upload & Verify'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Winners;
