import React, { useState, useEffect } from 'react';
import { scoreApi } from '../api/scores';
import GolfBall from '../components/common/GolfBall';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { Plus, Edit2, Trash2, Calendar, Target, AlertCircle, Check } from 'lucide-react';

const Scores = () => {
  const [scores, setScores] = useState([]);
  const [latestFive, setLatestFive] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Modal State for Add / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingScore, setEditingScore] = useState(null);
  const [formScore, setFormScore] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const fetchScores = async () => {
    setLoading(true);
    try {
      const res = await scoreApi.getScores();
      if (res.data?.success) {
        setScores(res.data.data.scores || []);
        setLatestFive(res.data.data.latest_five || []);
      }
    } catch (err) {
      setError(err.customMessage || 'Could not fetch scores history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  const handleOpenAdd = () => {
    setEditingScore(null);
    setFormScore('');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (scoreItem) => {
    setEditingScore(scoreItem);
    setFormScore(scoreItem.score);
    setFormDate(scoreItem.score_date);
    setFormError(null);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this round from your scorecard?')) {
      return;
    }
    try {
      await scoreApi.deleteScore(id);
      setSuccessMsg('Score deleted successfully.');
      setTimeout(() => setSuccessMsg(null), 3500);
      fetchScores();
    } catch (err) {
      setError(err.customMessage || 'Failed to delete score.');
      setTimeout(() => setError(null), 3500);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    const scoreNum = Number(formScore);
    if (!Number.isInteger(scoreNum) || scoreNum < 1 || scoreNum > 45) {
      setFormError('Score must be an integer between 1 and 45.');
      return;
    }

    if (!formDate) {
      setFormError('Date is required in YYYY-MM-DD format.');
      return;
    }

    setSubmitting(true);
    try {
      if (editingScore) {
        await scoreApi.updateScore(editingScore.id, {
          score: scoreNum,
          score_date: formDate,
        });
        setSuccessMsg('Round updated successfully.');
      } else {
        await scoreApi.createScore({
          score: scoreNum,
          score_date: formDate,
        });
        setSuccessMsg('New round logged to scorecard.');
      }
      setModalOpen(false);
      setTimeout(() => setSuccessMsg(null), 3500);
      fetchScores();
    } catch (err) {
      setFormError(err.customMessage || 'Operation failed. Please check inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] pt-28 pb-24 px-6 sm:px-12">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 border-b border-[#1A1A1A]/10">
          <div>
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#D4AF37] font-semibold block mb-2">
              SCORECARD ARCHIVE &bull; DRAW QUALIFIER
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl text-[#1A1A1A] font-normal tracking-tight">
              My Golf <span className="italic font-light">Scores.</span>
            </h1>
            <p className="text-sm sm:text-base text-[#6C6863] mt-2 font-sans">
              Valid range: 1–45. Your five most recent rounds become your official monthly draw balls.
            </p>
          </div>

          <Button onClick={handleOpenAdd} variant="primary" size="md" icon={<Plus size={16} />}>
            Log Round Score
          </Button>
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

        {/* Top Feature: Draw Entry Visualizer */}
        <div className="bg-[#F9F8F6] border border-[#1A1A1A]/15 p-8 sm:p-12 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#D4AF37] font-semibold block mb-1">
                ACTIVE MONTHLY DRAW ENTRY
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1A1A1A] tracking-tight">
                Latest Five Scores
              </h2>
            </div>
            <Badge variant={latestFive.length === 5 ? 'active' : 'pending'}>
              {latestFive.length === 5 ? 'ENTRY COMPLETE' : `${latestFive.length} / 5 SCORES RECORDED`}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 py-6 border-y border-[#1A1A1A]/10 my-2">
            {latestFive.length > 0 ? (
              latestFive.map((num, i) => (
                <GolfBall
                  key={i}
                  number={num}
                  size="lg"
                  isMatch={true}
                  label={`BALL 0${i + 1}`}
                />
              ))
            ) : (
              <div className="text-xs text-[#6C6863] font-mono py-4 uppercase tracking-wider">
                No scores recorded yet. Submit your recent rounds to build your draw entry.
              </div>
            )}

            {Array.from({ length: Math.max(0, 5 - latestFive.length) }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="w-16 h-16 border border-dashed border-[#1A1A1A]/20 flex flex-col items-center justify-center text-[10px] font-mono text-[#6C6863]"
              >
                <span>--</span>
                <span className="text-[8px] uppercase tracking-wider">SLOT {latestFive.length + i + 1}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-[#6C6863] mt-4 leading-relaxed font-sans">
            Note: When you log a newer score, it will automatically register into Ball 01 and shift the oldest recorded round into archive history.
          </p>
        </div>

        {/* History Table */}
        <div className="bg-[#F9F8F6] border border-[#1A1A1A]/15 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-[#1A1A1A]/10 flex items-center justify-between">
            <h3 className="font-serif text-2xl text-[#1A1A1A] tracking-tight">Scorecard History</h3>
            <span className="text-xs font-mono text-[#6C6863] uppercase tracking-wider">
              {scores.length} rounds logged
            </span>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-[#1A1A1A] border-t-transparent animate-spin" />
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#6C6863]">
                Loading Scores...
              </span>
            </div>
          ) : scores.length === 0 ? (
            <div className="py-20 text-center px-6">
              <Target size={36} className="text-[#D4AF37]/50 mx-auto mb-4" />
              <p className="font-serif text-2xl text-[#1A1A1A]">No scores logged yet</p>
              <p className="text-xs sm:text-sm text-[#6C6863] max-w-sm mx-auto mt-2 mb-8 font-sans">
                Submit your first verified golf round between 1 and 45 to initiate your monthly draw entry.
              </p>
              <Button onClick={handleOpenAdd} variant="primary" size="md">
                Log First Round
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[#1A1A1A]/10 text-[11px] font-mono tracking-[0.2em] uppercase text-[#6C6863] bg-[#EBE5DE]/30">
                    <th className="py-4 px-8 font-semibold">Play Date</th>
                    <th className="py-4 px-8 font-semibold">Score</th>
                    <th className="py-4 px-8 font-semibold">Draw Status</th>
                    <th className="py-4 px-8 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1A1A]/10 text-[#1A1A1A]">
                  {scores.map((item, idx) => {
                    const isDrawEntry = idx < 5;
                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-[#EBE5DE]/30 transition-colors"
                      >
                        <td className="py-4 px-8 font-mono text-xs text-[#6C6863]">
                          <div className="flex items-center gap-2.5">
                            <Calendar size={14} className="text-[#D4AF37]" />
                            <span>{item.score_date}</span>
                          </div>
                        </td>

                        <td className="py-4 px-8 font-mono text-base font-semibold text-[#1A1A1A]">
                          <div className="flex items-center gap-3">
                            <GolfBall number={item.score} size="sm" isMatch={isDrawEntry} />
                            <span>{item.score}</span>
                          </div>
                        </td>

                        <td className="py-4 px-8">
                          <Badge variant={isDrawEntry ? 'active' : 'default'} size="sm">
                            {isDrawEntry ? `ENTRY BALL 0${idx + 1}` : 'ARCHIVED'}
                          </Badge>
                        </td>

                        <td className="py-4 px-8 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEdit(item)}
                              className="p-2 text-[#6C6863] hover:text-[#1A1A1A] hover:bg-[#EBE5DE] transition-colors cursor-pointer"
                              title="Edit round"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-2 text-[#6C6863] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete round"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingScore ? 'Edit Round Score' : 'Log New Round'}
        subtitle="VERIFIED ROUND ENTRY"
      >
        {formError && (
          <div className="mb-6 p-3 border border-rose-500/30 bg-rose-50 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle size={15} className="text-rose-600" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
          <div>
            <label className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#1A1A1A] block mb-2 font-semibold">
              Score (1 – 45)
            </label>
            <input
              type="number"
              min="1"
              max="45"
              value={formScore}
              onChange={(e) => setFormScore(e.target.value)}
              placeholder="e.g. 36"
              required
              className="w-full bg-transparent border-b border-[#1A1A1A]/30 py-2.5 px-0 text-sm text-[#1A1A1A] font-mono placeholder-[#6C6863]/50 focus:outline-none focus:border-[#D4AF37] transition-colors"
            />
            <span className="text-[10px] text-[#6C6863] font-mono mt-1 block uppercase tracking-wider">
              Enter the exact integer score for this round.
            </span>
          </div>

          <div>
            <label className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#1A1A1A] block mb-2 font-semibold">
              Round Date (YYYY-MM-DD)
            </label>
            <input
              type="date"
              value={formDate}
              onChange={(e) => setFormDate(e.target.value)}
              required
              className="w-full bg-transparent border-b border-[#1A1A1A]/30 py-2.5 px-0 text-sm text-[#1A1A1A] font-mono placeholder-[#6C6863]/50 focus:outline-none focus:border-[#D4AF37] transition-colors"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <Button onClick={() => setModalOpen(false)} variant="ghost" size="sm">
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" disabled={submitting}>
              {submitting ? 'Saving...' : editingScore ? 'Update Round' : 'Save Round'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Scores;
