import {firebaseConfig as FC, REG_FEE, CFG} from './config.js';
import {initializeApp} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updatePassword, onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {getFirestore, doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, addDoc, writeBatch, increment, getCountFromServer} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const fbApp = initializeApp(FC), auth = getAuth(fbApp), db = getFirestore(fbApp);
const $ = s => document.querySelector(s);
const E = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safe = u => /^https?:\/\//i.test(u || '') ? u : '';
const GR = ['A+','A-','B+','B-','O+','O-','AB+','AB-'];
let lang = localStorage.lang || 'bn', BD, HOS = [], M = {};

const BN = {'Home':'হোম','Register as donor':'ডোনার নিবন্ধন','Donor login':'ডোনার লগইন','My profile':'আমার প্রোফাইল','Admin':'অ্যাডমিন','Logout':'লগআউট',
'Non-profit blood donor finder':'অলাভজনক রক্তদাতা খোঁজার প্ল্যাটফর্ম','Find a blood donor near you':'আপনার কাছের রক্তদাতা খুঁজুন','Total joined':'মোট যোগ দিয়েছেন','Active donors':'সক্রিয় ডোনার','Deleted profiles':'মুছে ফেলা প্রোফাইল',
'Search donors':'ডোনার খুঁজুন','Search division or district':'বিভাগ বা জেলা লিখুন','Division':'বিভাগ','District':'জেলা','Upazila':'উপজেলা','Hospital':'হাসপাতাল','Blood group':'রক্তের গ্রুপ','Search':'খুঁজুন','Any':'যেকোনো',
'Never pay money for blood. Verify the donor before you go.':'রক্তের জন্য কখনো টাকা দেবেন না। যাওয়ার আগে ডোনারকে যাচাই করুন।','Available':'প্রস্তুত','Not available':'এখন নয়','Last donation':'শেষ রক্তদান','Call':'কল করুন','Social link':'সোশ্যাল লিংক','No public contact':'কোনো পাবলিক যোগাযোগ নেই','Report':'রিপোর্ট','No donors found':'কোনো ডোনার পাওয়া যায়নি','Select district and blood group':'জেলা ও রক্তের গ্রুপ বেছে নিন',
'Eligibility':'রক্তদানের যোগ্যতা','Age 18–60, weight 50 kg or more, healthy, no fever or infection.':'বয়স ১৮–৬০, ওজন ৫০ কেজি বা বেশি, সুস্থ, জ্বর বা সংক্রমণ নেই।','Compatibility':'গ্রুপ সামঞ্জস্য','O- gives to all; AB+ receives from all; same group is always safe.':'O- সবাইকে দিতে পারে; AB+ সবার কাছ থেকে নিতে পারে; একই গ্রুপ সবসময় নিরাপদ।','Donation interval':'রক্তদানের বিরতি','Men: every 3 months. Women: every 4 months.':'পুরুষ: ৩ মাস পর পর। নারী: ৪ মাস পর পর।','FAQ':'প্রশ্নোত্তর','Is donating safe? Yes, sterile single-use equipment is used and the body refills blood in weeks.':'রক্তদান কি নিরাপদ? হ্যাঁ, জীবাণুমুক্ত একবার-ব্যবহার্য সরঞ্জাম ব্যবহার হয় এবং শরীর কয়েক সপ্তাহে রক্ত পূরণ করে নেয়।',
'Name':'নাম','Phone (01XXXXXXXXX)':'ফোন (01XXXXXXXXX)','Password (min 6)':'পাসওয়ার্ড (কমপক্ষে ৬)','Photo (optional)':'ছবি (ঐচ্ছিক)','Social link (optional)':'সোশ্যাল লিংক (ঐচ্ছিক)','Show my phone publicly':'আমার ফোন নম্বর পাবলিকে দেখান','I agree to the':'আমি রাজি:','Terms & Privacy':'শর্ত ও গোপনীয়তা',
'One-time registration fee':'এককালীন নিবন্ধন ফি','Payment method (Send Money)':'পেমেন্ট মাধ্যম (সেন্ড মানি)','Send money to':'এই নম্বরে পাঠান','Copy':'কপি','Your sender number':'আপনার প্রেরক নম্বর','Transaction ID':'ট্রানজাকশন আইডি','Register':'নিবন্ধন করুন',
'Invalid phone number':'ফোন নম্বর সঠিক নয়','This Transaction ID was already used':'এই ট্রানজাকশন আইডি আগেই ব্যবহার হয়েছে','Registration failed':'নিবন্ধন হয়নি','Submitted! Status: pending admin approval.':'জমা হয়েছে! অবস্থা: অ্যাডমিনের অনুমোদনের অপেক্ষায়।','Contact support on WhatsApp':'হোয়াটসঅ্যাপে সাপোর্টে কথা বলুন',
'Login':'লগইন','Wrong phone or password':'ফোন বা পাসওয়ার্ড ভুল','Status':'অবস্থা','pending':'অপেক্ষমাণ','approved':'অনুমোদিত','rejected':'বাতিল','Contact phone':'যোগাযোগের ফোন','Available to donate':'রক্ত দিতে প্রস্তুত','Last donation date':'শেষ রক্তদানের তারিখ','Remove photo':'ছবি সরান','Save changes':'পরিবর্তন সংরক্ষণ','Saved':'সংরক্ষিত হয়েছে','New password':'নতুন পাসওয়ার্ড','Change password':'পাসওয়ার্ড বদলান','Password changed':'পাসওয়ার্ড বদলেছে','Request permanent deletion':'স্থায়ীভাবে মুছার অনুরোধ','Deletion request sent':'অনুরোধ পাঠানো হয়েছে','Why are you reporting?':'রিপোর্টের কারণ কী?','Reported':'রিপোর্ট জমা হয়েছে',
'Pending registrations':'অপেক্ষমাণ নিবন্ধন','Duplicate TrxID attempts':'ডুপ্লিকেট TrxID চেষ্টা','Deletion requests':'মুছার অনুরোধ','Reports':'রিপোর্ট','Edit log':'এডিট লগ','Approve':'অনুমোদন','Reject':'বাতিল','Delete permanently':'স্থায়ীভাবে মুছুন','Dismiss':'সরান','Joined':'যোগ দিয়েছেন','Active':'সক্রিয়','Pending':'অপেক্ষমাণ','Deleted':'মুছে ফেলা','Admin email':'অ্যাডমিন ইমেইল','Not an admin account':'এটি অ্যাডমিন অ্যাকাউন্ট নয়'};
const t = s => lang === 'bn' ? (BN[s] || s) : s;
const nm = o => o ? o[lang] : '';
const GRP = ['A+','A-','B+','B-','O+','O-','AB+','AB-'];
const opts = a => a.map(x => `<option value="${E(x)}">${E(x)}</option>`).join('');

