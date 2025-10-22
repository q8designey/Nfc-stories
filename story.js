function qs(n){var p=new URLSearchParams(location.search);return p.get(n);}
function getLang(){return (qs('lang')||localStorage.getItem('lang')||'ar');}
function setLang(l){localStorage.setItem('lang',l);}
function switchLang(l){setLang(l); var id=qs('id'); var page=qs('page')||'1'; location.href='story.html?id='+encodeURIComponent(id)+'&lang='+l+'&page='+page;}
function t(obj){var l=getLang(); if(!obj) return ''; if(typeof obj==='string') return obj; return (l==='ar'?(obj.ar||obj.en):(obj.en||obj.ar));}
(function(){
  var id=qs('id'), page=parseInt(qs('page')||'1',10);
  var lang=getLang(); document.documentElement.lang=lang; document.documentElement.dir=(lang==='ar'?'rtl':'ltr');
  var s = window.STORYBOOK && window.STORYBOOK.find(x=>x.id===id);
  if(!s){ document.body.innerHTML='<main class="wrap"><p>Story not found.</p></main>'; return; }
  document.title = t(s.title) + ' — Storybook';
  document.getElementById('title').textContent = t(s.title);
  document.getElementById('subtitle').textContent = t(s.subtitle)||'';
  document.getElementById('back').textContent = (lang==='ar'?'← القائمة':'← Back');
  document.getElementById('prevText').textContent = (lang==='ar'?'السابق':'Prev');
  document.getElementById('nextText').textContent = (lang==='ar'?'التالي':'Next');
  document.getElementById('foot').textContent = t(s.footer)||'';
  var pages = t(s.pages); var total = pages.length;
  var currentPage = page;
  function render(p){
    if(p<1) p=1; if(p>total) p=total;
    var data = pages[p-1];
    var pageEl = document.getElementById('page');
    pageEl.classList.remove('flip-enter','flip-enter-active');
    pageEl.classList.add('flip-exit');
    setTimeout(()=>{
      pageEl.classList.add('flip-exit-active');
      setTimeout(()=>{
        document.getElementById('content').innerHTML = data.html || '';
        var img = document.getElementById('img'); if(data.img){ img.src=data.img; } else { img.removeAttribute('src'); }
        document.getElementById('pager').textContent = p + ' / ' + total;
        pageEl.classList.remove('flip-exit','flip-exit-active');
        pageEl.classList.add('flip-enter'); requestAnimationFrame(()=>{ pageEl.classList.add('flip-enter-active'); });
      }, 180);
    }, 0);
    var u = new URL(location.href); u.searchParams.set('page', p); history.replaceState(null, '', u.toString());
    currentPage = p;
  }
  render(currentPage);
  document.getElementById('prev').onclick=function(){ if(currentPage>1) render(currentPage-1); };
  document.getElementById('next').onclick=function(){ if(currentPage<total) render(currentPage+1); };
})();