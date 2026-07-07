/* ============================================================
   とおまち 夏花火ナイト — script.js
   ============================================================ */

// ===== GAS ENDPOINT（デプロイ後に差し替え） =====
const GAS_URL = 'https://script.google.com/macros/s/AKfycbz3ewfcbotFvlw4jAkZh_dmH1KN6iZTrCHq72Yx_fqiSdpcl6GcIE_i6283e77q4xnl/exec';

// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initStickyBar();
  initFadeIn();
  initFAQ();
  initForm();
  initHamburger();
  initSmoothScroll();
  initVoicePlayback();
});

// ===== NAV スクロール =====
function initNav() {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

// ===== スティッキーバー =====
function initStickyBar() {
  const bar = document.getElementById('stickyBar');
  const spBar = document.getElementById('spBottomCta');

  function updateBars() {
    const show = window.scrollY > 50;
    if (bar) bar.classList.toggle('visible', show);
    if (spBar) spBar.classList.toggle('visible', show);
  }

  window.addEventListener('scroll', updateBars, { passive: true });
  updateBars();
}

// ===== フェードインアニメーション =====
function initFadeIn() {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
    observer.observe(el);
  });
}

// ===== FAQ アコーディオン =====
function initFAQ() {
  const items = document.querySelectorAll('.faq__item');

  items.forEach((item) => {
    const btn = item.querySelector('.faq__q');
    const answer = item.querySelector('.faq__a');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // 他を閉じる
      items.forEach((other) => {
        const otherBtn = other.querySelector('.faq__q');
        const otherAns = other.querySelector('.faq__a');
        if (otherBtn && otherAns && other !== item) {
          otherBtn.setAttribute('aria-expanded', 'false');
          otherAns.hidden = true;
        }
      });

      btn.setAttribute('aria-expanded', String(!isOpen));
      answer.hidden = isOpen;
    });
  });
}

// ===== ハンバーガーメニュー =====
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const spMenu = document.getElementById('spMenu');
  if (!hamburger || !spMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = spMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    spMenu.setAttribute('aria-hidden', String(!isOpen));
  });

  // メニューリンクをクリックで閉じる
  spMenu.querySelectorAll('.sp-menu__link').forEach((link) => {
    link.addEventListener('click', () => {
      spMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      spMenu.setAttribute('aria-hidden', 'true');
    });
  });
}

// ===== スムーススクロール =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = document.getElementById('nav')?.offsetHeight || 56;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

// ===== 吹き出しクリックで音声再生 =====
// 対応させたい要素に data-voice="キー" を付けると、
// img/audio/toma-voice-{キー}.mp3 が自動で再生対象になる。
// 音声ファイルが未追加のキーはクリックしても何も起きない（エラーにしない）。
function initVoicePlayback() {
  const triggers = document.querySelectorAll('[data-voice]');
  if (!triggers.length) return;

  let currentAudio = null;
  let currentTrigger = null;

  function stopCurrent() {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    if (currentTrigger) currentTrigger.classList.remove('is-playing');
    currentAudio = null;
    currentTrigger = null;
  }

  triggers.forEach((trigger) => {
    const key = trigger.dataset.voice;
    const audio = new Audio(`img/audio/toma-voice-${key}.mp3`);

    const play = () => {
      // 同じ吹き出しを連打した場合はトグルで停止
      if (currentTrigger === trigger) {
        stopCurrent();
        return;
      }
      stopCurrent();
      audio.currentTime = 0;
      audio.play().catch(() => {
        // 音声ファイルが無い/再生できない場合は静かに無視
      });
      trigger.classList.add('is-playing');
      currentAudio = audio;
      currentTrigger = trigger;
    };

    audio.addEventListener('ended', stopCurrent);
    audio.addEventListener('error', () => {
      trigger.classList.remove('is-playing');
    });

    trigger.addEventListener('click', play);
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        play();
      }
    });
  });
}