// ---------- helpers ----------
const shrink = f => new Promise((res, rej) => { const i = new Image(); i.onerror = rej; i.onload = () => {
  let s = 240, q = .7, u; const c = document.createElement('canvas');
  for (;;) { const r = Math.min(1, s / Math.max(i.width, i.height)); c.width = i.width * r; c.height = i.height * r;
    c.getContext('2d').drawImage(i, 0, 0, c.width, c.height); u = c.toDataURL('image/jpeg', q);
    if (u.length < 62000 || s < 80) break; q > .4 ? q -= .1 : s -= 40; } res(u); }; i.src = URL.createObjectURL(f); });
const pub = d => ({name: d.name, group: d.group, district: d.district, upazila: d.upazila, available: !!d.available, lastDonation: d.lastDonation || '', photo: d.photo || '', social: d.social || '', phone: d.showPhone ? d.contactPhone : '', country: d.country || 'BD'});
const fillUp = (dSel, uSel) => { const d = M[dSel.value]; uSel.innerHTML = d && d.upazilas.length ? d.upazilas.map(u => `<option value="${E(u.en)}">${E(nm(u))}</option>`).join('') : '<option value="">—</option>'; };
const distOpts = () => Object.values(M).map(d => `<option value="${E(d.en)}">${E(nm(d))}</option>`).join('');
const csv = txt => { const [h, ...r] = txt.trim().split(/\r?\n/); const k = h.split(','); return r.map(l => Object.fromEntries(l.split(',').map((v, i) => [k[i], v.trim()]))); };
const wa = txt => `https://wa.me/88${CFG.SUPPORT_WHATSAPP}?text=${encodeURIComponent(txt)}`;
const U = () => auth.currentUser;
const isAdmin = async () => U() && (await getDoc(doc(db, 'admins', U().uid))).exists();

