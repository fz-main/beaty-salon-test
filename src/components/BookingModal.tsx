import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import type { Service } from '../data/services';
import type { Lang, Translations } from '../lib/i18n';

interface BookingModalProps {
  service: Service;
  onClose: () => void;
  lang: Lang;
  t: Translations;
}

const DURATION_MINUTES: Record<string, number> = {
  cosmetology: 90,
  massage: 60,
  rituals: 120,
  laser: 45,
  peel: 60,
};

function generateSlots(durationMin: number): string[] {
  const slots: string[] = [];
  let h = 8, m = 0;
  while (h < 21) {
    slots.push(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`);
    m += durationMin;
    h += Math.floor(m / 60);
    m = m % 60;
    if (h >= 21) break;
  }
  return slots;
}

function getDates(): Date[] {
  const dates: Date[] = [];
  const today = new Date();
  today.setHours(0,0,0,0);
  for (let i = 1; i <= 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d);
  }
  return dates;
}

export default function BookingModal({ service, onClose, lang: _lang, t }: BookingModalProps) {
  const DAY_NAMES = t.days;
  const MONTH_NAMES = t.months;
  const [step, setStep] = useState<'calendar'|'form'|'success'>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', comment: '', gdpr: false });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const dates = getDates();
  const slots = generateSlots(DURATION_MINUTES[service.id] || 60);

  useEffect(() => {
    if (!selectedDate) return;
    const dateStr = selectedDate.toISOString().split('T')[0];
    supabase
      .from('bookings')
      .select('time_slot')
      .eq('service_id', service.id)
      .eq('date', dateStr)
      .then(({ data }: { data: { time_slot: string }[] | null }) => {
        setBookedSlots(data?.map(r => r.time_slot) || []);
      });
  }, [selectedDate, service.id]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = t.errors.firstName;
    if (!form.lastName.trim()) e.lastName = t.errors.lastName;
    if (!form.phone.trim()) e.phone = t.errors.phone;
    if (!form.gdpr) e.gdpr = t.errors.gdpr;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    const { error } = await supabase.from('bookings').insert({
      service_id: service.id,
      service_title: service.title,
      date: selectedDate!.toISOString().split('T')[0],
      time_slot: selectedSlot,
      first_name: form.firstName,
      last_name: form.lastName,
      phone: form.phone,
      comment: form.comment || null,
      gdpr_consent: form.gdpr,
    });
    setLoading(false);
    if (!error) setStep('success');
    else alert('Ошибка при бронировании. Попробуйте ещё раз.');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl"
        style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/8">
          <div>
            <div className="font-monument text-[9px] tracking-[0.25em] text-[#e5d3b3]">Reserve</div>
            <div className="font-editorial text-2xl">{service.title}</div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white text-lg">×</button>
        </div>

        <AnimatePresence mode="wait">

          {/* STEP 1: CALENDAR */}
          {step === 'calendar' && (
            <motion.div key="calendar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">

              {/* Dates */}
              <div className="font-monument text-[9px] tracking-widest text-[#a3a3a3] mb-3">Select date</div>
              <div className="grid grid-cols-7 gap-1 mb-6">
                {DAY_NAMES.map(d => (
                  <div key={d} className="text-center font-monument text-[8px] text-[#a3a3a3] py-1">{d}</div>
                ))}
                {dates.map((date, i) => {
                  const isSelected = selectedDate?.toDateString() === date.toDateString();
                  const dow = date.getDay();
                  return (
                    <button
                      key={i}
                      onClick={() => { setSelectedDate(date); setSelectedSlot(null); }}
                      className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all text-xs ${
                        isSelected
                          ? 'bg-[#e5d3b3] text-black font-bold'
                          : 'hover:bg-white/10 text-white/80'
                      }`}
                    >
                      <span className={`font-monument text-[8px] mb-0.5 ${isSelected ? 'text-black/60' : 'text-white/30'}`}>
                        {DAY_NAMES[dow]}
                      </span>
                      <span className="font-editorial text-sm leading-none">{date.getDate()}</span>
                    </button>
                  );
                })}
              </div>

              {/* Month label */}
              {selectedDate && (
                <div className="font-monument text-[9px] tracking-widest text-[#e5d3b3] mb-3">
                  {MONTH_NAMES[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                </div>
              )}

              {/* Time slots */}
              {selectedDate && (
                <div>
                  <div className="font-monument text-[9px] tracking-widest text-[#a3a3a3] mb-3">Select time · {service.time}</div>
                  <div className="grid grid-cols-4 gap-2">
                    {slots.map(slot => {
                      const isBooked = bookedSlots.includes(slot);
                      const isSelected = selectedSlot === slot;
                      return (
                        <button
                          key={slot}
                          disabled={isBooked}
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-2 rounded-xl font-monument text-[10px] tracking-wider transition-all ${
                            isBooked ? 'bg-white/5 text-white/20 cursor-not-allowed line-through'
                            : isSelected ? 'bg-[#e5d3b3] text-black'
                            : 'bg-white/8 hover:bg-white/15 text-white/80'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <button
                disabled={!selectedDate || !selectedSlot}
                onClick={() => setStep('form')}
                className="w-full mt-6 py-4 rounded-full font-monument text-[10px] tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ background: selectedDate && selectedSlot ? '#e5d3b3' : '#333', color: selectedDate && selectedSlot ? '#000' : '#666' }}
              >
                Continue →
              </button>
            </motion.div>
          )}

          {/* STEP 2: FORM */}
          {step === 'form' && (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">

              {/* Summary */}
              <div className="glass-panel rounded-2xl p-4 mb-6 flex items-center gap-4">
                <div className="flex-1">
                  <div className="font-montreal text-sm text-white/60">
                    {selectedDate?.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })} · {selectedSlot}
                  </div>
                  <div className="font-editorial text-lg">{service.title}</div>
                </div>
                <button onClick={() => setStep('calendar')} className="font-monument text-[9px] text-[#e5d3b3] tracking-wider hover:underline">Change</button>
              </div>

              <div className="flex flex-col gap-4">
                {/* First name */}
                <div>
                  <label className="font-monument text-[9px] tracking-widest text-[#a3a3a3] block mb-1">First name *</label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                    className="w-full bg-white/8 border border-white/10 rounded-xl px-4 py-3 font-montreal text-sm text-white outline-none focus:border-[#e5d3b3] transition-colors"
                    placeholder="Имя"
                  />
                  {errors.firstName && <div className="text-red-400 text-xs mt-1 font-montreal">{errors.firstName}</div>}
                </div>

                {/* Last name */}
                <div>
                  <label className="font-monument text-[9px] tracking-widest text-[#a3a3a3] block mb-1">Last name *</label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                    className="w-full bg-white/8 border border-white/10 rounded-xl px-4 py-3 font-montreal text-sm text-white outline-none focus:border-[#e5d3b3] transition-colors"
                    placeholder="Фамилия"
                  />
                  {errors.lastName && <div className="text-red-400 text-xs mt-1 font-montreal">{errors.lastName}</div>}
                </div>

                {/* Phone */}
                <div>
                  <label className="font-monument text-[9px] tracking-widest text-[#a3a3a3] block mb-1">Phone *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full bg-white/8 border border-white/10 rounded-xl px-4 py-3 font-montreal text-sm text-white outline-none focus:border-[#e5d3b3] transition-colors"
                    placeholder="+420 000 000 000"
                  />
                  {errors.phone && <div className="text-red-400 text-xs mt-1 font-montreal">{errors.phone}</div>}
                </div>

                {/* Comment */}
                <div>
                  <label className="font-monument text-[9px] tracking-widest text-[#a3a3a3] block mb-1">Comment (optional)</label>
                  <textarea
                    value={form.comment}
                    onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                    rows={3}
                    className="w-full bg-white/8 border border-white/10 rounded-xl px-4 py-3 font-montreal text-sm text-white outline-none focus:border-[#e5d3b3] transition-colors resize-none"
                    placeholder="Пожелания или вопросы..."
                  />
                </div>

                {/* GDPR */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div
                    onClick={() => setForm(f => ({ ...f, gdpr: !f.gdpr }))}
                    className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all ${form.gdpr ? 'bg-[#e5d3b3] border-[#e5d3b3]' : 'border-white/30 hover:border-white/60'}`}
                  >
                    {form.gdpr && <span className="text-black text-xs font-bold">✓</span>}
                  </div>
                  <span className="font-montreal text-xs text-[#a3a3a3] leading-relaxed">
                    {t.gdpr}
                  </span>
                </label>
                {errors.gdpr && <div className="text-red-400 text-xs font-montreal -mt-2">{errors.gdpr}</div>}
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full mt-6 py-4 rounded-full font-monument text-[10px] tracking-widest bg-[#e5d3b3] text-black hover:bg-white transition-colors disabled:opacity-50"
              >
                {loading ? 'Booking...' : 'Confirm Reservation'}
              </button>
            </motion.div>
          )}

          {/* STEP 3: SUCCESS */}
          {step === 'success' && (
            <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-8 text-center">
              <div className="text-5xl mb-4">✦</div>
              <div className="font-editorial text-3xl mb-2 text-[#e5d3b3]">Reservation confirmed</div>
              <div className="font-montreal text-[#a3a3a3] text-sm mb-2">
                {service.title} · {selectedDate?.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })} · {selectedSlot}
              </div>
              <div className="font-montreal text-[#a3a3a3] text-sm mb-8">
                {form.firstName} {form.lastName} · {form.phone}
              </div>
              <button
                onClick={onClose}
                className="px-8 py-4 rounded-full font-monument text-[10px] tracking-widest bg-[#e5d3b3] text-black hover:bg-white transition-colors"
              >
                Done
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
