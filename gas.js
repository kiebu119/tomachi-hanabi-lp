// ============================================================
// とおまち 夏花火ナイト — GAS スクリプト
// Google Apps Script エディタに貼り付けてデプロイしてください
// ============================================================

// スプレッドシートID（デプロイ前に差し替え）
const SHEET_ID = '1RpO_IWKhFnCZUG4HiM_vPaBJJI0_Ud7U6cIQ7OU4n0Q';
const SHEET_NAME = 'とおまち観覧席予約';

// 確認メール送信元（GASのメールアドレス）
const FROM_NAME = 'とおまち観光協会';
const REPLY_TO = 'info@toomachi-kanko.jp';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    saveToSheet(data);
    sendConfirmationEmail(data);
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// スプレッドシートに保存
function saveToSheet(data) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);

  // シートがなければ作成
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['受付日時', '名前', 'メールアドレス', '電話番号', '人数', '備考']);
    sheet.getRange(1, 1, 1, 6).setFontWeight('bold').setBackground('#1B2A4A').setFontColor('#FFF6E5');
  }

  sheet.appendRow([
    data.timestamp || new Date().toLocaleString('ja-JP'),
    data.name,
    data.email,
    data.phone,
    data.count + '名',
    data.message || '',
  ]);
}

// 確認メール送信
function sendConfirmationEmail(data) {
  const subject = '【とおまち 夏花火ナイト】観覧席のご予約を受け付けました';
  const body = `
${data.name} 様

この度は「とおまち 夏花火ナイト」観覧席のご予約をいただき、ありがとうございます。
以下の内容で受け付けました。

────────────────────────────
■ お名前：${data.name} 様
■ メールアドレス：${data.email}
■ 電話番号：${data.phone}
■ 人数：${data.count}名
■ 備考：${data.message || 'なし'}
────────────────────────────

ご予約内容の確認後、担当者より改めてご連絡いたします。
キャンセルは前日17時まで無料で承っております。

当日、とおまちでお会いできることを楽しみにしています。

━━━━━━━━━━━━━━━━━━━━━━
とおまち観光協会
〒999-0000 とおまち市本町1-1 とおまち観光会館内
営業時間：平日 9:00〜17:00（夏季イベント期間中は土日対応あり）
Email：info@toomachi-kanko.jp
━━━━━━━━━━━━━━━━━━━━━━
  `.trim();

  GmailApp.sendEmail(data.email, subject, body, {
    name: FROM_NAME,
    replyTo: REPLY_TO,
  });
}

// ===== デプロイ手順 =====
// 1. Google スプレッドシートを作成し、IDをSHEET_IDに設定
// 2. Google Apps Script エディタでこのコードを貼り付け
// 3. 「デプロイ」→「新しいデプロイ」→「ウェブアプリ」
// 4. 「アクセスできるユーザー」を「全員」に設定
// 5. デプロイ後のURLをscript.jsのGAS_URLに設定