// ---------- nav ----------
function nav() {
  $('#nav').innerHTML = `<a href="#/">${t('Home')}</a><a href="#/register">${t('Register as donor')}</a><a href="#/${U() ? 'dash' : 'login'}">${U() ? t('My profile') : t('Donor login')}</a><a href="#/admin">${t('Admin')}</a>${U() ? `<button id="lo">${t('Logout')}</button>` : ''}<button id="lg">${lang === 'bn' ? 'English' : 'বাংলা'}</button>`;
  $('#lg').onclick = () => { lang = lang === 'bn' ? 'en' : 'bn'; localStorage.lang = lang; document.documentElement.lang = lang; nav(); route(); };
  if ($('#lo')) $('#lo').onclick = async () => { await signOut(auth); location.hash = '#/'; };
  document.querySelectorAll('[data-t]').forEach(e => e.textContent = t(e.dataset.t));
}

// ---------- home + search ----------
async function home() {
  $('#app').innerHTML = `<section class="hero"><h1>${t('Find a blood donor near you')}</h1><div class="stats" id="st"></div></section>
  <section class="box"><h2>${t('Search donors')}</h2><p class="warn">${t('Never pay money for blood. Verify the donor before you go.')}</p>
  <div class="form"><label class="full">${t('Search division or district')}<input id="q" autocomplete="off"><ul class="sug" id="sg" hidden></ul></label>
  <label id="dvw" hidden>${t('District')}<select id="dvs"></select></label>
  <label>${t('Upazila')}<select id="su"><option value="">${t('Any')}</option></select></label>
  <label>${t('Hospital')}<select id="sh"><option value="">${t('Any')}</option></select></label>
  <label>${t('Blood group')}<select id="sg2">${opts(GRP)}</select></label>
  <button class="btn full" id="go">${t('Search')}</button></div><p id="info" class="err"></p></section>
  <div class="cards" id="res"></div>
  <section class="box"><div class="row">${[['Eligibility','Age 18–60, weight 50 kg or more, healthy, no fever or infection.'],['Compatibility','O- gives to all; AB+ receives from all; same group is always safe.'],['Donation interval','Men: every 3 months. Women: every 4 months.'],['FAQ','Is donating safe? Yes, sterile single-use equipment is used and the body refills blood in weeks.']].map(([a, b]) => `<div><h3>${t(a)}</h3><p>${t(b)}</p></div>`).join('')}</div></section>`;
  try { const s = (await getDoc(doc(db, 'stats', 'main'))).data() || {}, a = await getCountFromServer(query(collection(db, 'public'), where('available', '==', true)));
    $('#st').innerHTML = [[s.joined || 0, 'Total joined'], [a.data().count, 'Active donors'], [s.deleted || 0, 'Deleted profiles']].map(([n, l]) => `<div><b>${n}</b>${t(l)}</div>`).join(''); } catch (e) {}

  let div = null, dist = null; const items = BD.divisions.flatMap(d => [{k: 'v', o: d, d}, ...d.districts.map(z => ({k: 'z', o: z, d}))]);
  const setDist = d => { dist = d; const hs = HOS.filter(h => h.district.toLowerCase() === d.en.toLowerCase());
    $('#su').innerHTML = `<option value="">${t('Any')}</option>` + d.upazilas.map(u => `<option value="${E(u.en)}">${E(nm(u))}</option>`).join('');
    $('#sh').innerHTML = `<option value="">${t('Any')}</option>` + hs.map((h, i) => `<option value="${E(h.upazila)}">${E(lang === 'bn' ? h.name_bn : h.name_en)}</option>`).join(''); };
  $('#q').oninput = e => { const v = e.target.value.toLowerCase().trim(); const m = v ? items.filter(i => (i.o.bn + i.o.en).toLowerCase().includes(v)).slice(0, 8) : [];
    $('#sg').hidden = !m.length; $('#sg').innerHTML = m.map((i, n) => `<li data-n="${items.indexOf(i)}">${E(nm(i.o))} <small>(${t(i.k === 'v' ? 'Division' : 'District')})</small></li>`).join(''); };
  $('#sg').onclick = e => { const li = e.target.closest('li'); if (!li) return; const i = items[li.dataset.n]; $('#sg').hidden = true; $('#q').value = nm(i.o);
    if (i.k === 'v') { div = i.o; dist = null; $('#dvw').hidden = false; $('#dvs').innerHTML = `<option value="">—</option>` + i.o.districts.map(z => `<option value="${E(z.en)}">${E(nm(z))}</option>`).join(''); }
    else { $('#dvw').hidden = true; setDist(i.o); } };
  $('#dvs').onchange = e => { const z = M[e.target.value]; if (z) setDist(z); };
  $('#sh').onchange = e => { if (e.target.value) $('#su').value = e.target.value; };
  $('#go').onclick = async () => {
    if (!dist) return $('#info').textContent = t('Select district and blood group');
    $('#info').textContent = ''; const up = $('#su').value;
    const snap = await getDocs(query(collection(db, 'public'), where('district', '==', dist.en), where('group', '==', $('#sg2').value)));
    const arr = snap.docs.map(d => ({id: d.id, ...d.data()})).sort((a, b) => (b.upazila === up) - (a.upazila === up));
    $('#res').innerHTML = arr.length ? arr.map(card).join('') : `<p>${t('No donors found')}</p>`; };
  $('#res').onclick = async e => { const r = e.target.closest('.rep'); if (r) { e.stopPropagation(); const why = prompt(t('Why are you reporting?')); if (why) { await addDoc(collection(db, 'reports'), {donorId: r.dataset.r, reason: why.slice(0, 300), time: Date.now()}); alert(t('Reported')); } return; }
    if (e.target.closest('.det a')) return; const p = e.target.closest('.ph');
    if (p && p.dataset.s) return window.open(p.dataset.s, '_blank', 'noopener'); const c = e.target.closest('.card'); if (c) { const d = c.querySelector('.det'); d.hidden = !d.hidden; } };
}
const card = d => { const s = safe(d.social); return `<article class="card"><div class="ph" ${s ? `data-s="${E(s)}"` : ''}>${d.photo ? `<img src="${E(d.photo)}" alt="">` : E((d.name || '?')[0])}</div><h3>${E(d.name)}</h3><b class="bg">${E(d.group)}</b>
<span class="av ${d.available ? '' : 'off'}">${d.available ? t('Available') : t('Not available')}</span><small>${t('Last donation')}: ${E(d.lastDonation || '-')}</small>
<div class="det" hidden>${d.phone ? `<a class="btn" href="tel:${E(d.phone)}">${t('Call')} ${E(d.phone)}</a>` : ''}${s ? `<a class="btn2" target="_blank" rel="noopener" href="${E(s)}">${t('Social link')}</a>` : ''}${!d.phone && !s ? `<p>${t('No public contact')}</p>` : ''}<button class="rep" data-r="${E(d.id)}">${t('Report')}</button></div></article>`; };

