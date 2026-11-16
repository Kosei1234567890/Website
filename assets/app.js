(()=>{'use strict';
  const storageKey='studymaster-completed-v1';
  const getDone=()=>{try{const value=JSON.parse(localStorage.getItem(storageKey)||'[]');return Array.isArray(value)?new Set(value):new Set();}catch{return new Set();}};
  const saveDone=(v)=>{try{localStorage.setItem(storageKey,JSON.stringify([...v]));}catch{/* private mode */}};
  const updateProgress=()=>{
    const done=getDone();
    document.querySelectorAll('[data-complete]').forEach(btn=>{
      const isDone=done.has(btn.dataset.complete);btn.classList.toggle('is-done',isDone);
      btn.innerHTML=isDone?'<svg aria-hidden="true" class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m5 12 4 4L19 6"/></svg> 学習済み ✓':'<svg aria-hidden="true" class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m5 12 4 4L19 6"/></svg> 学習済みにする';
      btn.setAttribute('aria-pressed',String(isDone));
    });
    document.querySelectorAll('.article-progress-status').forEach(el=>{el.textContent=done.has(document.body.dataset.article)?'完了！':'未完了';});
    document.querySelectorAll('.article-card').forEach(card=>{const tag=card.querySelector('.done-tiny');if(tag)tag.hidden=!done.has(card.dataset.slug);});
  };
  document.querySelectorAll('[data-complete]').forEach(btn=>btn.addEventListener('click',()=>{
    const done=getDone(),slug=btn.dataset.complete;if(done.has(slug))done.delete(slug);else done.add(slug);saveDone(done);updateProgress();
  }));
  updateProgress();
  const menuBtn=document.querySelector('.mobile-nav-btn'),menu=document.getElementById('mobile-menu');
  if(menuBtn&&menu){menuBtn.addEventListener('click',()=>{const newOpen=menu.hasAttribute('hidden');menu.hidden=!newOpen;menuBtn.setAttribute('aria-expanded',String(newOpen));});menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.hidden=true;menuBtn.setAttribute('aria-expanded','false');}));}
  const search=document.getElementById('article-search'),chips=[...document.querySelectorAll('[data-filter]')],cards=[...document.querySelectorAll('.article-card')],count=document.getElementById('result-count'),empty=document.getElementById('no-results');
  if(search&&chips.length){let subject='すべて';
    function update(){const query=search.value.trim().normalize('NFKC').toLocaleLowerCase('ja');let visible=0;
      cards.forEach(card=>{const matchesSubject=subject==='すべて'||card.dataset.subject===subject||(subject==='面白勉強'&&(card.dataset.tags||'').split(/\s+/).includes('面白勉強'));const matchesQuery=card.dataset.title.normalize('NFKC').toLocaleLowerCase('ja').includes(query);card.hidden=!(matchesSubject&&matchesQuery);if(!card.hidden)visible++;});
      count.textContent=`${visible}件の記事`;empty.hidden=visible!==0;
    }
    function setSubject(value){subject=value;chips.forEach(c=>{const selected=c.dataset.filter===value;c.classList.toggle('is-active',selected);c.setAttribute('aria-pressed',String(selected));});update();}
    chips.forEach(chip=>chip.addEventListener('click',()=>setSubject(chip.dataset.filter)));
    search.addEventListener('input',update);
    document.querySelectorAll('[data-subject-jump]').forEach(link=>link.addEventListener('click',()=>{search.value='';setSubject(link.dataset.subjectJump);}));
    const clear=document.getElementById('clear-search');if(clear)clear.addEventListener('click',()=>{search.value='';setSubject('すべて');search.focus();});
    update();
  }
})();
