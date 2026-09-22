import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import {
  Shield,
  Plus,
  Play,
  Share2,
  Check,
  X,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'charities' | 'draws' | 'winners'

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [charities, setCharities] = useState([]);
  const [draws, setDraws] = useState([]);
  const [winners, setWinners] = useState([]);
  const [feedbackMsg, setFeedbackMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Modals
  const [charityModalOpen, setCharityModalOpen] = useState(false);
  const [editingCharity, setEditingCharity] = useState(null);
  const [charityName, setCharityName] = useState('');
  const [charityDesc, setCharityDesc] = useState('');
  const [charityImg, setCharityImg] = useState('');
  const [charityActive, setCharityActive] = useState(true);

  const [drawModalOpen, setDrawModalOpen] = useState(false);
  const [drawMonth, setDrawMonth] = useState('');
  const [drawPrizePool, setDrawPrizePool] = useState('150000');
  const [drawJackpot, setDrawJackpot] = useState('50000');

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [uRes, cRes, dRes, wRes] = await Promise.allSettled([
        adminApi.getUsers(),
        adminApi.getCharities(),
        adminApi.getDraws(),
        adminApi.getWinners(),
      ]);

      if (uRes.status === 'fulfilled' && uRes.value.data?.success) {
        setUsers(uRes.value.data.data.users || []);
      }
      if (cRes.status === 'fulfilled' && cRes.value.data?.success) {
        setCharities(cRes.value.data.data.charities || []);
      }
      if (dRes.status === 'fulfilled' && dRes.value.data?.success) {
        setDraws(dRes.value.data.data.draws || []);
      }
      if (wRes.status === 'fulfilled' && wRes.value.data?.success) {
        setWinners(wRes.value.data.data.winners || []);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const showSuccess = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const showError = (msg) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(null), 4000);
  };

  // Charity Handlers
  const handleOpenCharityModal = (charity = null) => {
    if (charity) {
      setEditingCharity(charity);
      setCharityName(charity.name);
      setCharityDesc(charity.description);
      setCharityImg(charity.image_url || '');
      setCharityActive(charity.is_active);
    } else {
      setEditingCharity(null);
      setCharityName('');
      setCharityDesc('');
      setCharityImg('');
      setCharityActive(true);
    }
    setCharityModalOpen(true);
  };

  const handleSaveCharity = async (e) => {
    e.preventDefault();
    try {
      if (editingCharity) {
        await adminApi.updateCharity(editingCharity.id, {
          name: charityName,
          description: charityDesc,
          image_url: charityImg || null,
          is_active: charityActive,
        });
        showSuccess('Charity updated.');
      } else {
        await adminApi.createCharity({
          name: charityName,
          description: charityDesc,
          image_url: charityImg || null,
          is_active: charityActive,
        });
        showSuccess('New charity partner created.');
      }
      setCharityModalOpen(false);
      loadAllAdminData();
    } catch (err) {
      showError(err.customMessage || 'Failed to save charity.');
    }
  };

  const handleDeleteCharity = async (id) => {
    if (!window.confirm('Are you sure you want to remove this charity?')) return;
    try {
      await adminApi.deleteCharity(id);
      showSuccess('Charity removed.');
      loadAllAdminData();
    } catch (err) {
      showError(err.customMessage || 'Failed to delete charity.');
    }
  };

  // Draw Handlers
  const handleCreateDraw = async (e) => {
    e.preventDefault();
    try {
      await adminApi.createDraw({
        draw_month: drawMonth,
        prize_pool_amount: Number(drawPrizePool),
        jackpot_amount: Number(drawJackpot),
      });
      showSuccess(`Draw for ${drawMonth} created in DRAFT status.`);
      setDrawModalOpen(false);
      loadAllAdminData();
    } catch (err) {
      showError(err.customMessage || 'Failed to create draw.');
    }
  };

  const handleSimulateDraw = async (drawId) => {
    if (!window.confirm('Simulate winning numbers and prize allocations for this draw?')) return;
    try {
      const res = await adminApi.simulateDraw(drawId);
      if (res.data?.success) {
        showSuccess('Draw simulated! 5 numbers drawn and winners categorized.');
        loadAllAdminData();
      }
    } catch (err) {
      showError(err.customMessage || 'Failed to simulate draw.');
    }
  };

  const handlePublishDraw = async (drawId) => {
    if (!window.confirm('Publish draw results to the public?')) return;
    try {
      const res = await adminApi.publishDraw(drawId);
      if (res.data?.success) {
        showSuccess('Draw officially published!');
        loadAllAdminData();
      }
    } catch (err) {
      showError(err.customMessage || 'Failed to publish draw.');
    }
  };

  // Winner Verification Handlers
  const handleVerifyWinner = async (winnerId, status) => {
    try {
      await adminApi.verifyWinner(winnerId, { status });
      showSuccess(`Winner verification status set to ${status}.`);
      loadAllAdminData();
    } catch (err) {
      showError(err.customMessage || 'Verification update failed.');
    }
  };

  const handlePayoutWinner = async (winnerId) => {
    if (!window.confirm('Mark this winner payout as PAID?')) return;
    try {
      await adminApi.payoutWinner(winnerId);
      showSuccess('Payout recorded as PAID.');
      loadAllAdminData();
    } catch (err) {
      showError(err.customMessage || 'Payout update failed.');
    }
  };

  // Quick Metrics
  const totalUsersCount = users.length;
  const pendingVerifications = winners.filter((w) => w.verification_status === 'PENDING').length;
  const pendingPayouts = winners.filter((w) => w.payout_status === 'PENDING' && w.verification_status === 'APPROVED').length;

  return (
    <div className="min-h-screen bg-[#F9F8F6] pt-28 pb-24 px-6 sm:px-12">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 border-b border-[#1A1A1A]/10">
          <div>
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#D4AF37] font-semibold block mb-2 flex items-center gap-2">
              <Shield size={14} />
              COMMAND CENTER &bull; ROOT CONTROLLER
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl text-[#1A1A1A] font-normal tracking-tight">
              Admin <span className="italic font-light">Clubhouse.</span>
            </h1>
          </div>

          {/* Tab navigation with 0px radius */}
          <div className="flex flex-wrap items-center gap-2 border border-[#1A1A1A]/15 p-1.5 bg-[#F9F8F6]">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'users', label: `Users (${users.length})` },
              { key: 'charities', label: `Charities (${charities.length})` },
              { key: 'draws', label: `Draws (${draws.length})` },
              { key: 'winners', label: `Winners (${winners.length})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`text-xs font-mono py-2 px-4 transition-all duration-300 cursor-pointer uppercase tracking-wider ${
                  activeTab === tab.key
                    ? 'bg-[#1A1A1A] text-[#F9F8F6] font-semibold shadow-sm'
                    : 'text-[#6C6863] hover:text-[#1A1A1A] hover:bg-[#EBE5DE]/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Alerts */}
        {feedbackMsg && (
          <div className="p-4 border border-[#D4AF37]/50 bg-[#D4AF37]/10 text-[#1A1A1A] text-xs font-mono flex items-center gap-2 font-medium">
            <Check size={16} className="text-[#D4AF37]" />
            <span>{feedbackMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="p-4 border border-rose-500/30 bg-rose-50 text-rose-800 text-xs font-mono flex items-center gap-2">
            <AlertCircle size={16} className="text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#F9F8F6] border border-[#1A1A1A]/15 p-8 shadow-sm">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#6C6863] block font-semibold">
                  Total Users
                </span>
                <div className="font-serif text-4xl text-[#1A1A1A] mt-2 tracking-tight">
                  {totalUsersCount}
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] mt-1 block">Registered Members</span>
              </div>

              <div className="bg-[#F9F8F6] border border-[#1A1A1A]/15 p-8 shadow-sm">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#6C6863] block font-semibold">
                  Active Charities
                </span>
                <div className="font-serif text-4xl text-[#1A1A1A] mt-2 tracking-tight">
                  {charities.filter((c) => c.is_active).length}
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] mt-1 block">Partner Foundations</span>
              </div>

              <div className="bg-[#F9F8F6] border border-[#1A1A1A]/15 p-8 shadow-sm">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#6C6863] block font-semibold">
                  Draw Cycles
                </span>
                <div className="font-serif text-4xl text-[#1A1A1A] mt-2 tracking-tight">
                  {draws.length}
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] mt-1 block">
                  {draws.filter((d) => d.status === 'PUBLISHED').length} Published
                </span>
              </div>

              <div className="bg-[#F9F8F6] border border-[#1A1A1A]/15 p-8 shadow-sm">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#6C6863] block font-semibold">
                  Verification Queue
                </span>
                <div className="font-serif text-4xl text-[#D4AF37] mt-2 tracking-tight">
                  {pendingVerifications}
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#6C6863] mt-1 block">
                  {pendingPayouts} Pending Payouts
                </span>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="p-8 bg-[#F9F8F6] border border-[#1A1A1A]/15 shadow-sm flex flex-wrap items-center justify-between gap-6">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#6C6863] font-semibold">
                Operational Triggers:
              </span>
              <div className="flex flex-wrap items-center gap-4">
                <Button
                  onClick={() => {
                    setDrawMonth(new Date().toISOString().split('T')[0]);
                    setDrawModalOpen(true);
                  }}
                  variant="primary"
                  size="md"
                  icon={<Plus size={14} />}
                >
                  Create Monthly Draw
                </Button>
                <Button
                  onClick={() => handleOpenCharityModal()}
                  variant="outline"
                  size="md"
                  icon={<Plus size={14} />}
                >
                  Add Partner Charity
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Users */}
        {activeTab === 'users' && (
          <div className="bg-[#F9F8F6] border border-[#1A1A1A]/15 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-[#1A1A1A]/10">
              <h3 className="font-serif text-2xl text-[#1A1A1A] tracking-tight">Member Directory</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#EBE5DE]/30 text-[10px] font-mono uppercase tracking-[0.2em] text-[#6C6863] border-b border-[#1A1A1A]/10">
                  <tr>
                    <th className="py-4 px-8 font-semibold">Name</th>
                    <th className="py-4 px-8 font-semibold">Email</th>
                    <th className="py-4 px-8 font-semibold">Role</th>
                    <th className="py-4 px-8 font-semibold">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1A1A]/10 text-[#1A1A1A]">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-[#EBE5DE]/30 transition-colors">
                      <td className="py-4 px-8 font-medium">
                        {u.first_name} {u.last_name}
                      </td>
                      <td className="py-4 px-8 font-mono text-xs text-[#6C6863]">
                        {u.email}
                      </td>
                      <td className="py-4 px-8">
                        <Badge variant={u.role === 'ADMIN' ? 'gold' : 'default'} size="sm">
                          {u.role || 'USER'}
                        </Badge>
                      </td>
                      <td className="py-4 px-8 text-xs font-mono text-[#6C6863]">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN') : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Charities Management */}
        {activeTab === 'charities' && (
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-3xl text-[#1A1A1A] tracking-tight">Partner Charities</h3>
              <Button
                onClick={() => handleOpenCharityModal()}
                variant="primary"
                size="md"
                icon={<Plus size={14} />}
              >
                Add Charity
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {charities.map((c) => (
                <div
                  key={c.id}
                  className="bg-[#F9F8F6] border border-[#1A1A1A]/15 p-8 flex flex-col justify-between shadow-sm hover:border-[#1A1A1A] transition-colors duration-300"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant={c.is_active ? 'active' : 'default'}>
                        {c.is_active ? 'ACTIVE' : 'INACTIVE'}
                      </Badge>
                      <span className="text-[10px] font-mono text-[#6C6863] uppercase tracking-wider">
                        ID: {c.id.slice(0, 8)}...
                      </span>
                    </div>

                    <h4 className="font-serif text-2xl text-[#1A1A1A] mb-2 tracking-tight">{c.name}</h4>
                    <p className="text-xs sm:text-sm text-[#6C6863] line-clamp-3 leading-relaxed font-sans">
                      {c.description}
                    </p>
                  </div>

                  <div className="mt-8 pt-5 border-t border-[#1A1A1A]/10 flex items-center justify-end gap-3">
                    <Button onClick={() => handleOpenCharityModal(c)} variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteCharity(c.id)}
                      variant="ghost"
                      size="sm"
                      className="text-rose-600 hover:text-rose-800 hover:bg-rose-50"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Draws Management */}
        {activeTab === 'draws' && (
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-3xl text-[#1A1A1A] tracking-tight">Draw Operations</h3>
              <Button
                onClick={() => {
                  setDrawMonth(new Date().toISOString().split('T')[0]);
                  setDrawModalOpen(true);
                }}
                variant="primary"
                size="md"
                icon={<Plus size={14} />}
              >
                Create Draw
              </Button>
            </div>

            <div className="bg-[#F9F8F6] border border-[#1A1A1A]/15 shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#EBE5DE]/30 text-[10px] font-mono uppercase tracking-[0.2em] text-[#6C6863] border-b border-[#1A1A1A]/10">
                  <tr>
                    <th className="py-4 px-8 font-semibold">Month</th>
                    <th className="py-4 px-8 font-semibold">Prize Pool</th>
                    <th className="py-4 px-8 font-semibold">Status</th>
                    <th className="py-4 px-8 font-semibold">Winning Numbers</th>
                    <th className="py-4 px-8 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1A1A]/10 text-[#1A1A1A]">
                  {draws.map((d) => {
                    const simResult = d.simulation_result;
                    const winningBalls = simResult?.winning_numbers || [];

                    return (
                      <tr key={d.id} className="hover:bg-[#EBE5DE]/30 transition-colors">
                        <td className="py-4 px-8 font-mono text-sm font-medium">
                          {d.draw_month}
                        </td>
                        <td className="py-4 px-8 font-serif text-lg text-[#1A1A1A]">
                          ₹{Number(d.prize_pool_amount).toLocaleString('en-IN')}
                        </td>
                        <td className="py-4 px-8">
                          <Badge
                            variant={
                              d.status === 'PUBLISHED'
                                ? 'paid'
                                : d.status === 'SIMULATED'
                                ? 'active'
                                : 'default'
                            }
                            size="sm"
                          >
                            {d.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-8">
                          {winningBalls.length > 0 ? (
                            <div className="flex items-center gap-2 font-mono text-xs text-[#D4AF37] font-semibold">
                              {winningBalls.map((b) => (
                                <span key={b} className="px-2 py-1 bg-[#EBE5DE]/50 border border-[#1A1A1A]/10">
                                  {b}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-[#6C6863] font-mono uppercase tracking-wider">Not simulated yet</span>
                          )}
                        </td>
                        <td className="py-4 px-8 text-right">
                          <div className="flex items-center justify-end gap-3">
                            {d.status === 'DRAFT' && (
                              <Button
                                onClick={() => handleSimulateDraw(d.id)}
                                variant="outline"
                                size="sm"
                                icon={<Play size={12} />}
                              >
                                Simulate
                              </Button>
                            )}
                            {d.status === 'SIMULATED' && (
                              <Button
                                onClick={() => handlePublishDraw(d.id)}
                                variant="primary"
                                size="sm"
                                icon={<Share2 size={12} />}
                              >
                                Publish
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Winner Verification & Payout */}
        {activeTab === 'winners' && (
          <div className="flex flex-col gap-8">
            <h3 className="font-serif text-3xl text-[#1A1A1A] tracking-tight">
              Winner Claims &amp; Verification
            </h3>

            <div className="bg-[#F9F8F6] border border-[#1A1A1A]/15 shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#EBE5DE]/30 text-[10px] font-mono uppercase tracking-[0.2em] text-[#6C6863] border-b border-[#1A1A1A]/10">
                  <tr>
                    <th className="py-4 px-8 font-semibold">Winner</th>
                    <th className="py-4 px-8 font-semibold">Match</th>
                    <th className="py-4 px-8 font-semibold">Prize Amount</th>
                    <th className="py-4 px-8 font-semibold">Verification</th>
                    <th className="py-4 px-8 font-semibold">Proof Attached</th>
                    <th className="py-4 px-8 font-semibold">Payout</th>
                    <th className="py-4 px-8 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1A1A]/10 text-[#1A1A1A]">
                  {winners.map((w) => {
                    const proofs = w.winner_proofs || [];
                    return (
                      <tr key={w.id} className="hover:bg-[#EBE5DE]/30 transition-colors">
                        <td className="py-4 px-8 font-medium">
                          {w.users?.first_name ? `${w.users.first_name} ${w.users.last_name || ''}` : w.user_id.slice(0, 8)}
                        </td>
                        <td className="py-4 px-8 font-mono text-xs text-[#D4AF37] font-semibold">
                          {w.match_type}
                        </td>
                        <td className="py-4 px-8 font-serif text-lg">
                          ₹{Number(w.prize_amount).toLocaleString('en-IN')}
                        </td>
                        <td className="py-4 px-8">
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
                        </td>
                        <td className="py-4 px-8">
                          {proofs.length > 0 ? (
                            <a
                              href={proofs[0].file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-mono text-[#D4AF37] hover:underline flex items-center gap-1 font-semibold"
                            >
                              <span>View Scorecard</span>
                              <ExternalLink size={12} />
                            </a>
                          ) : (
                            <span className="text-xs text-[#6C6863] font-mono uppercase tracking-wider">None</span>
                          )}
                        </td>
                        <td className="py-4 px-8">
                          <Badge variant={w.payout_status === 'PAID' ? 'paid' : 'default'} size="sm">
                            {w.payout_status}
                          </Badge>
                        </td>
                        <td className="py-4 px-8 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {w.verification_status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => handleVerifyWinner(w.id, 'APPROVED')}
                                  className="p-2 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                                  title="Approve"
                                >
                                  <Check size={14} />
                                </button>
                                <button
                                  onClick={() => handleVerifyWinner(w.id, 'REJECTED')}
                                  className="p-2 border border-rose-400 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                                  title="Reject"
                                >
                                  <X size={14} />
                                </button>
                              </>
                            )}
                            {w.verification_status === 'APPROVED' && w.payout_status === 'PENDING' && (
                              <Button
                                onClick={() => handlePayoutWinner(w.id)}
                                variant="primary"
                                size="sm"
                              >
                                Mark Paid
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Charity Create/Edit Modal */}
      <Modal
        isOpen={charityModalOpen}
        onClose={() => setCharityModalOpen(false)}
        title={editingCharity ? 'Edit Charity' : 'Add Partner Charity'}
        subtitle="FOUNDATION REGISTRY"
      >
        <form onSubmit={handleSaveCharity} className="flex flex-col gap-6">
          <div>
            <label className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#1A1A1A] block mb-2 font-semibold">
              Charity Name
            </label>
            <input
              type="text"
              value={charityName}
              onChange={(e) => setCharityName(e.target.value)}
              required
              className="w-full bg-transparent border-b border-[#1A1A1A]/30 py-2 px-0 text-sm text-[#1A1A1A] focus:border-[#D4AF37] focus:outline-none transition-colors font-sans"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#1A1A1A] block mb-2 font-semibold">
              Mission Statement &amp; Description
            </label>
            <textarea
              value={charityDesc}
              onChange={(e) => setCharityDesc(e.target.value)}
              rows={3}
              required
              className="w-full bg-transparent border-b border-[#1A1A1A]/30 py-2 px-0 text-sm text-[#1A1A1A] focus:border-[#D4AF37] focus:outline-none transition-colors font-sans"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#1A1A1A] block mb-2 font-semibold">
              Image URL
            </label>
            <input
              type="url"
              value={charityImg}
              onChange={(e) => setCharityImg(e.target.value)}
              placeholder="https://..."
              className="w-full bg-transparent border-b border-[#1A1A1A]/30 py-2 px-0 text-sm text-[#1A1A1A] focus:border-[#D4AF37] focus:outline-none transition-colors font-sans"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="isActiveCheck"
              checked={charityActive}
              onChange={(e) => setCharityActive(e.target.checked)}
              className="accent-[#D4AF37] cursor-pointer"
            />
            <label htmlFor="isActiveCheck" className="text-xs text-[#1A1A1A] cursor-pointer font-medium font-sans">
              Active in Public Selection Directory
            </label>
          </div>

          <div className="pt-4 border-t border-[#1A1A1A]/10 flex justify-end gap-3">
            <Button onClick={() => setCharityModalOpen(false)} variant="ghost" size="sm">
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              Save Charity
            </Button>
          </div>
        </form>
      </Modal>

      {/* Create Draw Modal */}
      <Modal
        isOpen={drawModalOpen}
        onClose={() => setDrawModalOpen(false)}
        title="Create Monthly Draw"
        subtitle="NEW CYCLE REGISTRATION"
      >
        <form onSubmit={handleCreateDraw} className="flex flex-col gap-6">
          <div>
            <label className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#1A1A1A] block mb-2 font-semibold">
              Draw Month (YYYY-MM-01)
            </label>
            <input
              type="date"
              value={drawMonth}
              onChange={(e) => setDrawMonth(e.target.value)}
              required
              className="w-full bg-transparent border-b border-[#1A1A1A]/30 py-2 px-0 text-sm text-[#1A1A1A] font-mono focus:border-[#D4AF37] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#1A1A1A] block mb-2 font-semibold">
              Prize Pool Amount (INR)
            </label>
            <input
              type="number"
              value={drawPrizePool}
              onChange={(e) => setDrawPrizePool(e.target.value)}
              required
              min="1000"
              className="w-full bg-transparent border-b border-[#1A1A1A]/30 py-2 px-0 text-sm text-[#1A1A1A] font-mono focus:border-[#D4AF37] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#1A1A1A] block mb-2 font-semibold">
              Jackpot Match 5 Allocation (INR)
            </label>
            <input
              type="number"
              value={drawJackpot}
              onChange={(e) => setDrawJackpot(e.target.value)}
              min="0"
              className="w-full bg-transparent border-b border-[#1A1A1A]/30 py-2 px-0 text-sm text-[#1A1A1A] font-mono focus:border-[#D4AF37] focus:outline-none transition-colors"
            />
          </div>

          <div className="pt-4 border-t border-[#1A1A1A]/10 flex justify-end gap-3">
            <Button onClick={() => setDrawModalOpen(false)} variant="ghost" size="sm">
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              Create Draw Cycle
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