// ---------- register ----------
function reg() {
  $('#app').innerHTML = `<section class="box"><h2>${t('Register as donor')}</h2><form id="rf" class="form">
  <label>${t('Name')}<input id="n" required></label><label>${t('Phone (01XXXXXXXXX)')}<input id="p" inputmode="numeric" maxlength="11" required></label>
  <label>${t('Blood group')}<select id="g">${opts(GRP)}</select></label><label>${t('District')}<select id="di">${distOpts()}</select></label>
  <label>${t('Upazila')}<select id="up"></select></label><label>${t('Password (min 6)')}<input id="pw" type="password" minlength="6" required></label>
  <label>${t('Photo (optional)')}<input id="ph" type="file" accept="image/*"></label><label>${t('Social link (optional)')}<input id="so" type="url" placeholder="https://"></label>
  <label class="chk full"><input id="sp" type="checkbox">${t('Show my phone publicly')}</label>
  <div class="full box"><h3>${t('One-time registration fee')}: ${REG_FEE} ৳</h3><div class="row"><label>${t('Payment method (Send Money)')}<select id="pm">${opts(Object.keys(CFG.PAY))}</select></label>
  <label>${t('Send money to')}<span><b id="pn"></b> <button type="button" class="btn2" id="cp">${t('Copy')}</button></span></label>
  <label>${t('Your sender number')}<input id="sn" inputmode="numeric" required></label><label>${t('Transaction ID')}<input id="tx" required></label></div></div>
  <label class="chk full"><input id="tc" type="checkbox" required>${t('I agree to the')}&nbsp;<a href="#/terms">${t('Terms & Privacy')}</a></label>
  <button class="btn full">${t('Register')}</button><p id="msg" class="err full"></p></form></section>`;
  const pn = () => $('#pn').textContent = CFG.PAY[$('#pm').value]; pn(); $('#pm').onchange = pn; $('#cp').onclick = () => navigator.clipboard.writeText($('#pn').textContent);
  $('#di').onchange = () => fillUp($('#di'), $('#up')); fillUp($('#di'), $('#up'));
  $('#rf').onsubmit = async e => { e.preventDefault(); const msg = $('#msg'); msg.textContent = ''; const phone = $('#p').value.trim(); if (!/^01\d{9}$/.test(phone)) return msg.textContent = t('Invalid phone number');
    const trx = $('#tx').value.trim().toUpperCase().replace(/[^A-Z0-9]/g, ''); let cred;
    try { cred = await createUserWithEmailAndPassword(auth, phone + '@mkblood.app', $('#pw').value); const uid = cred.user.uid;
      const f = $('#ph').files[0], photo = f ? await shrink(f) : '', so = safe($('#so').value.trim());
      const data = {name: $('#n').value.trim(), phone, contactPhone: phone, group: $('#g').value, district: $('#di').value, upazila: $('#up').value, social: so, photo, showPhone: $('#sp').checked, available: true, lastDonation: '', status: 'pending', payMethod: $('#pm').value, senderNo: $('#sn').value.trim(), trxId: trx, country: 'BD', createdAt: Date.now()};
      const b = writeBatch(db); b.set(doc(db, 'donors', uid), data); b.set(doc(db, 'trx', trx), {uid, method: data.payMethod, time: Date.now()}); await b.commit();
      $('#app').innerHTML = `<section class="box"><p class="okm">${t('Submitted! Status: pending admin approval.')}</p><a class="btn" target="_blank" rel="noopener" href="${wa('MK BLOOD BANK: ' + data.name + ' / ' + phone + ' / TrxID ' + trx)}">${t('Contact support on WhatsApp')}</a> <a class="btn2" href="#/dash">${t('My profile')}</a></section>`; nav();
    } catch (er) { if (cred) { try { await addDoc(collection(db, 'dup'), {trxId: trx, phone, time: Date.now()}); } catch (x) {} try { await cred.user.delete(); } catch (x) {} }
      msg.textContent = cred ? t('This Transaction ID was already used') : (er.code === 'auth/email-already-in-use' ? 'এই নম্বর আগেই নিবন্ধিত / Phone already registered' : t('Registration failed')); } };
}

