    (() => {
      const $ = (id) => document.getElementById(id);
      // Add the advanced authoring controls from JavaScript so Astro only has to render the stable reader/editor shell.
      const metadata = document.querySelector('.author-metadata');
      const bibPanel = document.createElement('section');
      bibPanel.className = 'author-bib-panel';
      bibPanel.innerHTML = '<div class="author-bib-heading"><strong>BibTeX Library</strong><span class="author-bib-count" id="author-bib-count">0 entries</span></div><label class="author-field"><span>BIBTEX SOURCE</span><textarea id="author-bib" class="author-bib-source" spellcheck="false" placeholder="Paste BibTeX entries here..."></textarea></label><p class="author-bib-help">粘贴真实 BibTeX 条目。正文使用 [@key] 或 [@key1; @key2]；预览会生成编号引用和文末参考文献。</p>';
      metadata?.after(bibPanel);
      const vault = document.createElement('section');
      vault.className = 'author-draft-vault';
      vault.innerHTML = '<div class="author-draft-heading"><div><strong>本地草稿库</strong><span>LOCAL DRAFT VAULT</span></div><span class="author-draft-storage-mark">仅此浏览器</span></div><div class="author-draft-controls"><label class="author-field"><span>已保存的草稿</span><select id="author-draft-select"><option value="">暂无本地草稿</option></select></label><div class="author-draft-buttons"><button class="button button-quiet" id="author-draft-save" type="button">立即保存</button><button class="button button-quiet" id="author-draft-load" type="button">恢复所选</button><button class="button button-quiet" id="author-draft-delete" type="button">删除所选</button></div></div><p id="author-draft-status" class="author-draft-status" role="status" aria-live="polite">编辑时自动保存；不会上传到服务器。</p>';
      bibPanel.after(vault);
      const bibInput = bibPanel.querySelector('#author-bib');
      bibInput.value = '@misc{sample-reference,\n  author = {Example Author},\n  title = {Replace with a verified reference},\n  year = {2026}\n}\n';
      const sourceInput = $('author-source');
      sourceInput.value = [
        '## 1. 从图到参数积分',
        '',
        '第一 Symanzik 多项式由生成树求和：',
        '',
        '$$',
        '\\mathcal U_G(\\alpha) = \\sum_{T\\in\\mathcal T_1(G)} \\prod_{e\\notin T}\\alpha_e.',
        '\\label{eq:symanzik}',
        '$$',
        '',
        '::: definition id=def:period title="图周期"',
        '图周期是由图定义的参数积分；具体定义需要说明积分形式、参数区域和归一化。',
        ':::',
        '',
        '::: theorem id=thm:structure title="结构信息的必要性"',
        '周期类型的识别需要同时考察参数多项式、积分区域与奇点结构。',
        ':::',
        '',
        '::: proof',
        '这是研究方法层面的陈述，不是已经完成的普遍分类定理。',
        ':::',
        '',
        '定义 @ref{def:period}、定理 @ref{thm:structure} 和公式 @ref{eq:symanzik} 构成一组交叉引用示例。',
        '',
        '文献示例：[@sample-reference]。'
      ].join('\n');

      const actions = document.querySelector('.author-preview-actions');
      const addAction = (id, label, primary = false) => {
        const button = document.createElement('button');
        button.type = 'button'; button.id = id;
        button.className = 'button ' + (primary ? 'button-primary' : 'button-quiet');
        button.textContent = label; actions?.append(button);
      };
      addAction('author-tex', '导出 LaTeX');
      addAction('author-source-download', '下载源稿 Markdown');
      addAction('author-bib-download', '导出 BibTeX');
      addAction('author-print', '打印 / 保存 PDF', true);
      addAction('author-import', '导入 Markdown');
      addAction('author-bib-import', '导入 BibTeX');
      const markdownFileInput = document.createElement('input');
      markdownFileInput.type = 'file';
      markdownFileInput.accept = '.md,.markdown,text/markdown,text/plain';
      markdownFileInput.hidden = true;
      markdownFileInput.id = 'author-import-file';
      document.body.append(markdownFileInput);
      const bibFileInput = document.createElement('input');
      bibFileInput.type = 'file';
      bibFileInput.accept = '.bib,text/plain';
      bibFileInput.hidden = true;
      bibFileInput.id = 'author-bib-import-file';
      document.body.append(bibFileInput);

      const syntax = document.createElement('section');
      syntax.className = 'author-preview-help academic-syntax';
      syntax.innerHTML = '<div><p class="page-kicker">ACADEMIC MARKUP</p><h2>学术写作语法</h2><p>这些标记只在作者预览和导出的 LaTeX 中解释。正式网站正文仍使用普通 Markdown / LaTeX。</p></div><div class="academic-syntax-list"><div><strong>定理 / 定义 / 引理 / 推论 / 证明</strong><code>::: theorem id=thm:main title="定理标题"</code><code>...内容...</code><code>:::</code></div><div><strong>公式标签</strong><code>\\label{eq:main}</code><span>放在独立公式内部；正文用 @ref{eq:main} 引用。</span></div><div><strong>交叉引用</strong><code>@ref{thm:main}</code><span>支持定理、定义和公式标签。</span></div><div><strong>文献引用</strong><code>[@key]</code><span>key 来自 BibTeX Library。</span></div></div>';
      document.querySelector('.author-preview-help')?.before(syntax);
      const preflightPanel = document.createElement('section');
      preflightPanel.className = 'author-preflight-panel';
      preflightPanel.innerHTML = '<div class="author-preflight-heading"><div><span>PUBLICATION PREFLIGHT</span><strong>发布前结构检查</strong></div><span id="author-preflight-count" class="author-preflight-count">CHECKING</span></div><ul id="author-preflight-list" class="author-preflight-list"></ul><p class="author-preflight-note">这里只检查文稿结构与引用完整性，不证明数学命题正确，也不能代替中英文配对及 GitHub 构建检查。</p>';
      document.querySelector('.author-preview-toolbar')?.after(preflightPanel);

      const fields = ['author-title','author-description','author-kind','author-language','author-key','author-date','author-category','author-tags','author-source','author-bib'];
      const sample = $('author-source').value;
      const sampleBib = $('author-bib').value;
      const DRAFT_STORAGE_KEY = 'yz-author-studio-drafts-v1';
      const MAX_LOCAL_DRAFTS = 30;
      let autosaveTimer = null;
      let autosaveDirty = false;
      let draftStorageUnavailable = false;

      function readLocalDrafts() {
        try {
          const value = JSON.parse(window.localStorage.getItem(DRAFT_STORAGE_KEY) || '[]');
          return Array.isArray(value) ? value.filter((item) => item && typeof item.id === 'string') : [];
        } catch (_) {
          draftStorageUnavailable = true;
          return [];
        }
      }

      function currentDraftRecord() {
        const key = $('author-key').value.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '') || 'untitled';
        const language = $('author-language').value;
        const kind = $('author-kind').value;
        return {
          id: [kind, key, language].join('::'),
          title: $('author-title').value.trim() || '未命名草稿',
          description: $('author-description').value,
          kind,
          language,
          key,
          date: $('author-date').value,
          category: $('author-category').value,
          tags: $('author-tags').value,
          source: $('author-source').value,
          bib: $('author-bib').value,
          savedAt: new Date().toISOString()
        };
      }

      function refreshLocalDraftList(selectedId) {
        const select = $('author-draft-select');
        if (!select) return;
        const drafts = readLocalDrafts().sort((a, b) => String(b.savedAt || '').localeCompare(String(a.savedAt || '')));
        select.replaceChildren();
        if (!drafts.length) {
          const option = document.createElement('option');
          option.value = '';
          option.textContent = '暂无本地草稿';
          select.append(option);
        } else {
          for (const draft of drafts) {
            const option = document.createElement('option');
            option.value = draft.id;
            const stamp = draft.savedAt ? new Date(draft.savedAt).toLocaleString() : '';
            option.textContent = (draft.title || draft.key || '未命名') + ' · ' + String(draft.language || '').toUpperCase() + (stamp ? ' · ' + stamp : '');
            select.append(option);
          }
          select.value = selectedId && drafts.some((draft) => draft.id === selectedId) ? selectedId : drafts[0].id;
        }
        if (draftStorageUnavailable) {
          $('author-draft-status').textContent = '浏览器存储不可用；请及时下载源稿备份。';
        } else if (drafts.length) {
          $('author-draft-status').textContent = '本地已有 ' + drafts.length + ' 份草稿；最近保存于 ' + new Date(drafts[0].savedAt).toLocaleString();
        } else {
          $('author-draft-status').textContent = '编辑时自动保存；不会上传到服务器。';
        }
      }

      function saveLocalDraft(silent = false) {
        if (autosaveTimer) window.clearTimeout(autosaveTimer);
        autosaveTimer = null;
        const record = currentDraftRecord();
        try {
          const drafts = readLocalDrafts();
          const index = drafts.findIndex((draft) => draft.id === record.id);
          if (index >= 0) drafts[index] = record;
          else drafts.unshift(record);
          drafts.sort((a, b) => String(b.savedAt || '').localeCompare(String(a.savedAt || '')));
          window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(drafts.slice(0, MAX_LOCAL_DRAFTS)));
          draftStorageUnavailable = false;
          autosaveDirty = false;
          refreshLocalDraftList(record.id);
          $('author-draft-status').textContent = (silent ? '自动保存完成 · ' : '已保存 · ') + new Date(record.savedAt).toLocaleString();
        } catch (_) {
          draftStorageUnavailable = true;
          $('author-draft-status').textContent = '本地保存失败；请使用源稿 Markdown 下载备份。';
        }
      }

      function queueLocalAutosave() {
        autosaveDirty = true;
        $('author-draft-status').textContent = '检测到修改 · 正在等待自动保存…';
        if (autosaveTimer) window.clearTimeout(autosaveTimer);
        autosaveTimer = window.setTimeout(() => saveLocalDraft(true), 700);
      }

      function loadSelectedLocalDraft() {
        const id = $('author-draft-select').value;
        const draft = readLocalDrafts().find((item) => item.id === id);
        if (!draft) {
          $('author-draft-status').textContent = '请先选择一份已保存的草稿。';
          return;
        }
        $('author-title').value = draft.title || '';
        $('author-description').value = draft.description || '';
        $('author-kind').value = draft.kind || 'journal';
        $('author-language').value = draft.language || 'zh';
        $('author-key').value = draft.key || '';
        $('author-date').value = draft.date || '';
        $('author-category').value = draft.category || '';
        $('author-tags').value = draft.tags || '';
        $('author-source').value = draft.source || '';
        $('author-bib').value = draft.bib || '';
        autosaveDirty = false;
        update();
        refreshLocalDraftList(id);
        $('author-draft-status').textContent = '已恢复草稿 · ' + (draft.title || draft.key || '未命名');
      }

      function deleteSelectedLocalDraft() {
        const id = $('author-draft-select').value;
        if (!id) return;
        if (!window.confirm('确定删除所选本地草稿吗？')) return;
        const drafts = readLocalDrafts().filter((item) => item.id !== id);
        try {
          window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(drafts));
          refreshLocalDraftList();
          $('author-draft-status').textContent = '所选本地草稿已删除。';
        } catch (_) {
          $('author-draft-status').textContent = '无法更新浏览器本地存储。';
        }
      }
      const missing = ['markdownit','katex','texmath','DOMPurify'].filter((name) => !window[name]);
      if (missing.length) {
        $('author-status').textContent = '预览引擎加载失败：' + missing.join(', ') + '。请检查网络后刷新。';
        $('reader-content').textContent = 'Markdown / LaTeX 预览库未能加载。源文本仍保留在左侧。';
        return;
      }
      const markdown = window.markdownit({ html: false, linkify: true, typographer: false })
        .use(window.texmath, { engine: window.katex, delimiters: 'dollars', katexOptions: { throwOnError: false, trust: false, strict: 'ignore' } });
      const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&' + '#39;'}[c]));
      const idSafe = (v) => String(v ?? '').replace(/[^A-Za-z0-9:_-]/g, '-');
      const codePattern = /^\x60{3}[^\n]*\n[\s\S]*?^\x60{3}\s*$/gm;
      const envPattern = /^:::\s*(theorem|lemma|proposition|corollary|definition|example|remark|proof)(?:\s+id=([A-Za-z0-9:._-]+))?(?:\s+title="([^"]*)")?\s*\n([\s\S]*?)^:::\s*$/gm;
      const eqPattern = /^\$\$\s*\n([\s\S]*?)\n\$\$\s*$/gm;
      const citePattern = /\[\s*((?:@[A-Za-z0-9:._-]+)(?:\s*;\s*@[A-Za-z0-9:._-]+)*)\s*\]/g;

      function parseBib(source) {
        const out = {};
        const re = /^@([A-Za-z]+)\s*\{\s*([^,\s]+)\s*,([\s\S]*?)^\s*\}/gm;
        for (const m of source.matchAll(re)) {
          const fields = {};
          const fieldRe = /([A-Za-z][A-Za-z0-9_-]*)\s*=\s*(?:\{([\s\S]*?)\}|"([^"]*)")\s*,?/g;
          for (const f of m[3].matchAll(fieldRe)) fields[f[1].toLowerCase()] = (f[2] ?? f[3] ?? '').trim();
          out[m[2]] = { type: m[1].toLowerCase(), ...fields };
        }
        return out;
      }

      function preview(source, bibSource, locale) {
        const bib = parseBib(bibSource);
        const code = [];
        let text = source.replace(codePattern, (block) => {
          const token = '@@CODE' + code.length + '@@'; code.push(block); return token;
        });
        const equations = [];
        const labels = new Map();
        const duplicate = [];
        text = text.replace(eqPattern, (_all, latex) => {
          const n = equations.length + 1;
          const lm = /\\label\{([^}]+)\}/.exec(latex);
          const label = lm?.[1]?.trim();
          const clean = latex.replace(/\\label\{[^}]+\}/g, '').trim();
          const token = '@@EQ' + equations.length + '@@';
          equations.push({ token, n, clean });
          if (label) { if (labels.has(label)) duplicate.push(label); labels.set(label, { id: idSafe(label), name: locale === 'en' ? 'Equation (' + n + ')' : '公式 (' + n + ')' }); }
          return token;
        });

        const typeNames = { theorem: locale === 'en' ? 'Theorem' : '定理', lemma: locale === 'en' ? 'Lemma' : '引理', proposition: locale === 'en' ? 'Proposition' : '命题', corollary: locale === 'en' ? 'Corollary' : '推论', definition: locale === 'en' ? 'Definition' : '定义', example: locale === 'en' ? 'Example' : '例', remark: locale === 'en' ? 'Remark' : '注', proof: locale === 'en' ? 'Proof' : '证明' };
        const envs = [], counters = {};
        text = text.replace(envPattern, (_all, type, label, title, body) => {
          const token = '@@ENV' + envs.length + '@@';
          const family = ['theorem','lemma','proposition','corollary'].includes(type) ? 'theorem' : type;
          const n = type === 'proof' ? null : (counters[family] = (counters[family] || 0) + 1);
          envs.push({ token, type, label, title, body, n });
          if (label) { if (labels.has(label)) duplicate.push(label); labels.set(label, { id: idSafe(label), name: typeNames[type] + (n ? ' ' + n : '') }); }
          return token;
        });

        const cited = [], citeNums = new Map();
        for (const m of source.replace(codePattern, '').matchAll(citePattern)) {
          for (const key of m[1].split(';').map((x) => x.trim().replace(/^@/, ''))) {
            if (!citeNums.has(key)) { cited.push(key); citeNums.set(key, cited.length + 1); }
          }
        }
        const missingCites = cited.filter((key) => !bib[key]);
        const missingRefs = [];
        const htmlTokens = new Map(); let serial = 0;

        function prepare(fragment) {
          let result = fragment.replace(/@ref\{([^}]+)\}/g, (_all, key) => {
            const target = labels.get(key.trim());
            const token = '@@HTML' + serial++ + '@@';
            if (!target) { missingRefs.push(key.trim()); htmlTokens.set(token, '<span class="academic-missing-ref">?? ' + esc(key.trim()) + '</span>'); }
            else htmlTokens.set(token, '<a class="academic-crossref" href="#' + esc(target.id) + '">' + esc(target.name) + '</a>');
            return token;
          });
          return result.replace(citePattern, (_all, group) => group.split(';').map((item) => {
            const key = item.trim().replace(/^@/, ''), n = citeNums.get(key), token = '@@HTML' + serial++ + '@@';
            htmlTokens.set(token, n && bib[key] ? '<a class="academic-citation" href="#ref-' + esc(idSafe(key)) + '">[' + n + ']</a>' : '<span class="academic-missing-cite">[? ' + esc(key) + ']</span>');
            return token;
          }).join('; '));
        }
        function restore(html, map) {
          for (const [token, value] of map) html = html.replaceAll('<p>' + token + '</p>', value).replaceAll(token, value);
          return html;
        }

        const eqHtml = new Map(equations.map((e) => [e.token, '<div class="academic-equation"><div class="academic-equation-math">' + markdown.render('$$\n' + e.clean + '\n$$') + '</div><span class="academic-equation-number">(' + e.n + ')</span></div>']));
        const codeHtml = new Map(code.map((block, i) => ['@@CODE' + i + '@@', markdown.render(block)]));
        const envHtml = new Map();
        function renderFragment(fragment) {
          let html = markdown.render(prepare(fragment));
          html = restore(html, eqHtml); html = restore(html, codeHtml); html = restore(html, htmlTokens);
          return html;
        }
        for (const env of envs) {
          const heading = typeNames[env.type] + (env.n ? ' ' + env.n : '');
          const title = env.title ? ' <span class="academic-environment-title">(' + esc(env.title) + ')</span>' : '';
          const id = env.label ? ' id="' + esc(idSafe(env.label)) + '"' : '';
          envHtml.set(env.token, '<section class="academic-environment academic-' + env.type + '"' + id + '><div class="academic-environment-heading"><strong>' + heading + title + '</strong></div><div class="academic-environment-body">' + renderFragment(env.body) + '</div></section>');
        }
        const article = restore(renderFragment(text), envHtml);
        const bibliography = cited.length ? '<section class="academic-bibliography"><h2>' + (locale === 'en' ? 'References' : '参考文献') + '</h2><ol>' + cited.map((key) => {
          const e = bib[key];
          if (!e) return '<li><span class="academic-missing-cite">Missing BibTeX entry: ' + esc(key) + '</span></li>';
          const doi = e.doi ? ' <a href="https://doi.org/' + esc(e.doi) + '" target="_blank" rel="noreferrer">DOI</a>' : '';
          const url = e.url ? ' <a href="' + esc(e.url) + '" target="_blank" rel="noreferrer">Link</a>' : '';
          return '<li id="ref-' + esc(idSafe(key)) + '"><span class="academic-ref-authors">' + esc(e.author || '') + '</span>. <cite>' + esc(e.title || key) + '</cite>. ' + esc(e.journal || e.booktitle || e.publisher || '') + (e.year ? ', ' + esc(e.year) : '') + '.' + doi + url + '</li>';
        }).join('') + '</ol></section>' : '';
        return { html: window.DOMPurify.sanitize(article + bibliography, { USE_PROFILES: { html: true } }), equations: equations.length, environments: envs.length, citations: cited.length, missingCites, missingRefs, duplicate, bibCount: Object.keys(bib).length };
      }

      function texEscape(value) {
        return String(value).replace(/\\/g, '\\textbackslash{}').replace(/([{}#$%&_])/g, '\\$1').replace(/~/g, '\\textasciitilde{}').replace(/\^/g, '\\textasciicircum{}');
      }
      function markdownToTex(source) {
        let text = source;
        const protectedItems = [];
        const protect = (value) => {
          const token = '@@TEX_BLOCK_' + protectedItems.length + '@@';
          protectedItems.push(value);
          return token;
        };
        text = text.replace(codePattern, (_whole, code) => protect('\\begin{verbatim}\n' + code + '\n\\end{verbatim}'));
        text = text.replace(envPattern, (_whole, type, label, title, body) => {
          const optional = title ? '[' + texEscape(title) + ']' : '';
          const labelLine = label ? '\\label{' + label + '}\n' : '';
          return protect('\\begin{' + type + '}' + optional + '\n' + labelLine + markdownToTex(body) + '\n\\end{' + type + '}');
        });
        text = text.replace(eqPattern, (_whole, latex) => {
          const formula = latex.trim();
          const alreadyEnvironment = /^\\begin\{(align|gather|multline)\*?\}/.test(formula);
          return protect(alreadyEnvironment ? formula : '\\begin{equation}\n' + formula + '\n\\end{equation}');
        });

        const blocks = text.split(/\n\s*\n/).map((block) => block.trim()).filter(Boolean);
        const converted = blocks.map((block) => {
          const tokenMatch = /^@@TEX_BLOCK_(\d+)@@$/.exec(block);
          if (tokenMatch) return protectedItems[Number(tokenMatch[1])];
          const heading = /^(#{1,4})\s+(.+)$/.exec(block);
          if (heading) {
            const command = ['section','subsection','subsubsection','paragraph'][heading[1].length - 1];
            return '\\' + command + '{' + inlineToTex(heading[2]) + '}';
          }
          const lines = block.split('\n');
          if (lines.every((line) => /^[-*+]\s+/.test(line))) {
            return '\\begin{itemize}\n' + lines.map((line) => '\\item ' + inlineToTex(line.replace(/^[-*+]\s+/, ''))).join('\n') + '\n\\end{itemize}';
          }
          if (lines.every((line) => /^\d+\.\s+/.test(line))) {
            return '\\begin{enumerate}\n' + lines.map((line) => '\\item ' + inlineToTex(line.replace(/^\d+\.\s+/, ''))).join('\n') + '\n\\end{enumerate}';
          }
          if (lines.every((line) => /^>\s?/.test(line))) {
            return '\\begin{quote}\n' + lines.map((line) => inlineToTex(line.replace(/^>\s?/, ''))).join('\\\\\n') + '\n\\end{quote}';
          }
          if (/^---+$/.test(block)) return '\\medskip\\hrule\\medskip';
          return lines.map((line) => inlineToTex(line)).join('\n');
        });
        return converted.join('\n\n');
      }
      function toPublicMarkdown(source, bibSource, locale) {
        const bib = parseBib(bibSource);
        const codeBlocks = [];
        let text = source.replace(codePattern, (block) => {
          const token = '@@PUBLIC_CODE_' + codeBlocks.length + '@@';
          codeBlocks.push(block);
          return token;
        });
        const labels = new Map();
        let equationNumber = 0;
        text = text.replace(eqPattern, (_all, latex) => {
          equationNumber += 1;
          const match = /\\label\{([^}]+)\}/.exec(latex);
          const label = match?.[1]?.trim();
          if (label) labels.set(label, { id: idSafe(label), name: locale === 'en' ? 'Equation (' + equationNumber + ')' : '公式 (' + equationNumber + ')' });
          const clean = latex.replace(/\\label\{[^}]+\}/g, '').trim();
          const tagged = /\\tag\{/.test(clean) ? clean : clean + '\n\\tag{' + equationNumber + '}';
          const anchor = label ? '<a id="' + esc(idSafe(label)) + '"></a>\n\n' : '';
          return '\n\n' + anchor + '$\n' + tagged + '\n$\n\n';
        });

        const names = {
          theorem: locale === 'en' ? 'Theorem' : '定理',
          lemma: locale === 'en' ? 'Lemma' : '引理',
          proposition: locale === 'en' ? 'Proposition' : '命题',
          corollary: locale === 'en' ? 'Corollary' : '推论',
          definition: locale === 'en' ? 'Definition' : '定义',
          example: locale === 'en' ? 'Example' : '例',
          remark: locale === 'en' ? 'Remark' : '注',
          proof: locale === 'en' ? 'Proof' : '证明'
        };
        const counters = {};
        text = text.replace(envPattern, (_all, type, label, title, body) => {
          const family = ['theorem','lemma','proposition','corollary'].includes(type) ? 'theorem' : type;
          const number = type === 'proof' ? null : (counters[family] = (counters[family] || 0) + 1);
          if (label) labels.set(label, { id: idSafe(label), name: names[type] + (number ? ' ' + number : '') });
          const heading = names[type] + (number ? ' ' + number : '') + (title ? ' (' + title + ')' : '');
          const anchor = label ? '<a id="' + esc(idSafe(label)) + '"></a>\n\n' : '';
          return '\n\n' + anchor + '**' + heading + '**\n\n' + body.trim() + '\n\n';
        });

        const cited = [], numbers = new Map();
        for (const match of source.replace(codePattern, '').matchAll(citePattern)) {
          for (const key of match[1].split(';').map((item) => item.trim().replace(/^@/, ''))) {
            if (!numbers.has(key)) { cited.push(key); numbers.set(key, cited.length + 1); }
          }
        }
        text = text.replace(/@ref\{([^}]+)\}/g, (_all, key) => {
          const target = labels.get(key.trim());
          return target ? '[' + target.name + '](#' + target.id + ')' : '**?? ' + key.trim() + '**';
        });
        text = text.replace(citePattern, (_all, group) => group.split(';').map((item) => {
          const key = item.trim().replace(/^@/, ''), number = numbers.get(key);
          return bib[key] ? '[' + number + '](#ref-' + idSafe(key) + ')' : '[? ' + key + ']';
        }).join('; '));

        if (cited.length) {
          const heading = locale === 'en' ? '## References' : '## 参考文献';
          const entries = cited.map((key, index) => {
            const entry = bib[key];
            if (!entry) return (index + 1) + '. Missing BibTeX entry: ' + key;
            const anchor = '<a id="ref-' + esc(idSafe(key)) + '"></a> ';
            const venue = [entry.journal || entry.booktitle || entry.publisher || '', entry.year || ''].filter(Boolean).join(', ');
            const doi = entry.doi ? ' [DOI](https://doi.org/' + entry.doi + ')' : '';
            const url = entry.url ? ' [Link](' + entry.url + ')' : '';
            return (index + 1) + '. ' + anchor + (entry.author || '') + '. *' + (entry.title || key) + '*.' + (venue ? ' ' + venue + '.' : '') + doi + url;
          });
          text += '\n\n' + heading + '\n\n' + entries.join('\n\n');
        }
        codeBlocks.forEach((block, index) => { text = text.replace('@@PUBLIC_CODE_' + index + '@@', block); });
        return text.trim() + '\n';
      }

      function makeMarkdownFile(readerReady = true) {
        const key = $('author-key').value.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '') || 'untitled';
        const lang = $('author-language').value, tags = $('author-tags').value.split(',').map((x) => x.trim()).filter(Boolean), kind = $('author-kind').value;
        const lines = ['---','translationKey: ' + key,'lang: ' + lang,'title: ' + JSON.stringify($('author-title').value),'description: ' + JSON.stringify($('author-description').value),'date: ' + ($('author-date').value || new Date().toISOString().slice(0,10)),'tags: [' + tags.map((x) => JSON.stringify(x)).join(', ') + ']','draft: true'];
        if (kind === 'note') lines.push('category: ' + JSON.stringify($('author-category').value || 'GENERAL'),'order: 100');
        const body = readerReady ? toPublicMarkdown($('author-source').value, $('author-bib').value, lang) : $('author-source').value;
        lines.push('---', '', body, '');
        return { filename: key + '.' + lang + '.md', content: lines.join('\n') };
      }
      function makeTexFile() {
        const key = $('author-key').value.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-') || 'article';
        const body = markdownToTex($('author-source').value);
        const hasCitations = /\[@[A-Za-z0-9:._-]+/.test($('author-source').value);
        const lines = [
          '\\documentclass[UTF8,12pt]{ctexart}',
          '\\usepackage[a4paper,margin=27mm]{geometry}',
          '\\usepackage{amsmath,amssymb,amsthm,mathtools}',
          '\\usepackage{graphicx,booktabs,enumitem,xcolor}',
          '\\usepackage[colorlinks=true,linkcolor=blue,citecolor=blue,urlcolor=blue]{hyperref}',
          '\\newtheorem{theorem}{Theorem}',
          '\\newtheorem{lemma}[theorem]{Lemma}',
          '\\newtheorem{proposition}[theorem]{Proposition}',
          '\\newtheorem{corollary}[theorem]{Corollary}',
          '\\newtheorem{definition}{Definition}',
          '\\newtheorem{example}{Example}',
          '\\newtheorem{remark}{Remark}',
          '\\title{' + texEscape($('author-title').value) + '}',
          '\\author{Yu Zhehao}',
          '\\date{' + ($('author-date').value || '\\today') + '}',
          '\\begin{document}','\\maketitle',body,
          hasCitations ? '\\bibliographystyle{unsrt}\n\\bibliography{' + key + '}' : '',
          '\\end{document}'
        ];
        return { filename: key + '.tex', content: lines.join('\n') };
      }
      function download(filename, content, mime) {
        const url = URL.createObjectURL(new Blob([content], { type: mime }));
        const link = document.createElement('a'); link.href = url; link.download = filename;
        document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1200);
      }
      function renderPreflight(result) {
        const source = $('author-source').value;
        const title = $('author-title').value.trim();
        const key = $('author-key').value.trim();
        const kind = $('author-kind').value;
        const issues = [];
        if (!title) issues.push('文章标题为空。');
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(key)) issues.push('文章 ID 应使用英文字母、数字和连字符。');
        if (!source.trim()) issues.push('正文为空。');
        const mathDelimiters = source.match(/^\$\$[ \t]*$/gm) || [];
        if (mathDelimiters.length % 2 !== 0) issues.push('独立公式的 $ 分隔符数量不成对。');
        const codeFences = source.match(/^\x60{3}/gm) || [];
        if (codeFences.length % 2 !== 0) issues.push('代码块围栏未闭合。');
        const supportedOpen = source.match(/^:::\s*(?:theorem|lemma|proposition|corollary|definition|example|remark|proof)\b/gm) || [];
        const environmentClose = source.match(/^:::\s*$/gm) || [];
        if (supportedOpen.length !== environmentClose.length) issues.push('定理类环境的开始与结束标记数量不一致。');
        const allContainers = source.match(/^:::\s*\S+/gm) || [];
        if (allContainers.length !== supportedOpen.length) issues.push('发现无法识别的学术环境标记。');
        if (kind === 'note' && !$('author-category').value.trim()) issues.push('笔记分类尚未填写。');
        if (result.missingCites.length) issues.push('BibTeX 缺少条目：' + result.missingCites.join(', ') + '。');
        if (result.missingRefs.length) issues.push('交叉引用目标不存在：' + result.missingRefs.join(', ') + '。');
        if (result.duplicate.length) issues.push('标签重复：' + result.duplicate.join(', ') + '。');
        if (result.html.includes('katex-error')) issues.push('至少一个公式未能通过 KaTeX 解析，请检查 LaTeX 语法。');
        const list = $('author-preflight-list');
        list.replaceChildren();
        if (!issues.length) {
          const item = document.createElement('li');
          item.className = 'author-preflight-pass';
          item.textContent = '基础结构检查通过。仍需人工核对推导、文献真实性、事实陈述和中英文版本。';
          list.append(item);
          $('author-preflight-count').textContent = '0 ISSUES';
        } else {
          $('author-preflight-count').textContent = issues.length + ' ITEMS';
          for (const issue of issues) {
            const item = document.createElement('li');
            item.className = 'author-preflight-issue';
            item.textContent = issue;
            list.append(item);
          }
        }
      }

      function update() {
        const kind = $('author-kind').value, lang = $('author-language').value;
        $('reader-title').textContent = $('author-title').value.trim() || 'Untitled';
        $('reader-description').textContent = $('author-description').value;
        $('reader-kind').textContent = kind === 'note' ? 'NOTE' : 'JOURNAL';
        $('reader-date').textContent = $('author-date').value || '';
        $('reader-language').textContent = lang.toUpperCase();
        $('reader-tags').replaceChildren(...$('author-tags').value.split(',').map((x) => x.trim()).filter(Boolean).map((tag) => {
          const node = document.createElement('span'); node.className = 'tag'; node.textContent = tag; return node;
        }));
        const result = preview($('author-source').value, $('author-bib').value, lang);
        $('reader-content').innerHTML = result.html;
        renderPreflight(result);
        $('author-count').textContent = $('author-source').value.length.toLocaleString() + ' 字符';
        $('author-bib-count').textContent = result.bibCount + ' entries';
        document.querySelectorAll('.author-note-only').forEach((node) => { node.hidden = kind !== 'note'; });
        const warnings = [];
        if (result.missingCites.length) warnings.push('缺少 BibTeX: ' + result.missingCites.join(', '));
        if (result.missingRefs.length) warnings.push('未定义标签: ' + result.missingRefs.join(', '));
        if (result.duplicate.length) warnings.push('重复标签: ' + result.duplicate.join(', '));
        $('author-status').textContent = warnings.length ? warnings.join('；') : '预览已更新 · ' + result.equations + ' 个公式 · ' + result.environments + ' 个学术环境 · ' + result.citations + ' 组引用';
      }
      async function copyText(value, message) {
        try { await navigator.clipboard.writeText(value); $('author-status').textContent = message; }
        catch (_) { $('author-status').textContent = '浏览器不允许自动复制，请手动选择文本。'; }
      }
      fields.forEach((id) => {
        const field = $(id);
        field.addEventListener('input', () => { update(); queueLocalAutosave(); });
        field.addEventListener('change', () => { update(); queueLocalAutosave(); });
      });
      $('author-draft-save').addEventListener('click', () => saveLocalDraft(false));
      $('author-draft-load').addEventListener('click', loadSelectedLocalDraft);
      $('author-draft-delete').addEventListener('click', deleteSelectedLocalDraft);
      $('author-import').addEventListener('click', () => markdownFileInput.click());
      $('author-bib-import').addEventListener('click', () => bibFileInput.click());

      function parseFrontmatterFile(content) {
        const match = /^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/.exec(content);
        if (!match) return { metadata: {}, body: content };
        const metadata = {};
        for (const line of match[1].split(/\r?\n/)) {
          const colon = line.indexOf(':');
          if (colon < 1) continue;
          const key = line.slice(0, colon).trim();
          const raw = line.slice(colon + 1).trim();
          let value = raw;
          if (raw.startsWith('"') || raw.startsWith('[')) {
            try { value = JSON.parse(raw); } catch (_) {}
          } else if (raw === 'true') value = true;
          else if (raw === 'false') value = false;
          metadata[key] = value;
        }
        return { metadata, body: content.slice(match[0].length) };
      }

      markdownFileInput.addEventListener('change', async () => {
        const file = markdownFileInput.files?.[0];
        if (!file) return;
        try {
          const imported = parseFrontmatterFile(await file.text());
          const meta = imported.metadata;
          if (meta.title !== undefined) $('author-title').value = String(meta.title);
          if (meta.description !== undefined) $('author-description').value = String(meta.description);
          if (meta.translationKey !== undefined) $('author-key').value = String(meta.translationKey);
          else $('author-key').value = file.name.replace(/\.source\.md$|\.markdown$|\.md$/i, '').toLowerCase().replace(/[^a-z0-9-]+/g, '-');
          if (meta.lang === 'zh' || meta.lang === 'en') $('author-language').value = meta.lang;
          if (meta.date) $('author-date').value = String(meta.date).slice(0, 10);
          if (Array.isArray(meta.tags)) $('author-tags').value = meta.tags.join(', ');
          if (meta.category !== undefined) $('author-category').value = String(meta.category);
          $('author-source').value = imported.body;
          update();
          queueLocalAutosave();
          $('author-status').textContent = '已导入 Markdown：' + file.name;
        } catch (_) {
          $('author-status').textContent = 'Markdown 导入失败；请检查文件编码与 frontmatter 格式。';
        } finally {
          markdownFileInput.value = '';
        }
      });

      bibFileInput.addEventListener('change', async () => {
        const file = bibFileInput.files?.[0];
        if (!file) return;
        try {
          $('author-bib').value = await file.text();
          update();
          queueLocalAutosave();
          $('author-status').textContent = '已导入 BibTeX：' + file.name;
        } catch (_) {
          $('author-status').textContent = 'BibTeX 导入失败；请检查文件。';
        } finally {
          bibFileInput.value = '';
        }
      });
      document.addEventListener('keydown', (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
          event.preventDefault();
          saveLocalDraft(false);
        }
      });
      window.addEventListener('beforeunload', () => { if (autosaveDirty) saveLocalDraft(true); });
      $('author-reset').addEventListener('click', () => { $('author-source').value = sample; $('author-bib').value = sampleBib; update(); });
      $('author-copy').addEventListener('click', () => copyText($('author-source').value, '正文已复制'));
      $('author-download').addEventListener('click', () => { const f = makeMarkdownFile(true); download(f.filename, f.content, 'text/markdown;charset=utf-8'); $('author-status').textContent = '读者版 Markdown 草稿已生成'; });
      $('author-source-download').addEventListener('click', () => { const f = makeMarkdownFile(false); f.filename = f.filename.slice(0, -3) + '.source.md'; download(f.filename, f.content, 'text/markdown;charset=utf-8'); $('author-status').textContent = '保留学术标记的源稿已生成'; });
      $('author-tex').addEventListener('click', () => { const f = makeTexFile(); download(f.filename, f.content, 'application/x-tex;charset=utf-8'); $('author-status').textContent = 'LaTeX 源文件已生成；如有引用，请同时导出 BibTeX'; });
      $('author-bib-download').addEventListener('click', () => { const key = $('author-key').value.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-') || 'references'; download(key + '.bib', $('author-bib').value.trim() + '\n', 'application/x-bibtex;charset=utf-8'); });
      $('author-print').addEventListener('click', () => window.print());
      refreshLocalDraftList();
      update();
    })();
