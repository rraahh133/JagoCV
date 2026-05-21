import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { compressImage } from '../utils/imageCompressor';

export default function EditProfileView() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [socialLinks, setSocialLinks] = useState<{ platform: string, url: string }[]>([]);
  const [phones, setPhones] = useState<{ number: string, label: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    api.getMe().then(data => {
      setName(data.name || '');
      setHeadline(data.headline || '');
      setBio(data.bio || '');
      setLocation(data.location || '');
      setEmail(data.email || '');
      setProfileImageUrl(data.profileImageUrl || '');
      setSocialLinks(data.socialLinks || []);
      setPhones(data.phones || []);
    }).catch(console.error);
  }, []);

  const handleAutoLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          const city = data.address.city || data.address.town || data.address.village || data.address.state || '';
          const country = data.address.country || '';
          setLocation(`${city}, ${country}`.trim());
        } catch (err) {
          console.error("Geocoding failed", err);
        } finally {
          setIsLocating(false);
        }
      }, () => {
        setIsLocating(false);
        alert("Gagal mengambil lokasi. Pastikan izin lokasi aktif.");
      });
    } else {
      setIsLocating(false);
      alert("Browser Anda tidak mendukung geolokasi.");
    }
  };

  const handleAddSocial = () => setSocialLinks([...socialLinks, { platform: 'LinkedIn', url: '' }]);
  const handleRemoveSocial = (index: number) => setSocialLinks(socialLinks.filter((_, i) => i !== index));
  const handleUpdateSocial = (index: number, field: string, value: string) => {
    const updated = [...socialLinks];
    updated[index] = { ...updated[index], [field]: value };
    setSocialLinks(updated);
  };

  const handleAddPhone = () => setPhones([...phones, { number: '', label: 'Utama' }]);
  const handleRemovePhone = (index: number) => setPhones(phones.filter((_, i) => i !== index));
  const handleUpdatePhone = (index: number, field: string, value: string) => {
    const updated = [...phones];
    updated[index] = { ...updated[index], [field]: value };
    setPhones(updated);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Hard limit 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert('File terlalu besar. Maksimal 5MB.');
      e.target.value = '';
      return;
    }

    try {
      // Auto compress jika > 300KB, resize ke max 400x400 untuk foto profil
      const result = await compressImage(file, {
        maxWidth: 400,
        maxHeight: 400,
        targetSizeKB: 300,
      });
      setProfileImageUrl(result.dataUrl);
    } catch {
      alert('Gagal memproses gambar. Silakan coba lagi.');
      e.target.value = '';
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const updatedUser = await api.updateUser({
        name,
        headline,
        bio,
        location,
        profileImageUrl,
        socialLinks,
        phones
      });
      localStorage.setItem('user', JSON.stringify(updatedUser));
      navigate('/profile');
    } catch (err) {
      console.error('Failed to update profile', err);
      alert('Gagal menyimpan profil');
    } finally {
      setIsLoading(false);
    }
  };

  const avatarUrl = profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=eff6ff&color=3b82f6&size=128`;

  return (
    <div className="animate-[fadeIn_0.5s_ease_forwards]">
      <div className="max-w-3xl mx-auto mt-10">
          <Link to="/profile" className="mb-6 flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-white/5 dark:hover:text-white px-3 py-2 rounded-xl transition-colors font-semibold w-fit">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Kembali ke Profil
          </Link>
          
          <div className="bg-white dark:bg-[#0B1221] rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
             <div className="p-8 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Profil</h2>
                <p className="text-sm text-slate-500 mt-1">Perbarui informasi profil dan personalisasi akun Anda.</p>
             </div>
             
             <div className="p-8 space-y-8">
                {/* Photo Section */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-8 border-b border-slate-200 dark:border-slate-800">
                   <div className="relative group shrink-0">
                      <div className="p-1 bg-white dark:bg-[#0B1221] rounded-full border border-slate-200 dark:border-slate-700">
                          <img src={avatarUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover bg-slate-100 dark:bg-slate-800" />
                      </div>
                   </div>
                   <div className="flex-1 w-full text-center sm:text-left">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Foto Profil</h3>
                      <p className="text-xs text-slate-500 mb-4">Dihasilkan otomatis atau unggah foto baru.</p>
                      <div className="flex gap-2 justify-center sm:justify-start">
                         <label className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold cursor-pointer transition">
                           Unggah Foto
                           <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                         </label>
                         <button onClick={() => setProfileImageUrl('')} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition">Reset</button>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Basic Info Column */}
                  <div className="space-y-6">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Informasi Dasar</h4>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Nama Lengkap</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} type="text" className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all text-slate-900 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Pekerjaan / Peran</label>
                        <input value={headline} onChange={(e) => setHeadline(e.target.value)} type="text" className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all text-slate-900 dark:text-white" placeholder="misal. Senior Frontend Engineer" />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Lokasi</label>
                       <div className="relative">
                          <input value={location} onChange={(e) => setLocation(e.target.value)} type="text" className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all text-slate-900 dark:text-white" />
                          <button onClick={handleAutoLocation} disabled={isLocating} className="absolute right-2 top-1.5 px-2 py-1 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded-lg border border-slate-200 dark:border-slate-700">
                             {isLocating ? '...' : 'Auto'}
                          </button>
                       </div>
                    </div>
                  </div>

                  {/* Contact Info Column */}
                  <div className="space-y-6">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Kontak & Sosial</h4>
                    
                    {/* Phones */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Nomor Telepon</label>
                        <button onClick={handleAddPhone} className="text-blue-600 text-[11px] font-bold">+ Tambah</button>
                      </div>
                      {phones.map((phone, idx) => (
                        <div key={idx} className="flex gap-2 animate-in slide-in-from-left-2 duration-200">
                          <input value={phone.number} onChange={(e) => handleUpdatePhone(idx, 'number', e.target.value)} className="flex-1 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-white" placeholder="08..." />
                          <select value={['Utama', 'Kerja', 'Pribadi'].includes(phone.label) ? phone.label : 'Utama'} onChange={(e) => handleUpdatePhone(idx, 'label', e.target.value)} className="w-24 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-2 text-[11px] text-white outline-none">
                            <option>Utama</option>
                            <option>Kerja</option>
                            <option>Pribadi</option>
                          </select>
                          <button onClick={() => handleRemovePhone(idx)} className="text-red-500 p-2">✕</button>
                        </div>
                      ))}
                    </div>

                    {/* Socials */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Sosial Media</label>
                        <button onClick={handleAddSocial} className="text-blue-600 text-[11px] font-bold">+ Tambah</button>
                      </div>
                      {socialLinks.map((link, idx) => {
                        const predefinedPlatforms = ['LinkedIn', 'GitHub', 'Twitter', 'Facebook', 'Instagram', 'Portfolio'];
                        const isCustom = !predefinedPlatforms.includes(link.platform);
                        
                        return (
                          <div key={idx} className="space-y-2 animate-in slide-in-from-left-2 duration-200">
                            <div className="flex gap-2">
                              <select 
                                value={isCustom ? 'Lainnya' : link.platform} 
                                onChange={(e) => {
                                  const val = e.target.value;
                                  handleUpdateSocial(idx, 'platform', val === 'Lainnya' ? '' : val);
                                }} 
                                className="w-28 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-2 text-[11px] text-white outline-none"
                              >
                                {predefinedPlatforms.map(p => <option key={p} value={p}>{p}</option>)}
                                <option value="Lainnya">Lainnya</option>
                              </select>
                              <input 
                                value={link.url} 
                                onChange={(e) => handleUpdateSocial(idx, 'url', e.target.value)} 
                                className="flex-1 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-white" 
                                placeholder="URL Profil atau Username" 
                              />
                              <button onClick={() => handleRemoveSocial(idx)} className="text-red-500 p-2">✕</button>
                            </div>
                            {isCustom && (
                              <input 
                                value={link.platform} 
                                onChange={(e) => handleUpdateSocial(idx, 'platform', e.target.value)} 
                                className="w-full bg-slate-50/50 dark:bg-slate-900/30 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-[10px] text-blue-400 placeholder:text-slate-600" 
                                placeholder="Nama Platform (misal: TikTok, Behance)"
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                   <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Bio Singkat</label>
                   <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all text-slate-900 dark:text-white min-h-[80px]" placeholder="Ceritakan sedikit tentang Anda..." />
                </div>
             </div>

             <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3">
                <Link to="/profile" className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold transition-colors">Batal</Link>
                <button disabled={isLoading} onClick={handleSave} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-blue-500/30 disabled:opacity-50">
                  {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
             </div>
          </div>
        </div>
      </div>
  );
}