// ---------- login + dashboard ----------
function login() {
  $('#app').innerHTML = `<section class="box"><h2>${t('Donor login')}</h2><form id="lf" class="form"><label>${t('Phone (01XXXXXXXXX)')}<input id="p" inputmode="numeric" required></label><label>${t('Password (min 6)')}<input id="pw" type="password" required></label><button class="btn full">${t('Login')}</button><p id="msg" class="err"></p></form></section>`;
  $('#lf').onsubmit = async e => { e.preventDefault(); try { await signInWithEmailAndPassword(auth, $('#p').value.trim() + '@mkblood.app', $('#pw').value); location.hash = '#/dash'; } catch (x) { $('#msg').textContent = t('Wrong phone or password'); } };
}
async function dash() {
  if (!U()) return location.hash = '#/login'; const uid = U().uid, ref = doc(db, 'donors', uid), d = (await getDoc(ref)).data();
  if (!d) return $('#app').innerHTML = `<section class="box"><p>${t('Not an admin account')}</p></section>`;
  const ed = d.status === 'approved'; let photo = d.photo || '';
  $('#app').innerHTML = `<section class="box"><h2>${E(d.name)} — ${E(d.group)}</h2><p>${t('Status')}: <b>${t(d.status)}</b></p>
  ${d.status === 'pending' ? `<a class="btn" target="_blank" rel="noopener" href="${wa('MK BLOOD BANK support: ' + d.phone)}">${t('Contact support on WhatsApp')}</a>` : ''}
  <form id="df" class="form"><label>${t('Name')}<input id="n" value="${E(d.name)}" required></label><label>${t('Contact phone')}<input id="cp" value="${E(d.contactPhone)}"></label>
  <label>${t('Social link (optional)')}<input id="so" type="url" value="${E(d.social)}"></label><label>${t('Last donation date')}<input id="ld" type="date" value="${E(d.lastDonation)}"></label>
  <label class="chk"><input id="sp" type="checkbox" ${d.showPhone ? 'checked' : ''}>${t('Show my phone publicly')}</label><label class="chk"><input id="av" type="checkbox" ${d.available ? 'checked' : ''}>${t('Available to donate')}</label>
  <label>${t('Photo (optional)')}<input id="ph" type="file" accept="image/*"></label><button type="button" class="btn2" id="rp">${t('Remove photo')}</button>
  <button class="btn full">${t('Save changes')}</button><p id="msg" class="okm full"></p></form>
  <form id="pf" class="form"><label>${t('New password')}<input id="np" type="password" minlength="6" required></label><button class="btn2">${t('Change password')}</button><p id="pm" class="okm"></p></form>
  <p><button class="btn" id="dl">${t('Request permanent deletion')}</button></p></section>`;
  $('#rp').onclick = () => { photo = ''; $('#ph').value = ''; };
  $('#df').onsubmit = async e => { e.preventDefault(); const f = $('#ph').files[0]; if (f) photo = await shrink(f);
    const u = {name: $('#n').value.trim(), contactPhone: $('#cp').value.trim(), social: safe($('#so').value.trim()), showPhone: $('#sp').checked, photo, available: $('#av').checked, lastDonation: $('#ld').value};
    await updateDoc(ref, u); if (ed) await setDoc(doc(db, 'public', uid), pub({...d, ...u})); await addDoc(collection(db, 'edits'), {uid, name: u.name, time: Date.now()}); $('#msg').textContent = t('Saved'); };
  $('#pf').onsubmit = async e => { e.preventDefault(); try { await updatePassword(U(), $('#np').value); $('#pm').textContent = t('Password changed'); } catch (x) { $('#pm').textContent = 'Please logout, login again and retry.'; } };
  $('#dl').onclick = async () => { if (confirm(t('Request permanent deletion') + '?')) { await setDoc(doc(db, 'deletions', uid), {uid, name: d.name, phone: d.phone, time: Date.now()}); alert(t('Deletion request sent')); } };
}

