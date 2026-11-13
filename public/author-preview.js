    (() => {
      const $ = (id) => document.getElementById(id);
      const fields = ['author-title','author-description','author-kind','author-language','author-key','author-date','author-category','author-tags','author-source','author-bib'];
      const sample = $('author-source').value;
      const sampleBib = $('author-bib').value;
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
        const blocks = [];
        const protect = (value) => { const token = '@@TEX' + blocks.length + '@@'; blocks.push(value); return token; };
        let text = source.replace(codePattern, (block) => protect('\\begin{verbatim}\n' + block.replace(/^\x60{3}[^\n]*\n/, '').replace(/\n\x60{3}\s*$/, '') + '\n\\end{verbatim}'));
        text = text.replace(envPattern, (_all, type, label, title, body) => protect('\\begin{' + type + '}' + (title ? '[' + texEscape(title) + ']' : '') + '\n' + (label ? '\\label{' + label + '}\n' : '') + markdownToTex(body) + '\n\\end{' + type + '}'));
        text = text.replace(eqPattern, (_all, latex) => protect('\\begin{equation}\n' + latex.trim() + '\n\\end{equation}'));
        text = text.replace(/^\s*(#{1,4})\s+(.+)$/gm, (_all, hashes, title) => '\\' + ['section','subsection','subsubsection','paragraph'][hashes.length - 1] + '{' + texEscape(title) + '}');
        text = text.replace(/\[@([A-Za-z0-9:._-]+)\]/g, '\\cite{$1}');
        text = text.replace(/@ref\{([^}]+)\}/g, '\\autoref{$1}');
        text = text.replace(/\*\*(.+?)\*\*/g, '\\textbf{$1}').replace(/\*(.+?)\*/g, '\\emph{$1}');
        text = text.replace(/^\s*[-*+]\s+(.+)$/gm, '\\\\item $1');
        text = text.replace(/^\s*>\s?/gm, '');
        blocks.forEach((value, i) => { text = text.replace('@@TEX' + i + '@@', value); });
        return text;
      }
      function makeMarkdownFile() {
        const key = $('author-key').value.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '') || 'untitled';
        const lang = $('author-language').value, tags = $('author-tags').value.split(',').map((x) => x.trim()).filter(Boolean), kind = $('author-kind').value;
        const lines = ['---','translationKey: ' + key,'lang: ' + lang,'title: ' + JSON.stringify($('author-title').value),'description: ' + JSON.stringify($('author-description').value),'date: ' + ($('author-date').value || new Date().toISOString().slice(0,10)),'tags: [' + tags.map((x) => JSON.stringify(x)).join(', ') + ']','draft: true'];
        if (kind === 'note') lines.push('category: ' + JSON.stringify($('author-category').value || 'GENERAL'),'order: 100');
        lines.push('---', '', $('author-source').value, '');
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
      fields.forEach((id) => $(id).addEventListener('input', update));
      $('author-reset').addEventListener('click', () => { $('author-source').value = sample; $('author-bib').value = sampleBib; update(); });
      $('author-copy').addEventListener('click', () => copyText($('author-source').value, '正文已复制'));
      $('author-download').addEventListener('click', () => { const f = makeMarkdownFile(); download(f.filename, f.content, 'text/markdown;charset=utf-8'); $('author-status').textContent = 'Markdown 草稿已生成'; });
      $('author-tex').addEventListener('click', () => { const f = makeTexFile(); download(f.filename, f.content, 'application/x-tex;charset=utf-8'); $('author-status').textContent = 'LaTeX 源文件已生成；如有引用，请同时导出 BibTeX'; });
      $('author-bib-download').addEventListener('click', () => { const key = $('author-key').value.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-') || 'references'; download(key + '.bib', $('author-bib').value.trim() + '\n', 'application/x-bibtex;charset=utf-8'); });
      $('author-print').addEventListener('click', () => window.print());
      update();
    })();
