(() => {
  'use strict';
  const email = 'M.ElQadi2026@gmail.com';
  const translations = {
    ar: {skip:'انتقل للمحتوى',navLabel:'القائمة الرئيسية',navAbout:'عنّي',navExplore:'اهتماماتي',navWork:'مشروعي',navContact:'قول أهلاً',heroEyebrow:'طالب. هاوي. فضولي.',heroLine1:'فضول',heroLine2:'بيتحوّل <em>لكود.</em>',heroDescription:'أنا مصطفى، طالب ثانوي وهاوي برمجة. بتعلّم أبني حاجات للويب، وبستكشف عالم السايبر سكيورتي والذكاء الاصطناعي.',heroPrimary:'شوف مشروعي',currently:'بتعلّم حاليًا',robotAlt:'روبوت ثلاثي الأبعاد بإضاءة برتقالية يتحرك بهدوء',robotCaption:'مدفوع بالفضول.',introSubtitle:'كل رحلة بتبدأ بفضول.',waveTitle:'حيّي الروبوت',wave:'قول أهلاً',replay:'إعادة المشهد',pauseMotion:'إيقاف الحركة',resumeMotion:'تشغيل الحركة',scroll:'انزل واكتشف',aboutKicker:'ورا الشاشة',aboutTitle:'لسه في أول الرحلة.<br><span class="muted">وبتعلّم كل يوم.</span>',aboutBody:'بحب أفهم الحاجات بتشتغل إزاي، وأجرّب أعملها بإيدي. بدأت أكتب كود بسيط، وحاليًا بتعلّم HTML وCSS وJavaScript خطوة بخطوة.',aboutNote:'الموقع ده بداية؛ مساحة أعرّف فيها بنفسي وأشارك اللي بتعلّمه مع الوقت.',codeFooter:'كل تجربة بتعلّمني حاجة.',exploreKicker:'اللي بيشد فضولي',exploreTitle:'ثلاث عوالم.<br>فضول واحد.',exploreIntro:'بداية بسيطة في تطوير الويب، واهتمام باكتشاف اللي وراه.',learningState:'بتعلّم حاليًا',interestState:'فضول واستكشاف',webTitle:'تطوير الويب',webBody:'من أول عنوان في HTML، لتنسيق الصفحة بـCSS وإضافة التفاعل بـJavaScript. خطوة، ورا خطوة.',securityTitle:'السايبر سكيورتي',securityBody:'الأنظمة بتشتغل إزاي؟ وإزاي نحافظ على أمانها؟ أسئلة بتشدّني أعرف وأتعلّم أكتر.',securityTag1:'الأمان الرقمي',securityTag2:'فهم الأنظمة',aiTitle:'الذكاء الاصطناعي',aiBody:'مهتم أفهم عالم الـAI، وإزاي البرمجة ممكن تحوّل الأفكار لأدوات جديدة ومفيدة.',aiTag:'أفكار وتجارب',workKicker:'أول خطوة على الويب',workTitle:'البداية: الموقع ده.',projectState:'مشروع شخصي · النسخة الأولى',projectTitle:'مساحتي على الويب.',projectBody:'مكان يجمع تعريفي بنفسي، واللي بتعلّمه، واهتماماتي. ببداية سينمائية وروبوت 3D، وتجربة بالعربي والإنجليزي.',projectFeature1:'تجربة بلغتين',projectFeature2:'روبوت 3D تفاعلي',projectFeature3:'تصميم للموبايل والكمبيوتر',projectLink:'إنت هنا — جرّب المشهد تاني',contactKicker:'باب الكلام مفتوح',contactTitle:'عندك فكرة؟<br><span class="muted">قول أهلاً.</span><span class="contact-star" aria-hidden="true">✳</span>',contactBody:'فكرة، نصيحة، أو حتى مجرد أهلاً. يسعدني أسمع منك.',emailLabel:'راسلني على',copyEmail:'نسخ البريد الإلكتروني',copied:'تم نسخ الإيميل.',copyFailed:'الإيميل: '+email,backTop:'العودة للأعلى',footerNote:'فضول. تعلّم. تجربة.',fallbackCaption:'أهلًا من الروبوت.',title:'En.Mostafa — فضول بيتحوّل لكود'},
    en: {skip:'Skip to content',navLabel:'Main navigation',navAbout:'About',navExplore:'Interests',navWork:'My project',navContact:'Say hello',heroEyebrow:'Student. Hobbyist. Curious.',heroLine1:'Curiosity,',heroLine2:'turned into <em>code.</em>',heroDescription:'I’m Mostafa, a secondary-school student and coding hobbyist. Learning to build for the web, with a curiosity for cybersecurity and AI.',heroPrimary:'Explore my project',currently:'Currently learning',robotAlt:'Animated three-dimensional robot with warm orange lighting',robotCaption:'Powered by curiosity.',introSubtitle:'Every journey starts with curiosity.',waveTitle:'Say hello to the robot',wave:'Say hello',replay:'Replay the scene',pauseMotion:'Pause animation',resumeMotion:'Play animation',scroll:'Scroll to discover',aboutKicker:'Behind the screen',aboutTitle:'Just getting started.<br><span class="muted">Always learning.</span>',aboutBody:'I like understanding how things work, then trying them for myself. I write simple code and build my understanding of HTML, CSS, and JavaScript one step at a time.',aboutNote:'This site is a beginning: a place to introduce myself and share what I learn along the way.',codeFooter:'Every experiment teaches me something.',exploreKicker:'Following my curiosity',exploreTitle:'Three worlds.<br>One curious mind.',exploreIntro:'A small start in web development. A curiosity for what comes next.',learningState:'Currently learning',interestState:'Curious to explore',webTitle:'Web development',webBody:'From a first HTML heading to styling with CSS and adding interaction with JavaScript. One small step at a time.',securityTitle:'Cybersecurity',securityBody:'How do systems work? How can we keep them secure? Questions that make me want to find out more.',securityTag1:'Digital safety',securityTag2:'Understanding systems',aiTitle:'Artificial intelligence',aiBody:'Curious about the world of AI, and how code can turn ideas into new and useful tools.',aiTag:'Ideas & experiments',workKicker:'A first step on the web',workTitle:'The beginning: this site.',projectState:'Personal project · First edition',projectTitle:'My space on the web.',projectBody:'A home for who I am, what I’m learning, and what interests me. A cinematic introduction, an interactive 3D robot, and an experience in Arabic and English.',projectFeature1:'Two languages',projectFeature2:'Interactive 3D robot',projectFeature3:'Mobile & desktop',projectLink:'You’re here — replay the experience',contactKicker:'Open to a conversation',contactTitle:'Have an idea?<br><span class="muted">Say hello.</span><span class="contact-star" aria-hidden="true">✳</span>',contactBody:'An idea, a tip, or just a hello. I’d be happy to hear from you.',emailLabel:'Drop me a line',copyEmail:'Copy email address',copied:'Email address copied.',copyFailed:'Email: '+email,backTop:'Back to top',footerNote:'Stay curious. Keep learning.',fallbackCaption:'Hello from the robot.',title:'En.Mostafa — Curiosity, turned into code.'}
  };
  const getSaved = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const save = (key,value) => { try { localStorage.setItem(key,value); } catch {} };
  let language = getSaved('mostafa-language') === 'en' ? 'en' : 'ar';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let motionEnabled = getSaved('mostafa-motion') === null ? !reducedMotion.matches : getSaved('mostafa-motion') === 'on';
  let sceneAvailable = true;
  const stage = document.querySelector('#robot-stage');
  const motionButton = document.querySelector('#motion-toggle');
  let introTimer, toastTimer;
  function translate() {
    const text = translations[language];
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.title = text.title;
    document.querySelectorAll('[data-i18n]').forEach(el => { const value=text[el.dataset.i18n]; if (value !== undefined) el.innerHTML=value; });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => el.setAttribute('aria-label',text[el.dataset.i18nAria]));
    document.querySelectorAll('[data-i18n-title]').forEach(el => el.title=text[el.dataset.i18nTitle]);
    document.querySelector('#language-label').textContent = language === 'ar' ? 'EN' : 'عربي';
    document.querySelector('#language-toggle').setAttribute('aria-label',language === 'ar' ? 'Switch to English' : 'التبديل للعربية');
    updateMotionControl();
  }
  function updateMotionControl() {
    motionButton.setAttribute('aria-pressed',String(!motionEnabled));
    motionButton.setAttribute('aria-label',translations[language][motionEnabled ? 'pauseMotion' : 'resumeMotion']);
    motionButton.title = motionButton.getAttribute('aria-label');
    document.querySelector('#motion-icon').innerHTML = motionEnabled ? '<path d="M7 5h3v14H7zM14 5h3v14h-3z"/>' : '<path d="m8 5 12 7-12 7z"/>';
    document.body.classList.toggle('motion-paused',!motionEnabled);
  }
  function setMotion(enabled, persist=true) {
    motionEnabled=enabled;
    window.robotScene?.setMotion(enabled);
    updateMotionControl();
    if(persist) save('mostafa-motion',enabled?'on':'off');
    if(!enabled) stage.classList.remove('is-intro');
  }
  function playIntro(userInitiated=false) {
    if(!sceneAvailable) return;
    if(userInitiated && !motionEnabled) setMotion(true);
    if(!motionEnabled) return;
    clearTimeout(introTimer);
    stage.classList.remove('is-intro');
    void stage.offsetWidth;
    stage.classList.add('is-intro');
    window.robotScene?.replay();
    introTimer=setTimeout(()=>stage.classList.remove('is-intro'),3600);
  }
  function toast(message) {
    const element=document.querySelector('#toast');
    element.textContent=message;
    element.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer=setTimeout(()=>element.classList.remove('visible'),3300);
  }
  document.querySelector('#language-toggle').addEventListener('click',()=>{language=language==='ar'?'en':'ar';save('mostafa-language',language);translate();});
  motionButton.addEventListener('click',()=>setMotion(!motionEnabled));
  document.querySelector('#robot-replay').addEventListener('click',()=>playIntro(true));
  document.querySelector('#robot-wave').addEventListener('click',()=>{
    if(!sceneAvailable)return;
    if(!motionEnabled) setMotion(true);
    window.robotScene?.wave();
  });
  document.querySelector('#project-revisit').addEventListener('click',()=>playIntro(true));
  document.querySelector('#copy-email').addEventListener('click',async()=>{
    try {
      if(navigator.clipboard?.writeText) await navigator.clipboard.writeText(email);
      else {
        const input=document.createElement('textarea'); input.value=email; input.style.position='fixed'; input.style.opacity='0'; document.body.append(input); input.select();
        const copied=document.execCommand('copy'); input.remove(); if(!copied)throw new Error('Clipboard unavailable');
      }
      toast(translations[language].copied);
    } catch { toast(translations[language].copyFailed); }
  });
  reducedMotion.addEventListener('change',event=>{if(event.matches)setMotion(false,false);});
  window.addEventListener('robotready',()=>{setMotion(motionEnabled,false);playIntro();});
  window.addEventListener('roboterror',()=>{
    sceneAvailable=false;
    document.querySelector('#robot-canvas').hidden=true;
    document.querySelector('#robot-fallback').hidden=false;
    document.querySelector('.scene-tools').hidden=true;
    stage.classList.remove('is-intro');
  });
  translate();
})();