// ---------- admin ----------
async function admin() {
  if (!(await isAdmin())) { $('#app').innerHTML = `<section class="box"><h2>${t('Admin')}</h2><form id="af" class="form"><label>${t('Admin email')}<input id="e" type="email" required></label><label>${t('Password (min 6)')}<input id="pw" type="password" required></label><button class="btn full">${t('Login')}</button><p id="msg" class="err"></p></form></section>`;
    return $('#af').onsubmit = async e => { e.preventDefault(); try { await signInWithEmailAndPassword(auth, $('#e').value, $('#pw').value); if (await isAdmin()) { nav(); route(); } else { await signOut(auth); $('#msg').textContent = t('Not an admin account'); } } catch (x) { $('#msg').textContent = t('Wrong phone or password'); } }; }
  const g = async (c, w) => (await getDocs(w ? query(collection(db, c), w) : collection(db, c))).docs.map(d => ({id: d.id, ...d.data()}));
  const [pen, dup, del, rep, edt, st] = await Promise.all([g('donors', where('status', '==', 'pending')), g('dup'), g('deletions'), g('reports'), g('edits'), getDoc(doc(db, 'stats', 'main'))]);
  const s = st.data() || {}, act = (await getCountFromServer(query(collection(db, 'public'), where('available', '==', true)))).data().count;
  const sec = (title, arr, fn) => `<section class="box"><h3>${t(title)}<span class="badge">${arr.length}</span></h3>${arr.map(x => `<div class="item">${fn(x)}</div>`).join('')}</section>`;
  const bt = (a, id, l) => `<button class="${a === 'ap' ? 'btn2' : 'btn'}" data-a="${a}" data-id="${E(id)}">${t(l)}</button>`;
  $('#app').innerHTML = `<div class="hero"><div class="stats"><div><b>${s.joined || 0}</b>${t('Joined')}</div><div><b>${act}</b>${t('Active')}</div><div><b>${pen.length}</b>${t('Pending')}</div><div><b>${s.deleted || 0}</b>${t('Deleted')}</div></div></div>
  <div id="ad">${sec('Pending registrations', pen, x => `<span>${E(x.name)} • ${E(x.phone)} • ${E(x.group)} • ${E(x.district)}<br>${E(x.payMethod)} • ${E(x.senderNo)} • TrxID: <b>${E(x.trxId)}</b></span><span>${bt('ap', x.id, 'Approve')} ${bt('rj', x.id, 'Reject')}</span>`)}
  ${sec('Duplicate TrxID attempts', dup, x => `<span>${E(x.phone)} • ${E(x.trxId)} • ${new Date(x.time).toLocaleString()}</span>${bt('dd', x.id + '|dup', 'Dismiss')}`)}
  ${sec('Deletion requests', del, x => `<span>${E(x.name)} • ${E(x.phone)}</span>${bt('rm', x.id, 'Delete permanently')}`)}
  ${sec('Reports', rep, x => `<span>${E(x.donorId)} — ${E(x.reason)}</span>${bt('dd', x.id + '|reports', 'Dismiss')}`)}
  ${sec('Edit log', edt.sort((a, b) => b.time - a.time).slice(0, 30), x => `<span>${E(x.name)} • ${new Date(x.time).toLocaleString()}</span>`)}</div>`;
  $('#ad').onclick = async e => { const b = e.target.closest('button'); if (!b) return; const id = b.dataset.id, a = b.dataset.a, wb = writeBatch(db), ref = doc(db, 'donors', id);
    if (a === 'ap') { const d = (await getDoc(ref)).data(); wb.update(ref, {status: 'approved'}); wb.set(doc(db, 'public', id), pub(d)); wb.set(doc(db, 'stats', 'main'), {joined: increment(1)}, {merge: true}); }
    if (a === 'rj') wb.update(ref, {status: 'rejected'});
    if (a === 'rm') { wb.delete(ref); wb.delete(doc(db, 'public', id)); wb.delete(doc(db, 'deletions', id)); wb.set(doc(db, 'stats', 'main'), {deleted: increment(1)}, {merge: true}); }
    if (a === 'dd') { const [i, c] = id.split('|'); wb.delete(doc(db, c, i)); }
    await wb.commit(); if (a === 'rm') alert('Firebase Console → Authentication → Users → এই ইউজার মুছে দিন / delete the Auth user manually.'); admin(); };
}

