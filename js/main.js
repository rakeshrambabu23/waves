(function(){
  var $=function(s,r){return (r||document).querySelector(s)};
  var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- seeded random + colour helper ---------- */
  function rng(seed){var s=(seed>>>0)||1;return function(){s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296}}
  function hexA(hex,a){var n=parseInt(hex.slice(1),16);return 'rgba('+(n>>16&255)+','+(n>>8&255)+','+(n&255)+','+a+')'}

  /* ---------- scenes ---------- */
  function drawWave(ctx,w,h,t,sx){
    var hz=h*.64,X=w*sx,sy=hz-h*.05,g;
    g=ctx.createLinearGradient(0,0,0,h);
    g.addColorStop(0,'#CBD3F2');g.addColorStop(.38,'#E9ECF6');g.addColorStop(.62,'#FCE6D5');g.addColorStop(1,'#EEF0F5');
    ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    g=ctx.createRadialGradient(X,sy,0,X,sy,h*.75);
    g.addColorStop(0,'rgba(255,128,60,.9)');g.addColorStop(.22,'rgba(255,150,90,.4)');g.addColorStop(1,'rgba(255,150,90,0)');
    ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    g=ctx.createRadialGradient(X,sy,0,X,sy,h*.085);
    g.addColorStop(0,'#FFFFFF');g.addColorStop(.6,'#FFE9D6');g.addColorStop(1,'rgba(255,170,110,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(X,sy,h*.085,0,Math.PI*2);ctx.fill();
    var N=36,span=(h-hz)*1.06,step=8;
    for(var i=0;i<N;i++){
      var p=i/(N-1),y0=hz+Math.pow(p,1.9)*span,yn=hz+Math.pow((i+1)/(N-1),1.9)*span;
      var amp=h*(.003+p*p*.05),gap=(yn-y0)+amp*2+3,ph=t*.55+i*.33,ys=[];
      for(var x=0;x<=w+step;x+=step){var u=x/w;ys.push(y0+Math.sin(u*(6+p*3)+ph)*amp+Math.sin(u*13-t*.35+i*.2)*amp*.4)}
      ctx.beginPath();
      for(var k=0;k<ys.length;k++){k?ctx.lineTo(k*step,ys[k]):ctx.moveTo(0,ys[k])}
      for(k=ys.length-1;k>=0;k--){ctx.lineTo(k*step,ys[k]+gap)}
      ctx.closePath();
      ctx.fillStyle='rgba('+(236-Math.round(p*18))+','+(239-Math.round(p*18))+','+(247-Math.round(p*10))+',.86)';
      ctx.fill();
      ctx.beginPath();
      for(k=0;k<ys.length;k++){k?ctx.lineTo(k*step,ys[k]):ctx.moveTo(0,ys[k])}
      var a=.14+p*.6;
      ctx.strokeStyle=(i%6===0)?'rgba(47,60,255,'+a+')':'rgba(12,16,33,'+(a*.7)+')';
      ctx.lineWidth=.7+p*1.5;ctx.stroke();
    }
    var sp=Math.min(.99,Math.max(.01,sx));
    g=ctx.createLinearGradient(0,0,w,0);
    g.addColorStop(0,'rgba(47,60,255,0)');g.addColorStop(sp,'rgba(47,60,255,.14)');g.addColorStop(1,'rgba(47,60,255,0)');
    ctx.fillStyle=g;ctx.fillRect(0,sy-8,w,16);
    g=ctx.createLinearGradient(0,0,w,0);
    g.addColorStop(0,'rgba(47,60,255,0)');g.addColorStop(sp,'rgba(47,60,255,.8)');g.addColorStop(1,'rgba(47,60,255,0)');
    ctx.fillStyle=g;ctx.fillRect(0,sy-1,w,2);
  }
  function drawRings(ctx,w,h,k){
    var g=ctx.createLinearGradient(0,0,w,h);
    g.addColorStop(0,'#D6DDF6');g.addColorStop(.6,'#F3F1F0');g.addColorStop(1,'#FFDCC6');
    ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    var cx=w*.5,cy=h*.55,base=Math.max(w,h*.9);
    g=ctx.createRadialGradient(cx,cy,0,cx,cy,base*.45);
    g.addColorStop(0,'rgba(255,122,60,.75)');g.addColorStop(.3,'rgba(255,150,90,.25)');g.addColorStop(1,'rgba(255,150,90,0)');
    ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    ctx.save();ctx.translate(cx,cy);ctx.rotate(-.38+k*.1);
    for(var i=0;i<26;i++){
      var rx=base*(.05+i*.027),ry=rx*.34,acc=i%6===0;
      ctx.beginPath();ctx.ellipse(0,0,rx,ry,0,0,Math.PI*2);
      ctx.strokeStyle=acc?'rgba(47,60,255,.75)':'rgba(12,16,33,'+(.1+i/26*.22)+')';
      ctx.lineWidth=acc?1.5:.8;ctx.stroke();
      if(acc){var an=i*1.3;ctx.beginPath();ctx.arc(Math.cos(an)*rx,Math.sin(an)*ry,3.5,0,Math.PI*2);ctx.fillStyle='#2F3CFF';ctx.fill()}
    }
    ctx.restore();
    g=ctx.createRadialGradient(cx,cy,0,cx,cy,base*.05);
    g.addColorStop(0,'#FFFFFF');g.addColorStop(.7,'#FFE7D3');g.addColorStop(1,'rgba(255,170,110,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,base*.05,0,Math.PI*2);ctx.fill();
  }
  function drawMesh(ctx,w,h,cols,seed){
    var r=rng(seed),g;
    ctx.fillStyle=cols[0];ctx.fillRect(0,0,w,h);
    for(var k=0;k<5;k++){
      var x=r()*w,y=r()*h,rad=Math.max(w,h)*(.35+r()*.4),c=cols[1+k%2];
      g=ctx.createRadialGradient(x,y,0,x,y,rad);g.addColorStop(0,hexA(c,.9));g.addColorStop(1,hexA(c,0));
      ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    }
    g=ctx.createLinearGradient(0,0,w,h);
    g.addColorStop(.3,'rgba(255,255,255,0)');g.addColorStop(.5,'rgba(255,255,255,.38)');g.addColorStop(.7,'rgba(255,255,255,0)');
    ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  }

  var heroCv=$('#heroCanvas');
  function paint(cv,t){
    var w=cv.clientWidth,h=cv.clientHeight;if(!w||!h)return;
    var dpr=Math.min(window.devicePixelRatio||1,cv===heroCv?1.5:2);
    var W=Math.round(w*dpr),H=Math.round(h*dpr);
    if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H}
    var ctx=cv.getContext('2d');ctx.setTransform(W/w,0,0,H/h,0,0);
    var d=cv.dataset;
    if(d.scene==='wave')drawWave(ctx,w,h,(t==null?parseFloat(d.t||'3'):t),parseFloat(d.sx||'.72'));
    else if(d.scene==='rings')drawRings(ctx,w,h,parseFloat(d.k||'0'));
    else drawMesh(ctx,w,h,d.c.split(','),parseInt(d.seed||'1',10));
  }
  var ro=window.ResizeObserver?new ResizeObserver(function(es){es.forEach(function(e){paint(e.target)})}):null;
  function watch(cv){if(ro)ro.observe(cv);else paint(cv)}

  /* ---------- hero animation + timecode ---------- */
  var tc=$('#tc'),raf=0,t0=performance.now(),heroVisible=true;
  function two(n){return (n<10?'0':'')+n}
  function fmt(s){var f=Math.floor((s%1)*24),sec=Math.floor(s)%60,m=Math.floor(s/60)%60;return '00:'+two(m)+':'+two(sec)+':'+two(f)}
  function loop(now){var t=(now-t0)/1000;paint(heroCv,t+3);if(tc)tc.textContent=fmt(t+12.3);raf=requestAnimationFrame(loop)}
  function heroRun(){
    cancelAnimationFrame(raf);
    if(reduced||!heroCv||!heroVisible)return;
    raf=requestAnimationFrame(loop);
  }
  if(window.IntersectionObserver&&$('.hero-frame')){
    new IntersectionObserver(function(es){heroVisible=es[0].isIntersecting;heroRun()}).observe($('.hero-frame'));
  }

  /* ---------- projects ---------- */
  var PROJECTS=[
    {name:'Veloce Scooters',cat:'Automotive',type:'Scooter showroom website',url:'https://rakeshrambabu23.github.io/veloce/',img:'images/veloce.jpg',desc:'A scooter showroom site with a three-design hero slider, colour studio, EMI calculator and WhatsApp test ride booking.'},
    {name:'Aiba Makeovers',cat:'Beauty',type:'Bridal makeup studio website',url:'https://rakeshrambabu23.github.io/aiba2/',img:'images/aiba-makeovers.jpg',desc:'A rich, bridal-inspired site for a makeup studio, built around early-booking offers, limited slots and one-tap booking.'},
    {name:'Voyaa',cat:'Travel',type:'Tours and travels website',url:'https://rakeshrambabu23.github.io/voyaa/',img:'images/voyaa.jpg',desc:'A budget travel site with a trip of the month, seats left, live weather and a quick plan-my-trip search.'}
  ];
  function card(p){
    return '<a class="work" data-cat="'+p.cat+'" href="'+p.url+'" target="_blank" rel="noopener"><div class="frame"><div class="shot"><img src="'+p.img+'" alt="'+p.name+' website preview" loading="lazy"></div></div><div class="work-meta"><div><h3>'+p.name+'</h3><p>'+p.type+'</p></div><span class="chip-tag">Live site ↗</span></div><p class="work-desc">'+p.desc+'</p></a>';
  }
  if($('#home-work'))$('#home-work').innerHTML=PROJECTS.map(card).join('');
  if($('#all-work'))$('#all-work').innerHTML=PROJECTS.map(card).join('');

  /* ---------- shared CTA band ---------- */
  var BAND='<section class="band"><div class="streak"></div><div class="wrap band-in"><h2>Have a project in mind? Let\'s make it unforgettable.</h2><p>Tell us what you are building. We reply by email with questions, a rough plan and the next step.</p><div class="acts"><a class="btn light" href="contact.html">Start a project</a><button class="btn line" type="button" data-copy="uxwavestudio@gmail.com">Copy email</button></div><div class="mail">uxwavestudio@gmail.com</div></div></section>';
  $$('.band-slot').forEach(function(s){s.innerHTML=BAND});

  $$('canvas.cv').forEach(watch);

  /* ---------- copy ---------- */
  function copyText(text,btn){
    var orig=btn.dataset.l||btn.textContent;btn.dataset.l=orig;
    function done(){btn.textContent='Copied';setTimeout(function(){btn.textContent=orig},1600)}
    function fb(){
      var ta=document.createElement('textarea');ta.value=text;ta.style.cssText='position:fixed;opacity:0;top:0';
      document.body.appendChild(ta);ta.select();var ok=false;
      try{ok=document.execCommand('copy')}catch(e){}
      ta.remove();
      if(ok)done();else btn.textContent='Select the text and copy';
    }
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(done,fb)}else fb();
  }
  document.addEventListener('click',function(e){
    var b=e.target.closest('[data-copy]');if(b)copyText(b.getAttribute('data-copy'),b);
  });

  /* ---------- portfolio filter ---------- */
  $$('.filter button').forEach(function(b){
    b.addEventListener('click',function(){
      $$('.filter button').forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});
      var c=b.dataset.cat;
      $$('#all-work .work').forEach(function(w){w.hidden=!(c==='all'||w.dataset.cat===c)});
    });
  });

  /* ---------- contact form ---------- */
  if($('#enquiry')){
  var form=$('#enquiry'),brief=$('#brief');
    function setErr(id,msg){$('#'+id).textContent=msg}
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var name=$('#f-name').value.trim(),email=$('#f-email').value.trim(),msg=$('#f-msg').value.trim(),bad=null;
      setErr('e-name','');setErr('e-email','');setErr('e-msg','');
      if(!name){setErr('e-name','Enter your name.');bad=bad||$('#f-name')}
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){setErr('e-email','Enter an email address like you@company.com.');bad=bad||$('#f-email')}
      if(!msg){setErr('e-msg','Tell us a little about the project.');bad=bad||$('#f-msg')}
      if(bad){bad.focus();return}
      var type=($('input[name="type"]:checked')||{}).value||'Not sure yet';
      var text='Subject: New project enquiry from '+name+'\n\nName: '+name+'\nEmail: '+email+'\nCompany: '+($('#f-company').value.trim()||'-')+'\nProject type: '+type+'\nBudget: '+($('#f-budget').value.trim()||'-')+'\n\nAbout the project:\n'+msg;
      $('#brief-text').value=text;
      var sub='New project enquiry from '+name,body=text.split('\n\n').slice(1).join('\n\n');
      $('#brief-mail').href='mailto:uxwavestudio@gmail.com?subject='+encodeURIComponent(sub)+'&body='+encodeURIComponent(body);
      $('#brief-gmail').href='https://mail.google.com/mail/?view=cm&fs=1&to=uxwavestudio@gmail.com&su='+encodeURIComponent(sub)+'&body='+encodeURIComponent(body);
      var btn=form.querySelector('button[type=submit]'),label=btn.textContent;btn.disabled=true;btn.textContent='Sending...';
      var payload={access_key:'8b6fcd9a-8c02-45d6-8018-1a3afe9aa0ce',subject:sub,from_name:'UXwave website',name:name,email:email,company:$('#f-company').value.trim()||'-',project_type:type,budget:$('#f-budget').value.trim()||'-',message:msg,botcheck:($('#botcheck')||{}).checked||false};
      function show(ok){
        $('#brief-title').textContent=ok?'Message sent':'We could not send it';
        $('#brief-note').textContent=ok?'Thanks, '+name+'. We have your enquiry and will reply to '+email+' soon.':'Something went wrong. Use Open in Gmail or your email app, or copy the brief and send it to uxwavestudio@gmail.com.';
        $$('#brief-gmail,#brief-mail').forEach(function(a){a.style.display=ok?'none':''});
        $('#brief-edit').textContent=ok?'Send another message':'Edit details';
        btn.disabled=false;btn.textContent=label;if(ok)form.reset();
        form.hidden=true;brief.hidden=false;brief.scrollIntoView({block:'nearest'});$('#brief-copy').focus();
      }
      fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(payload)})
        .then(function(r){return r.json()}).then(function(d){show(!!(d&&d.success))}).catch(function(){show(false)});
    });
    $('#brief-copy').addEventListener('click',function(){copyText($('#brief-text').value,this)});
    $('#brief-edit').addEventListener('click',function(){brief.hidden=true;form.hidden=false;$('#f-name').focus()});
  }

  /* ---------- mobile menu ---------- */
  var menu=$('#menu'),links=$('#links');
  function closeMenu(){links.classList.remove('open');menu.setAttribute('aria-expanded','false')}
  menu.addEventListener('click',function(){var o=links.classList.toggle('open');menu.setAttribute('aria-expanded',o?'true':'false')});
  $$('#links a').forEach(function(a){a.addEventListener('click',closeMenu)});

  /* ---------- initial paint ---------- */
  $$('canvas.cv').forEach(function(cv){paint(cv)});
  heroRun();
})();
