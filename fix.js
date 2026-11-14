const fs = require('fs');
const path = require('path');

// 指向你的 _posts 資料夾
const postsDir = path.join(__dirname, 'source', '_posts'); 

fs.readdir(postsDir, (err, files) => {
  if (err) {
    // 如果腳本是直接放在 _posts 資料夾內執行的備用路徑
    return fixFiles(__dirname);
  }
  fixFiles(postsDir);
});

function fixFiles(dir) {
  fs.readdirSync(dir).forEach(file => {
    if (path.extname(file) !== '.md') return;

    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    const stats = fs.statSync(filePath);
    
    // 取得檔案原本正確的修改時間 (mtime)
    const mtime = stats.mtime;
    const YYYY = mtime.getFullYear();
    const MM = String(mtime.getMonth() + 1).padStart(2, '0');
    const DD = String(mtime.getDate()).padStart(2, '0');
    const hh = String(mtime.getHours()).padStart(2, '0');
    const mm = String(mtime.getMinutes()).padStart(2, '0');
    const ss = String(mtime.getSeconds()).padStart(2, '0');
    
    const formattedDate = `${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss}`;

    // 如果沒有 date: 標籤，就把修改時間寫進去
    if (!content.includes('date:')) {
      if (content.startsWith('---')) {
        content = content.replace(/^---\n/, `---\ndate: ${formattedDate}\n`);
      } else {
        content = `---\ndate: ${formattedDate}\n---\n\n` + content;
      }
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ 已修正 ${file} -> date: ${formattedDate}`);
    }
  });
}