// ---------- terms ----------
function terms() {
  $('#app').innerHTML = `<section class="box"><h2>${t('Terms & Privacy')}</h2>${lang === 'bn'
    ? `<p>এটি একটি অলাভজনক প্ল্যাটফর্ম। নিবন্ধনের মাধ্যমে আপনি সম্মতি দিচ্ছেন যে আপনার নাম, রক্তের গ্রুপ, জেলা/উপজেলা, শেষ রক্তদানের তারিখ এবং আপনার বেছে নেওয়া ফোন/সোশ্যাল লিংক ও ছবি অনুমোদনের পর সবার জন্য দৃশ্যমান হবে।</p><p>পেমেন্ট তথ্য শুধু অ্যাডমিন দেখতে পাবেন। রক্তের জন্য কখনো টাকা লেনদেন করবেন না। ডোনারকে যাচাই করে নিন। আপনি অ্যাডমিনের কাছে স্থায়ী মুছে ফেলার অনুরোধ করতে পারেন।</p>`
    : `<p>This is a non-profit platform. By registering you consent to publicly show your name, blood group, district/upazila, last donation date and the phone, social link and photo you choose, after admin approval.</p><p>Payment details are visible only to the admin. Never pay money for blood and always verify the donor. You can request permanent deletion from the admin.</p>`}</section>`;
}

// ---------- boot ----------
const R = {'': home, '/': home, '/register': reg, '/login': login, '/dash': dash, '/admin': admin, '/terms': terms};
const route = async () => { try { await (R[location.hash.slice(1)] || home)(); } catch (e) { console.error(e); } nav(); scrollTo(0, 0); };
window.onhashchange = route;
(async () => {
  BD = await (await fetch('data/bd.json')).json(); BD.divisions.forEach(v => v.districts.forEach(z => M[z.en] = z));
  try { HOS = csv(await (await fetch('data/hospitals.csv')).text()); } catch (e) {}
  onAuthStateChanged(auth, route);
})();