// ===== フォームバリデーション & GAS送信 =====
function initForm() {
  const form = document.getElementById('reserveForm');
  const submitBtn = document.getElementById('submitBtn');
  const thanksMsg = document.getElementById('thanksMsg');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    submitBtn.disabled = true;
    submitBtn.textContent = '送信中...';

    const data = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      count: document.getElementById('count').value,
      message: document.getElementById('message').value.trim(),
      timestamp: new Date().toLocaleString('ja-JP'),
    };

    try {
      await fetch(GAS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      form.hidden = true;
      if (thanksMsg) thanksMsg.hidden = false;
      thanksMsg?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.textContent = '予約を申し込む';
      alert('送信中にエラーが発生しました。時間をおいてもう一度お試しください。');
    }
  });

  // リアルタイムバリデーション
  ['name', 'email', 'phone', 'count'].forEach((id) => {
    document.getElementById(id)?.addEventListener('blur', () => validateField(id));
  });

  // 電話番号：数字入力に合わせて自動でハイフンを挿入
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      phoneInput.value = formatPhoneNumber(phoneInput.value);
    });
  }
}

// ===== 電話番号の自動ハイフン整形 =====
function formatPhoneNumber(value) {
  const digits = value.replace(/[^\d]/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

function validateForm() {
  const fields = ['name', 'email', 'phone', 'count'];
  let valid = true;
  fields.forEach((id) => {
    if (!validateField(id)) valid = false;
  });
  return valid;
}

function validateField(id) {
  const el = document.getElementById(id);
  const errEl = document.getElementById(`${id}Error`);
  if (!el || !errEl) return true;

  const value = el.value.trim();
  let error = '';

  if (!value) {
    error = 'この項目は必須です。';
  } else if (id === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    error = 'メールアドレスの形式が正しくありません。';
  } else if (id === 'phone' && !/^[\d\-\+\(\)\s]{7,15}$/.test(value)) {
    error = '電話番号の形式が正しくありません。';
  }

  errEl.textContent = error;
  el.classList.toggle('error', !!error);
  return !error;
}

// ===== 宿泊モーダル =====
const stayData = {
  ryokan: {
    name: '旅館 川の音',
    body: `
      <p>とおまち川のほとりに佇む、歴史ある和風旅館。縁側から川の音を聞きながら花火の余韻に浸れる、特別な一夜を。</p>
      <br>
      <p><strong>タイプ：</strong>和風旅館</p>
      <p><strong>料金：</strong>1泊2食付き ¥9,000台〜（1名）</p>
      <p><strong>チェックイン：</strong>15:00〜</p>
      <p><strong>チェックアウト：</strong>〜10:00</p>
      <br>
      <p>空室状況や詳細プランはLINEよりお気軽にご相談ください。</p>
    `,
  },
  minshuku: {
    name: '民宿 やまぐち',
    body: `
      <p>三代続く家族経営の民宿。地元の食材を使った家庭料理が自慢。まるで実家に帰ってきたような、あたたかいおもてなし。</p>
      <br>
      <p><strong>タイプ：</strong>民宿・ゲストハウス</p>
      <p><strong>料金：</strong>1泊2食付き ¥9,000台〜（1名）</p>
      <p><strong>チェックイン：</strong>15:00〜</p>
      <p><strong>チェックアウト：</strong>〜10:00</p>
      <br>
      <p>空室状況や詳細プランはLINEよりお気軽にご相談ください。</p>
    `,
  },
  hotel: {
    name: 'ホテル とおまちステーション',
    body: `
      <p>とおまち駅から徒歩3分、会場までも徒歩圏内。シンプルで清潔な客室と快適なアメニティが揃う小規模ホテル。</p>
      <br>
      <p><strong>タイプ：</strong>小規模ホテル</p>
      <p><strong>料金：</strong>1泊2食付き ¥9,000台〜（1名）</p>
      <p><strong>チェックイン：</strong>15:00〜</p>
      <p><strong>チェックアウト：</strong>〜11:00</p>
      <br>
      <p>空室状況や詳細プランはLINEよりお気軽にご相談ください。</p>
    `,
  },
};

function openModal(key) {
  const modal = document.getElementById('modal');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');
  const data = stayData[key];
  if (!modal || !data) return;

  title.textContent = data.name;
  body.innerHTML = data.body;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';

  // フォーカストラップ
  modal.querySelector('.modal__close')?.focus();
}

function closeModal() {
  const modal = document.getElementById('modal');
  if (!modal) return;
  modal.hidden = true;
  document.body.style.overflow = '';
}

// ESCキーで閉じる
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});