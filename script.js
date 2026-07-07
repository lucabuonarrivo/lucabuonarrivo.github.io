(function(){
  /* ===== greeting rotation (his languages) ===== */
  var GREETS = [
    {w:'Ciao!',  tip:'that’s “Hi!” in Italian'},
    {w:'Hallo!', tip:'that’s “Hi!” in German'},
    {w:'¡Hola!', tip:'that’s “Hi!” in Spanish'}
  ];
  var greet=document.getElementById('greet'), gtip=document.getElementById('gtip'), gi=0, tipShown=false;
  setInterval(function(){
    gi=(gi+1)%GREETS.length;
    greet.style.opacity=0;
    setTimeout(function(){ greet.textContent=GREETS[gi].w; greet.style.opacity=1; if(tipShown) gtip.textContent=GREETS[gi].tip; },300);
  },2600);

  /* greeting tip follows the cursor and keeps updating with the language */
  function posTip(e){ gtip.style.left=(e.clientX+14)+'px'; gtip.style.top=(e.clientY+16)+'px'; }
  greet.addEventListener('mouseenter',function(e){ tipShown=true; gtip.textContent=GREETS[gi].tip; gtip.classList.add('on'); posTip(e); });
  greet.addEventListener('mousemove',posTip);
  greet.addEventListener('mouseleave',function(){ tipShown=false; gtip.classList.remove('on'); });

  /* ----- TOP SKILLS -----
     One entry per chip (key matches data-k in the HTML chips).
     t = title shown in the pop-up · d = explanation text.                     */
  var SKILLS = {
    gmp:{t:'GMP · Good Manufacturing Practice', d:'The quality backbone of medicine manufacturing. At AGC Biologics, Luca produced ATMPs (cell & gene therapies) in a Class B/C cleanroom, executing Batch Production Records in strict accordance with EU GMP Annex 1.'},
    glp:{t:'GLP · Good Laboratory Practice', d:'The standard that makes lab data trustworthy for regulators. Luca ran ISO/GLP-compliant assays at Abich and works within a quality-controlled (GLP) environment at the AO Research Institute.'},
    iso10993:{t:'ISO 10993 · Biological evaluation of medical devices', d:'The standard for proving a device is safe in contact with the body. Luca designed and ran cytotoxicity and related assays — including OECD-compliant 3D human tissue models — to characterise how devices behave with living tissue.'},
    iso13485:{t:'ISO 13485 · Medical-device quality management', d:'The quality-management framework behind medical-device makers. It shapes how Luca’s R&D data and SOPs feed into regulatory and technical documentation with full traceability.'},
    atmp:{t:'ATMPs · Advanced Therapy Medicinal Products', d:'Cell and gene therapies — among the most complex medicines to make. Luca manufactured them aseptically in a cleanroom, mastering Contamination Control Strategies (CCS) in an international pharmaceutical setting.'},
    reg:{t:'Regulatory affairs', d:'Turning science into something regulators can approve. Luca builds evidence with future Clinical Trial Applications (CTA) in mind, keeping data integrity and traceability across the pharmaceutical and biologics sectors.'}
  };
  var skillpop=document.getElementById('skillpop'), activeChip=null;
  function closeSkill(){ skillpop.classList.remove('on'); if(activeChip){activeChip.classList.remove('active'); activeChip=null;} }
  document.querySelectorAll('.chip').forEach(function(btn){
    btn.addEventListener('click',function(e){
      e.stopPropagation();
      var s=SKILLS[btn.dataset.k]; if(!s) return;
      if(activeChip===btn){ closeSkill(); return; }
      if(activeChip) activeChip.classList.remove('active');
      activeChip=btn; btn.classList.add('active');
      skillpop.innerHTML='<h4>'+s.t+'</h4><p>'+s.d+'</p>';
      skillpop.classList.add('on');
      var r=btn.getBoundingClientRect(), pw=Math.min(300, window.innerWidth-32);
      var left=r.left+r.width/2-pw/2; left=Math.max(16, Math.min(left, window.innerWidth-pw-16));
      var top=r.bottom+10;
      skillpop.style.width=pw+'px'; skillpop.style.left=left+'px'; skillpop.style.top=top+'px';
    });
  });
  document.addEventListener('click',function(e){ if(activeChip && !skillpop.contains(e.target)) closeSkill(); });
  window.addEventListener('scroll',function(){ if(activeChip) closeSkill(); },{passive:true});

  /* ===== name image trail ===== */
  /* Trail tiles: put a photo file in images/ and reference it as `src`.
     Each tile automatically takes the ORIENTATION (portrait/landscape) of its photo. */
  var TRAIL = [
    {cap:'Davos', src:'images/davos.jpeg'},
    {cap:'Reykjavík University', src:'images/reykjavik.jpeg'},
    {cap:'Me :)', src:'images/luca.jpeg', crop:0.15}
  ];
  /* preload to learn each photo's aspect ratio (falls back to a portrait tile until it loads) */
  TRAIL.forEach(function(t){ t.ar=0.8; var im=new Image(); im.onload=function(){ if(im.naturalWidth) t.ar=im.naturalWidth/im.naturalHeight; }; im.src=t.src; });
  var ROT=[-14, 11, -8, 15, -12, 7, -16, 10];
  var nameEl=document.getElementById('name'), ti=0, pool=[], lastT=0, canTrail=!('ontouchstart' in window);
  function spawn(x,y){
    var d=TRAIL[ti%TRAIL.length], r=ROT[ti%ROT.length]; ti++;
    var el=document.createElement('div'); el.className='trail';
    /* size the tile to the photo's orientation (longest side ~184px) */
    var ar=d.ar||0.8, LONG=184, w, h;
    if(ar>=1){ w=LONG; h=Math.round(LONG/ar); } else { h=LONG; w=Math.round(LONG*ar); }
    if(d.crop){ h=Math.round(h*(1-d.crop)); }   /* trim a bit off the bottom of the photo */
    el.style.width=w+'px'; el.style.height=h+'px';
    el.style.left=x+'px'; el.style.top=y+'px'; el.style.setProperty('--r', r+'deg');
    el.style.background='url('+d.src+') '+(d.crop?'center top':'center')+'/cover no-repeat, '+(d.grad||'#d7d3cc');
    el.innerHTML='<span class="cap">'+d.cap+'</span>';
    document.body.appendChild(el);
    void el.offsetWidth; el.classList.add('show');
    pool.push(el); if(pool.length>5){ pool.shift().remove(); }   /* keep a few on screen at once */
    setTimeout(function(){ el.remove(); var k=pool.indexOf(el); if(k>-1)pool.splice(k,1); }, 1100);
  }
  /* photos pop up scattered AROUND the name (not tied to the cursor) and linger a moment */
  function spawnAroundName(){
    var r=nameEl.getBoundingClientRect();
    var mx=r.width*0.08, my=r.height*1.1;
    var x=r.left - mx + Math.random()*(r.width + 2*mx);
    var y=r.top  - my + Math.random()*(r.height + 2*my);
    spawn(x,y);
  }
  if(canTrail){
    nameEl.addEventListener('mouseenter',function(){ spawnAroundName(); lastT=performance.now(); });
    /* keep photos appearing while the cursor stays over the name, gently paced */
    nameEl.addEventListener('mousemove',function(){ var now=performance.now(); if(now-lastT>150){ lastT=now; spawnAroundName(); } });
  }

  /* =========================================================================
     CONTENT YOU CAN EDIT BELOW
     All page content lives in the arrays/objects that follow. Edit the text
     between quotes to change what appears on the site. Structure:
       • PROJECTS — the work cards + their detail pop-ups
       • EXP      — Experience entries (CV)
       • EDU      — Education entries (CV)
       • SKILLS   — the "Top skills" chip explanations (defined above)
     To add an item, copy one { ... } block, paste it, and edit the text.
     ========================================================================= */

  /* ----- WORK / PROJECTS -----
     Each { } is one project. Key fields:
       title/headline/client/tag — shown on the card
       color   — placeholder colour shown until the first photo loads
       ar      — fallback width/height ratio (a number, e.g. 0.75) used only until the first photo loads
       images  — [{ src:'images/name.jpg', cap:'caption' }, ...]  ADD AS MANY AS YOU LIKE.
                 The FIRST image fills the card, and the card auto-shapes to that photo.
                 ALL images appear in the detail pop-up. Just drop the files in /images.
       summary/location/team/roles/sections — shown inside the detail pop-up
       link    — optional { href, label } "Read the paper" button          */
  var PROJECTS = [
    { id:'fibra', title:'Fibra', meta:'Fibra · Startup · 2026',
      headline:'Biodegradable fibers grown from algae', client:'Fibra', tag:'R&D · 2026',
      ar:0.667,
      color:'#12a150',
      summary:[
        "Born from algae, shaped by the ocean. Fibra builds biodegradable fibers that bring technology and sustainability into balance.",
        "I work in an interdisciplinary team on the R&D of a <b>patent-pending</b> biodegradable fiber for the textile industry.",
        "Funded by Aalto Design Factory and the School of Chemical Engineering, Aalto University."
      ],
      location:'Italy · Finland · Switzerland', team:['Giulia Rinaldo','Oliwia Kaczmarek'],
      roles:'Research, Prototyping, Business Development',
      sections:[
        {label:'Challenge', text:"The textile industry is one of the most polluting in the world. Fibra's goal is to create a new material that is both sustainable and functional, while also being aesthetically pleasing."},
        {label:'Process', text:"We started with a deep dive into the science of algae and its potential. We're currently prototyping different fibers and testing their properties, from strength to biodegradability."},
        {label:'Future', text:"The project continues to evolve, with ongoing research and development."}
      ],
      images:[{src:'images/fibra-01.jpg',cap:'Algae fibers'},{src:'images/fibra-02.jpg',cap:'Fiber samples'}] },

    { id:'sound', title:'Sound-Guided Regeneration', meta:'Sound-Guided Regeneration · Research · 2025',
      headline:'Guiding tissue regeneration with sound', client:'AO Research Institute, Davos', tag:'Research · 2025',
      ar:1.6,
      color:'#2f5fe6',
      summary:[
        "Translational research in biofabrication and tissue engineering — using controlled acoustic and mechanical cues to steer how cells organise and rebuild damaged tissue.",
        "Carried out within a quality-controlled (ISO / GLP) environment, with a clear line of sight to future Clinical Trial Applications."
      ],
      location:'Davos, Switzerland', team:['AO Research Institute'],
      roles:'Translational research, Assay design, Regulatory (ISO / GLP)',
      sections:[
        {label:'Context', text:"Mechanical cues are as instructive to cells as chemical ones. Delivering them with precision could make regeneration faster, more targeted and less dependent on biologics alone."},
        {label:'Approach', text:"Designing stimulation protocols, running them on cell and tissue models, and reading out the biological response — in close collaboration with surgeons and clinical experts."},
        {label:'Direction', text:"Building the audit-ready evidence and quality foundation needed to move from the bench toward the clinic."}
      ],
      images:[{src:'images/sound-01.jpg',cap:'Tissue models'},{src:'images/sound-02.jpg',cap:'Acoustic stimulation'}] },

    { id:'cartilage', title:'Bioprinted Cartilage', meta:'Bioprinted Cartilage · Research · 2024',
      headline:'3D-bioprinted hydrogels for cartilage repair', client:'Reykjavík University', tag:'Research · 2024',
      ar:0.75,
      color:'#e0327e',
      summary:[
        "3D-bioprinted solutions for cartilage repair, developed in direct collaboration with the National University Hospital of Iceland (Landspítali).",
        "An Erasmus+ research traineeship at Reykjavík University."
      ],
      location:'Reykjavík, Iceland', team:['Reykjavík University','Landspítali'],
      roles:'3D bioprinting, Mechanical & biological characterization',
      sections:[
        {label:'Challenge', text:"Cartilage has a limited capacity to heal. Engineering a printable material that is both mechanically sound and biologically friendly is the central difficulty."},
        {label:'Process', text:"Characterized the mechanical and biological effects of ionic and photo-crosslinking on gelatin-based hydrogels, comparing crosslinking strategies on 3D-bioprinted structures."},
        {label:'Outcome', text:"A reproducible study clarifying how crosslinking method shapes printed gelatin — published in Polymers (MDPI), 2024."}
      ],
      images:[{src:'images/cartilage-01.jpg',cap:'Bioprinting'},{src:'images/cartilage-02.jpg',cap:'Hydrogel scaffold'}],
      link:{href:'https://www.mdpi.com/2073-4360/16/19/2741', label:'Read the paper ↗'} }
  ];

  /* ----- EXPERIENCE (CV) -----
     Each { ... } block below is ONE experience. The list rebuilds itself
     automatically, so you can have any number of them.
       • TO ADD one:    copy a whole { ... } block, paste it where you want it
                        in the list, and edit the text. Keep the comma after } .
       • TO REMOVE one: delete its whole { ... } block (and its trailing comma).
       • TO REORDER:    move a { ... } block up or down — top of the list shows first.
     Fields in each block:
       r = role/title · o = employer · y = years · loc = location line
       s = Context · t = Objective · a = Approach · rr = Outcome
           (the four STAR fields shown when the entry is expanded)
     Keep every piece of text inside its "quotes".                             */
  var EXP = [
    { r:'Research Assistant', o:'AO Research Institute, Davos', y:'2025 - Present', loc:'Davos, Graubünden, Switzerland · On-site',
      s:"Translational research in biofabrication and tissue engineering, associating fundamental biological investigation with clinically oriented product development.",
      t:"Ensure data integrity for future Clinical Trial Applications (CTA) within a quality-controlled (ISO and GLP) environment.",
      a:"Conducting studies in biofabrication and tissue engineering, in close collaboration with surgeons and clinical experts, to develop strategies aimed at future therapeutic applications.",
      rr:"Clinically oriented research, carried out to a standard fit for future clinical translation." },
    { r:'R&D Analyst', o:'Abich - Lifeanalytics Cosmetics & MD', y:'2025', loc:'Verbano-Cusio-Ossola, Piedmont, Italy · On-site',
      s:"Safety and efficacy of cosmetics and medical devices need to be demonstrated without relying on animal testing.",
      t:"Produce ISO/GLP-compliant evidence for regulatory and technical documentation, and support clients adopting New Approach Methodologies (NAMs).",
      a:"Performed cellular and molecular safety and efficacy assays, including OECD-compliant 3D reconstructed human tissue models; authored and maintained laboratory SOPs in a GLP-certified environment.",
      rr:"Evidence used in regulatory and technical documentation for public and private clients, with data quality and traceability throughout." },
    { r:'GMP Manufacturing Associate - Cell & Gene Therapy', o:'AGC Biologics', y:'2024 - 25', loc:'Milan, Lombardy, Italy · On-site',
      s:"ATMP production within a Class B/C cleanroom, in an international pharmaceutical setting.",
      t:"Manufacture advanced therapy medicinal products and document them to EU GMP Annex 1 standard.",
      a:"Executed Batch Production Records (BPRs) in strict accordance with EU GMP Annex 1, applying aseptic processing and Contamination Control Strategies (CCS).",
      rr:"Foundational, hands-on experience in compliant ATMP manufacturing and contamination control." },
    { r:'Graduate Research Fellow - Erasmus+', o:'Reykjavík University', y:'2024', loc:'Reykjavík, Iceland · On-site',
      s:"Cartilage repair calls for printable materials that are mechanically sound and biologically friendly.",
      t:"Bring academic research toward real-world clinical settings, in collaboration with the National University Hospital of Iceland (Landspítali).",
      a:"Developed 3D-bioprinted solutions and led the mechanical and biological characterization of ionic and photo-crosslinking effects on gelatin-based hydrogels.",
      rr:"A reproducible study, later published in Polymers (MDPI, 2024)." },
    { r:'MSc Research Internship', o:'Univ. of Eastern Piedmont - TheInnovationLab', y:'2023 - 24', loc:'Novara, Piedmont, Italy · On-site',
      s:"Novel biomaterials need to be characterized in vitro before translational use.",
      t:"Test the biocompatibility and antimicrobial properties of novel biomaterials.",
      a:"Advanced the use of co-culture systems of cells and bacteria and optimized 3D and dynamic cell-culture systems in the Tissue Engineering and Biomaterials Evaluation laboratory <a href='https://www.theinnovationlab.it' target='_blank' rel='noopener'>TheInnovationLab ↗</a>.",
      rr:"In-vitro characterization supporting downstream tissue-engineering work." },
    { r:'Cellular Biology Internship', o:'University of Insubria', y:'2021 - 22', loc:'Varese, Lombardy, Italy · On-site',
      s:"First hands-on research in regenerative medicine.",
      t:"Support skin tissue-engineering studies at the laboratory of cellular biology.",
      a:"Completed a curricular internship followed by a post-graduation voluntary internship focused on regenerative medicine and skin tissue engineering.",
      rr:"An experimental foundation for the work that followed." }
  ];

  /* ----- EDUCATION (CV) -----
     Works exactly like EXPERIENCE above: each { ... } block is ONE entry.
     Copy a block to add, delete a block to remove, move blocks to reorder.
     Fields:
       r = degree · o = institution · y = years · loc = city
       d = a list of sentences; each is shown on its own line when expanded.
     Inside a sentence you can use:
       <span class='grade'>110/110</span>  for the grade
       <em>...</em>                          for the thesis title (Instrument serif) */
  var EDU = [
    { r:'MSc, Medical Biotechnology', o:'University of Eastern Piedmont', y:'2022 - 24', loc:'Novara, Italy',
      d:[
        "Cell Therapy, Tissue Engineering and Regenerative Medicine.",
        "Graduated <span class='grade'>110/110 cum laude</span> with an honourable mention.",
        "Thesis: <em>&ldquo;Effectiveness of gellan gum scaffolds loaded with Boswellia serrata extract for in-situ modulation of pro-inflammatory pathways affecting cartilage healing.&rdquo;</em>",
        "Served on the university's Teacher-Student Joint Committee."
      ] },
    { r:'BSc, Biotechnology', o:'University of Insubria', y:'2018 - 22', loc:'Varese, Italy',
      d:[
        "Graduated <span class='grade'>108/110</span>.",
        "Thesis: <em>&ldquo;Enhancing skin regeneration with a cell-free human dental pulp stem cell-derived solution combined with a nanostructured scaffold in vivo.&rdquo;</em>"
      ] },
    { r:'Technical Diploma', o:'ITE E. Tosi - International marketing relations', y:'2013 - 18', loc:'Busto Arsizio, Italy',
      d:[
        "Diploma in administration, finance and marketing with a focus on international relations (<span class='grade'>92/100</span>).",
        "Included an Erasmus+ experience in Berlin and a school exchange in Tel Aviv."
      ] }
  ];

  var byId={}; PROJECTS.forEach(function(p){byId[p.id]=p;});

  /* morph cards */
  var morph=document.getElementById('morph');
  PROJECTS.forEach(function(p,i){
    var el=document.createElement('div'); el.className='mcard'; el.dataset.id=p.id;
    el.style.setProperty('--i',i);
    if(p.ar) el.style.setProperty('--aspect', p.ar);   /* fallback shape until the photo loads */
    var first = (p.images && p.images[0]) ? p.images[0].src : '';
    el.innerHTML='<div class="face"><div class="mc-color" style="background:'+p.color+'"></div>'+
      '<div class="mc-photo" style="background-image:url('+first+')"></div></div>'+
      '<div class="cap"><div class="h">'+p.headline+'</div><div class="c">'+p.client+'</div><div class="tag">'+p.tag+'</div></div>';
    /* the card takes the exact shape of its first photo once we know its natural size */
    if(first){ var probe=new Image(); probe.onload=function(){ if(probe.naturalWidth){ el.style.setProperty('--aspect',(probe.naturalWidth/probe.naturalHeight).toFixed(4)); computeDeck(); } }; probe.src=first; }
    el.addEventListener('click',function(){ openPd(p.id); });
    morph.appendChild(el);
  });

  /* Arrange the cards as a pile/fan before scroll and a lifted row after scroll.
     All the offsets are derived from how many cards there are, so adding or
     removing a project just works — no hard-coded per-card rules. */
  function computeDeck(){
    var cards=[].slice.call(morph.querySelectorAll('.mcard'));
    if(!cards.length) return;
    var n=cards.length, mid=(n-1)/2;
    /* measure each card's natural row position with transforms momentarily off */
    cards.forEach(function(el){ el.style.transition='none'; el.style.transform='none'; });
    var mr=morph.getBoundingClientRect(), cx=mr.left+mr.width/2;
    cards.forEach(function(el,i){
      var off=i-mid, r=el.getBoundingClientRect();
      var out=off===0?0:(off>0?1:-1)*30;                     /* outer cards drift outward so none stays hidden */
      var pileX=(cx-(r.left+r.width/2))*0.6;                 /* overlap, but each card still peeks out */
      el.style.setProperty('--deckX', (pileX + out).toFixed(1)+'px');
      el.style.setProperty('--deckY', (10+Math.abs(off)*15 + (i%2?0:9)).toFixed(1)+'px');
      el.style.setProperty('--deckR', (off*11 + (i%2?1:-1)*3).toFixed(2)+'deg');
      el.style.setProperty('--liftY', (-(mid-Math.abs(off))*38).toFixed(1)+'px');
      el.style.zIndex=String(Math.round(20-Math.abs(off)*3));  /* centre card on top (kept well below the modal, z-90) */
    });
    cards.forEach(function(el){ el.style.transform=''; });    /* back to the CSS deck/settle transform */
    requestAnimationFrame(function(){ cards.forEach(function(el){ el.style.transition=''; }); });
  }
  computeDeck();
  var deckT; window.addEventListener('resize',function(){ clearTimeout(deckT); deckT=setTimeout(computeDeck,120); });

  /* experience (STAR) */
  var eh=document.getElementById('exp-list');
  EXP.forEach(function(e){
    var d=document.createElement('details'); d.className='item';
    d.innerHTML='<summary><span><span class="r">'+e.r+'</span><div class="o">'+e.o+'</div></span>'+
      '<span class="y">'+e.y+' <span class="plus"></span></span></summary>'+
      '<div class="body"><div class="star">'+
        '<div class="cell"><span class="k">Context</span><p>'+e.s+'</p></div>'+
        '<div class="cell"><span class="k">Objective</span><p>'+e.t+'</p></div>'+
        '<div class="cell"><span class="k">Approach</span><p>'+e.a+'</p></div>'+
        '<div class="cell result"><span class="k">Outcome</span><p>'+e.rr+'</p></div>'+
        '<div class="loc">'+e.loc+'</div>'+
      '</div></div>';
    eh.appendChild(d);
  });

  /* education */
  var edh=document.getElementById('edu-list');
  EDU.forEach(function(e){
    var d=document.createElement('details'); d.className='item';
    d.innerHTML='<summary><span><span class="r">'+e.r+'</span><div class="o">'+e.o+'</div></span>'+
      '<span class="y">'+e.y+' <span class="plus"></span></span></summary>'+
      '<div class="body">'+e.d.map(function(x){return '<p>'+x+'</p>';}).join('')+'<div class="loc">'+e.loc+'</div></div>';
    edh.appendChild(d);
  });

  /* smooth open AND close animation for every CV accordion item */
  var reduceMo = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.item').forEach(function(it){
    var sum=it.querySelector('summary'), body=it.querySelector('.body');
    sum.addEventListener('click',function(e){
      e.preventDefault();
      if(reduceMo){ it.open=!it.open; return; }
      if(it._anim) return; it._anim=true;
      if(!it.open){
        it.open=true;
        var h=body.scrollHeight;
        body.style.height='0px'; body.style.opacity='0';
        requestAnimationFrame(function(){
          body.style.transition='height .42s var(--ease), opacity .42s var(--ease)';
          body.style.height=h+'px'; body.style.opacity='1';
        });
        setTimeout(function(){ body.style.transition=''; body.style.height=''; body.style.opacity=''; it._anim=false; },440);
      } else {
        var h=body.scrollHeight;
        body.style.height=h+'px'; body.style.opacity='1';
        requestAnimationFrame(function(){
          body.style.transition='height .38s var(--ease), opacity .38s var(--ease)';
          body.style.height='0px'; body.style.opacity='0';
        });
        setTimeout(function(){ it.open=false; body.style.transition=''; body.style.height=''; body.style.opacity=''; it._anim=false; },400);
      }
    });
  });

  /* project detail */
  var pd=document.getElementById('pd'), pdBody=document.getElementById('pdBody'), pdMeta=document.getElementById('pdMeta');
  var order=PROJECTS.map(function(p){return p.id;}), current=0;
  function renderPd(id){
    var p=byId[id]; current=order.indexOf(id); pdMeta.textContent=p.meta;
    var left='<div class="pd-left"><div class="sum">'+p.summary.map(function(s){return '<p>'+s+'</p>';}).join('')+'</div>'+
      '<div class="blk"><span class="k">Place</span><br>'+p.location+'</div>'+
      '<div class="blk"><span class="k">Team</span><br>'+p.team.join('<br>')+'</div>'+
      '<div class="roles"><span class="k">Keywords</span><br>'+p.roles+'</div>'+
      (p.link?'<div><a class="pd-link" href="'+p.link.href+'" target="_blank" rel="noopener">'+p.link.label+'</a></div>':'')+'</div>';
    var right='<div class="pd-right">';
    /* colour the section titles with the same palette as the CV STAR labels */
    var SLCOL=['#12a150','#2f5fe6','#e0327e','#e0851f'];
    p.sections.forEach(function(s,i){
      right+='<div class="sec2"><div class="sl" style="color:'+(SLCOL[i]||'#e0851f')+'">'+s.label+'</div><div class="st">'+s.text+'</div></div>';
      if(i===0 && p.images){ right+='<div class="pd-imgs">'+p.images.map(function(im){return '<div class="ph" style="background-image:url('+im.src+'); background-color:'+p.color+'"><span>'+im.cap+'</span></div>';}).join('')+'</div>'; }
    });
    right+='</div>';
    pdBody.innerHTML=left+right; pd.scrollTop=0;
  }
  function openPd(id){ renderPd(id); pd.classList.add('on'); document.body.style.overflow='hidden'; }
  function closePd(){ pd.classList.remove('on'); document.body.style.overflow=''; }
  function nextPd(){ renderPd(order[(current+1)%order.length]); pd.scrollTop=0; }
  document.getElementById('pdClose').addEventListener('click',closePd);
  document.getElementById('pdNext').addEventListener('click',nextPd);
  pd.addEventListener('click',function(e){ if(e.target===pd) closePd(); });
  document.addEventListener('keydown',function(e){ if(!pd.classList.contains('on'))return; if(e.key==='Escape')closePd(); if(e.key==='ArrowRight')nextPd(); });

  /* reveal + morph trigger */
  function obs(sel, cb){ if('IntersectionObserver' in window){ var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){cb(x.target);io.unobserve(x.target);}});},{threshold:.28,rootMargin:'0px 0px -20px 0px'}); document.querySelectorAll(sel).forEach(function(el){io.observe(el);}); } else document.querySelectorAll(sel).forEach(cb); }
  obs('.rv', function(el){ el.classList.add('in'); });
  if('IntersectionObserver' in window){ new IntersectionObserver(function(es){ es.forEach(function(x){ morph.classList.toggle('in', x.isIntersecting); }); },{threshold:.26}).observe(morph); } else morph.classList.add('in');
})();
