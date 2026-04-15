/**
 * Eatpol i18n — client-side translation engine
 * Supports: en, ar, zh, nl, it, de, es, fr
 *
 * SECURITY NOTE: All translation strings are developer-defined constants,
 * not user input. The setHtml() helper uses a whitelist of allowed tags
 * to safely render formatted translations.
 */
(function () {
  'use strict';

  var LANGUAGES = {
    en: { flag: '🇬🇧', label: 'English', dir: 'ltr' },
    nl: { flag: '🇳🇱', label: 'Nederlands', dir: 'ltr' },
    de: { flag: '🇩🇪', label: 'Deutsch', dir: 'ltr' },
    it: { flag: '🇮🇹', label: 'Italiano', dir: 'ltr' },
    es: { flag: '🇪🇸', label: 'Español', dir: 'ltr' },
    fr: { flag: '🇫🇷', label: 'Français', dir: 'ltr' },
    ar: { flag: '🇸🇦', label: 'العربية', dir: 'rtl' },
    zh: { flag: '🇨🇳', label: '中文', dir: 'ltr' },
    ja: { flag: '🇯🇵', label: '日本語', dir: 'ltr' },
    ko: { flag: '🇰🇷', label: '한국어', dir: 'ltr' }
  };

  /**
   * Safe HTML setter: strips all tags except a small whitelist
   * (strong, em, span, a, br) to prevent injection from corrupted data.
   */
  var ALLOWED_TAGS = ['STRONG', 'EM', 'SPAN', 'A', 'BR', 'B', 'I'];

  function setHtml(el, rawHtml) {
    var temp = document.createElement('div');
    temp.textContent = ''; // clear
    // Parse through a temporary element
    var parser = new DOMParser();
    var doc = parser.parseFromString('<body>' + rawHtml + '</body>', 'text/html');
    var body = doc.body;

    function sanitizeNode(source, target) {
      var i, child, clone;
      for (i = 0; i < source.childNodes.length; i++) {
        child = source.childNodes[i];
        if (child.nodeType === Node.TEXT_NODE) {
          target.appendChild(document.createTextNode(child.textContent));
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          if (ALLOWED_TAGS.indexOf(child.tagName) !== -1) {
            clone = document.createElement(child.tagName.toLowerCase());
            // Copy safe attributes for <a> and <span>
            if (child.tagName === 'A' && child.getAttribute('href')) {
              clone.setAttribute('href', child.getAttribute('href'));
            }
            if (child.getAttribute('class')) {
              clone.setAttribute('class', child.getAttribute('class'));
            }
            sanitizeNode(child, clone);
            target.appendChild(clone);
          } else {
            // Flatten disallowed tags to text
            sanitizeNode(child, target);
          }
        }
      }
    }

    // Build sanitized content
    var fragment = document.createDocumentFragment();
    sanitizeNode(body, fragment);
    // Clear element and append sanitized content
    while (el.firstChild) el.removeChild(el.firstChild);
    el.appendChild(fragment);
  }

  /* ──────────────────────────────────────────────
     TRANSLATIONS
     ────────────────────────────────────────────── */
  var T = {
    // ── Meta / SEO ──
    'meta.title': {
      en: 'Eatpol | AI In-Home Consumer Testing for Food Product Launches',
      ar: 'Eatpol | اختبار المستهلكين في المنزل بالذكاء الاصطناعي لإطلاق المنتجات الغذائية',
      zh: 'Eatpol | AI居家消费者测试，助力食品产品上市',
      nl: 'Eatpol | AI-gestuurde consumententests thuis voor voedselproductlanceringen',
      it: 'Eatpol | Test consumatori a domicilio con IA per il lancio di prodotti alimentari',
      de: 'Eatpol | KI-gestützte Verbrauchertests zu Hause für Lebensmittel-Produkteinführungen',
      es: 'Eatpol | Pruebas de consumidores en el hogar con IA para lanzamientos de productos alimentarios',
      fr: 'Eatpol | Tests consommateurs à domicile par IA pour les lancements de produits alimentaires',
      ja: 'Eatpol | 食品製品の発売に向けたAI在宅消費者テスト',
      ko: 'Eatpol | 식품 출시를 위한 AI 가정 내 소비자 테스트'
    },
    'meta.description': {
      en: 'Eatpol helps food companies launch products people love with AI-driven, in-home consumer testing. Capture real-world behavior, emotions, and purchase intent before going to market.',
      ar: 'تساعد Eatpol شركات الأغذية على إطلاق منتجات يحبها الناس من خلال اختبار المستهلكين في المنزل بالذكاء الاصطناعي. التقط السلوك الحقيقي والمشاعر ونية الشراء قبل الذهاب إلى السوق.',
      zh: 'Eatpol帮助食品公司通过AI驱动的居家消费者测试推出人们喜爱的产品。在上市之前捕捉真实行为、情感和购买意向。',
      nl: 'Eatpol helpt voedingsbedrijven producten te lanceren waar mensen van houden met AI-gestuurde consumententests thuis. Leg echt gedrag, emoties en koopintentie vast vóór marktintroductie.',
      it: "Eatpol aiuta le aziende alimentari a lanciare prodotti che la gente ama con test consumatori a domicilio guidati dall'IA. Cattura il comportamento reale, le emozioni e l'intenzione d'acquisto prima di andare sul mercato.",
      de: 'Eatpol hilft Lebensmittelunternehmen, Produkte auf den Markt zu bringen, die die Menschen lieben – mit KI-gestützten Verbrauchertests zu Hause. Erfassen Sie reales Verhalten, Emotionen und Kaufabsicht vor der Markteinführung.',
      es: 'Eatpol ayuda a las empresas alimentarias a lanzar productos que la gente ama con pruebas de consumidores en el hogar impulsadas por IA. Captura comportamiento real, emociones e intención de compra antes de salir al mercado.',
      fr: "Eatpol aide les entreprises alimentaires à lancer des produits que les gens adorent grâce à des tests consommateurs à domicile pilotés par l'IA. Capturez les comportements réels, les émotions et l'intention d'achat avant la mise sur le marché.",
      ja: 'EatpolはAI駆動の在宅消費者テストで、人々が愛する製品の発売を食品企業に支援します。市場投入前に実際の行動、感情、購買意向を捉えます。',
      ko: 'Eatpol은 AI 기반 가정 내 소비자 테스트를 통해 식품 기업이 사람들이 사랑하는 제품을 출시할 수 있도록 돕습니다. 시장 출시 전에 실제 행동, 감정, 구매 의향을 포착하세요.'
    },

    // ── Nav ──
    'nav.home': {
      en: 'Home', ar: 'الرئيسية', zh: '首页', nl: 'Home', it: 'Home', de: 'Startseite', es: 'Inicio', fr: 'Accueil', ja: 'ホーム', ko: '홈'
    },
    'nav.solutions': {
      en: 'Solutions', ar: 'الحلول', zh: '解决方案', nl: 'Oplossingen', it: 'Soluzioni', de: 'Lösungen', es: 'Soluciones', fr: 'Solutions', ja: 'ソリューション', ko: '솔루션'
    },
    'nav.community': {
      en: 'Community', ar: 'المجتمع', zh: '社区', nl: 'Community', it: 'Comunità', de: 'Community', es: 'Comunidad', fr: 'Communauté', ja: 'コミュニティ', ko: '커뮤니티'
    },
    'nav.tester': {
      en: 'Become a Tester', ar: 'كن مختبرًا', zh: '成为测试员', nl: 'Word Tester', it: 'Diventa Tester', de: 'Tester werden', es: 'Hazte Tester', fr: 'Devenir Testeur', ja: 'テスターになる', ko: '테스터 되기'
    },
    'nav.about': {
      en: 'About Us', ar: 'من نحن', zh: '关于我们', nl: 'Over Ons', it: 'Chi Siamo', de: 'Über Uns', es: 'Sobre Nosotros', fr: 'À Propos', ja: '会社概要', ko: '소개'
    },
    'nav.login': {
      en: 'Login', ar: 'تسجيل الدخول', zh: '登录', nl: 'Inloggen', it: 'Accedi', de: 'Anmelden', es: 'Iniciar Sesión', fr: 'Connexion', ja: 'ログイン', ko: '로그인'
    },

    // ── Hero ──
    'hero.title': {
      en: 'Launch Products<br>People Love',
      ar: 'أطلق منتجات<br>يحبها الناس',
      zh: '推出人们<br>喜爱的产品',
      nl: 'Lanceer producten<br>waar mensen van houden',
      it: 'Lancia prodotti<br>che la gente ama',
      de: 'Produkte launchen,<br>die Menschen lieben',
      es: 'Lanza productos<br>que la gente ame',
      fr: 'Lancez des produits<br>que les gens adorent',
      ja: '人々が愛する製品を<br>発売しよう',
      ko: '사람들이 사랑하는<br>제품을 출시하세요'
    },
    'hero.subtitle': {
      en: 'Test with real consumers in their homes. Get actionable insights in 1 week.',
      ar: 'اختبر مع مستهلكين حقيقيين في منازلهم. احصل على رؤى قابلة للتنفيذ في أسبوع واحد.',
      zh: '在真实消费者的家中进行测试。一周内获得可执行的洞察。',
      nl: 'Test met echte consumenten in hun huis. Ontvang bruikbare inzichten in 1 week.',
      it: 'Testa con consumatori reali nelle loro case. Ottieni insight azionabili in 1 settimana.',
      de: 'Testen Sie mit echten Verbrauchern in ihrem Zuhause. Umsetzbare Erkenntnisse in 1 Woche.',
      es: 'Prueba con consumidores reales en sus hogares. Obtén insights accionables en 1 semana.',
      fr: 'Testez avec de vrais consommateurs chez eux. Des insights actionnables en 1 semaine.',
      ja: '消費者の自宅で実際にテスト。1週間で実行可能なインサイトを取得。',
      ko: '실제 소비자의 가정에서 테스트하세요. 1주일 만에 실행 가능한 인사이트를 확보하세요.'
    },
    'hero.cta.assessment': {
      en: 'Get Your Free Assessment',
      ar: 'احصل على تقييمك المجاني',
      zh: '获取免费评估',
      nl: 'Vraag Gratis Beoordeling Aan',
      it: 'Ottieni la Tua Valutazione Gratuita',
      de: 'Kostenlose Bewertung Anfordern',
      es: 'Obtén Tu Evaluación Gratuita',
      fr: 'Obtenez Votre Évaluation Gratuite',
      ja: '無料アセスメントを受ける',
      ko: '무료 평가 받기'
    },
    'hero.cta.how': {
      en: 'See how it works',
      ar: 'شاهد كيف يعمل',
      zh: '了解运作方式',
      nl: 'Bekijk hoe het werkt',
      it: 'Scopri come funziona',
      de: 'So funktioniert es',
      es: 'Mira cómo funciona',
      fr: 'Découvrez comment ça marche',
      ja: '仕組みを見る',
      ko: '작동 방식 보기'
    },
    'hero.trust': {
      en: 'Spin-off from <strong>Wageningen University &amp; Research</strong>',
      ar: 'شركة منبثقة من <strong>جامعة فاخينينغن والأبحاث</strong>',
      zh: '源自<strong>瓦赫宁根大学与研究中心</strong>',
      nl: 'Spin-off van <strong>Wageningen University &amp; Research</strong>',
      it: 'Spin-off della <strong>Wageningen University &amp; Research</strong>',
      de: 'Spin-off der <strong>Wageningen University &amp; Research</strong>',
      es: 'Spin-off de la <strong>Wageningen University &amp; Research</strong>',
      fr: 'Spin-off de <strong>Wageningen University &amp; Research</strong>',
      ja: '<strong>ワーヘニンゲン大学＆リサーチ</strong>発のスピンオフ',
      ko: '<strong>바헤닝언 대학교 & 리서치</strong> 스핀오프'
    },

    // ── Problem Section ──
    'problem.label': {
      en: 'Product failure rate', ar: 'معدل فشل المنتجات', zh: '产品失败率', nl: 'Faalpercentage producten', it: 'Tasso di fallimento dei prodotti', de: 'Produktfehlerquote', es: 'Tasa de fracaso de productos', fr: "Taux d'échec des produits", ja: '製品失敗率', ko: '제품 실패율'
    },
    'problem.headline': {
      en: 'Why most product launches <em>fail</em>',
      ar: 'لماذا تفشل معظم إطلاقات المنتجات',
      zh: '为什么大多数产品上市都会<em>失败</em>',
      nl: 'Waarom de meeste productlanceringen <em>mislukken</em>',
      it: 'Perché la maggior parte dei lanci di prodotti <em>fallisce</em>',
      de: 'Warum die meisten Produkteinführungen <em>scheitern</em>',
      es: 'Por qué la mayoría de los lanzamientos de productos <em>fracasan</em>',
      fr: 'Pourquoi la plupart des lancements de produits <em>échouent</em>',
      ja: 'なぜほとんどの製品発売は<em>失敗</em>するのか',
      ko: '대부분의 제품 출시가 <em>실패</em>하는 이유'
    },
    'problem.p1': {
      en: '<strong>85% of new food products fail within 2 years</strong> <span class="cite">(Forbes)</span>. Not because the products are bad — but because they were tested in the wrong place, with the wrong tools.',
      ar: '<strong>85% من المنتجات الغذائية الجديدة تفشل خلال عامين</strong> <span class="cite">(Forbes)</span>. ليس لأن المنتجات سيئة — ولكن لأنها اختُبرت في المكان الخطأ، بالأدوات الخطأ.',
      zh: '<strong>85%的新食品产品在两年内失败</strong> <span class="cite">(Forbes)</span>。不是因为产品不好——而是因为它们在错误的地方、用错误的工具进行了测试。',
      nl: '<strong>85% van nieuwe voedingsproducten mislukt binnen 2 jaar</strong> <span class="cite">(Forbes)</span>. Niet omdat de producten slecht zijn — maar omdat ze op de verkeerde plek, met de verkeerde tools werden getest.',
      it: "<strong>L'85% dei nuovi prodotti alimentari fallisce entro 2 anni</strong> <span class=\"cite\">(Forbes)</span>. Non perché i prodotti siano cattivi — ma perché sono stati testati nel posto sbagliato, con gli strumenti sbagliati.",
      de: '<strong>85 % der neuen Lebensmittelprodukte scheitern innerhalb von 2 Jahren</strong> <span class="cite">(Forbes)</span>. Nicht weil die Produkte schlecht sind — sondern weil sie am falschen Ort, mit den falschen Werkzeugen getestet wurden.',
      es: '<strong>El 85% de los nuevos productos alimentarios fracasan en 2 años</strong> <span class="cite">(Forbes)</span>. No porque los productos sean malos — sino porque fueron probados en el lugar equivocado, con las herramientas equivocadas.',
      fr: "<strong>85% des nouveaux produits alimentaires échouent en 2 ans</strong> <span class=\"cite\">(Forbes)</span>. Pas parce que les produits sont mauvais — mais parce qu'ils ont été testés au mauvais endroit, avec les mauvais outils.",
      ja: '<strong>新しい食品の85%が2年以内に失敗します</strong> <span class="cite">(Forbes)</span>。製品が悪いからではなく、間違った場所で、間違ったツールでテストされたからです。',
      ko: '<strong>새로운 식품의 85%가 2년 이내에 실패합니다</strong> <span class="cite">(Forbes)</span>. 제품이 나빠서가 아니라, 잘못된 장소에서 잘못된 도구로 테스트되었기 때문입니다.'
    },
    'problem.p2': {
      en: '<strong>Sensory booths</strong> are sterile rooms where participants "evaluate" — not eat. They are not cooking for their family or deciding what to buy. They circle a number on a <strong>questionnaire, collect their payment, and leave.</strong>',
      ar: '<strong>أكشاك التذوق</strong> هي غرف معقمة حيث يقوم المشاركون بـ"التقييم" — وليس الأكل. لا يطبخون لعائلاتهم ولا يقررون ماذا يشترون. يضعون دائرة حول رقم في <strong>استبيان، ويجمعون أموالهم، ويغادرون.</strong>',
      zh: '<strong>感官品评室</strong>是无菌的房间，参与者在那里"评估"——而不是吃。他们不是在为家人做饭，也不是在决定买什么。他们在<strong>问卷上圈一个数字，领取报酬，然后离开。</strong>',
      nl: '<strong>Sensorische cabines</strong> zijn steriele ruimtes waar deelnemers "evalueren" — niet eten. Ze koken niet voor hun gezin en beslissen niet wat ze kopen. Ze omcirkelen een getal op een <strong>vragenlijst, halen hun betaling op en vertrekken.</strong>',
      it: '<strong>Le cabine sensoriali</strong> sono stanze sterili dove i partecipanti "valutano" — non mangiano. Non cucinano per la famiglia né decidono cosa comprare. Cerchiano un numero su un <strong>questionario, ritirano il compenso e se ne vanno.</strong>',
      de: '<strong>Sensorik-Kabinen</strong> sind sterile Räume, in denen Teilnehmer "bewerten" — nicht essen. Sie kochen nicht für ihre Familie und entscheiden nicht, was sie kaufen. Sie kreisen eine Zahl auf einem <strong>Fragebogen ein, holen ihre Bezahlung ab und gehen.</strong>',
      es: '<strong>Las cabinas sensoriales</strong> son salas estériles donde los participantes "evalúan" — no comen. No cocinan para su familia ni deciden qué comprar. Marcan un número en un <strong>cuestionario, recogen su pago y se van.</strong>',
      fr: '<strong>Les cabines sensorielles</strong> sont des salles stériles où les participants "évaluent" — sans manger. Ils ne cuisinent pas pour leur famille ni ne décident quoi acheter. Ils entourent un chiffre sur un <strong>questionnaire, récupèrent leur paiement et partent.</strong>',
      ja: '<strong>官能評価ブース</strong>は参加者が「評価する」無菌の部屋です。食べるのではありません。家族のために料理したり、何を買うか決めたりしていません。<strong>アンケートに数字を丸つけて、報酬を受け取り、帰ります。</strong>',
      ko: '<strong>관능평가 부스</strong>는 참가자들이 "평가"하는 무균실입니다. 먹는 것이 아닙니다. 가족을 위해 요리하거나 무엇을 살지 결정하지 않습니다. <strong>설문지에 숫자를 동그라미 치고, 보수를 받고, 떠납니다.</strong>'
    },
    'problem.p3': {
      en: 'That 1–10 taste score? It tells you what people <em>rate</em>. Not what they <em>buy</em>. Not what they <em>feel</em>. Not why they reach for your competitor\'s product instead.',
      ar: 'تلك النتيجة من 1 إلى 10 للمذاق؟ تخبرك بما <em>يقيّمه</em> الناس. ليس ما <em>يشترونه</em>. ليس ما <em>يشعرون</em> به. ليس لماذا يختارون منتج منافسك بدلاً من ذلك.',
      zh: '那个1到10的口味评分？它告诉你人们如何<em>评分</em>。而不是他们<em>买</em>什么。不是他们的<em>感受</em>。不是他们为什么转而选择竞争对手的产品。',
      nl: 'Die smaakscore van 1–10? Die vertelt u wat mensen <em>beoordelen</em>. Niet wat ze <em>kopen</em>. Niet wat ze <em>voelen</em>. Niet waarom ze naar het product van de concurrent grijpen.',
      it: 'Quel punteggio di gusto da 1 a 10? Ti dice cosa le persone <em>valutano</em>. Non cosa <em>comprano</em>. Non cosa <em>provano</em>. Non perché scelgono il prodotto della concorrenza.',
      de: 'Diese Geschmacksbewertung von 1–10? Sie sagt Ihnen, was Menschen <em>bewerten</em>. Nicht was sie <em>kaufen</em>. Nicht was sie <em>fühlen</em>. Nicht warum sie zum Produkt des Wettbewerbers greifen.',
      es: 'Esa puntuación de sabor del 1 al 10? Te dice lo que la gente <em>califica</em>. No lo que <em>compran</em>. No lo que <em>sienten</em>. No por qué eligen el producto de tu competidor.',
      fr: 'Ce score de goût de 1 à 10 ? Il vous dit ce que les gens <em>notent</em>. Pas ce qu\'ils <em>achètent</em>. Pas ce qu\'ils <em>ressentent</em>. Pas pourquoi ils choisissent le produit de votre concurrent.',
      ja: '1〜10の味覚スコア？それは人々が何を<em>評価する</em>かを教えてくれます。何を<em>買う</em>かではありません。何を<em>感じる</em>かでもありません。なぜ競合の製品を選ぶのかも教えてくれません。',
      ko: '1~10점 맛 점수? 사람들이 무엇을 <em>평가</em>하는지 알려줄 뿐입니다. 무엇을 <em>사는지</em>가 아닙니다. 무엇을 <em>느끼는지</em>도 아닙니다. 왜 경쟁사 제품을 선택하는지도 알 수 없습니다.'
    },
    'problem.p4': {
      en: 'Real food decisions happen in kitchens, with emotions, in chaos. <strong>If you are not testing there, you are not really testing.</strong>',
      ar: 'القرارات الغذائية الحقيقية تحدث في المطابخ، مع المشاعر، في الفوضى. <strong>إذا لم تختبر هناك، فأنت لا تختبر حقًا.</strong>',
      zh: '真正的食品决策发生在厨房里，伴随着情感，在混乱中。<strong>如果你不在那里测试，你就不是真正在测试。</strong>',
      nl: 'Echte voedselkeuzes worden in keukens gemaakt, met emoties, in chaos. <strong>Als u daar niet test, test u niet echt.</strong>',
      it: 'Le vere decisioni alimentari avvengono in cucina, con emozioni, nel caos. <strong>Se non stai testando lì, non stai veramente testando.</strong>',
      de: 'Echte Lebensmittelentscheidungen fallen in der Küche, mit Emotionen, im Chaos. <strong>Wenn Sie nicht dort testen, testen Sie nicht wirklich.</strong>',
      es: 'Las decisiones alimentarias reales ocurren en cocinas, con emociones, en el caos. <strong>Si no estás probando ahí, no estás probando realmente.</strong>',
      fr: 'Les vraies décisions alimentaires se prennent en cuisine, avec des émotions, dans le chaos. <strong>Si vous ne testez pas là, vous ne testez pas vraiment.</strong>',
      ja: '本当の食品の選択はキッチンで、感情とともに、混沌の中で行われます。<strong>そこでテストしなければ、本当のテストではありません。</strong>',
      ko: '실제 식품 결정은 부엌에서, 감정과 함께, 혼란 속에서 이루어집니다. <strong>거기서 테스트하지 않으면 진정한 테스트가 아닙니다.</strong>'
    },
    'problem.img1.label': {
      en: 'Sensory booths', ar: 'أكشاك التذوق', zh: '感官品评室', nl: 'Sensorische cabines', it: 'Cabine sensoriali', de: 'Sensorik-Kabinen', es: 'Cabinas sensoriales', fr: 'Cabines sensorielles', ja: '官能評価ブース', ko: '관능평가 부스'
    },
    'problem.img2.label': {
      en: 'Manual questionnaires', ar: 'الاستبيانات اليدوية', zh: '手动问卷', nl: 'Handmatige vragenlijsten', it: 'Questionari manuali', de: 'Manuelle Fragebögen', es: 'Cuestionarios manuales', fr: 'Questionnaires manuels', ja: '手動アンケート', ko: '수동 설문지'
    },

    // ── Hinge ──
    'hinge.text': {
      en: 'There is a better way', ar: 'هناك طريقة أفضل', zh: '有更好的方法', nl: 'Er is een betere manier', it: "C'è un modo migliore", de: 'Es gibt einen besseren Weg', es: 'Hay una forma mejor', fr: 'Il y a une meilleure façon', ja: 'もっと良い方法があります', ko: '더 나은 방법이 있습니다'
    },

    // ── Solution Section ──
    'solution.overline': {
      en: 'The new standard', ar: 'المعيار الجديد', zh: '新标准', nl: 'De nieuwe standaard', it: 'Il nuovo standard', de: 'Der neue Standard', es: 'El nuevo estándar', fr: 'Le nouveau standard', ja: '新しいスタンダード', ko: '새로운 기준'
    },
    'solution.title': {
      en: 'From losing market share to <span class="highlight-gradient">brand loyalty</span>',
      ar: 'من خسارة حصة السوق إلى <span class="highlight-gradient">ولاء العلامة التجارية</span>',
      zh: '从失去市场份额到<span class="highlight-gradient">品牌忠诚</span>',
      nl: 'Van marktaandeel verliezen naar <span class="highlight-gradient">merkloyaliteit</span>',
      it: 'Dalla perdita di quote di mercato alla <span class="highlight-gradient">fedeltà al marchio</span>',
      de: 'Von Marktanteilsverlusten zu <span class="highlight-gradient">Markentreue</span>',
      es: 'De perder cuota de mercado a <span class="highlight-gradient">lealtad de marca</span>',
      fr: 'De la perte de parts de marché à la <span class="highlight-gradient">fidélité à la marque</span>',
      ja: '市場シェアの喪失から<span class="highlight-gradient">ブランドロイヤリティ</span>へ',
      ko: '시장 점유율 상실에서 <span class="highlight-gradient">브랜드 충성도</span>로'
    },
    'solution.body': {
      en: "Real consumer feedback from your target customer's kitchen, directly to your dashboard. Test, iterate, and launch with confidence.",
      ar: 'ملاحظات المستهلكين الحقيقية من مطبخ عميلك المستهدف، مباشرة إلى لوحة التحكم. اختبر، كرر، وأطلق بثقة.',
      zh: '来自目标客户厨房的真实消费者反馈，直接传送到您的仪表板。测试、迭代、自信地上市。',
      nl: 'Echte consumentenfeedback uit de keuken van uw doelklant, rechtstreeks naar uw dashboard. Test, itereer en lanceer met vertrouwen.',
      it: 'Feedback reale dei consumatori dalla cucina del tuo cliente target, direttamente nella tua dashboard. Testa, itera e lancia con sicurezza.',
      de: 'Echtes Verbraucherfeedback aus der Küche Ihrer Zielkunden, direkt in Ihr Dashboard. Testen, iterieren und mit Zuversicht launchen.',
      es: 'Retroalimentación real de consumidores desde la cocina de tu cliente objetivo, directamente a tu panel de control. Prueba, itera y lanza con confianza.',
      fr: 'De vrais retours consommateurs depuis la cuisine de votre client cible, directement dans votre tableau de bord. Testez, itérez et lancez en confiance.',
      ja: 'ターゲット顧客のキッチンからのリアルな消費者フィードバックを、直接ダッシュボードへ。テストし、改善し、自信を持って発売しましょう。',
      ko: '타겟 고객의 부엌에서 직접 대시보드로 전달되는 실제 소비자 피드백. 테스트하고, 반복하고, 자신 있게 출시하세요.'
    },
    'solution.callout': {
      en: 'Be in the 15% that succeed.',
      ar: 'كن من الـ 15% الناجحين.',
      zh: '成为那成功的15%。',
      nl: 'Behoor tot de 15% die slaagt.',
      it: 'Fai parte del 15% che ha successo.',
      de: 'Gehören Sie zu den 15 %, die Erfolg haben.',
      es: 'Forma parte del 15% que tiene éxito.',
      fr: 'Faites partie des 15% qui réussissent.',
      ja: '成功する15%に入りましょう。',
      ko: '성공하는 15%가 되세요.'
    },

    // ── Our Method ──
    'method.overline': {
      en: 'Our Method', ar: 'طريقتنا', zh: '我们的方法', nl: 'Onze Methode', it: 'Il Nostro Metodo', de: 'Unsere Methode', es: 'Nuestro Método', fr: 'Notre Méthode', ja: '私たちの方法', ko: '우리의 방법'
    },
    'method.cta.explore': {
      en: 'Explore Solutions', ar: 'استكشف الحلول', zh: '探索解决方案', nl: 'Bekijk Oplossingen', it: 'Esplora le Soluzioni', de: 'Lösungen Entdecken', es: 'Explorar Soluciones', fr: 'Explorer les Solutions', ja: 'ソリューションを見る', ko: '솔루션 살펴보기'
    },
    'method.step1.title': {
      en: 'Brief', ar: 'الموجز', zh: '简报', nl: 'Briefing', it: 'Brief', de: 'Briefing', es: 'Brief', fr: 'Brief', ja: 'ブリーフ', ko: '브리프'
    },
    'method.step1.desc': {
      en: 'Define your goals, target consumers, and products to test',
      ar: 'حدد أهدافك والمستهلكين المستهدفين والمنتجات المراد اختبارها',
      zh: '确定您的目标、目标消费者和待测产品',
      nl: 'Definieer uw doelen, doelconsumenten en te testen producten',
      it: 'Definisci i tuoi obiettivi, i consumatori target e i prodotti da testare',
      de: 'Definieren Sie Ihre Ziele, Zielverbraucher und zu testende Produkte',
      es: 'Define tus objetivos, consumidores objetivo y productos a probar',
      fr: 'Définissez vos objectifs, consommateurs cibles et produits à tester',
      ja: '目標、ターゲット消費者、テストする製品を定義します',
      ko: '목표, 타겟 소비자, 테스트할 제품을 정의합니다'
    },
    'method.step2.title': {
      en: 'Recruit', ar: 'التوظيف', zh: '招募', nl: 'Werving', it: 'Reclutamento', de: 'Rekrutierung', es: 'Reclutamiento', fr: 'Recrutement', ja: 'リクルート', ko: '모집'
    },
    'method.step2.desc': {
      en: 'We find and screen consumers from your target audience',
      ar: 'نجد ونفحص المستهلكين من جمهورك المستهدف',
      zh: '我们从您的目标受众中寻找和筛选消费者',
      nl: 'Wij vinden en screenen consumenten uit uw doelgroep',
      it: 'Troviamo e selezioniamo consumatori dal tuo pubblico target',
      de: 'Wir finden und prüfen Verbraucher aus Ihrer Zielgruppe',
      es: 'Encontramos y seleccionamos consumidores de tu público objetivo',
      fr: 'Nous trouvons et sélectionnons des consommateurs de votre audience cible',
      ja: 'ターゲットオーディエンスから消費者を見つけて選別します',
      ko: '타겟 오디언스에서 소비자를 찾아 선별합니다'
    },
    'method.step3.title': {
      en: 'Test in-home', ar: 'اختبار منزلي', zh: '居家测试', nl: 'Test thuis', it: 'Test a casa', de: 'Test zu Hause', es: 'Prueba en casa', fr: 'Test à domicile', ja: '在宅テスト', ko: '가정 내 테스트'
    },
    'method.step3.desc': {
      en: 'Consumers test your product in their own kitchen, on video',
      ar: 'يختبر المستهلكون منتجك في مطبخهم، بالفيديو',
      zh: '消费者在自己的厨房里通过视频测试您的产品',
      nl: 'Consumenten testen uw product in hun eigen keuken, op video',
      it: 'I consumatori testano il tuo prodotto nella loro cucina, in video',
      de: 'Verbraucher testen Ihr Produkt in ihrer eigenen Küche, auf Video',
      es: 'Los consumidores prueban tu producto en su propia cocina, en vídeo',
      fr: 'Les consommateurs testent votre produit dans leur cuisine, en vidéo',
      ja: '消費者が自分のキッチンでビデオ撮影しながら製品をテストします',
      ko: '소비자가 자신의 부엌에서 비디오로 제품을 테스트합니다'
    },
    'method.step4.title': {
      en: 'AI Analysis', ar: 'تحليل بالذكاء الاصطناعي', zh: 'AI分析', nl: 'AI-Analyse', it: 'Analisi IA', de: 'KI-Analyse', es: 'Análisis IA', fr: 'Analyse IA', ja: 'AI分析', ko: 'AI 분석'
    },
    'method.step4.desc': {
      en: 'Emotions, behavior, and friction points analyzed automatically',
      ar: 'المشاعر والسلوك ونقاط الاحتكاك تُحلَّل تلقائيًا',
      zh: '自动分析情感、行为和摩擦点',
      nl: 'Emoties, gedrag en knelpunten automatisch geanalyseerd',
      it: 'Emozioni, comportamenti e punti di attrito analizzati automaticamente',
      de: 'Emotionen, Verhalten und Reibungspunkte automatisch analysiert',
      es: 'Emociones, comportamiento y puntos de fricción analizados automáticamente',
      fr: 'Émotions, comportements et points de friction analysés automatiquement',
      ja: '感情、行動、摩擦点を自動分析',
      ko: '감정, 행동, 마찰 포인트를 자동으로 분석'
    },
    'method.step5.title': {
      en: 'Dashboard', ar: 'لوحة التحكم', zh: '仪表板', nl: 'Dashboard', it: 'Dashboard', de: 'Dashboard', es: 'Panel de Control', fr: 'Tableau de Bord',
      ja: 'ダッシュボード',
      ko: '대시보드'
    },
    'method.step5.desc': {
      en: 'Results, recommendations, and insights in Eatpol Studio',
      ar: 'النتائج والتوصيات والرؤى في Eatpol Studio',
      zh: '在Eatpol Studio中查看结果、建议和洞察',
      nl: 'Resultaten, aanbevelingen en inzichten in Eatpol Studio',
      it: 'Risultati, raccomandazioni e approfondimenti in Eatpol Studio',
      de: 'Ergebnisse, Empfehlungen und Erkenntnisse in Eatpol Studio',
      es: 'Resultados, recomendaciones e insights en Eatpol Studio',
      fr: 'Résultats, recommandations et insights dans Eatpol Studio',
      ja: 'Eatpol Studioで結果、推奨事項、インサイトを確認',
      ko: 'Eatpol Studio에서 결과, 권장 사항, 인사이트 확인'
    },

    // ── What you get ──
    'insights.overline': {
      en: 'What you get', ar: 'ما تحصل عليه', zh: '你将获得', nl: 'Wat u krijgt', it: 'Cosa ottieni', de: 'Was Sie bekommen', es: 'Lo que obtienes', fr: 'Ce que vous obtenez',
      ja: '得られるもの',
      ko: '얻을 수 있는 것'
    },
    'insights.title': {
      en: 'Insights for every team in 1 week',
      ar: 'رؤى لكل فريق في أسبوع واحد',
      zh: '一周内为每个团队提供洞察',
      nl: 'Inzichten voor elk team in 1 week',
      it: 'Insight per ogni team in 1 settimana',
      de: 'Erkenntnisse für jedes Team in 1 Woche',
      es: 'Insights para cada equipo en 1 semana',
      fr: 'Des insights pour chaque équipe en 1 semaine',
      ja: '1週間で全チームにインサイトを',
      ko: '1주일 만에 모든 팀에 인사이트를'
    },
    'insights.subtitle': {
      en: 'A single in-home study delivers the evidence R&D, Marketing, and Business need — from kickoff to results in your dashboard.',
      ar: 'دراسة واحدة في المنزل تقدم الأدلة التي يحتاجها البحث والتطوير والتسويق والأعمال — من البداية إلى النتائج في لوحة التحكم.',
      zh: '一次居家研究即可提供研发、营销和业务所需的证据——从启动到结果直达仪表板。',
      nl: 'Eén thuisstudie levert het bewijs dat R&D, Marketing en Business nodig hebben — van kickoff tot resultaten in uw dashboard.',
      it: 'Un singolo studio a domicilio fornisce le evidenze di cui R&D, Marketing e Business hanno bisogno — dal kickoff ai risultati nella tua dashboard.',
      de: 'Eine einzige In-Home-Studie liefert die Belege, die F&E, Marketing und Business brauchen — vom Kickoff bis zu Ergebnissen in Ihrem Dashboard.',
      es: 'Un solo estudio en el hogar entrega la evidencia que I+D, Marketing y Negocio necesitan — del kickoff a los resultados en tu panel.',
      fr: "Une seule étude à domicile fournit les preuves dont la R&D, le Marketing et le Business ont besoin — du kickoff aux résultats dans votre tableau de bord.",
      ja: '1回の在宅調査で、R&D、マーケティング、ビジネスが必要とする証拠を提供 — キックオフからダッシュボードの結果まで。',
      ko: '한 번의 가정 내 연구로 R&D, 마케팅, 비즈니스가 필요로 하는 증거를 제공 — 킥오프부터 대시보드 결과까지.'
    },

    // ── R&D Card ──
    'rnd.tag': { en: 'R&D & Insights', ar: 'البحث والتطوير والرؤى', zh: '研发与洞察', nl: 'R&D & Inzichten', it: 'R&D e Insight', de: 'F&E & Insights', es: 'I+D e Insights', fr: 'R&D & Insights', ja: 'R&D & インサイト', ko: 'R&D & 인사이트' },
    'rnd.headline': { en: 'Understand the real consumer experience', ar: 'افهم تجربة المستهلك الحقيقية', zh: '了解真实的消费者体验', nl: 'Begrijp de echte consumentenervaring', it: 'Comprendi la vera esperienza del consumatore', de: 'Verstehen Sie die echte Verbrauchererfahrung', es: 'Comprende la experiencia real del consumidor', fr: 'Comprenez la vraie expérience consommateur', ja: '実際の消費者体験を理解する', ko: '실제 소비자 경험 이해하기' },
    'rnd.desc': { en: 'Go beyond sensory scores. See how people actually prepare, cook, eat, and store your product — and what they feel while doing it.', ar: 'تجاوز الدرجات الحسية. شاهد كيف يحضر الناس فعليًا منتجك ويطبخونه ويأكلونه ويخزنونه — وما يشعرون به أثناء ذلك.', zh: '超越感官评分。看看人们如何准备、烹饪、食用和存储您的产品——以及他们的感受。', nl: 'Ga verder dan sensorische scores. Zie hoe mensen uw product daadwerkelijk bereiden, koken, eten en bewaren — en wat ze daarbij voelen.', it: 'Vai oltre i punteggi sensoriali. Guarda come le persone preparano, cucinano, mangiano e conservano il tuo prodotto — e cosa provano mentre lo fanno.', de: 'Gehen Sie über Sensorik-Bewertungen hinaus. Sehen Sie, wie Menschen Ihr Produkt tatsächlich zubereiten, kochen, essen und lagern — und was sie dabei fühlen.', es: 'Ve más allá de las puntuaciones sensoriales. Mira cómo la gente realmente prepara, cocina, come y almacena tu producto — y qué sienten al hacerlo.', fr: "Allez au-delà des scores sensoriels. Voyez comment les gens préparent, cuisinent, mangent et stockent votre produit — et ce qu'ils ressentent.", ja: '感覚スコアを超えて。人々が実際にあなたの製品をどう準備し、調理し、食べ、保存するか — そしてその時何を感じるかを見ましょう。', ko: '감각 점수를 넘어서. 사람들이 실제로 제품을 어떻게 준비하고, 요리하고, 먹고, 보관하는지 — 그리고 그때 무엇을 느끼는지 보세요.' },
    'rnd.li1': { en: 'AI consumer behavior tracking from in-home video', ar: 'تتبع سلوك المستهلك بالذكاء الاصطناعي من فيديو منزلي', zh: 'AI从居家视频中追踪消费者行为', nl: 'AI-consumentengedragstracking uit thuisvideo', it: 'Tracciamento del comportamento dei consumatori tramite IA da video a domicilio', de: 'KI-Verbraucherverhaltens-Tracking aus Heimvideo', es: 'Seguimiento del comportamiento del consumidor con IA desde vídeo en el hogar', fr: 'Suivi du comportement consommateur par IA à partir de vidéos à domicile', ja: '在宅ビデオからのAI消費者行動トラッキング', ko: '가정 내 비디오에서 AI 소비자 행동 추적' },
    'rnd.li2': { en: 'Friction points traditional surveys miss', ar: 'نقاط الاحتكاك التي تفتقدها الاستطلاعات التقليدية', zh: '传统调查遗漏的摩擦点', nl: 'Knelpunten die traditionele enquêtes missen', it: 'Punti di attrito che i sondaggi tradizionali non rilevano', de: 'Reibungspunkte, die herkömmliche Umfragen übersehen', es: 'Puntos de fricción que las encuestas tradicionales no detectan', fr: 'Points de friction que les enquêtes traditionnelles manquent', ja: '従来の調査が見落とす摩擦ポイント', ko: '기존 설문조사가 놓치는 마찰 포인트' },
    'rnd.li3': { en: 'Prioritized product improvement recommendations', ar: 'توصيات محددة الأولوية لتحسين المنتج', zh: '优先排序的产品改进建议', nl: 'Geprioriteerde productverbeteringsaanbevelingen', it: 'Raccomandazioni prioritarie per il miglioramento del prodotto', de: 'Priorisierte Produktverbesserungsempfehlungen', es: 'Recomendaciones priorizadas de mejora de producto', fr: "Recommandations priorisées d'amélioration produit", ja: '優先順位付けされた製品改善の推奨事項', ko: '우선순위화된 제품 개선 권장 사항' },
    'rnd.li4': { en: 'Behavioral evidence over stated preference', ar: 'أدلة سلوكية فوق التفضيل المُعلن', zh: '行为证据优于陈述偏好', nl: 'Gedragsbewijs boven opgegeven voorkeur', it: 'Evidenze comportamentali superiori alle preferenze dichiarate', de: 'Verhaltensbeweise statt angegebener Präferenzen', es: 'Evidencia conductual sobre preferencia declarada', fr: 'Preuves comportementales plutôt que préférences déclarées', ja: '述べられた好みより行動の証拠', ko: '진술된 선호도보다 행동 증거' },

    // ── Marketing Card ──
    'mkt.tag': { en: 'Marketing', ar: 'التسويق', zh: '市场营销', nl: 'Marketing', it: 'Marketing', de: 'Marketing', es: 'Marketing', fr: 'Marketing', ja: 'マーケティング', ko: '마케팅' },
    'mkt.headline': { en: 'Sharpen your positioning with real data', ar: 'صقل موقعك بالبيانات الحقيقية', zh: '用真实数据锐化您的定位', nl: 'Verscherp uw positionering met echte data', it: 'Affina il tuo posizionamento con dati reali', de: 'Schärfen Sie Ihre Positionierung mit echten Daten', es: 'Afina tu posicionamiento con datos reales', fr: 'Affinez votre positionnement avec de vraies données', ja: '実データでポジショニングを研ぎ澄ます', ko: '실제 데이터로 포지셔닝 강화' },
    'mkt.desc': { en: 'Know why consumers pick your product off the shelf — and what words they use to describe it. Build messaging that resonates.', ar: 'اعرف لماذا يختار المستهلكون منتجك من الرف — وما الكلمات التي يستخدمونها لوصفه. ابنِ رسائل تلقى صدى.', zh: '了解消费者为什么从货架上拿起你的产品——以及他们用什么词来描述它。打造有共鸣的信息。', nl: 'Weet waarom consumenten uw product uit het schap pakken — en welke woorden ze gebruiken om het te beschrijven. Bouw boodschappen die resoneren.', it: 'Scopri perché i consumatori scelgono il tuo prodotto dallo scaffale — e quali parole usano per descriverlo. Crea messaggi che risuonano.', de: 'Wissen Sie, warum Verbraucher Ihr Produkt aus dem Regal nehmen — und welche Worte sie verwenden. Erstellen Sie Botschaften, die ankommen.', es: 'Sabe por qué los consumidores eligen tu producto del estante — y qué palabras usan para describirlo. Construye mensajes que resuenen.', fr: 'Sachez pourquoi les consommateurs choisissent votre produit en rayon — et quels mots ils utilisent. Créez des messages qui résonnent.', ja: '消費者がなぜ棚からあなたの製品を選ぶのか — そしてどんな言葉で説明するかを知りましょう。響くメッセージングを構築。', ko: '소비자가 왜 진열대에서 당신의 제품을 선택하는지 — 그리고 어떤 말로 설명하는지 알아보세요. 공감하는 메시지 구축.' },
    'mkt.li1': { en: 'Purchase drivers at the point of sale', ar: 'محركات الشراء في نقطة البيع', zh: '销售点的购买驱动因素', nl: 'Aankoopdrijvers op het verkooppunt', it: "Driver d'acquisto al punto vendita", de: 'Kauftreiber am Point of Sale', es: 'Factores de compra en el punto de venta', fr: "Facteurs d'achat au point de vente", ja: '販売時点の購入ドライバー', ko: '판매 시점의 구매 요인' },
    'mkt.li2': { en: 'Brand perception & competitive benchmarking', ar: 'تصور العلامة التجارية والمقارنة المعيارية التنافسية', zh: '品牌认知与竞争基准', nl: 'Merkperceptie & concurrentiebenchmarking', it: 'Percezione del marchio e benchmarking competitivo', de: 'Markenwahrnehmung & Wettbewerbsbenchmarking', es: 'Percepción de marca y benchmarking competitivo', fr: 'Perception de marque & benchmarking concurrentiel', ja: 'ブランド認知と競合ベンチマーキング', ko: '브랜드 인식 & 경쟁 벤치마킹' },
    'mkt.li3': { en: 'Consumer language for authentic copy', ar: 'لغة المستهلك للنصوص الأصيلة', zh: '用于真实文案的消费者语言', nl: 'Consumentaal voor authentieke copy', it: 'Linguaggio del consumatore per copy autentiche', de: 'Verbrauchersprache für authentische Texte', es: 'Lenguaje del consumidor para copys auténticos', fr: 'Langage consommateur pour des textes authentiques', ja: '本物のコピーのための消費者言語', ko: '진정한 카피를 위한 소비자 언어' },
    'mkt.li4': { en: 'Validated claims backed by behavior data', ar: 'ادعاءات مُثبتة مدعومة ببيانات السلوك', zh: '由行为数据支持的经过验证的声明', nl: 'Gevalideerde claims ondersteund door gedragsdata', it: 'Claim validate supportate da dati comportamentali', de: 'Validierte Aussagen gestützt durch Verhaltensdaten', es: 'Claims validados respaldados por datos de comportamiento', fr: 'Allégations validées soutenues par des données comportementales', ja: '行動データに裏付けられた検証済みの主張', ko: '행동 데이터로 뒷받침된 검증된 주장' },

    // ── Business Card ──
    'biz.tag': { en: 'Business', ar: 'الأعمال', zh: '商业', nl: 'Business', it: 'Business', de: 'Business', es: 'Negocio', fr: 'Business', ja: 'ビジネス', ko: '비즈니스' },
    'biz.headline': { en: 'Launch faster with less risk', ar: 'أطلق أسرع مع مخاطر أقل', zh: '更快上市，更低风险', nl: 'Lanceer sneller met minder risico', it: 'Lancia più velocemente con meno rischi', de: 'Schneller launchen mit weniger Risiko', es: 'Lanza más rápido con menos riesgo', fr: 'Lancez plus vite avec moins de risques', ja: 'リスクを抑えて速く発売', ko: '위험을 줄여 빠르게 출시' },
    'biz.desc': { en: 'Get a clear go / no-go signal before committing to production. Cut months off your timeline with evidence-based decisions.', ar: 'احصل على إشارة واضحة بالمضي أو التوقف قبل الالتزام بالإنتاج. اختصر أشهرًا من جدولك الزمني بقرارات مبنية على الأدلة.', zh: '在投入生产前获得清晰的通过/不通过信号。通过基于证据的决策缩短数月时间。', nl: 'Krijg een duidelijk go/no-go signaal voordat u zich aan productie committeert. Verkort uw tijdlijn met op bewijs gebaseerde beslissingen.', it: 'Ottieni un chiaro segnale go/no-go prima di impegnarti nella produzione. Taglia mesi dalla tua timeline con decisioni basate sulle evidenze.', de: 'Erhalten Sie ein klares Go/No-Go-Signal, bevor Sie sich zur Produktion verpflichten. Kürzen Sie Ihre Timeline mit evidenzbasierten Entscheidungen.', es: 'Obtén una señal clara de go/no-go antes de comprometerte con la producción. Recorta meses de tu cronograma con decisiones basadas en evidencia.', fr: "Obtenez un signal go/no-go clair avant de vous engager en production. Gagnez des mois grâce à des décisions fondées sur des preuves.", ja: '生産にコミットする前に、明確なGo/No-Goシグナルを取得。証拠に基づく意思決定でタイムラインを数ヶ月短縮。', ko: '생산에 착수하기 전에 명확한 Go/No-Go 신호를 받으세요. 증거 기반 의사결정으로 일정을 수개월 단축.' },
    'biz.li1': { en: 'Results in 1 week, not months', ar: 'نتائج في أسبوع واحد، وليس أشهر', zh: '一周出结果，而不是几个月', nl: 'Resultaten in 1 week, niet maanden', it: 'Risultati in 1 settimana, non mesi', de: 'Ergebnisse in 1 Woche, nicht Monaten', es: 'Resultados en 1 semana, no meses', fr: 'Résultats en 1 semaine, pas des mois', ja: '数ヶ月ではなく1週間で結果', ko: '몇 달이 아닌 1주일 만에 결과' },
    'biz.li2': { en: 'Reduced launch failure risk with real-world data', ar: 'تقليل مخاطر فشل الإطلاق بالبيانات الحقيقية', zh: '用真实数据降低上市失败风险', nl: 'Verminderd faalrisico bij lancering met real-world data', it: 'Rischio di fallimento del lancio ridotto con dati reali', de: 'Reduziertes Einführungsrisiko mit realen Daten', es: 'Riesgo de fracaso de lanzamiento reducido con datos reales', fr: "Risque d'échec de lancement réduit avec des données réelles", ja: '実データで発売失敗リスクを低減', ko: '실제 데이터로 출시 실패 위험 감소' },
    'biz.li3': { en: 'Side-by-side competitor benchmarking', ar: 'مقارنة معيارية جنبًا إلى جنب مع المنافسين', zh: '并排竞争对手基准比较', nl: 'Zij-aan-zij concurrentiebenchmarking', it: 'Benchmarking competitivo affiancato', de: 'Seite-an-Seite Wettbewerbsbenchmarking', es: 'Benchmarking comparativo de competidores', fr: 'Benchmarking concurrentiel côte à côte', ja: '競合との並列ベンチマーキング', ko: '경쟁사와 나란히 벤치마킹' },
    'biz.li4': { en: 'Iterate 10x faster than legacy methods', ar: 'كرر أسرع 10 مرات من الطرق التقليدية', zh: '迭代速度比传统方法快10倍', nl: '10x sneller itereren dan traditionele methoden', it: 'Itera 10 volte più velocemente dei metodi tradizionali', de: '10x schneller iterieren als mit herkömmlichen Methoden', es: 'Itera 10 veces más rápido que los métodos tradicionales', fr: 'Itérez 10x plus vite que les méthodes traditionnelles', ja: 'レガシー手法より10倍速く反復', ko: '기존 방법보다 10배 빠르게 반복' },

    // ── Testimonial ──
    'testimonial.overline': { en: 'Client Story', ar: 'قصة عميل', zh: '客户故事', nl: 'Klantverhaal', it: 'Storia del Cliente', de: 'Kundengeschichte', es: 'Historia del Cliente', fr: 'Témoignage Client', ja: 'クライアントストーリー', ko: '고객 사례' },
    'testimonial.text': {
      en: 'Validating product claims, real-life usage, packaging, and flavors before launch was a constant challenge. Traditional testing gave us a score, not a direction. Eatpol was completely different! Seeing how consumers actually use our products at home gave us insights we could act on. We brought them into a retailer conversation and <strong>walked out with an extra SKU at Albert Heijn</strong>. We call it <strong>Eatpol proof</strong>.',
      ar: 'كان التحقق من ادعاءات المنتج والاستخدام الفعلي والتغليف والنكهات قبل الإطلاق تحديًا مستمرًا. الاختبارات التقليدية أعطتنا درجة، وليس اتجاهًا. كانت Eatpol مختلفة تمامًا! رؤية كيف يستخدم المستهلكون منتجاتنا فعليًا في المنزل أعطتنا رؤى يمكننا العمل بها. أحضرناها إلى محادثة مع بائع تجزئة و<strong>خرجنا بمنتج إضافي في Albert Heijn</strong>. نسميه <strong>دليل Eatpol</strong>.',
      zh: '在上市前验证产品声明、实际使用、包装和口味一直是一个持续的挑战。传统测试给了我们一个分数，而不是方向。Eatpol完全不同！看到消费者实际上如何在家中使用我们的产品，给了我们可以执行的洞察。我们将这些带入与零售商的对话中，<strong>并在Albert Heijn获得了额外的SKU</strong>。我们称之为<strong>Eatpol证明</strong>。',
      nl: 'Het valideren van productclaims, real-life gebruik, verpakking en smaken vóór lancering was een constante uitdaging. Traditioneel testen gaf ons een score, geen richting. Eatpol was compleet anders! Zien hoe consumenten onze producten daadwerkelijk thuis gebruiken, gaf ons inzichten waar we op konden handelen. We namen ze mee naar een retailgesprek en <strong>liepen naar buiten met een extra SKU bij Albert Heijn</strong>. We noemen het <strong>Eatpol proof</strong>.',
      it: "Validare le dichiarazioni del prodotto, l'uso reale, il packaging e i sapori prima del lancio era una sfida costante. I test tradizionali ci davano un punteggio, non una direzione. Eatpol era completamente diverso! Vedere come i consumatori usano effettivamente i nostri prodotti a casa ci ha dato insight su cui agire. Li abbiamo portati in una conversazione con un retailer e <strong>siamo usciti con un SKU extra ad Albert Heijn</strong>. Lo chiamiamo <strong>prova Eatpol</strong>.",
      de: 'Die Validierung von Produktaussagen, dem tatsächlichen Gebrauch, der Verpackung und der Geschmacksrichtungen vor dem Launch war eine ständige Herausforderung. Traditionelle Tests gaben uns eine Bewertung, keine Richtung. Eatpol war komplett anders! Zu sehen, wie Verbraucher unsere Produkte zu Hause tatsächlich nutzen, gab uns Erkenntnisse, auf die wir handeln konnten. Wir brachten sie in ein Einzelhandelsgespräch und <strong>gingen mit einem zusätzlichen SKU bei Albert Heijn heraus</strong>. Wir nennen es <strong>Eatpol-Beweis</strong>.',
      es: 'Validar las declaraciones del producto, el uso real, el empaque y los sabores antes del lanzamiento era un desafío constante. Las pruebas tradicionales nos daban una puntuación, no una dirección. Eatpol fue completamente diferente! Ver cómo los consumidores realmente usan nuestros productos en casa nos dio insights sobre los que podíamos actuar. Los llevamos a una conversación con un retailer y <strong>salimos con un SKU extra en Albert Heijn</strong>. Lo llamamos <strong>prueba Eatpol</strong>.',
      fr: "Valider les revendications produit, l'utilisation réelle, le packaging et les saveurs avant le lancement était un défi constant. Les tests traditionnels nous donnaient un score, pas une direction. Eatpol était complètement différent ! Voir comment les consommateurs utilisent réellement nos produits à la maison nous a donné des insights exploitables. Nous les avons apportés dans une conversation avec un distributeur et <strong>sommes repartis avec un SKU supplémentaire chez Albert Heijn</strong>. Nous l'appelons la <strong>preuve Eatpol</strong>.",
      ja: '発売前に製品の主張、実際の使用状況、パッケージ、フレーバーを検証することは常に課題でした。従来のテストはスコアを教えてくれましたが、方向性は示してくれませんでした。Eatpolはまったく違いました！消費者が実際に自宅で製品をどう使っているかを見ることで、行動に移せるインサイトを得ました。それを小売店との商談に持ち込み、<strong>Albert Heijnで追加SKUを獲得しました</strong>。私たちはそれを<strong>Eatpolの証明</strong>と呼んでいます。',
      ko: '출시 전에 제품 주장, 실제 사용법, 포장, 맛을 검증하는 것은 항상 도전이었습니다. 전통적인 테스트는 점수만 줄 뿐 방향은 제시하지 못했습니다. Eatpol은 완전히 달랐습니다! 소비자가 가정에서 실제로 제품을 어떻게 사용하는지 보면서 실행 가능한 인사이트를 얻었습니다. 이를 리테일러 미팅에 가져갔고 <strong>Albert Heijn에서 추가 SKU를 확보했습니다</strong>. 우리는 이것을 <strong>Eatpol 증거</strong>라고 부릅니다.'
    },
    'testimonial.role': { en: 'Creative Concept Designer at QSTA', ar: 'مصممة مفاهيم إبداعية في QSTA', zh: 'QSTA创意概念设计师', nl: 'Creative Concept Designer bij QSTA', it: 'Creative Concept Designer presso QSTA', de: 'Creative Concept Designerin bei QSTA', es: 'Diseñadora de Conceptos Creativos en QSTA', fr: 'Creative Concept Designer chez QSTA', ja: 'QSTA クリエイティブコンセプトデザイナー', ko: 'QSTA 크리에이티브 컨셉 디자이너' },

    // ── Dark Band CTA ──
    'band.title': { en: 'Every failed launch costs months and millions', ar: 'كل إطلاق فاشل يكلف شهورًا وملايين', zh: '每次失败的上市都会耗费数月时间和数百万资金', nl: 'Elke mislukte lancering kost maanden en miljoenen', it: 'Ogni lancio fallito costa mesi e milioni', de: 'Jede gescheiterte Einführung kostet Monate und Millionen', es: 'Cada lanzamiento fallido cuesta meses y millones', fr: 'Chaque lancement raté coûte des mois et des millions', ja: '失敗した発売には数ヶ月と数百万のコストがかかります', ko: '실패한 출시는 수개월과 수백만의 비용이 듭니다' },
    'band.text': { en: 'Replace opinion and assumption with real consumer behavior evidence. Find the issues before your customers do.', ar: 'استبدل الرأي والافتراض بأدلة حقيقية على سلوك المستهلك. اكتشف المشاكل قبل عملائك.', zh: '用真实的消费者行为证据取代意见和假设。在客户发现问题之前找到它们。', nl: 'Vervang mening en aanname door echt consumentengedragsbewijs. Vind de problemen voordat uw klanten dat doen.', it: 'Sostituisci opinioni e supposizioni con prove reali del comportamento dei consumatori. Trova i problemi prima che lo facciano i tuoi clienti.', de: 'Ersetzen Sie Meinung und Annahme durch echte Verbraucherverhaltensbeweise. Finden Sie die Probleme, bevor es Ihre Kunden tun.', es: 'Reemplaza la opinión y la suposición con evidencia real del comportamiento del consumidor. Encuentra los problemas antes que tus clientes.', fr: "Remplacez l'opinion et l'hypothèse par de vraies preuves de comportement consommateur. Trouvez les problèmes avant vos clients.", ja: '意見と仮定を実際の消費者行動の証拠に置き換えましょう。顧客より先に問題を見つけましょう。', ko: '의견과 가정을 실제 소비자 행동 증거로 대체하세요. 고객보다 먼저 문제를 찾으세요.' },

    // ── Privacy & Ethics ──
    'privacy.title': { en: 'Privacy & Ethics', ar: 'الخصوصية والأخلاقيات', zh: '隐私与道德', nl: 'Privacy & Ethiek', it: 'Privacy ed Etica', de: 'Datenschutz & Ethik', es: 'Privacidad y Ética', fr: 'Confidentialité & Éthique', ja: 'プライバシーと倫理', ko: '개인정보 보호 & 윤리' },
    'privacy.subtitle': { en: 'Your trust is our foundation. We handle data with the highest standards of privacy, security, and transparency.', ar: 'ثقتكم هي أساسنا. نتعامل مع البيانات بأعلى معايير الخصوصية والأمان والشفافية.', zh: '您的信任是我们的基石。我们以最高标准的隐私、安全和透明度处理数据。', nl: 'Uw vertrouwen is ons fundament. Wij behandelen data met de hoogste normen voor privacy, beveiliging en transparantie.', it: 'La vostra fiducia è il nostro fondamento. Trattiamo i dati con i più alti standard di privacy, sicurezza e trasparenza.', de: 'Ihr Vertrauen ist unser Fundament. Wir behandeln Daten mit den höchsten Standards für Datenschutz, Sicherheit und Transparenz.', es: 'Tu confianza es nuestra base. Manejamos los datos con los más altos estándares de privacidad, seguridad y transparencia.', fr: 'Votre confiance est notre fondation. Nous traitons les données avec les plus hauts standards de confidentialité, sécurité et transparence.', ja: 'お客様の信頼が私たちの基盤です。最高水準のプライバシー、セキュリティ、透明性でデータを取り扱います。', ko: '여러분의 신뢰가 우리의 기반입니다. 최고 수준의 개인정보 보호, 보안, 투명성으로 데이터를 처리합니다.' },
    'privacy.lawful.title': { en: 'Lawful basis', ar: 'الأساس القانوني', zh: '合法基础', nl: 'Wettelijke basis', it: 'Base giuridica', de: 'Rechtsgrundlage', es: 'Base legal', fr: 'Base légale', ja: '法的根拠', ko: '법적 근거' },
    'privacy.lawful.desc': { en: 'Consent-based data collection with clear purposes; opt-out at any time.', ar: 'جمع بيانات قائم على الموافقة مع أغراض واضحة؛ إلغاء الاشتراك في أي وقت.', zh: '基于同意的数据收集，目的明确；随时可退出。', nl: 'Toestemmingsgebaseerde dataverzameling met duidelijke doeleinden; op elk moment uitschrijven.', it: 'Raccolta dati basata sul consenso con scopi chiari; revoca in qualsiasi momento.', de: 'Einwilligungsbasierte Datenerhebung mit klaren Zwecken; jederzeit widerrufbar.', es: 'Recopilación de datos basada en consentimiento con propósitos claros; exclusión en cualquier momento.', fr: 'Collecte de données basée sur le consentement avec des objectifs clairs ; désabonnement à tout moment.', ja: '明確な目的による同意ベースのデータ収集。いつでもオプトアウト可能。', ko: '명확한 목적의 동의 기반 데이터 수집. 언제든지 탈퇴 가능.' },
    'privacy.security.title': { en: 'Security', ar: 'الأمان', zh: '安全', nl: 'Beveiliging', it: 'Sicurezza', de: 'Sicherheit', es: 'Seguridad', fr: 'Sécurité', ja: 'セキュリティ', ko: '보안' },
    'privacy.security.desc': { en: 'Encrypted storage, strict access controls, and time-bound retention policies.', ar: 'تخزين مشفر، ضوابط وصول صارمة، وسياسات احتفاظ محددة زمنيًا.', zh: '加密存储、严格的访问控制和限时保留政策。', nl: 'Versleutelde opslag, strikte toegangscontroles en tijdgebonden bewaarbeleid.', it: 'Archiviazione crittografata, controlli di accesso rigorosi e politiche di conservazione temporizzate.', de: 'Verschlüsselte Speicherung, strenge Zugriffskontrollen und zeitgebundene Aufbewahrungsrichtlinien.', es: 'Almacenamiento cifrado, controles de acceso estrictos y políticas de retención con límite de tiempo.', fr: "Stockage crypté, contrôles d'accès stricts et politiques de conservation limitées dans le temps.", ja: '暗号化されたストレージ、厳格なアクセス制御、期限付き保持ポリシー。', ko: '암호화된 저장소, 엄격한 접근 제어, 기한부 보존 정책.' },
    'privacy.transparency.title': { en: 'Transparency', ar: 'الشفافية', zh: '透明度', nl: 'Transparantie', it: 'Trasparenza', de: 'Transparenz', es: 'Transparencia', fr: 'Transparence', ja: '透明性', ko: '투명성' },
    'privacy.transparency.desc': { en: 'Participants see what is collected, why, and how it\'s used. Read our <a href="privacy_policy.html">Privacy Policy</a>.', ar: 'يرى المشاركون ما يتم جمعه ولماذا وكيف يُستخدم. اقرأ <a href="privacy_policy.html">سياسة الخصوصية</a>.', zh: '参与者可以看到收集了什么、为什么以及如何使用。阅读我们的<a href="privacy_policy.html">隐私政策</a>。', nl: 'Deelnemers zien wat wordt verzameld, waarom en hoe het wordt gebruikt. Lees ons <a href="privacy_policy.html">Privacybeleid</a>.', it: 'I partecipanti vedono cosa viene raccolto, perché e come viene utilizzato. Leggi la nostra <a href="privacy_policy.html">Informativa sulla Privacy</a>.', de: 'Teilnehmer sehen, was gesammelt wird, warum und wie es verwendet wird. Lesen Sie unsere <a href="privacy_policy.html">Datenschutzrichtlinie</a>.', es: 'Los participantes ven qué se recopila, por qué y cómo se usa. Lee nuestra <a href="privacy_policy.html">Política de Privacidad</a>.', fr: "Les participants voient ce qui est collecté, pourquoi et comment c'est utilisé. Lisez notre <a href=\"privacy_policy.html\">Politique de Confidentialité</a>.", ja: '参加者は何が収集され、なぜ、どのように使用されるかを確認できます。<a href="privacy_policy.html">プライバシーポリシー</a>をお読みください。', ko: '참가자는 무엇이 수집되고, 왜, 어떻게 사용되는지 확인할 수 있습니다. <a href="privacy_policy.html">개인정보 처리방침</a>을 읽어보세요.' },

    // ── FAQ ──
    'faq.title': { en: 'FAQs', ar: 'الأسئلة الشائعة', zh: '常见问题', nl: 'Veelgestelde Vragen', it: 'FAQ', de: 'Häufige Fragen', es: 'Preguntas Frecuentes', fr: 'FAQ', ja: 'よくある質問', ko: '자주 묻는 질문' },
    'faq.q1': { en: 'How is privacy handled?', ar: 'كيف يتم التعامل مع الخصوصية؟', zh: '隐私如何处理？', nl: 'Hoe wordt privacy afgehandeld?', it: 'Come viene gestita la privacy?', de: 'Wie wird der Datenschutz gehandhabt?', es: '¿Cómo se maneja la privacidad?', fr: 'Comment la confidentialité est-elle gérée ?', ja: 'プライバシーはどう扱われますか？', ko: '개인정보는 어떻게 처리되나요?' },
    'faq.a1': { en: 'Faces are auto-masked in videos; we store de-identified signals only and comply with GDPR. A Data Processing Agreement (DPA) is available on request.', ar: 'يتم إخفاء الوجوه تلقائيًا في مقاطع الفيديو؛ نخزن فقط الإشارات مجهولة الهوية ونمتثل للائحة العامة لحماية البيانات. اتفاقية معالجة البيانات (DPA) متاحة عند الطلب.', zh: '视频中的面部会自动遮蔽；我们仅存储去标识化的信号并遵守GDPR。数据处理协议（DPA）可应要求提供。', nl: "Gezichten worden automatisch gemaskeerd in video's; we slaan alleen geanonimiseerde signalen op en voldoen aan de AVG. Een verwerkersovereenkomst (DPA) is op aanvraag beschikbaar.", it: 'I volti vengono automaticamente mascherati nei video; memorizziamo solo segnali de-identificati e siamo conformi al GDPR. Un Accordo di Trattamento dei Dati (DPA) è disponibile su richiesta.', de: 'Gesichter werden in Videos automatisch maskiert; wir speichern nur de-identifizierte Signale und sind DSGVO-konform. Eine Auftragsverarbeitungsvereinbarung (AVV) ist auf Anfrage erhältlich.', es: 'Los rostros se enmascaran automáticamente en los vídeos; solo almacenamos señales desidentificadas y cumplimos con el RGPD. Un Acuerdo de Procesamiento de Datos (DPA) está disponible a solicitud.', fr: 'Les visages sont automatiquement masqués dans les vidéos ; nous stockons uniquement des signaux désidentifiés et respectons le RGPD. Un Accord de Traitement des Données (DPA) est disponible sur demande.', ja: '動画では顔が自動的にマスクされます。識別解除されたシグナルのみを保存し、GDPRに準拠しています。データ処理契約（DPA）はリクエストに応じて提供されます。', ko: '동영상에서 얼굴이 자동으로 마스킹됩니다. 비식별화된 신호만 저장하며 GDPR을 준수합니다. 데이터 처리 계약(DPA)은 요청 시 제공됩니다.' },
    'faq.q2': { en: 'Do we need special hardware?', ar: 'هل نحتاج إلى أجهزة خاصة؟', zh: '我们需要特殊硬件吗？', nl: 'Hebben we speciale hardware nodig?', it: 'Abbiamo bisogno di hardware speciale?', de: 'Brauchen wir spezielle Hardware?', es: '¿Necesitamos hardware especial?', fr: 'Avons-nous besoin de matériel spécial ?', ja: '特別なハードウェアが必要ですか？', ko: '특별한 하드웨어가 필요한가요?' },
    'faq.a2': { en: 'No — testers use their own phones. We provide simple setup guidance inside the app.', ar: 'لا — يستخدم المختبرون هواتفهم الخاصة. نوفر إرشادات إعداد بسيطة داخل التطبيق.', zh: '不需要——测试者使用自己的手机。我们在应用程序内提供简单的设置指导。', nl: 'Nee — testers gebruiken hun eigen telefoon. We bieden eenvoudige installatiehandleiding in de app.', it: "No — i tester usano i propri telefoni. Forniamo una guida semplice all'interno dell'app.", de: 'Nein — Tester verwenden ihre eigenen Telefone. Wir bieten eine einfache Einrichtungsanleitung in der App.', es: 'No — los testers usan sus propios teléfonos. Proporcionamos una guía de configuración sencilla dentro de la app.', fr: "Non — les testeurs utilisent leurs propres téléphones. Nous fournissons un guide de configuration simple dans l'app.", ja: 'いいえ — テスターは自分のスマートフォンを使用します。アプリ内で簡単なセットアップガイダンスを提供します。', ko: '아니요 — 테스터는 자신의 스마트폰을 사용합니다. 앱 내에서 간단한 설정 안내를 제공합니다.' },
    'faq.q3': { en: 'How fast are results?', ar: 'ما مدى سرعة النتائج؟', zh: '结果有多快？', nl: 'Hoe snel zijn resultaten?', it: 'Quanto sono rapidi i risultati?', de: 'Wie schnell sind die Ergebnisse?', es: '¿Qué tan rápidos son los resultados?', fr: 'À quelle vitesse obtient-on les résultats ?', ja: '結果はどのくらい早く出ますか？', ko: '결과는 얼마나 빨리 나오나요?' },
    'faq.a3': { en: 'From kickoff to results in 1 week. Consumer interviews (Vox) can be completed in as little as 2 days. In-home product testing (Domus) runs in parallel. Results appear in your Eatpol Studio dashboard as soon as testing wraps.', ar: 'من البدء إلى النتائج في أسبوع واحد. يمكن إكمال مقابلات المستهلكين (Vox) في أقل من يومين. اختبار المنتج في المنزل (Domus) يعمل بالتوازي. تظهر النتائج في لوحة تحكم Eatpol Studio بمجرد انتهاء الاختبار.', zh: '从启动到结果仅需一周。消费者访谈（Vox）最快2天即可完成。居家产品测试（Domus）同步进行。测试结束后结果即刻出现在Eatpol Studio仪表板中。', nl: 'Van kickoff tot resultaten in 1 week. Consumenteninterviews (Vox) kunnen in slechts 2 dagen worden afgerond. Thuisproducttesten (Domus) lopen parallel. Resultaten verschijnen in uw Eatpol Studio dashboard zodra het testen is afgerond.', it: 'Dal kickoff ai risultati in 1 settimana. Le interviste ai consumatori (Vox) possono essere completate in appena 2 giorni. I test di prodotto a domicilio (Domus) procedono in parallelo. I risultati appaiono nella dashboard di Eatpol Studio appena i test si concludono.', de: 'Vom Kickoff bis zu den Ergebnissen in 1 Woche. Verbraucherinterviews (Vox) können in nur 2 Tagen abgeschlossen werden. In-Home-Produkttests (Domus) laufen parallel. Ergebnisse erscheinen in Ihrem Eatpol Studio Dashboard, sobald die Tests abgeschlossen sind.', es: 'Del kickoff a los resultados en 1 semana. Las entrevistas a consumidores (Vox) pueden completarse en tan solo 2 días. Las pruebas de producto en el hogar (Domus) se ejecutan en paralelo. Los resultados aparecen en tu panel de Eatpol Studio tan pronto como finalizan las pruebas.', fr: 'Du kickoff aux résultats en 1 semaine. Les entretiens consommateurs (Vox) peuvent être réalisés en seulement 2 jours. Les tests produits à domicile (Domus) sont menés en parallèle. Les résultats apparaissent dans votre tableau de bord Eatpol Studio dès la fin des tests.', ja: 'キックオフから結果まで1週間。消費者インタビュー（Vox）は最短2日で完了できます。在宅製品テスト（Domus）は並行して実施。テスト終了後すぐにEatpol Studioダッシュボードに結果が表示されます。', ko: '킥오프부터 결과까지 1주일. 소비자 인터뷰(Vox)는 최소 2일 만에 완료할 수 있습니다. 가정 내 제품 테스트(Domus)는 병렬로 진행됩니다. 테스트가 끝나면 바로 Eatpol Studio 대시보드에 결과가 표시됩니다.' },
    'faq.q4': { en: 'Can we compare against competitors?', ar: 'هل يمكننا المقارنة مع المنافسين؟', zh: '我们可以与竞争对手进行比较吗？', nl: 'Kunnen we vergelijken met concurrenten?', it: 'Possiamo confrontarci con i concorrenti?', de: 'Können wir uns mit Wettbewerbern vergleichen?', es: '¿Podemos compararnos con la competencia?', fr: 'Pouvons-nous nous comparer aux concurrents ?', ja: '競合と比較できますか？', ko: '경쟁사와 비교할 수 있나요?' },
    'faq.a4': { en: 'Yes — include one or multiple competitor SKUs. We report relative performance and key drivers.', ar: 'نعم — أضف منتجًا واحدًا أو أكثر من المنافسين. نقدم تقريرًا عن الأداء النسبي والمحركات الرئيسية.', zh: '可以——包含一个或多个竞争对手SKU。我们报告相对表现和关键驱动因素。', nl: "Ja — voeg een of meerdere concurrerende SKU's toe. We rapporteren relatieve prestaties en belangrijke drijfveren.", it: 'Sì — includi uno o più SKU della concorrenza. Riportiamo le prestazioni relative e i principali driver.', de: 'Ja — fügen Sie eine oder mehrere Wettbewerber-SKUs hinzu. Wir berichten über relative Leistung und Schlüsselfaktoren.', es: 'Sí — incluye uno o varios SKUs de la competencia. Reportamos rendimiento relativo y factores clave.', fr: 'Oui — incluez un ou plusieurs SKUs concurrents. Nous rapportons les performances relatives et les facteurs clés.', ja: 'はい — 1つまたは複数の競合SKUを含めることができます。相対的なパフォーマンスと主要ドライバーを報告します。', ko: '네 — 하나 또는 여러 경쟁사 SKU를 포함할 수 있습니다. 상대적 성과와 핵심 요인을 보고합니다.' },
    'faq.q5': { en: 'What if samples require cooking?', ar: 'ماذا لو تطلبت العينات طهيًا؟', zh: '如果样品需要烹饪怎么办？', nl: 'Wat als samples koken vereisen?', it: 'E se i campioni richiedono cottura?', de: 'Was wenn Proben gekocht werden müssen?', es: '¿Y si las muestras requieren cocción?', fr: 'Et si les échantillons nécessitent une cuisson ?', ja: 'サンプルに調理が必要な場合は？', ko: '샘플에 조리가 필요한 경우는?' },
    'faq.a5': { en: 'We capture preparation steps to connect outcomes with real-world usage and identify friction.', ar: 'نلتقط خطوات التحضير لربط النتائج بالاستخدام الحقيقي وتحديد نقاط الاحتكاك.', zh: '我们记录准备步骤，将结果与实际使用联系起来并识别摩擦点。', nl: 'We leggen bereidingsstappen vast om resultaten te koppelen aan real-world gebruik en knelpunten te identificeren.', it: "Catturiamo i passaggi di preparazione per collegare i risultati all'uso reale e identificare i punti di attrito.", de: 'Wir erfassen Zubereitungsschritte, um Ergebnisse mit der realen Nutzung zu verbinden und Reibungspunkte zu identifizieren.', es: 'Capturamos los pasos de preparación para conectar los resultados con el uso real e identificar fricciones.', fr: "Nous capturons les étapes de préparation pour relier les résultats à l'usage réel et identifier les frictions.", ja: '準備手順を記録し、結果を実際の使用状況と結びつけ、摩擦を特定します。', ko: '준비 단계를 기록하여 결과를 실제 사용 상황과 연결하고 마찰을 식별합니다.' },

    // ── Footer ──
    'footer.about.title': { en: 'About Eatpol', ar: 'عن Eatpol', zh: '关于Eatpol', nl: 'Over Eatpol', it: 'Chi è Eatpol', de: 'Über Eatpol', es: 'Sobre Eatpol', fr: "À Propos d'Eatpol", ja: 'Eatpolについて', ko: 'Eatpol 소개' },
    'footer.about.text': { en: 'Eatpol is a spin-off company from Wageningen University and Research founded in 2025. <br> KvK: 98066269', ar: 'Eatpol هي شركة منبثقة من جامعة فاخينينغن والأبحاث تأسست في 2025. <br> KvK: 98066269', zh: 'Eatpol是瓦赫宁根大学与研究中心的衍生公司，成立于2025年。<br> KvK: 98066269', nl: 'Eatpol is een spin-off van Wageningen University and Research, opgericht in 2025. <br> KvK: 98066269', it: 'Eatpol è una spin-off della Wageningen University and Research fondata nel 2025. <br> KvK: 98066269', de: 'Eatpol ist ein Spin-off der Wageningen University and Research, gegründet 2025. <br> KvK: 98066269', es: 'Eatpol es una spin-off de la Wageningen University and Research fundada en 2025. <br> KvK: 98066269', fr: 'Eatpol est une spin-off de Wageningen University and Research fondée en 2025. <br> KvK: 98066269', ja: 'Eatpolは2025年設立のワーヘニンゲン大学&リサーチのスピンオフ企業です。<br> KvK: 98066269', ko: 'Eatpol은 2025년에 설립된 바헤닝언 대학교 & 연구소의 스핀오프 기업입니다. <br> KvK: 98066269' },
    'footer.links.title': { en: 'Quick Links', ar: 'روابط سريعة', zh: '快速链接', nl: 'Snelle Links', it: 'Link Rapidi', de: 'Schnelle Links', es: 'Enlaces Rápidos', fr: 'Liens Rapides', ja: 'クイックリンク', ko: '빠른 링크' },
    'footer.link.home': { en: 'Home', ar: 'الرئيسية', zh: '首页', nl: 'Home', it: 'Home', de: 'Startseite', es: 'Inicio', fr: 'Accueil', ja: 'ホーム', ko: '홈' },
    'footer.link.tester': { en: 'Become a Tester', ar: 'كن مختبرًا', zh: '成为测试员', nl: 'Word Tester', it: 'Diventa Tester', de: 'Tester werden', es: 'Hazte Tester', fr: 'Devenir Testeur', ja: 'テスターになる', ko: '테스터 되기' },
    'footer.link.community': { en: 'Community', ar: 'المجتمع', zh: '社区', nl: 'Community', it: 'Comunità', de: 'Community', es: 'Comunidad', fr: 'Communauté', ja: 'コミュニティ', ko: '커뮤니티' },
    'footer.link.about': { en: 'About Us', ar: 'من نحن', zh: '关于我们', nl: 'Over Ons', it: 'Chi Siamo', de: 'Über Uns', es: 'Sobre Nosotros', fr: 'À Propos', ja: '会社概要', ko: '회사 소개' },
    'footer.contact.title': { en: 'Contact Info', ar: 'معلومات الاتصال', zh: '联系方式', nl: 'Contactgegevens', it: 'Contatti', de: 'Kontaktdaten', es: 'Información de Contacto', fr: 'Coordonnées', ja: '連絡先', ko: '연락처' },
    'footer.contact.address': { en: 'Bronland 10, 6708WH, Wageningen, the Netherlands', ar: 'Bronland 10, 6708WH, فاخينينغن، هولندا', zh: 'Bronland 10, 6708WH, 瓦赫宁根, 荷兰', nl: 'Bronland 10, 6708WH, Wageningen, Nederland', it: 'Bronland 10, 6708WH, Wageningen, Paesi Bassi', de: 'Bronland 10, 6708WH, Wageningen, Niederlande', es: 'Bronland 10, 6708WH, Wageningen, Países Bajos', fr: 'Bronland 10, 6708WH, Wageningen, Pays-Bas', ja: 'Bronland 10, 6708WH, ワーヘニンゲン, オランダ', ko: 'Bronland 10, 6708WH, 바헤닝언, 네덜란드' },
    'footer.legal.title': { en: 'Legal', ar: 'قانوني', zh: '法律', nl: 'Juridisch', it: 'Legale', de: 'Rechtliches', es: 'Legal', fr: 'Mentions Légales', ja: '法的情報', ko: '법적 정보' },
    'footer.legal.privacy': { en: 'Privacy Policy', ar: 'سياسة الخصوصية', zh: '隐私政策', nl: 'Privacybeleid', it: 'Informativa sulla Privacy', de: 'Datenschutzrichtlinie', es: 'Política de Privacidad', fr: 'Politique de Confidentialité', ja: 'プライバシーポリシー', ko: '개인정보 처리방침' },
    'footer.legal.terms': { en: 'Terms & Conditions', ar: 'الشروط والأحكام', zh: '条款和条件', nl: 'Algemene Voorwaarden', it: 'Termini e Condizioni', de: 'Allgemeine Geschäftsbedingungen', es: 'Términos y Condiciones', fr: 'Conditions Générales', ja: '利用規約', ko: '이용약관' },
    'footer.collab': { en: 'In collaboration with', ar: 'بالتعاون مع', zh: '合作伙伴', nl: 'In samenwerking met', it: 'In collaborazione con', de: 'In Zusammenarbeit mit', es: 'En colaboración con', fr: 'En collaboration avec', ja: '提携先', ko: '협력 기관' },
    'footer.rights': { en: '&copy; 2025 Eatpol. All Rights Reserved.', ar: '&copy; 2025 Eatpol. جميع الحقوق محفوظة.', zh: '&copy; 2025 Eatpol. 版权所有。', nl: '&copy; 2025 Eatpol. Alle rechten voorbehouden.', it: '&copy; 2025 Eatpol. Tutti i diritti riservati.', de: '&copy; 2025 Eatpol. Alle Rechte vorbehalten.', es: '&copy; 2025 Eatpol. Todos los derechos reservados.', fr: '&copy; 2025 Eatpol. Tous droits réservés.', ja: '&copy; 2025 Eatpol. All Rights Reserved.', ko: '&copy; 2025 Eatpol. All Rights Reserved.' },

    // ── Banner ──
    'banner.text': { en: 'Free Assessment', ar: 'تقييم مجاني', zh: '免费评估', nl: 'Gratis Beoordeling', it: 'Valutazione Gratuita', de: 'Kostenlose Bewertung', es: 'Evaluación Gratuita', fr: 'Évaluation Gratuite', ja: '無料アセスメント', ko: '무료 평가' },

    // ── CTA Clarifiers ──
    'cta.forCompanies': {
      en: 'For food companies launching products.',
      ar: 'لشركات الأغذية التي تطلق منتجات.',
      zh: '面向正在推出产品的食品公司。',
      nl: 'Voor voedingsbedrijven die producten lanceren.',
      it: 'Per aziende alimentari che lanciano prodotti.',
      de: 'Für Lebensmittelunternehmen, die Produkte einführen.',
      es: 'Para empresas alimentarias que lanzan productos.',
      fr: 'Pour les entreprises alimentaires qui lancent des produits.',
      ja: '食品を発売する企業向け。',
      ko: '식품을 출시하는 기업용.'
    },
    'cta.testerLink': {
      en: 'Are you a food tester?',
      ar: 'هل أنت مختبر طعام؟',
      zh: '您是食品测试员吗？',
      nl: 'Bent u een voedingstester?',
      it: 'Sei un food tester?',
      de: 'Sind Sie ein Food-Tester?',
      es: '¿Eres un food tester?',
      fr: 'Vous êtes testeur alimentaire ?',
      ja: 'フードテスターですか？',
      ko: '식품 테스터이신가요?'
    },
    'cta.bannerNote': {
      en: 'For companies only. <a href="testers.html">Testers click here</a>',
      ar: 'للشركات فقط. <a href="testers.html">المختبرون انقروا هنا</a>',
      zh: '仅限公司。<a href="testers.html">测试员请点击这里</a>',
      nl: 'Alleen voor bedrijven. <a href="testers.html">Testers klik hier</a>',
      it: 'Solo per aziende. <a href="testers.html">Tester clicca qui</a>',
      de: 'Nur für Unternehmen. <a href="testers.html">Tester hier klicken</a>',
      es: 'Solo para empresas. <a href="testers.html">Testers hagan clic aquí</a>',
      fr: 'Réservé aux entreprises. <a href="testers.html">Testeurs cliquez ici</a>',
      ja: '企業様専用です。<a href="testers.html">テスターの方はこちら</a>',
      ko: '기업 전용입니다. <a href="testers.html">테스터는 여기를 클릭하세요</a>'
    },

    // ── Assessment Page ──
    'assess.overline': { en: 'Free assessment', ar: 'تقييم مجاني', zh: '免费评估', nl: 'Gratis beoordeling', it: 'Valutazione gratuita', de: 'Kostenlose Bewertung', es: 'Evaluación gratuita', fr: 'Évaluation gratuite', ja: '無料アセスメント', ko: '무료 평가' },
    'assess.title': { en: "Let's talk about <span class=\"highlight-gradient\">your product</span>", ar: "لنتحدث عن <span class=\"highlight-gradient\">منتجك</span>", zh: "让我们聊聊<span class=\"highlight-gradient\">您的产品</span>", nl: "Laten we praten over <span class=\"highlight-gradient\">uw product</span>", it: "Parliamo del <span class=\"highlight-gradient\">tuo prodotto</span>", de: "Sprechen wir über <span class=\"highlight-gradient\">Ihr Produkt</span>", es: "Hablemos de <span class=\"highlight-gradient\">tu producto</span>", fr: "Parlons de <span class=\"highlight-gradient\">votre produit</span>", ja: '<span class="highlight-gradient">あなたの製品</span>について話しましょう', ko: '<span class="highlight-gradient">당신의 제품</span>에 대해 이야기해요' },
    'assess.subtitle': { en: "Book a 30-minute intro call. We'll discuss your product and follow up with a tailored proposal.", ar: 'احجز مكالمة تعريفية مدتها 30 دقيقة. سنناقش منتجك ونتابع باقتراح مخصص.', zh: '预约30分钟介绍电话。我们将讨论您的产品并跟进定制方案。', nl: 'Boek een kennismakingsgesprek van 30 minuten. We bespreken uw product en volgen op met een voorstel op maat.', it: 'Prenota una chiamata introduttiva di 30 minuti. Discuteremo del tuo prodotto e daremo seguito con una proposta su misura.', de: 'Buchen Sie ein 30-minütiges Kennenlerngespräch. Wir besprechen Ihr Produkt und senden Ihnen ein maßgeschneidertes Angebot.', es: 'Reserva una llamada introductoria de 30 minutos. Hablaremos de tu producto y te enviaremos una propuesta personalizada.', fr: "Réservez un appel découverte de 30 minutes. Nous discuterons de votre produit et vous enverrons une proposition sur mesure.", ja: '30分のイントロコールを予約。製品について話し合い、カスタマイズされた提案をフォローアップします。', ko: '30분 소개 전화를 예약하세요. 제품에 대해 논의하고 맞춤 제안서를 보내드립니다.' },
    'assess.badge1': { en: 'No commitment', ar: 'بدون التزام', zh: '无需承诺', nl: 'Geen verplichting', it: 'Senza impegno', de: 'Keine Verpflichtung', es: 'Sin compromiso', fr: 'Sans engagement', ja: '義務なし', ko: '의무 없음' },
    'assess.badge2': { en: 'Results in 2 weeks', ar: 'نتائج في أسبوعين', zh: '两周内出结果', nl: 'Resultaten in 2 weken', it: 'Risultati in 2 settimane', de: 'Ergebnisse in 2 Wochen', es: 'Resultados en 2 semanas', fr: 'Résultats en 2 semaines', ja: '2週間で結果', ko: '2주 만에 결과' },
    'assess.badge3': { en: 'GDPR compliant', ar: 'متوافق مع GDPR', zh: '符合GDPR', nl: 'AVG-conform', it: 'Conforme al GDPR', de: 'DSGVO-konform', es: 'Cumple con RGPD', fr: 'Conforme RGPD', ja: 'GDPR準拠', ko: 'GDPR 준수' },
    'assess.clarifier': {
      en: '<strong>For food companies launching a product.</strong><br>Looking to become a food tester? <a href="testers.html">Sign up here instead</a>',
      ar: '<strong>لشركات الأغذية التي تطلق منتجًا.</strong><br>تبحث عن أن تصبح مختبر طعام؟ <a href="testers.html">سجل هنا بدلاً من ذلك</a>',
      zh: '<strong>面向正在推出产品的食品公司。</strong><br>想成为食品测试员？<a href="testers.html">请在此注册</a>',
      nl: '<strong>Voor voedingsbedrijven die een product lanceren.</strong><br>Wilt u voedingstester worden? <a href="testers.html">Meld u hier aan</a>',
      it: '<strong>Per aziende alimentari che lanciano un prodotto.</strong><br>Vuoi diventare un food tester? <a href="testers.html">Iscriviti qui</a>',
      de: '<strong>Für Lebensmittelunternehmen, die ein Produkt einführen.</strong><br>Möchten Sie Food-Tester werden? <a href="testers.html">Hier anmelden</a>',
      es: '<strong>Para empresas alimentarias que lanzan un producto.</strong><br>¿Quieres ser food tester? <a href="testers.html">Regístrate aquí</a>',
      fr: '<strong>Pour les entreprises alimentaires qui lancent un produit.</strong><br>Vous souhaitez devenir testeur ? <a href="testers.html">Inscrivez-vous ici</a>',
      ja: '<strong>製品を発売する食品企業向け。</strong><br>フードテスターになりたいですか？<a href="testers.html">こちらからご登録ください</a>',
      ko: '<strong>제품을 출시하는 식품 기업을 위한 서비스입니다.</strong><br>식품 테스터가 되고 싶으신가요? <a href="testers.html">여기서 가입하세요</a>'
    },
    'assess.step1.label': { en: 'Your details', ar: 'بياناتك', zh: '您的详情', nl: 'Uw gegevens', it: 'I tuoi dati', de: 'Ihre Daten', es: 'Tus datos', fr: 'Vos coordonnées', ja: 'お客様情報', ko: '고객 정보' },
    'assess.step2.label': { en: 'Book a call', ar: 'احجز مكالمة', zh: '预约电话', nl: 'Boek een gesprek', it: 'Prenota una chiamata', de: 'Gespräch buchen', es: 'Reservar llamada', fr: 'Réserver un appel', ja: '電話を予約', ko: '전화 예약' },
    'assess.form.time': { en: 'Takes 30 seconds', ar: 'يستغرق 30 ثانية', zh: '仅需30秒', nl: 'Duurt 30 seconden', it: 'Bastano 30 secondi', de: 'Dauert 30 Sekunden', es: 'Toma 30 segundos', fr: 'Prend 30 secondes', ja: '30秒で完了', ko: '30초면 완료' },
    'assess.form.firstName': { en: 'First Name *', ar: 'الاسم الأول *', zh: '名 *', nl: 'Voornaam *', it: 'Nome *', de: 'Vorname *', es: 'Nombre *', fr: 'Prénom *', ja: '名 *', ko: '이름 *' },
    'assess.form.lastName': { en: 'Last Name *', ar: 'اسم العائلة *', zh: '姓 *', nl: 'Achternaam *', it: 'Cognome *', de: 'Nachname *', es: 'Apellido *', fr: 'Nom *', ja: '姓 *', ko: '성 *' },
    'assess.form.email': { en: 'Work Email *', ar: 'البريد الإلكتروني للعمل *', zh: '工作邮箱 *', nl: 'Werk e-mail *', it: 'Email aziendale *', de: 'Geschäftliche E-Mail *', es: 'Email de trabajo *', fr: 'Email professionnel *', ja: '業務用メール *', ko: '업무용 이메일 *' },
    'assess.form.company': { en: 'Company *', ar: 'الشركة *', zh: '公司 *', nl: 'Bedrijf *', it: 'Azienda *', de: 'Unternehmen *', es: 'Empresa *', fr: 'Entreprise *', ja: '会社名 *', ko: '회사명 *' },
    'assess.form.role': { en: 'Role <span class="optional">(optional)</span>', ar: 'الدور <span class="optional">(اختياري)</span>', zh: '职位 <span class="optional">(选填)</span>', nl: 'Functie <span class="optional">(optioneel)</span>', it: 'Ruolo <span class="optional">(opzionale)</span>', de: 'Position <span class="optional">(optional)</span>', es: 'Cargo <span class="optional">(opcional)</span>', fr: 'Fonction <span class="optional">(facultatif)</span>', ja: '役職 <span class="optional">（任意）</span>', ko: '직책 <span class="optional">(선택사항)</span>' },
    'assess.form.optionalLabel': { en: 'Help us prepare for your call', ar: 'ساعدنا في الاستعداد لمكالمتك', zh: '帮助我们为您的电话做准备', nl: 'Help ons uw gesprek voor te bereiden', it: 'Aiutaci a preparare la tua chiamata', de: 'Helfen Sie uns, Ihr Gespräch vorzubereiten', es: 'Ayúdanos a preparar tu llamada', fr: 'Aidez-nous à préparer votre appel', ja: '電話の準備にご協力ください', ko: '전화 준비를 도와주세요' },
    'assess.form.productType': { en: 'Product type', ar: 'نوع المنتج', zh: '产品类型', nl: 'Producttype', it: 'Tipo di prodotto', de: 'Produkttyp', es: 'Tipo de producto', fr: 'Type de produit', ja: '製品タイプ', ko: '제품 유형' },
    'assess.form.productStage': { en: 'Product stage', ar: 'مرحلة المنتج', zh: '产品阶段', nl: 'Productstadium', it: 'Fase del prodotto', de: 'Produktphase', es: 'Etapa del producto', fr: 'Stade du produit', ja: '製品ステージ', ko: '제품 단계' },
    'assess.form.comments': { en: 'Anything else?', ar: 'أي شيء آخر؟', zh: '还有其他问题吗？', nl: 'Nog iets anders?', it: 'Altro da aggiungere?', de: 'Noch etwas?', es: '¿Algo más?', fr: "Autre chose ?", ja: '他に何かありますか？', ko: '다른 것이 있나요?' },
    'assess.form.submit': { en: 'Continue — pick a time', ar: 'متابعة — اختر وقتًا', zh: '继续 — 选择时间', nl: 'Doorgaan — kies een tijd', it: 'Continua — scegli un orario', de: 'Weiter — Zeit wählen', es: 'Continuar — elige un horario', fr: 'Continuer — choisir un créneau', ja: '続ける — 時間を選ぶ', ko: '계속 — 시간 선택' },
    'assess.step2.confirmed': { en: 'Details saved', ar: 'تم حفظ البيانات', zh: '信息已保存', nl: 'Gegevens opgeslagen', it: 'Dati salvati', de: 'Daten gespeichert', es: 'Datos guardados', fr: 'Informations enregistrées', ja: '情報を保存しました', ko: '정보가 저장되었습니다' },
    'assess.step2.pick': { en: 'Now pick a time that works for you.', ar: 'الآن اختر وقتًا يناسبك.', zh: '现在选择一个适合您的时间。', nl: 'Kies nu een moment dat u uitkomt.', it: 'Ora scegli un orario che ti va bene.', de: 'Wählen Sie jetzt einen passenden Termin.', es: 'Ahora elige un horario que te convenga.', fr: 'Choisissez maintenant un créneau qui vous convient.', ja: 'ご都合の良い時間をお選びください。', ko: '편한 시간을 선택해 주세요.' },
    'assess.sidebar.get': { en: "What you'll get", ar: 'ما ستحصل عليه', zh: '您将获得', nl: 'Wat u krijgt', it: 'Cosa otterrai', de: 'Was Sie erhalten', es: 'Lo que obtendrás', fr: 'Ce que vous obtiendrez', ja: '得られるもの', ko: '받으실 수 있는 것' },
    'assess.sidebar.get1': { en: 'Personalized testing plan tailored to your product', ar: 'خطة اختبار مخصصة لمنتجك', zh: '为您的产品量身定制的测试计划', nl: 'Gepersonaliseerd testplan op maat van uw product', it: 'Piano di test personalizzato per il tuo prodotto', de: 'Personalisierter Testplan für Ihr Produkt', es: 'Plan de pruebas personalizado para tu producto', fr: 'Plan de test personnalisé pour votre produit', ja: '製品に合わせたパーソナライズされたテスト計画', ko: '제품에 맞춘 개인화된 테스트 계획' },
    'assess.sidebar.get2': { en: 'Clear cost estimate — no hidden fees', ar: 'تقدير واضح للتكلفة — بدون رسوم خفية', zh: '清晰的费用估算——无隐藏收费', nl: 'Duidelijke kostenraming — geen verborgen kosten', it: 'Preventivo chiaro — nessun costo nascosto', de: 'Klare Kostenschätzung — keine versteckten Gebühren', es: 'Presupuesto claro — sin costos ocultos', fr: 'Estimation claire — pas de frais cachés', ja: '明確なコスト見積もり — 隠れた料金なし', ko: '명확한 비용 견적 — 숨겨진 수수료 없음' },
    'assess.sidebar.get3': { en: 'Timeline and expected deliverables', ar: 'الجدول الزمني والتسليمات المتوقعة', zh: '时间线和预期交付物', nl: 'Tijdlijn en verwachte deliverables', it: 'Tempistiche e deliverable attesi', de: 'Zeitplan und erwartete Ergebnisse', es: 'Cronograma y entregables esperados', fr: 'Calendrier et livrables attendus', ja: 'タイムラインと予想される成果物', ko: '타임라인과 예상 산출물' },
    'assess.sidebar.get4': { en: 'Sample dashboard walkthrough', ar: 'جولة تعريفية في لوحة التحكم', zh: '示例仪表板演示', nl: 'Voorbeeld dashboard-demonstratie', it: 'Dimostrazione della dashboard', de: 'Beispiel-Dashboard-Vorstellung', es: 'Demostración del panel de ejemplo', fr: 'Démonstration du tableau de bord', ja: 'サンプルダッシュボードのウォークスルー', ko: '샘플 대시보드 둘러보기' },
    'assess.sidebar.get5': { en: 'Expert advice on study design', ar: 'نصائح خبراء في تصميم الدراسة', zh: '研究设计专家建议', nl: 'Deskundig advies over studieontwerp', it: 'Consulenza esperta sulla progettazione dello studio', de: 'Expertenberatung zum Studiendesign', es: 'Asesoramiento experto en diseño de estudio', fr: "Conseils d'experts en conception d'étude", ja: '研究設計に関する専門家のアドバイス', ko: '연구 설계에 대한 전문가 조언' },
    'assess.sidebar.next': { en: 'What happens next', ar: 'ما يحدث بعد ذلك', zh: '接下来会发生什么', nl: 'Wat er daarna gebeurt', it: 'Cosa succede dopo', de: 'Was als Nächstes passiert', es: 'Qué sucede después', fr: 'Et ensuite', ja: '次のステップ', ko: '다음 단계' },
    'assess.sidebar.next1': { en: 'Book a 30-min intro call at a time that suits you', ar: 'احجز مكالمة تعريفية مدتها 30 دقيقة في وقت يناسبك', zh: '在您方便的时间预约30分钟介绍电话', nl: 'Boek een kennismakingsgesprek van 30 minuten op een moment dat u uitkomt', it: 'Prenota una chiamata introduttiva di 30 minuti quando preferisci', de: 'Buchen Sie ein 30-Min-Kennenlerngespräch zu einem Zeitpunkt, der Ihnen passt', es: 'Reserva una llamada introductoria de 30 min a tu conveniencia', fr: 'Réservez un appel découverte de 30 min au moment qui vous convient', ja: 'ご都合の良い時間に30分のイントロコールを予約', ko: '편한 시간에 30분 소개 전화 예약' },
    'assess.sidebar.next2': { en: 'We discuss your product and goals', ar: 'نناقش منتجك وأهدافك', zh: '我们讨论您的产品和目标', nl: 'We bespreken uw product en doelen', it: 'Discutiamo del tuo prodotto e dei tuoi obiettivi', de: 'Wir besprechen Ihr Produkt und Ihre Ziele', es: 'Hablamos de tu producto y objetivos', fr: 'Nous discutons de votre produit et vos objectifs', ja: '製品と目標について話し合います', ko: '제품과 목표에 대해 논의합니다' },
    'assess.sidebar.next3': { en: 'You receive a tailored proposal within 2 business days', ar: 'تتلقى اقتراحًا مخصصًا خلال يومي عمل', zh: '您将在2个工作日内收到定制方案', nl: 'U ontvangt binnen 2 werkdagen een voorstel op maat', it: 'Ricevi una proposta su misura entro 2 giorni lavorativi', de: 'Sie erhalten innerhalb von 2 Werktagen ein maßgeschneidertes Angebot', es: 'Recibes una propuesta personalizada en 2 días hábiles', fr: 'Vous recevez une proposition sur mesure sous 2 jours ouvrés', ja: '2営業日以内にカスタマイズされた提案を受け取ります', ko: '2영업일 이내에 맞춤 제안서를 받습니다' },
    'assess.sidebar.next4': { en: 'Results in your Eatpol Studio dashboard in 2 weeks', ar: 'النتائج في لوحة تحكم Eatpol Studio خلال أسبوعين', zh: '2周内在Eatpol Studio仪表板中查看结果', nl: 'Resultaten in uw Eatpol Studio dashboard in 2 weken', it: 'Risultati nella dashboard Eatpol Studio in 2 settimane', de: 'Ergebnisse in Ihrem Eatpol Studio Dashboard in 2 Wochen', es: 'Resultados en tu panel de Eatpol Studio en 2 semanas', fr: 'Résultats dans votre tableau de bord Eatpol Studio en 2 semaines', ja: '2週間でEatpol Studioダッシュボードに結果', ko: '2주 만에 Eatpol Studio 대시보드에 결과' },
    'assess.sidebar.safe': { en: 'Your data is safe', ar: 'بياناتك آمنة', zh: '您的数据安全', nl: 'Uw gegevens zijn veilig', it: 'I tuoi dati sono al sicuro', de: 'Ihre Daten sind sicher', es: 'Tus datos están seguros', fr: 'Vos données sont en sécurité', ja: 'データは安全です', ko: '데이터는 안전합니다' },
    'assess.sidebar.safe1': { en: 'GDPR compliant', ar: 'متوافق مع GDPR', zh: '符合GDPR', nl: 'AVG-conform', it: 'Conforme al GDPR', de: 'DSGVO-konform', es: 'Cumple con RGPD', fr: 'Conforme RGPD', ja: 'GDPR準拠', ko: 'GDPR 준수' },
    'assess.sidebar.safe2': { en: 'No spam, ever', ar: 'بدون رسائل مزعجة أبدًا', zh: '绝不发送垃圾邮件', nl: 'Nooit spam', it: 'Mai spam', de: 'Kein Spam, niemals', es: 'Sin spam, nunca', fr: 'Jamais de spam', ja: 'スパムは一切送りません', ko: '스팸은 절대 보내지 않습니다' },
    'assess.sidebar.safe3': { en: 'Information used only to prepare your proposal', ar: 'المعلومات تُستخدم فقط لإعداد اقتراحك', zh: '信息仅用于准备您的方案', nl: 'Informatie alleen gebruikt om uw voorstel voor te bereiden', it: 'Informazioni utilizzate solo per preparare la tua proposta', de: 'Informationen nur zur Vorbereitung Ihres Angebots verwendet', es: 'Información utilizada solo para preparar tu propuesta', fr: 'Informations utilisées uniquement pour préparer votre proposition', ja: '情報は提案書の準備にのみ使用されます', ko: '정보는 제안서 준비에만 사용됩니다' },

    // ── Solutions Page ──
    'solutions.hero.overline': { en: 'Our Solutions', nl: 'Onze Oplossingen', de: 'Unsere Lösungen', it: 'Le Nostre Soluzioni', fr: 'Nos Solutions', ar: 'حلولنا', zh: '我们的解决方案', es: 'Nuestras Soluciones', ja: '私たちのソリューション', ko: '우리의 솔루션' },
    'solutions.hero.title': { en: 'Listen. Observe. Analyze.', nl: 'Luisteren. Observeren. Analyseren.', de: 'Zuhören. Beobachten. Analysieren.', it: 'Ascoltare. Osservare. Analizzare.', fr: 'Écouter. Observer. Analyser.', ar: 'استمع. لاحظ. حلّل.', zh: '倾听。观察。分析。', es: 'Escuchar. Observar. Analizar.', ja: '聴く。観察する。分析する。', ko: '듣다. 관찰하다. 분석하다.' },
    'solutions.hero.sub': { en: 'Three products that give you the full picture of how consumers experience your food product &mdash; from first impression to last bite.', nl: 'Drie producten die u het volledige beeld geven van hoe consumenten uw voedingsproduct ervaren &mdash; van eerste indruk tot laatste hap.', de: 'Drei Produkte, die Ihnen das vollständige Bild davon geben, wie Verbraucher Ihr Lebensmittelprodukt erleben &mdash; vom ersten Eindruck bis zum letzten Bissen.', it: 'Tre prodotti che vi offrono il quadro completo di come i consumatori vivono il vostro prodotto alimentare &mdash; dalla prima impressione all\'ultimo morso.', fr: 'Trois produits qui vous donnent une vision complète de la façon dont les consommateurs vivent votre produit alimentaire &mdash; de la première impression à la dernière bouchée.', ar: 'ثلاثة منتجات تمنحك الصورة الكاملة لكيفية تجربة المستهلكين لمنتجك الغذائي &mdash; من الانطباع الأول إلى آخر لقمة.', zh: '三款产品为您呈现消费者体验您食品的完整画面 &mdash; 从第一印象到最后一口。', es: 'Tres productos que le dan la imagen completa de cómo los consumidores experimentan su producto alimentario &mdash; desde la primera impresión hasta el último bocado.', ja: '消費者があなたの食品をどう体験するかの全体像を提供する3つの製品 &mdash; 第一印象から最後の一口まで。', ko: '소비자가 귀사의 식품을 어떻게 경험하는지 전체 그림을 보여주는 세 가지 제품 &mdash; 첫인상부터 마지막 한 입까지.' },
    'solutions.hero.cta1': { en: 'Get Your Free Assessment', nl: 'Ontvang Uw Gratis Analyse', de: 'Kostenlose Analyse Anfordern', it: 'Ottieni la Tua Analisi Gratuita', fr: 'Obtenez Votre Analyse Gratuite', ar: 'احصل على تقييمك المجاني', zh: '获取免费评估', es: 'Obtenga Su Evaluación Gratuita', ja: '無料アセスメントを受ける', ko: '무료 평가 받기' },
    'solutions.hero.cta2': { en: 'Explore the products', nl: 'Ontdek de producten', de: 'Produkte entdecken', it: 'Esplora i prodotti', fr: 'Découvrir les produits', ar: 'استكشف المنتجات', zh: '探索产品', es: 'Explorar los productos', ja: '製品を探索する', ko: '제품 살펴보기' },
    'solutions.nav.studio': { en: 'Eatpol Studio', nl: 'Eatpol Studio', de: 'Eatpol Studio', it: 'Eatpol Studio', fr: 'Eatpol Studio', ar: 'Eatpol Studio', zh: 'Eatpol Studio', es: 'Eatpol Studio', ja: 'Eatpol Studio', ko: 'Eatpol Studio' },
    'solutions.banner': { en: 'Free Assessment', nl: 'Gratis Analyse', de: 'Kostenlose Analyse', it: 'Analisi Gratuita', fr: 'Analyse Gratuite', ar: 'تقييم مجاني', zh: '免费评估', es: 'Evaluación Gratuita', ja: '無料アセスメント', ko: '무료 평가' },

    // Vox section
    'solutions.vox.title': { en: 'Hear what consumers <em>really</em> think', nl: 'Hoor wat consumenten <em>echt</em> denken', de: 'Erfahren Sie, was Verbraucher <em>wirklich</em> denken', it: 'Scopri cosa pensano <em>davvero</em> i consumatori', fr: 'Découvrez ce que les consommateurs pensent <em>vraiment</em>', ar: 'اسمع ما يفكر به المستهلكون <em>حقًا</em>', zh: '听听消费者<em>真正</em>的想法', es: 'Escuche lo que los consumidores <em>realmente</em> piensan', ja: '消費者が<em>本当に</em>思っていることを聞く', ko: '소비자가 <em>정말로</em> 생각하는 것을 들어보세요' },
    'solutions.vox.sub': { en: 'AI-moderated video interviews that capture beliefs, expectations, and purchase intent &mdash; before your product ever reaches the shelf.', nl: 'AI-gemodereerde video-interviews die overtuigingen, verwachtingen en koopintentie vastleggen &mdash; voordat uw product in de winkel ligt.', de: 'KI-moderierte Videointerviews, die Überzeugungen, Erwartungen und Kaufabsichten erfassen &mdash; bevor Ihr Produkt ins Regal kommt.', it: 'Interviste video moderate dall\'IA che catturano convinzioni, aspettative e intenzione d\'acquisto &mdash; prima che il vostro prodotto arrivi sullo scaffale.', fr: 'Des entretiens vidéo modérés par l\'IA qui capturent les croyances, les attentes et l\'intention d\'achat &mdash; avant que votre produit n\'arrive en rayon.', ar: 'مقابلات فيديو يديرها الذكاء الاصطناعي تلتقط المعتقدات والتوقعات ونية الشراء &mdash; قبل أن يصل منتجك إلى الرف.', zh: 'AI主持的视频访谈，捕捉信念、期望和购买意向 &mdash; 在您的产品上架之前。', es: 'Entrevistas en video moderadas por IA que capturan creencias, expectativas e intención de compra &mdash; antes de que su producto llegue al estante.', ja: '信念、期待、購買意向を捉えるAIモデレーション付きビデオインタビュー &mdash; 製品が棚に並ぶ前に。', ko: '신념, 기대, 구매 의향을 포착하는 AI 진행 비디오 인터뷰 &mdash; 제품이 매대에 오르기 전에.' },
    'solutions.vox.label1': { en: 'Live demo', nl: 'Live demo', de: 'Live-Demo', it: 'Demo dal vivo', fr: 'Démo en direct', ar: 'عرض مباشر', zh: '实时演示', es: 'Demo en vivo', ja: 'ライブデモ', ko: '라이브 데모' },
    'solutions.vox.row1.title': { en: 'AI-powered conversations at scale', nl: 'AI-gestuurde gesprekken op schaal', de: 'KI-gestützte Gespräche in großem Maßstab', it: 'Conversazioni basate sull\'IA su larga scala', fr: 'Conversations alimentées par l\'IA à grande échelle', ar: 'محادثات مدعومة بالذكاء الاصطناعي على نطاق واسع', zh: 'AI驱动的大规模对话', es: 'Conversaciones impulsadas por IA a escala', ja: 'AI対話を大規模に', ko: 'AI 기반 대규모 대화' },
    'solutions.vox.row1.p1': { en: 'Vox conducts in-depth consumer interviews using an AI moderator that adapts in real time. No scheduling hassles, no interviewer bias &mdash; just honest, natural conversations.', nl: 'Vox voert diepgaande consumenteninterviews uit met een AI-moderator die zich in realtime aanpast. Geen planningsproblemen, geen interviewer-bias &mdash; gewoon eerlijke, natuurlijke gesprekken.', de: 'Vox führt eingehende Verbraucherinterviews mit einem KI-Moderator durch, der sich in Echtzeit anpasst. Keine Terminprobleme, keine Interviewer-Voreingenommenheit &mdash; nur ehrliche, natürliche Gespräche.', it: 'Vox conduce interviste approfondite con i consumatori utilizzando un moderatore IA che si adatta in tempo reale. Nessun problema di pianificazione, nessun pregiudizio dell\'intervistatore &mdash; solo conversazioni oneste e naturali.', fr: 'Vox mène des entretiens approfondis avec les consommateurs grâce à un modérateur IA qui s\'adapte en temps réel. Pas de complications de planification, pas de biais d\'intervieweur &mdash; juste des conversations honnêtes et naturelles.', ar: 'يجري Vox مقابلات معمقة مع المستهلكين باستخدام مشرف ذكاء اصطناعي يتكيف في الوقت الفعلي. لا متاعب جدولة، لا تحيز من المحاور &mdash; فقط محادثات صادقة وطبيعية.', zh: 'Vox使用能够实时适应的AI主持人进行深入的消费者访谈。无需费力安排日程，没有访谈者偏见 &mdash; 只有诚实、自然的对话。', es: 'Vox realiza entrevistas en profundidad con consumidores usando un moderador de IA que se adapta en tiempo real. Sin complicaciones de programación, sin sesgo del entrevistador &mdash; solo conversaciones honestas y naturales.', ja: 'VoxはAIモデレーターを使用して詳細な消費者インタビューを実施し、リアルタイムで適応します。', ko: 'Vox는 AI 사회자를 사용하여 심층 소비자 인터뷰를 실시하며 실시간으로 적응합니다.' },
    'solutions.vox.row1.p2': { en: 'Consumers answer from home, on their own time. Results are automatically transcribed, analyzed, and themed for your dashboard.', nl: 'Consumenten antwoorden vanuit huis, op hun eigen moment. Resultaten worden automatisch getranscribeerd, geanalyseerd en gethematiseerd voor uw dashboard.', de: 'Verbraucher antworten von zu Hause aus, zu ihrer eigenen Zeit. Ergebnisse werden automatisch transkribiert, analysiert und thematisch für Ihr Dashboard aufbereitet.', it: 'I consumatori rispondono da casa, quando vogliono. I risultati vengono automaticamente trascritti, analizzati e organizzati per tema nella vostra dashboard.', fr: 'Les consommateurs répondent de chez eux, à leur rythme. Les résultats sont automatiquement transcrits, analysés et thématisés pour votre tableau de bord.', ar: 'يجيب المستهلكون من المنزل، في وقتهم الخاص. يتم نسخ النتائج وتحليلها وتنظيمها تلقائيًا للوحة التحكم الخاصة بك.', zh: '消费者在家中按自己的时间回答。结果会自动转录、分析并按主题整理到您的仪表板。', es: 'Los consumidores responden desde casa, a su propio ritmo. Los resultados se transcriben, analizan y organizan temáticamente de forma automática para su panel.', ja: '消費者は自宅から、自分の都合の良い時間に回答。結果は自動的に文字起こしされ分析されます。', ko: '소비자는 집에서 편한 시간에 답변합니다. 결과는 자동으로 전사되고 분석됩니다.' },
    'solutions.vox.chip1': { en: 'Purchase drivers', nl: 'Aankoopmotieven', de: 'Kauftreiber', it: 'Fattori d\'acquisto', fr: 'Facteurs d\'achat', ar: 'محركات الشراء', zh: '购买驱动因素', es: 'Factores de compra', ja: '購入ドライバー', ko: '구매 요인' },
    'solutions.vox.chip2': { en: 'Brand perception', nl: 'Merkperceptie', de: 'Markenwahrnehmung', it: 'Percezione del marchio', fr: 'Perception de marque', ar: 'إدراك العلامة التجارية', zh: '品牌认知', es: 'Percepción de marca', ja: 'ブランド認知', ko: '브랜드 인식' },
    'solutions.vox.chip3': { en: 'Expectation mapping', nl: 'Verwachtingen in kaart', de: 'Erwartungsmapping', it: 'Mappatura delle aspettative', fr: 'Cartographie des attentes', ar: 'تحليل التوقعات', zh: '期望映射', es: 'Mapeo de expectativas', ja: '期待マッピング', ko: '기대 매핑' },
    'solutions.vox.chip4': { en: 'Competitor benchmarking', nl: 'Concurrentievergelijking', de: 'Wettbewerbsanalyse', it: 'Benchmarking competitivo', fr: 'Benchmarking concurrentiel', ar: 'مقارنة المنافسين', zh: '竞争对手基准分析', es: 'Benchmarking competitivo', ja: '競合ベンチマーキング', ko: '경쟁 벤치마킹' },
    'solutions.vox.chip5': { en: 'Consumer language', nl: 'Consumententaal', de: 'Verbrauchersprache', it: 'Linguaggio dei consumatori', fr: 'Langage consommateur', ar: 'لغة المستهلك', zh: '消费者语言', es: 'Lenguaje del consumidor', ja: '消費者言語', ko: '소비자 언어' },
    'solutions.vox.chip6': { en: 'Results in 2 days', nl: 'Resultaten in 2 dagen', de: 'Ergebnisse in 2 Tagen', it: 'Risultati in 2 giorni', fr: 'Résultats en 2 jours', ar: 'نتائج خلال يومين', zh: '2天内出结果', es: 'Resultados en 2 días', ja: '2日で結果', ko: '2일 만에 결과' },
    'solutions.vox.label2': { en: 'Consumer interview', nl: 'Consumenteninterview', de: 'Verbraucherinterview', it: 'Intervista al consumatore', fr: 'Entretien consommateur', ar: 'مقابلة المستهلك', zh: '消费者访谈', es: 'Entrevista al consumidor', ja: '消費者インタビュー', ko: '소비자 인터뷰' },
    'solutions.vox.row2.title': { en: 'Understand the "why" behind purchase decisions', nl: 'Begrijp het "waarom" achter aankoopbeslissingen', de: 'Verstehen Sie das "Warum" hinter Kaufentscheidungen', it: 'Comprendete il "perché" dietro le decisioni d\'acquisto', fr: 'Comprenez le "pourquoi" derrière les décisions d\'achat', ar: 'افهم "لماذا" وراء قرارات الشراء', zh: '了解购买决策背后的"为什么"', es: 'Comprenda el "por qué" detrás de las decisiones de compra', ja: '「なぜ」を理解する', ko: '"왜"를 이해하기' },
    'solutions.vox.row2.p1': { en: 'Traditional surveys tell you <em>what</em> consumers rate. Vox tells you <em>why</em> they buy, what they expect, and what language they use to describe your product to others.', nl: 'Traditionele enquêtes vertellen u <em>wat</em> consumenten beoordelen. Vox vertelt u <em>waarom</em> ze kopen, wat ze verwachten en welke taal ze gebruiken om uw product aan anderen te beschrijven.', de: 'Traditionelle Umfragen sagen Ihnen, <em>was</em> Verbraucher bewerten. Vox sagt Ihnen, <em>warum</em> sie kaufen, was sie erwarten und welche Sprache sie verwenden, um Ihr Produkt anderen zu beschreiben.', it: 'I sondaggi tradizionali vi dicono <em>cosa</em> valutano i consumatori. Vox vi dice <em>perché</em> comprano, cosa si aspettano e quale linguaggio usano per descrivere il vostro prodotto ad altri.', fr: 'Les enquêtes traditionnelles vous disent <em>ce que</em> les consommateurs évaluent. Vox vous dit <em>pourquoi</em> ils achètent, ce qu\'ils attendent et quel langage ils utilisent pour décrire votre produit aux autres.', ar: 'تخبرك الاستطلاعات التقليدية <em>بماذا</em> يقيّم المستهلكون. يخبرك Vox <em>لماذا</em> يشترون، وما يتوقعونه، وأي لغة يستخدمونها لوصف منتجك للآخرين.', zh: '传统问卷告诉您消费者<em>给什么</em>评分。Vox告诉您他们<em>为什么</em>购买、期望什么，以及他们用什么语言向他人描述您的产品。', es: 'Las encuestas tradicionales le dicen <em>qué</em> califican los consumidores. Vox le dice <em>por qué</em> compran, qué esperan y qué lenguaje usan para describir su producto a otros.', ja: '従来のアンケートは消費者が何を評価するかを教えてくれます。Voxは<em>なぜ</em>を教えてくれます。', ko: '기존 설문조사는 소비자가 무엇을 평가하는지 알려줍니다. Vox는 <em>왜</em>를 알려줍니다.' },
    'solutions.vox.row2.p2': { en: 'Use these insights to sharpen positioning, validate claims, and build messaging that resonates with your target audience.', nl: 'Gebruik deze inzichten om uw positionering aan te scherpen, claims te valideren en boodschappen op te bouwen die resoneren bij uw doelgroep.', de: 'Nutzen Sie diese Erkenntnisse, um die Positionierung zu schärfen, Aussagen zu validieren und Botschaften zu entwickeln, die bei Ihrer Zielgruppe ankommen.', it: 'Utilizzate questi insight per affinare il posizionamento, validare le affermazioni e costruire messaggi che risuonano con il vostro pubblico target.', fr: 'Utilisez ces insights pour affiner le positionnement, valider les arguments et construire des messages qui résonnent avec votre public cible.', ar: 'استخدم هذه الرؤى لصقل التموضع، والتحقق من الادعاءات، وبناء رسائل تلقى صدى لدى جمهورك المستهدف.', zh: '利用这些洞察来优化定位、验证宣传主张，并构建能引起目标受众共鸣的信息。', es: 'Utilice estos conocimientos para afinar el posicionamiento, validar afirmaciones y construir mensajes que resuenen con su público objetivo.', ja: 'これらのインサイトを使って、ポジショニングを研ぎ澄まし、クレームを検証し、響くメッセージングを構築しましょう。', ko: '이러한 인사이트를 활용하여 포지셔닝을 강화하고 주장을 검증하며 공감하는 메시지를 구축하세요.' },
    'solutions.vox.chip7': { en: 'First impressions', nl: 'Eerste indrukken', de: 'Erste Eindrücke', it: 'Prime impressioni', fr: 'Premières impressions', ar: 'الانطباعات الأولى', zh: '第一印象', es: 'Primeras impresiones', ja: '第一印象', ko: '첫인상' },
    'solutions.vox.chip8': { en: 'Usage occasions', nl: 'Gebruiksmomenten', de: 'Verwendungsanlässe', it: 'Occasioni d\'uso', fr: 'Occasions d\'utilisation', ar: 'مناسبات الاستخدام', zh: '使用场景', es: 'Ocasiones de uso', ja: '使用シーン', ko: '사용 상황' },
    'solutions.vox.chip9': { en: 'Price sensitivity', nl: 'Prijsgevoeligheid', de: 'Preissensibilität', it: 'Sensibilità al prezzo', fr: 'Sensibilité au prix', ar: 'حساسية السعر', zh: '价格敏感度', es: 'Sensibilidad al precio', ja: '価格感度', ko: '가격 민감도' },
    'solutions.vox.chip10': { en: 'Packaging feedback', nl: 'Verpakkingsfeedback', de: 'Verpackungsfeedback', it: 'Feedback sul packaging', fr: 'Retour sur l\'emballage', ar: 'ملاحظات التغليف', zh: '包装反馈', es: 'Retroalimentación del empaque', ja: 'パッケージフィードバック', ko: '포장 피드백' },

    // Domus section
    'solutions.domus.title': { en: 'See how consumers <em>actually</em> use your product', nl: 'Zie hoe consumenten uw product <em>daadwerkelijk</em> gebruiken', de: 'Sehen Sie, wie Verbraucher Ihr Produkt <em>tatsächlich</em> verwenden', it: 'Scoprite come i consumatori usano <em>davvero</em> il vostro prodotto', fr: 'Voyez comment les consommateurs utilisent <em>réellement</em> votre produit', ar: 'شاهد كيف يستخدم المستهلكون منتجك <em>فعليًا</em>', zh: '看看消费者<em>实际</em>如何使用您的产品', es: 'Vea cómo los consumidores usan <em>realmente</em> su producto', ja: '消費者が<em>実際に</em>製品をどう使うかを見る', ko: '소비자가 제품을 <em>실제로</em> 어떻게 사용하는지 확인하세요' },
    'solutions.domus.sub': { en: 'Video-captured in-home testing with detailed action analysis, audio transcription, and sentiment tracking &mdash; in real kitchens with real people.', nl: 'Op video vastgelegde thuistests met gedetailleerde actieanalyse, audiotranscriptie en sentimenttracking &mdash; in echte keukens met echte mensen.', de: 'Videoaufgezeichnete In-Home-Tests mit detaillierter Aktionsanalyse, Audiotranskription und Stimmungsverfolgung &mdash; in echten Küchen mit echten Menschen.', it: 'Test a domicilio filmati con analisi dettagliata delle azioni, trascrizione audio e monitoraggio del sentiment &mdash; in cucine vere con persone vere.', fr: 'Tests à domicile filmés avec analyse détaillée des actions, transcription audio et suivi du sentiment &mdash; dans de vraies cuisines avec de vraies personnes.', ar: 'اختبارات منزلية مصورة بالفيديو مع تحليل مفصل للإجراءات ونسخ صوتي وتتبع المشاعر &mdash; في مطابخ حقيقية مع أشخاص حقيقيين.', zh: '视频记录的居家测试，包含详细的动作分析、音频转录和情感追踪 &mdash; 在真实厨房中与真实的人一起。', es: 'Pruebas en el hogar grabadas en video con análisis detallado de acciones, transcripción de audio y seguimiento de sentimiento &mdash; en cocinas reales con personas reales.', ja: '詳細なアクション分析、音声文字起こし、感情検出を備えたビデオキャプチャ在宅テスト。', ko: '상세한 행동 분석, 음성 전사, 감정 감지를 갖춘 비디오 캡처 가정 내 테스트.' },
    'solutions.domus.label1': { en: 'In-home test', nl: 'Thuistest', de: 'In-Home-Test', it: 'Test a domicilio', fr: 'Test à domicile', ar: 'اختبار منزلي', zh: '居家测试', es: 'Prueba en el hogar', ja: '在宅テスト', ko: '가정 내 테스트' },
    'solutions.domus.row1.title': { en: 'Real kitchens. Real behavior. Real insights.', nl: 'Echte keukens. Echt gedrag. Echte inzichten.', de: 'Echte Küchen. Echtes Verhalten. Echte Erkenntnisse.', it: 'Cucine vere. Comportamenti reali. Insight reali.', fr: 'De vraies cuisines. Un vrai comportement. De vrais insights.', ar: 'مطابخ حقيقية. سلوك حقيقي. رؤى حقيقية.', zh: '真实厨房。真实行为。真实洞察。', es: 'Cocinas reales. Comportamiento real. Insights reales.', ja: '本物のキッチン。本物の行動。本物のインサイト。', ko: '진짜 주방. 진짜 행동. 진짜 인사이트.' },
    'solutions.domus.row1.p1': { en: 'Domus captures the full product journey on video: how consumers prepare, cook, eat, and store your product at home. Our AI generates detailed step-by-step action descriptions, transcribes audio, and analyzes sentiment.', nl: 'Domus legt de volledige productreis vast op video: hoe consumenten uw product thuis bereiden, koken, eten en bewaren. Onze AI genereert gedetailleerde stapsgewijze actiebeschrijvingen, transcribeert audio en analyseert sentiment.', de: 'Domus erfasst die gesamte Produktreise auf Video: wie Verbraucher Ihr Produkt zu Hause zubereiten, kochen, essen und lagern. Unsere KI generiert detaillierte schrittweise Aktionsbeschreibungen, transkribiert Audio und analysiert die Stimmung.', it: 'Domus cattura l\'intero percorso del prodotto in video: come i consumatori preparano, cucinano, mangiano e conservano il vostro prodotto a casa. La nostra IA genera descrizioni dettagliate passo per passo delle azioni, trascrive l\'audio e analizza il sentiment.', fr: 'Domus capture tout le parcours produit en vidéo : comment les consommateurs préparent, cuisinent, mangent et conservent votre produit chez eux. Notre IA génère des descriptions détaillées étape par étape, transcrit l\'audio et analyse le sentiment.', ar: 'يلتقط Domus رحلة المنتج الكاملة بالفيديو: كيف يحضّر المستهلكون منتجك ويطبخونه ويأكلونه ويخزنونه في المنزل. يولّد ذكاؤنا الاصطناعي وصفًا مفصلاً خطوة بخطوة للإجراءات، وينسخ الصوت، ويحلل المشاعر.', zh: 'Domus通过视频捕捉完整的产品使用过程：消费者如何在家中准备、烹饪、食用和储存您的产品。我们的AI生成详细的逐步动作描述，转录音频并分析情感。', es: 'Domus captura en video el recorrido completo del producto: cómo los consumidores preparan, cocinan, comen y almacenan su producto en casa. Nuestra IA genera descripciones detalladas paso a paso, transcribe el audio y analiza el sentimiento.', ja: 'Domusは製品の全行程をビデオで記録：消費者がどう準備し、調理し、食べ、保存するか。', ko: 'Domus는 제품의 전체 여정을 비디오로 캡처합니다: 소비자가 어떻게 준비하고, 요리하고, 먹고, 보관하는지.' },
    'solutions.domus.row1.p2': { en: 'No sensory booths. No artificial settings. Just authentic consumer behavior in the environment where food decisions actually happen.', nl: 'Geen sensorische cabines. Geen kunstmatige omgevingen. Gewoon authentiek consumentengedrag in de omgeving waar voedingsbeslissingen echt worden genomen.', de: 'Keine Sensorikkabinen. Keine künstlichen Umgebungen. Nur authentisches Verbraucherverhalten in der Umgebung, in der Lebensmittelentscheidungen wirklich getroffen werden.', it: 'Niente cabine sensoriali. Niente ambienti artificiali. Solo comportamento autentico dei consumatori nell\'ambiente in cui le decisioni alimentari avvengono davvero.', fr: 'Pas de cabines sensorielles. Pas de cadres artificiels. Juste le comportement authentique des consommateurs dans l\'environnement où les décisions alimentaires se prennent vraiment.', ar: 'لا أكشاك حسية. لا إعدادات مصطنعة. فقط سلوك المستهلك الأصيل في البيئة التي تُتخذ فيها قرارات الطعام فعليًا.', zh: '没有感官测试间。没有人造环境。只有消费者在真正做出食品决策的环境中的真实行为。', es: 'Sin cabinas sensoriales. Sin entornos artificiales. Solo comportamiento auténtico del consumidor en el entorno donde realmente se toman las decisiones alimentarias.', ja: '感覚ブースなし。人工的な設定なし。最も重要な場所での本物の消費者行動だけ。', ko: '감각 부스 없음. 인위적인 환경 없음. 가장 중요한 곳에서의 진정한 소비자 행동만.' },
    'solutions.domus.chip1': { en: 'Step-by-step action analysis', nl: 'Stapsgewijze actieanalyse', de: 'Schritt-für-Schritt-Aktionsanalyse', it: 'Analisi delle azioni passo per passo', fr: 'Analyse des actions étape par étape', ar: 'تحليل الإجراءات خطوة بخطوة', zh: '逐步动作分析', es: 'Análisis de acciones paso a paso', ja: 'ステップバイステップのアクション分析', ko: '단계별 동작 분석' },
    'solutions.domus.chip2': { en: 'Audio transcription', nl: 'Audiotranscriptie', de: 'Audiotranskription', it: 'Trascrizione audio', fr: 'Transcription audio', ar: 'نسخ صوتي', zh: '音频转录', es: 'Transcripción de audio', ja: '音声文字起こし', ko: '오디오 전사' },
    'solutions.domus.chip3': { en: 'Sentiment analysis', nl: 'Sentimentanalyse', de: 'Stimmungsanalyse', it: 'Analisi del sentiment', fr: 'Analyse du sentiment', ar: 'تحليل المشاعر', zh: '情感分析', es: 'Análisis de sentimiento', ja: '感情分析', ko: '감정 분석' },
    'solutions.domus.label2': { en: 'Consumer test', nl: 'Consumententest', de: 'Verbrauchertest', it: 'Test consumatore', fr: 'Test consommateur', ar: 'اختبار المستهلك', zh: '消费者测试', es: 'Prueba del consumidor', ja: '消費者テスト', ko: '소비자 테스트' },
    'solutions.domus.row2.title': { en: 'Uncover friction points surveys miss', nl: 'Ontdek knelpunten die enquêtes missen', de: 'Entdecken Sie Reibungspunkte, die Umfragen übersehen', it: 'Scoprite i punti di attrito che i sondaggi non colgono', fr: 'Découvrez les points de friction que les enquêtes manquent', ar: 'اكتشف نقاط الاحتكاك التي تفوتها الاستطلاعات', zh: '发现问卷调查遗漏的摩擦点', es: 'Descubra puntos de fricción que las encuestas no detectan', ja: 'アンケートが見落とす摩擦ポイントを発見', ko: '설문조사가 놓치는 마찰 포인트 발견' },
    'solutions.domus.row2.p1': { en: 'See exactly where consumers hesitate, improvise, or struggle. Domus reveals the gap between how you designed your product and how people actually use it &mdash; from packaging to plating.', nl: 'Zie precies waar consumenten aarzelen, improviseren of worstelen. Domus onthult de kloof tussen hoe u uw product heeft ontworpen en hoe mensen het daadwerkelijk gebruiken &mdash; van verpakking tot presentatie.', de: 'Sehen Sie genau, wo Verbraucher zögern, improvisieren oder Schwierigkeiten haben. Domus zeigt die Lücke zwischen dem, wie Sie Ihr Produkt entworfen haben, und wie Menschen es tatsächlich nutzen &mdash; von der Verpackung bis zum Anrichten.', it: 'Vedete esattamente dove i consumatori esitano, improvvisano o hanno difficoltà. Domus rivela il divario tra come avete progettato il vostro prodotto e come le persone lo usano realmente &mdash; dal packaging all\'impiattamento.', fr: 'Voyez exactement où les consommateurs hésitent, improvisent ou peinent. Domus révèle l\'écart entre la façon dont vous avez conçu votre produit et la façon dont les gens l\'utilisent réellement &mdash; de l\'emballage au dressage.', ar: 'شاهد بالضبط أين يتردد المستهلكون أو يرتجلون أو يواجهون صعوبة. يكشف Domus الفجوة بين كيفية تصميمك لمنتجك وكيفية استخدام الناس له فعليًا &mdash; من التغليف إلى التقديم.', zh: '准确看到消费者在哪里犹豫、即兴发挥或遇到困难。Domus揭示了您产品设计方式与人们实际使用方式之间的差距 &mdash; 从包装到摆盘。', es: 'Vea exactamente dónde los consumidores dudan, improvisan o tienen dificultades. Domus revela la brecha entre cómo diseñó su producto y cómo las personas realmente lo usan &mdash; del empaque al emplatado.', ja: '消費者がどこでためらい、即興し、苦労するかを正確に把握。Domusはアンケートでは見えない隠れた洞察を明らかにします。', ko: '소비자가 어디서 망설이고, 즉흥적으로 행동하고, 어려움을 겪는지 정확히 파악하세요. Domus는 설문조사로는 보이지 않는 숨겨진 통찰을 드러냅니다.' },
    'solutions.domus.chip4': { en: 'Friction detection', nl: 'Frictiedetectie', de: 'Reibungserkennung', it: 'Rilevamento attriti', fr: 'Détection des frictions', ar: 'كشف نقاط الاحتكاك', zh: '摩擦点检测', es: 'Detección de fricción', ja: '摩擦検出', ko: '마찰 감지' },
    'solutions.domus.chip5': { en: 'Usage context', nl: 'Gebruikscontext', de: 'Nutzungskontext', it: 'Contesto d\'uso', fr: 'Contexte d\'utilisation', ar: 'سياق الاستخدام', zh: '使用场景', es: 'Contexto de uso', ja: '使用コンテキスト', ko: '사용 맥락' },
    'solutions.domus.chip6': { en: 'Results in 2 weeks', nl: 'Resultaten in 2 weken', de: 'Ergebnisse in 2 Wochen', it: 'Risultati in 2 settimane', fr: 'Résultats en 2 semaines', ar: 'نتائج خلال أسبوعين', zh: '2周内出结果', es: 'Resultados en 2 semanas', ja: '2週間で結果', ko: '2주 만에 결과' },

    // Studio section
    'solutions.studio.title': { en: 'Your results, one dashboard', nl: 'Uw resultaten, één dashboard', de: 'Ihre Ergebnisse, ein Dashboard', it: 'I vostri risultati, una dashboard', fr: 'Vos résultats, un seul tableau de bord', ar: 'نتائجك، لوحة تحكم واحدة', zh: '您的结果，一个仪表板', es: 'Sus resultados, un solo panel', ja: '結果をひとつのダッシュボードで', ko: '결과를 하나의 대시보드에서' },
    'solutions.studio.sub': { en: 'Eatpol Studio brings all your Vox and Domus data together in one place &mdash; with AI-powered analysis you can query in plain language.', nl: 'Eatpol Studio brengt al uw Vox- en Domus-data samen op één plek &mdash; met AI-gestuurde analyse die u in gewone taal kunt bevragen.', de: 'Eatpol Studio vereint alle Ihre Vox- und Domus-Daten an einem Ort &mdash; mit KI-gestützter Analyse, die Sie in einfacher Sprache abfragen können.', it: 'Eatpol Studio riunisce tutti i vostri dati Vox e Domus in un unico posto &mdash; con analisi basata sull\'IA che potete interrogare in linguaggio naturale.', fr: 'Eatpol Studio rassemble toutes vos données Vox et Domus en un seul endroit &mdash; avec une analyse alimentée par l\'IA que vous pouvez interroger en langage courant.', ar: 'يجمع Eatpol Studio جميع بيانات Vox وDomus في مكان واحد &mdash; مع تحليل مدعوم بالذكاء الاصطناعي يمكنك الاستعلام عنه بلغة بسيطة.', zh: 'Eatpol Studio将您所有的Vox和Domus数据汇集在一处 &mdash; 配有AI驱动的分析功能，您可以用自然语言进行查询。', es: 'Eatpol Studio reúne todos sus datos de Vox y Domus en un solo lugar &mdash; con análisis impulsado por IA que puede consultar en lenguaje natural.', ja: 'Eatpol StudioはVoxとDomusのデータを1か所にまとめ、AIパワーの分析ツールで装備しています。', ko: 'Eatpol Studio는 Vox와 Domus 데이터를 한 곳에 모아 AI 기반 분석 도구를 제공합니다.' },
    'solutions.studio.row1.title': { en: 'From raw data to clear decisions', nl: 'Van ruwe data naar heldere beslissingen', de: 'Von Rohdaten zu klaren Entscheidungen', it: 'Dai dati grezzi a decisioni chiare', fr: 'Des données brutes aux décisions claires', ar: 'من البيانات الخام إلى قرارات واضحة', zh: '从原始数据到清晰决策', es: 'De datos brutos a decisiones claras', ja: '生データから明確な意思決定へ', ko: '원시 데이터에서 명확한 의사결정으로' },
    'solutions.studio.row1.p1': { en: 'Every interview and in-home test feeds directly into your Studio dashboard. See transcripts, behavioral patterns, and AI-generated recommendations &mdash; all organized by product and study.', nl: 'Elk interview en elke thuistest komt rechtstreeks in uw Studio-dashboard terecht. Bekijk transcripties, gedragspatronen en AI-gegenereerde aanbevelingen &mdash; allemaal georganiseerd per product en studie.', de: 'Jedes Interview und jeder In-Home-Test fließt direkt in Ihr Studio-Dashboard ein. Sehen Sie Transkripte, Verhaltensmuster und KI-generierte Empfehlungen &mdash; alles nach Produkt und Studie organisiert.', it: 'Ogni intervista e test a domicilio confluisce direttamente nella vostra dashboard Studio. Visualizzate trascrizioni, pattern comportamentali e raccomandazioni generate dall\'IA &mdash; tutto organizzato per prodotto e studio.', fr: 'Chaque entretien et test à domicile alimente directement votre tableau de bord Studio. Consultez les transcriptions, les schémas comportementaux et les recommandations générées par l\'IA &mdash; le tout organisé par produit et étude.', ar: 'كل مقابلة واختبار منزلي يغذي مباشرة لوحة تحكم Studio الخاصة بك. شاهد النصوص وأنماط السلوك والتوصيات المولدة بالذكاء الاصطناعي &mdash; كلها منظمة حسب المنتج والدراسة.', zh: '每次访谈和居家测试都直接汇入您的Studio仪表板。查看转录、行为模式和AI生成的建议 &mdash; 全部按产品和研究组织。', es: 'Cada entrevista y prueba en el hogar se alimenta directamente en su panel de Studio. Vea transcripciones, patrones de comportamiento y recomendaciones generadas por IA &mdash; todo organizado por producto y estudio.', ja: 'すべてのインタビューと在宅テストがStudioダッシュボードに直接フィードされます。', ko: '모든 인터뷰와 가정 내 테스트가 Studio 대시보드에 직접 반영됩니다.' },
    'solutions.studio.row1.p2': { en: 'No more static PDF reports. Explore your data, filter by segment, and share findings with your team in real time.', nl: 'Geen statische PDF-rapporten meer. Verken uw data, filter op segment en deel bevindingen met uw team in realtime.', de: 'Keine statischen PDF-Berichte mehr. Erkunden Sie Ihre Daten, filtern Sie nach Segment und teilen Sie Erkenntnisse in Echtzeit mit Ihrem Team.', it: 'Basta con i report PDF statici. Esplorate i vostri dati, filtrate per segmento e condividete i risultati con il vostro team in tempo reale.', fr: 'Fini les rapports PDF statiques. Explorez vos données, filtrez par segment et partagez vos résultats avec votre équipe en temps réel.', ar: 'لا مزيد من تقارير PDF الثابتة. استكشف بياناتك، وقم بالتصفية حسب الشريحة، وشارك النتائج مع فريقك في الوقت الفعلي.', zh: '不再有静态PDF报告。探索您的数据，按细分市场筛选，并与团队实时共享发现。', es: 'Se acabaron los informes PDF estáticos. Explore sus datos, filtre por segmento y comparta hallazgos con su equipo en tiempo real.', ja: '静的なPDFレポートはもう不要。データを探索し、セグメントでフィルタリングし、発見を共有しましょう。', ko: '더 이상 정적 PDF 보고서는 필요 없습니다. 데이터를 탐색하고 세그먼트별로 필터링하고 발견 사항을 공유하세요.' },
    'solutions.studio.chip1': { en: 'Real-time results', nl: 'Realtime resultaten', de: 'Echtzeit-Ergebnisse', it: 'Risultati in tempo reale', fr: 'Résultats en temps réel', ar: 'نتائج في الوقت الفعلي', zh: '实时结果', es: 'Resultados en tiempo real', ja: 'リアルタイム結果', ko: '실시간 결과' },
    'solutions.studio.chip2': { en: 'Behavioral coding', nl: 'Gedragscodering', de: 'Verhaltenskodierung', it: 'Codifica comportamentale', fr: 'Codage comportemental', ar: 'ترميز سلوكي', zh: '行为编码', es: 'Codificación conductual', ja: '行動コーディング', ko: '행동 코딩' },
    'solutions.studio.chip3': { en: 'AI recommendations', nl: 'AI-aanbevelingen', de: 'KI-Empfehlungen', it: 'Raccomandazioni IA', fr: 'Recommandations IA', ar: 'توصيات الذكاء الاصطناعي', zh: 'AI建议', es: 'Recomendaciones de IA', ja: 'AI推奨', ko: 'AI 추천' },
    'solutions.studio.chip4': { en: 'Team sharing', nl: 'Team delen', de: 'Team-Sharing', it: 'Condivisione team', fr: 'Partage en équipe', ar: 'مشاركة الفريق', zh: '团队共享', es: 'Compartir en equipo', ja: 'チーム共有', ko: '팀 공유' },
    'solutions.studio.label': { en: 'Eatpol Studio', nl: 'Eatpol Studio', de: 'Eatpol Studio', it: 'Eatpol Studio', fr: 'Eatpol Studio', ar: 'Eatpol Studio', zh: 'Eatpol Studio', es: 'Eatpol Studio', ja: 'Eatpol Studio', ko: 'Eatpol Studio' },
    'solutions.studio.row2.title': { en: 'Ask your data anything', nl: 'Stel uw data elke vraag', de: 'Fragen Sie Ihre Daten alles', it: 'Chiedete qualsiasi cosa ai vostri dati', fr: 'Posez n\'importe quelle question à vos données', ar: 'اسأل بياناتك أي شيء', zh: '向您的数据提问任何问题', es: 'Pregunte cualquier cosa a sus datos', ja: 'データに何でも質問', ko: '데이터에 무엇이든 질문하세요' },
    'solutions.studio.row2.p1': { en: 'Eatpol Studio includes an AI assistant grounded in your own study data and relevant category context. Ask questions in plain language and get evidence-based answers instantly.', nl: 'Eatpol Studio bevat een AI-assistent gebaseerd op uw eigen studiedata en relevante categoriecontext. Stel vragen in gewone taal en krijg direct op bewijs gebaseerde antwoorden.', de: 'Eatpol Studio enthält einen KI-Assistenten, der auf Ihren eigenen Studiendaten und relevantem Kategoriekontext basiert. Stellen Sie Fragen in einfacher Sprache und erhalten Sie sofort evidenzbasierte Antworten.', it: 'Eatpol Studio include un assistente IA basato sui vostri dati di studio e sul contesto di categoria rilevante. Fate domande in linguaggio naturale e ottenete risposte basate sulle evidenze istantaneamente.', fr: 'Eatpol Studio inclut un assistant IA ancré dans vos propres données d\'étude et le contexte de catégorie pertinent. Posez des questions en langage courant et obtenez des réponses fondées sur les preuves instantanément.', ar: 'يتضمن Eatpol Studio مساعدًا ذكيًا مبنيًا على بيانات دراستك الخاصة وسياق الفئة ذي الصلة. اطرح أسئلة بلغة بسيطة واحصل على إجابات قائمة على الأدلة فورًا.', zh: 'Eatpol Studio包含一个基于您自身研究数据和相关品类背景的AI助手。用自然语言提问，即时获得基于证据的答案。', es: 'Eatpol Studio incluye un asistente de IA basado en sus propios datos de estudio y contexto de categoría relevante. Haga preguntas en lenguaje natural y obtenga respuestas basadas en evidencia al instante.', ja: 'Eatpol Studioには、自社の調査データと関連する学術研究に基づいたAIアシスタントが含まれています。', ko: 'Eatpol Studio에는 자체 연구 데이터와 관련 학술 연구에 기반한 AI 어시스턴트가 포함되어 있습니다.' },
    'solutions.studio.prompt1': { en: 'What should we change before launch?', nl: 'Wat moeten we veranderen voor de lancering?', de: 'Was sollten wir vor dem Launch ändern?', it: 'Cosa dovremmo cambiare prima del lancio?', fr: 'Que devrions-nous changer avant le lancement ?', ar: 'ما الذي يجب أن نغيره قبل الإطلاق؟', zh: '我们在上市前应该改变什么？', es: '¿Qué deberíamos cambiar antes del lanzamiento?', ja: '発売前に何を変更すべきですか？', ko: '출시 전에 무엇을 변경해야 할까요?' },
    'solutions.studio.prompt2': { en: 'What is still uncertain before scaling?', nl: 'Wat is nog onzeker voordat we opschalen?', de: 'Was ist vor der Skalierung noch unsicher?', it: 'Cosa è ancora incerto prima della scalata?', fr: 'Qu\'est-ce qui reste incertain avant le passage à l\'échelle ?', ar: 'ما الذي لا يزال غير مؤكد قبل التوسع؟', zh: '在扩大规模之前还有什么不确定因素？', es: '¿Qué sigue siendo incierto antes de escalar?', ja: 'スケーリング前にまだ不確実な点は？', ko: '확장 전에 아직 불확실한 점은?' },
    'solutions.studio.prompt3': { en: 'How does our product compare to consumer expectations?', nl: 'Hoe verhoudt ons product zich tot de verwachtingen van consumenten?', de: 'Wie schneidet unser Produkt im Vergleich zu den Verbrauchererwartungen ab?', it: 'Come si confronta il nostro prodotto con le aspettative dei consumatori?', fr: 'Comment notre produit se compare-t-il aux attentes des consommateurs ?', ar: 'كيف يقارن منتجنا بتوقعات المستهلكين؟', zh: '我们的产品与消费者期望相比如何？', es: '¿Cómo se compara nuestro producto con las expectativas del consumidor?', ja: '消費者の期待と比較して製品はどうですか？', ko: '소비자 기대와 비교하여 우리 제품은 어떤가요?' },

    // CTA section
    'solutions.cta.title': { en: 'Ready to see your product through consumers\' eyes?', nl: 'Klaar om uw product door de ogen van consumenten te zien?', de: 'Bereit, Ihr Produkt mit den Augen der Verbraucher zu sehen?', it: 'Pronti a vedere il vostro prodotto con gli occhi dei consumatori?', fr: 'Prêt à voir votre produit à travers les yeux des consommateurs ?', ar: 'مستعد لرؤية منتجك من خلال عيون المستهلكين؟', zh: '准备好从消费者的角度看您的产品了吗？', es: '¿Listo para ver su producto a través de los ojos del consumidor?', ja: '消費者の目で製品を見る準備はできましたか？', ko: '소비자의 눈으로 제품을 볼 준비가 되셨나요?' },
    'solutions.cta.sub': { en: 'Book a free assessment call. We\'ll recommend the right combination of Vox, Domus, and Studio for your goals.', nl: 'Boek een gratis analysegesprek. Wij adviseren de juiste combinatie van Vox, Domus en Studio voor uw doelen.', de: 'Buchen Sie ein kostenloses Analysegespräch. Wir empfehlen die richtige Kombination aus Vox, Domus und Studio für Ihre Ziele.', it: 'Prenotate una chiamata di analisi gratuita. Vi consiglieremo la giusta combinazione di Vox, Domus e Studio per i vostri obiettivi.', fr: 'Réservez un appel d\'analyse gratuit. Nous vous recommanderons la bonne combinaison de Vox, Domus et Studio pour vos objectifs.', ar: 'احجز مكالمة تقييم مجانية. سنوصي بالمزيج المناسب من Vox وDomus وStudio لأهدافك.', zh: '预约免费评估电话。我们将为您的目标推荐Vox、Domus和Studio的最佳组合。', es: 'Reserve una llamada de evaluación gratuita. Le recomendaremos la combinación adecuada de Vox, Domus y Studio para sus objetivos.', ja: '無料のアセスメントコールを予約してください。目標に合ったVox、Domus、Studioの最適な組み合わせをご提案します。', ko: '무료 평가 전화를 예약하세요. 목표에 맞는 Vox, Domus, Studio의 최적 조합을 추천해 드립니다.' },

    // ── Team / About Us Page ──
    'team.hero.badge': {
      en: 'Spin-off of Wageningen University & Research',
      nl: 'Spin-off van Wageningen University & Research',
      de: 'Ausgründung der Wageningen University & Research',
      it: 'Spin-off della Wageningen University & Research',
      fr: 'Spin-off de Wageningen University & Research',
      ar: 'شركة منبثقة عن جامعة فاخنينجن والأبحاث',
      zh: '瓦赫宁根大学与研究中心的衍生公司',
      es: 'Spin-off de Wageningen University & Research',
      ja: 'ワーヘニンゲン大学＆リサーチのスピンオフ',
      ko: '바헤닝언 대학교 & 리서치 스핀오프'
    },
    'team.hero.title': {
      en: 'About Us',
      nl: 'Over ons',
      de: 'Über uns',
      it: 'Chi siamo',
      fr: 'À propos',
      ar: 'من نحن',
      zh: '关于我们',
      es: 'Sobre nosotros',
      ja: '会社概要',
      ko: '소개'
    },
    'team.hero.subtitle': {
      en: 'Food scientists, AI engineers, and business builders on a mission to eliminate failed product launches.',
      nl: 'Voedingswetenschappers, AI-engineers en ondernemers met als missie mislukte productlanceringen te elimineren.',
      de: 'Lebensmittelwissenschaftler, KI-Ingenieure und Unternehmer mit der Mission, gescheiterte Produkteinführungen zu verhindern.',
      it: 'Scienziati alimentari, ingegneri AI e imprenditori con la missione di eliminare i lanci di prodotto falliti.',
      fr: 'Scientifiques alimentaires, ingénieurs IA et entrepreneurs en mission pour éliminer les lancements de produits ratés.',
      ar: 'علماء أغذية ومهندسو ذكاء اصطناعي ورواد أعمال في مهمة للقضاء على إطلاقات المنتجات الفاشلة.',
      zh: '食品科学家、AI工程师和企业建设者，致力于消除失败的产品发布。',
      es: 'Científicos alimentarios, ingenieros de IA y emprendedores con la misión de eliminar los lanzamientos de productos fallidos.',
      ja: '食品科学者、AIエンジニア、ビジネスビルダーが、製品発売の失敗をなくすミッションに取り組んでいます。',
      ko: '식품 과학자, AI 엔지니어, 비즈니스 빌더가 제품 출시 실패를 없애기 위한 미션에 임하고 있습니다.'
    },
    'team.hero.cta': {
      en: 'Get Your Free Assessment',
      nl: 'Vraag uw gratis analyse aan',
      de: 'Kostenlose Analyse anfordern',
      it: 'Richiedi la tua analisi gratuita',
      fr: 'Obtenez votre analyse gratuite',
      ar: 'احصل على تقييمك المجاني',
      zh: '获取免费评估',
      es: 'Obtén tu evaluación gratuita',
      ja: 'お問い合わせ',
      ko: '문의하기'
    },
    'team.story.title': {
      en: 'Our Story',
      nl: 'Ons verhaal',
      de: 'Unsere Geschichte',
      it: 'La nostra storia',
      fr: 'Notre histoire',
      ar: 'قصتنا',
      zh: '我们的故事',
      es: 'Nuestra historia',
      ja: '私たちのストーリー',
      ko: '우리의 이야기'
    },
    'team.story.p1': {
      en: 'Michele, a Ph.D. in <strong>AI and computer vision</strong> from <strong>Wageningen University</strong>, developed software to measure eating behavior from video—tracking bites and chews, under Guido Camps\' supervision.',
      nl: 'Michele, gepromoveerd in <strong>AI en computervisie</strong> aan de <strong>Wageningen University</strong>, ontwikkelde software om eetgedrag uit video te meten—het bijhouden van happen en kauwbewegingen, onder begeleiding van Guido Camps.',
      de: 'Michele, promoviert in <strong>KI und Computer Vision</strong> an der <strong>Wageningen University</strong>, entwickelte Software zur Messung des Essverhaltens aus Videos—Tracking von Bissen und Kaubewegungen, unter Aufsicht von Guido Camps.',
      it: 'Michele, dottore di ricerca in <strong>AI e visione artificiale</strong> presso la <strong>Wageningen University</strong>, ha sviluppato un software per misurare il comportamento alimentare dai video—tracciando morsi e masticazione, sotto la supervisione di Guido Camps.',
      fr: 'Michele, docteur en <strong>IA et vision par ordinateur</strong> de l\'<strong>Université de Wageningen</strong>, a développé un logiciel pour mesurer le comportement alimentaire à partir de vidéos—suivi des bouchées et de la mastication, sous la direction de Guido Camps.',
      ar: 'ميكيلي، حاصل على دكتوراه في <strong>الذكاء الاصطناعي ورؤية الحاسوب</strong> من <strong>جامعة فاخنينجن</strong>، طوّر برنامجاً لقياس سلوك الأكل من الفيديو—تتبع اللقمات والمضغ، تحت إشراف غيدو كامبس.',
      zh: 'Michele在<strong>瓦赫宁根大学</strong>获得<strong>人工智能和计算机视觉</strong>博士学位，在Guido Camps的指导下开发了通过视频测量饮食行为的软件——跟踪咬合和咀嚼。',
      es: 'Michele, doctor en <strong>IA y visión por computadora</strong> de la <strong>Universidad de Wageningen</strong>, desarrolló software para medir el comportamiento alimentario a partir de video—rastreando bocados y masticación, bajo la supervisión de Guido Camps.',
      ja: 'Eatpolはワーヘニンゲン大学&リサーチから2025年に誕生しました。',
      ko: 'Eatpol은 2025년 바헤닝언 대학교 & 연구소에서 탄생했습니다.'
    },
    'team.story.p2': {
      en: 'Partnering with <strong>Wageningen Impact Catalyst</strong>, the technology evolved to tackle a major industry problem: 85% of food product launches fail, costing billions.',
      nl: 'In samenwerking met <strong>Wageningen Impact Catalyst</strong> evolueerde de technologie om een groot brancheprobleem aan te pakken: 85% van de voedselproductlanceringen mislukt, wat miljarden kost.',
      de: 'In Partnerschaft mit dem <strong>Wageningen Impact Catalyst</strong> entwickelte sich die Technologie weiter, um ein großes Branchenproblem anzugehen: 85 % der Lebensmittelprodukteinführungen scheitern und kosten Milliarden.',
      it: 'In collaborazione con <strong>Wageningen Impact Catalyst</strong>, la tecnologia si è evoluta per affrontare un grande problema del settore: l\'85% dei lanci di prodotti alimentari fallisce, costando miliardi.',
      fr: 'En partenariat avec <strong>Wageningen Impact Catalyst</strong>, la technologie a évolué pour s\'attaquer à un problème majeur du secteur : 85 % des lancements de produits alimentaires échouent, coûtant des milliards.',
      ar: 'بالشراكة مع <strong>Wageningen Impact Catalyst</strong>، تطورت التقنية لمعالجة مشكلة كبرى في الصناعة: 85% من إطلاقات المنتجات الغذائية تفشل، مما يكلف مليارات.',
      zh: '与<strong>Wageningen Impact Catalyst</strong>合作，该技术发展为解决一个重大行业问题：85%的食品产品发布失败，损失数十亿。',
      es: 'En asociación con <strong>Wageningen Impact Catalyst</strong>, la tecnología evolucionó para abordar un gran problema de la industria: el 85% de los lanzamientos de productos alimentarios fracasan, costando miles de millones.',
      ja: '従来の食品テストは人工的な環境で行われ、実際の消費者行動を捉えられませんでした。',
      ko: '기존의 식품 테스트는 인위적인 환경에서 이루어져 실제 소비자 행동을 포착하지 못했습니다.'
    },
    'team.story.p3': {
      en: 'In fall 2025, <strong>Jakob</strong> and <strong>Simbiat</strong> joined the team, bringing Eatpol to market as a consumer testing service that delivers real-world insights straight from people\'s kitchens.',
      nl: 'In het najaar van 2025 sloten <strong>Jakob</strong> en <strong>Simbiat</strong> zich bij het team aan en brachten Eatpol op de markt als consumentenonderzoeksdienst die inzichten uit echte keukens levert.',
      de: 'Im Herbst 2025 kamen <strong>Jakob</strong> und <strong>Simbiat</strong> zum Team und brachten Eatpol als Verbrauchertestservice auf den Markt, der Erkenntnisse direkt aus den Küchen der Menschen liefert.',
      it: 'Nell\'autunno 2025, <strong>Jakob</strong> e <strong>Simbiat</strong> si sono uniti al team, portando Eatpol sul mercato come servizio di test per consumatori che fornisce informazioni reali direttamente dalle cucine delle persone.',
      fr: 'À l\'automne 2025, <strong>Jakob</strong> et <strong>Simbiat</strong> ont rejoint l\'équipe, amenant Eatpol sur le marché en tant que service de tests consommateurs fournissant des insights directement depuis les cuisines des gens.',
      ar: 'في خريف 2025، انضم <strong>ياكوب</strong> و<strong>سمبيات</strong> إلى الفريق، وأطلقوا Eatpol في السوق كخدمة اختبار المستهلكين التي تقدم رؤى واقعية مباشرة من مطابخ الناس.',
      zh: '2025年秋季，<strong>Jakob</strong>和<strong>Simbiat</strong>加入团队，将Eatpol作为消费者测试服务推向市场，直接从人们的厨房提供真实洞察。',
      es: 'En otoño de 2025, <strong>Jakob</strong> y <strong>Simbiat</strong> se unieron al equipo, llevando Eatpol al mercado como un servicio de pruebas de consumidores que ofrece información real directamente desde las cocinas de la gente.',
      ja: '私たちはAIと在宅テストを組み合わせ、食品企業に実用的なインサイトを提供します。',
      ko: '우리는 AI와 가정 내 테스트를 결합하여 식품 기업에 실행 가능한 인사이트를 제공합니다.'
    },
    'team.story.p4': {
      en: 'Based in <strong>Wageningen, the Netherlands</strong>, Eatpol helps leading food brands understand their consumers better and launch products people love.',
      nl: 'Gevestigd in <strong>Wageningen, Nederland</strong>, helpt Eatpol toonaangevende voedselmerken hun consumenten beter te begrijpen en producten te lanceren waar mensen van houden.',
      de: 'Mit Sitz in <strong>Wageningen, Niederlande</strong>, hilft Eatpol führenden Lebensmittelmarken, ihre Verbraucher besser zu verstehen und Produkte auf den Markt zu bringen, die Menschen lieben.',
      it: 'Con sede a <strong>Wageningen, Paesi Bassi</strong>, Eatpol aiuta i principali marchi alimentari a comprendere meglio i propri consumatori e a lanciare prodotti che le persone amano.',
      fr: 'Basé à <strong>Wageningen, aux Pays-Bas</strong>, Eatpol aide les grandes marques alimentaires à mieux comprendre leurs consommateurs et à lancer des produits que les gens adorent.',
      ar: 'يقع مقر Eatpol في <strong>فاخنينجن، هولندا</strong>، ويساعد العلامات التجارية الغذائية الرائدة على فهم مستهلكيها بشكل أفضل وإطلاق منتجات يحبها الناس.',
      zh: 'Eatpol总部位于<strong>荷兰瓦赫宁根</strong>，帮助领先的食品品牌更好地了解其消费者，并推出人们喜爱的产品。',
      es: 'Con sede en <strong>Wageningen, Países Bajos</strong>, Eatpol ayuda a las principales marcas alimentarias a comprender mejor a sus consumidores y lanzar productos que la gente ama.',
      ja: '私たちの使命：食品企業が消費者が本当に愛する製品を開発できるよう支援すること。',
      ko: '우리의 사명: 식품 기업이 소비자가 진정으로 사랑하는 제품을 개발할 수 있도록 지원하는 것.'
    },
    'team.section.title': {
      en: 'Team',
      nl: 'Team',
      de: 'Team',
      it: 'Team',
      fr: 'Équipe',
      ar: 'الفريق',
      zh: '团队',
      es: 'Equipo',
      ja: 'チームメンバー',
      ko: '팀원'
    },
    'team.section.subtitle': {
      en: 'Meet the people building the future of AI-powered consumer testing',
      nl: 'Ontmoet de mensen die de toekomst van AI-gestuurde consumententests bouwen',
      de: 'Lernen Sie die Menschen kennen, die die Zukunft der KI-gestützten Verbrauchertests gestalten',
      it: 'Scopri le persone che costruiscono il futuro dei test sui consumatori basati sull\'AI',
      fr: 'Découvrez les personnes qui construisent l\'avenir des tests consommateurs alimentés par l\'IA',
      ar: 'تعرف على الأشخاص الذين يبنون مستقبل اختبار المستهلكين بالذكاء الاصطناعي',
      zh: '认识正在构建AI驱动的消费者测试未来的人们',
      es: 'Conoce a las personas que construyen el futuro de las pruebas de consumidores impulsadas por IA',
      ja: '食品科学、AI、ビジネスの専門知識を結集。',
      ko: '식품 과학, AI, 비즈니스 전문 지식의 결합.'
    },
    'team.michele.role': {
      en: 'Co-Founder, CEO',
      nl: 'Medeoprichter, CEO',
      de: 'Mitgründer, CEO',
      it: 'Co-fondatore, CEO',
      fr: 'Cofondateur, CEO',
      ar: 'شريك مؤسس، الرئيس التنفيذي',
      zh: '联合创始人，首席执行官',
      es: 'Cofundador, CEO',
      ja: 'CEO & 共同創業者',
      ko: 'CEO & 공동 창업자'
    },
    'team.michele.bio': {
      en: 'Michele built the AI that analyzes real eating behavior from video — the core technology behind Eatpol\'s ability to predict product success before launch. His research at Wageningen University bridges computer vision and food science to give brands data they can\'t get anywhere else.',
      nl: 'Michele bouwde de AI die echt eetgedrag uit video analyseert — de kerntechnologie achter Eatpol\'s vermogen om productsucces te voorspellen vóór de lancering. Zijn onderzoek aan de Wageningen University overbrugt computervisie en voedingswetenschap om merken data te geven die ze nergens anders kunnen krijgen.',
      de: 'Michele entwickelte die KI, die echtes Essverhalten aus Videos analysiert — die Kerntechnologie hinter Eatpols Fähigkeit, den Produkterfolg vor der Markteinführung vorherzusagen. Seine Forschung an der Wageningen University verbindet Computer Vision und Lebensmittelwissenschaft, um Marken Daten zu liefern, die sie nirgendwo sonst bekommen.',
      it: 'Michele ha creato l\'AI che analizza il comportamento alimentare reale dai video — la tecnologia alla base della capacità di Eatpol di prevedere il successo di un prodotto prima del lancio. La sua ricerca alla Wageningen University unisce visione artificiale e scienze alimentari per fornire ai brand dati che non possono ottenere altrove.',
      fr: 'Michele a conçu l\'IA qui analyse le comportement alimentaire réel à partir de vidéos — la technologie clé derrière la capacité d\'Eatpol à prédire le succès d\'un produit avant son lancement. Ses recherches à l\'Université de Wageningen relient vision par ordinateur et science alimentaire pour offrir aux marques des données introuvables ailleurs.',
      ar: 'بنى ميكيلي الذكاء الاصطناعي الذي يحلل سلوك الأكل الحقيقي من الفيديو — التقنية الأساسية وراء قدرة Eatpol على التنبؤ بنجاح المنتج قبل الإطلاق. يربط بحثه في جامعة فاخنينجن بين رؤية الحاسوب وعلوم الأغذية لتقديم بيانات للعلامات التجارية لا يمكنهم الحصول عليها في أي مكان آخر.',
      zh: 'Michele构建了通过视频分析真实饮食行为的AI——这是Eatpol在产品发布前预测成功的核心技术。他在瓦赫宁根大学的研究将计算机视觉与食品科学联系起来，为品牌提供在其他地方无法获得的数据。',
      es: 'Michele creó la IA que analiza el comportamiento alimentario real a partir de video — la tecnología central detrás de la capacidad de Eatpol para predecir el éxito de un producto antes del lanzamiento. Su investigación en la Universidad de Wageningen une la visión por computadora y la ciencia alimentaria para ofrecer a las marcas datos que no pueden obtener en ningún otro lugar.',
      ja: 'ワーヘニンゲン大学で食品科学の博士号を取得。AI研究のバックグラウンドを持つ。',
      ko: '바헤닝언 대학교에서 식품 과학 박사학위 취득. AI 연구 배경 보유.'
    },
    'team.jakob.role': {
      en: 'Co-Founder, CCO',
      nl: 'Medeoprichter, CCO',
      de: 'Mitgründer, CCO',
      it: 'Co-fondatore, CCO',
      fr: 'Cofondateur, CCO',
      ar: 'شريك مؤسس، CCO',
      zh: '联合创始人，CCO',
      es: 'Cofundador, CCO',
      ja: '共同創業者、CCO',
      ko: '공동 창업자, CCO'
    },
    'team.jakob.bio': {
      en: 'Jakob works directly with food brands to design testing programs that fit their launch timeline — typically delivering actionable consumer insights within 2 weeks. He brings a sharp eye for product-market fit and commercial strategy to every engagement.',
      nl: 'Jakob werkt direct met voedselmerken om testprogramma\'s te ontwerpen die passen bij hun lanceringstijdlijn — meestal met bruikbare consumenteninzichten binnen 2 weken. Hij brengt een scherp oog voor product-market fit en commerciële strategie naar elk project.',
      de: 'Jakob arbeitet direkt mit Lebensmittelmarken zusammen, um Testprogramme zu entwerfen, die zu ihrem Einführungszeitplan passen — in der Regel mit umsetzbaren Verbrauchererkenntnissen innerhalb von 2 Wochen. Er bringt ein scharfes Auge für Product-Market-Fit und Geschäftsstrategie in jedes Projekt ein.',
      it: 'Jakob lavora direttamente con i brand alimentari per progettare programmi di test che si adattano alla loro tempistica di lancio — fornendo solitamente informazioni utili sui consumatori entro 2 settimane. Porta un occhio attento per il product-market fit e la strategia commerciale in ogni progetto.',
      fr: 'Jakob travaille directement avec les marques alimentaires pour concevoir des programmes de tests adaptés à leur calendrier de lancement — livrant généralement des insights consommateurs exploitables en 2 semaines. Il apporte un regard affûté sur l\'adéquation produit-marché et la stratégie commerciale à chaque engagement.',
      ar: 'يعمل ياكوب مباشرة مع العلامات التجارية الغذائية لتصميم برامج اختبار تناسب جدول إطلاقهم — عادة ما يقدم رؤى مستهلكين قابلة للتنفيذ خلال أسبوعين. يتمتع بنظرة ثاقبة لملاءمة المنتج للسوق والاستراتيجية التجارية.',
      zh: 'Jakob直接与食品品牌合作，设计符合其发布时间线的测试方案——通常在2周内提供可操作的消费者洞察。他对产品市场契合度和商业策略有敏锐的视角。',
      es: 'Jakob trabaja directamente con marcas alimentarias para diseñar programas de prueba que se ajusten a su cronograma de lanzamiento — normalmente entregando información de consumidores accionable en 2 semanas. Aporta una visión aguda del ajuste producto-mercado y la estrategia comercial a cada proyecto.',
      ja: 'AIとコンピュータビジョンのスペシャリスト。消費者行動分析のエキスパート。',
      ko: 'AI와 컴퓨터 비전 전문가. 소비자 행동 분석 전문.'
    },
    'team.riccardo.role': {
      en: 'Intern — Marketing',
      nl: 'Stagiair — Marketing',
      de: 'Praktikant — Marketing',
      it: 'Stagista — Marketing',
      fr: 'Stagiaire — Marketing',
      ar: 'متدرب — التسويق',
      zh: '实习生 — 市场营销',
      es: 'Becario — Marketing',
      ja: 'ソフトウェアエンジニア',
      ko: '소프트웨어 엔지니어'
    },
    'team.riccardo.bio': {
      en: 'Riccardo supports Eatpol\'s marketing efforts, helping to grow brand awareness and communicate the value of AI-powered consumer testing to the food industry.',
      nl: 'Riccardo ondersteunt de marketinginspanningen van Eatpol en helpt de naamsbekendheid te vergroten en de waarde van AI-gestuurde consumententests te communiceren naar de voedselindustrie.',
      de: 'Riccardo unterstützt Eatpols Marketingaktivitäten und hilft, die Markenbekanntheit zu steigern und den Wert von KI-gestützten Verbrauchertests an die Lebensmittelindustrie zu vermitteln.',
      it: 'Riccardo supporta le attività di marketing di Eatpol, contribuendo a far crescere la notorietà del marchio e a comunicare il valore dei test sui consumatori basati sull\'AI all\'industria alimentare.',
      fr: 'Riccardo soutient les efforts marketing d\'Eatpol, contribuant à développer la notoriété de la marque et à communiquer la valeur des tests consommateurs alimentés par l\'IA à l\'industrie alimentaire.',
      ar: 'يدعم ريكاردو جهود التسويق في Eatpol، ويساعد في زيادة الوعي بالعلامة التجارية وإيصال قيمة اختبار المستهلكين بالذكاء الاصطناعي لصناعة الأغذية.',
      zh: 'Riccardo支持Eatpol的市场营销工作，帮助提升品牌知名度，并向食品行业传达AI驱动的消费者测试的价值。',
      es: 'Riccardo apoya los esfuerzos de marketing de Eatpol, ayudando a aumentar el conocimiento de marca y comunicar el valor de las pruebas de consumidores impulsadas por IA a la industria alimentaria.',
      ja: 'フルスタック開発者。Eatpol Studioプラットフォームの構築を担当。',
      ko: '풀스택 개발자. Eatpol Studio 플랫폼 구축 담당.'
    },
    'team.kamila.role': {
      en: 'Intern — Sales',
      nl: 'Stagiair — Verkoop',
      de: 'Praktikantin — Vertrieb',
      it: 'Stagista — Vendite',
      fr: 'Stagiaire — Ventes',
      ar: 'متدربة — المبيعات',
      zh: '实习生 — 销售',
      es: 'Becaria — Ventas',
      ja: 'コミュニティマネージャー',
      ko: '커뮤니티 매니저'
    },
    'team.kamila.bio': {
      en: 'Kamila supports the sales team, connecting with food brands and helping them discover how Eatpol\'s consumer testing platform can de-risk their product launches.',
      nl: 'Kamila ondersteunt het verkoopteam, legt contact met voedselmerken en helpt hen ontdekken hoe het consumententestplatform van Eatpol hun productlanceringen kan de-risken.',
      de: 'Kamila unterstützt das Vertriebsteam, knüpft Kontakte zu Lebensmittelmarken und hilft ihnen zu entdecken, wie Eatpols Verbrauchertestplattform das Risiko ihrer Produkteinführungen reduzieren kann.',
      it: 'Kamila supporta il team vendite, collegandosi con i brand alimentari e aiutandoli a scoprire come la piattaforma di test sui consumatori di Eatpol possa ridurre i rischi dei loro lanci di prodotto.',
      fr: 'Kamila soutient l\'équipe commerciale, établissant des liens avec les marques alimentaires et les aidant à découvrir comment la plateforme de tests consommateurs d\'Eatpol peut réduire les risques de leurs lancements de produits.',
      ar: 'تدعم كاميلا فريق المبيعات، وتتواصل مع العلامات التجارية الغذائية وتساعدهم في اكتشاف كيف يمكن لمنصة Eatpol لاختبار المستهلكين تقليل مخاطر إطلاقات منتجاتهم.',
      zh: 'Kamila支持销售团队，与食品品牌建立联系，帮助他们了解Eatpol的消费者测试平台如何降低产品发布的风险。',
      es: 'Kamila apoya al equipo de ventas, conectando con marcas alimentarias y ayudándolas a descubrir cómo la plataforma de pruebas de consumidores de Eatpol puede reducir el riesgo de sus lanzamientos de productos.',
      ja: 'テスターコミュニティの管理と食品企業との連携を担当。',
      ko: '테스터 커뮤니티 관리와 식품 기업과의 연계 담당.'
    },
    'team.advisory.title': {
      en: 'Advisory Board',
      nl: 'Adviesraad',
      de: 'Beirat',
      it: 'Comitato consultivo',
      fr: 'Comité consultatif',
      ar: 'المجلس الاستشاري',
      zh: '顾问委员会',
      es: 'Junta asesora',
      ja: 'アドバイザリーボード',
      ko: '자문위원회'
    },
    'team.advisory.subtitle': {
      en: 'Industry experts and thought leaders guiding our strategic direction',
      nl: 'Branche-experts en thought leaders die onze strategische richting bepalen',
      de: 'Branchenexperten und Vordenker, die unsere strategische Ausrichtung leiten',
      it: 'Esperti del settore e leader di pensiero che guidano la nostra direzione strategica',
      fr: 'Experts du secteur et leaders d\'opinion guidant notre direction stratégique',
      ar: 'خبراء الصناعة وقادة الفكر الذين يوجهون اتجاهنا الاستراتيجي',
      zh: '行业专家和思想领袖引导我们的战略方向',
      es: 'Expertos de la industria y líderes de opinión que guían nuestra dirección estratégica',
      ja: '業界をリードする専門家からの指導。',
      ko: '업계를 선도하는 전문가의 지도.'
    },
    'team.guido.role': {
      en: 'Advisory Board Member',
      nl: 'Lid van de adviesraad',
      de: 'Beiratsmitglied',
      it: 'Membro del comitato consultivo',
      fr: 'Membre du comité consultatif',
      ar: 'عضو المجلس الاستشاري',
      zh: '顾问委员会成员',
      es: 'Miembro de la junta asesora',
      ja: 'アドバイザー',
      ko: '자문위원'
    },
    'team.guido.bio': {
      en: 'Associate Professor at Wageningen University and Eatpol\'s scientific advisor. Guido\'s research in eating behavior and AI ensures our technology stays grounded in peer-reviewed science.',
      nl: 'Universitair hoofddocent aan de Wageningen University en wetenschappelijk adviseur van Eatpol. Guido\'s onderzoek naar eetgedrag en AI zorgt ervoor dat onze technologie geworteld blijft in peer-reviewed wetenschap.',
      de: 'Assoziierter Professor an der Wageningen University und wissenschaftlicher Berater von Eatpol. Guidos Forschung zu Essverhalten und KI stellt sicher, dass unsere Technologie auf begutachteter Wissenschaft basiert.',
      it: 'Professore associato alla Wageningen University e consulente scientifico di Eatpol. La ricerca di Guido sul comportamento alimentare e l\'AI garantisce che la nostra tecnologia resti radicata nella scienza peer-reviewed.',
      fr: 'Professeur associé à l\'Université de Wageningen et conseiller scientifique d\'Eatpol. Les recherches de Guido sur le comportement alimentaire et l\'IA garantissent que notre technologie reste ancrée dans la science évaluée par les pairs.',
      ar: 'أستاذ مشارك في جامعة فاخنينجن والمستشار العلمي لـ Eatpol. يضمن بحث غيدو في سلوك الأكل والذكاء الاصطناعي أن تظل تقنيتنا راسخة في العلم المحكّم.',
      zh: '瓦赫宁根大学副教授和Eatpol的科学顾问。Guido在饮食行为和AI方面的研究确保我们的技术始终以同行评审的科学为基础。',
      es: 'Profesor asociado en la Universidad de Wageningen y asesor científico de Eatpol. La investigación de Guido en comportamiento alimentario e IA asegura que nuestra tecnología se mantenga fundamentada en ciencia revisada por pares.',
      ja: 'ワーヘニンゲン大学教授。食品消費者科学の第一人者。',
      ko: '바헤닝언 대학교 교수. 식품 소비자 과학의 선구자.'
    },
    'team.simbiat.role': {
      en: 'Advisor <br> Marketing and Consumer Insights',
      nl: 'Adviseur <br> Marketing en consumenteninzichten',
      de: 'Beraterin <br> Marketing und Verbrauchereinblicke',
      it: 'Consulente <br> Marketing e insight sui consumatori',
      fr: 'Conseillère <br> Marketing et insights consommateurs',
      ar: 'مستشارة <br> التسويق ورؤى المستهلكين',
      zh: '顾问 <br> 市场营销与消费者洞察',
      es: 'Asesora <br> Marketing e insights del consumidor',
      ja: 'アドバイザー',
      ko: '자문위원'
    },
    'team.simbiat.bio': {
      en: 'Food scientist, nutritionist, and consumer behavior expert with advanced degrees from Maastricht University and the University of Edinburgh. Simbiat translates scientific insights into practical, sustainable food solutions that resonate with real consumers.',
      nl: 'Voedingswetenschapper, voedingsdeskundige en expert in consumentengedrag met geavanceerde graden van de Universiteit Maastricht en de Universiteit van Edinburgh. Simbiat vertaalt wetenschappelijke inzichten naar praktische, duurzame voedseloplossingen die resoneren bij echte consumenten.',
      de: 'Lebensmittelwissenschaftlerin, Ernährungsberaterin und Expertin für Verbraucherverhalten mit Abschlüssen der Universität Maastricht und der Universität Edinburgh. Simbiat übersetzt wissenschaftliche Erkenntnisse in praktische, nachhaltige Lebensmittellösungen, die bei echten Verbrauchern ankommen.',
      it: 'Scienziata alimentare, nutrizionista ed esperta di comportamento dei consumatori con lauree avanzate dall\'Università di Maastricht e dall\'Università di Edimburgo. Simbiat traduce le intuizioni scientifiche in soluzioni alimentari pratiche e sostenibili che risuonano con i veri consumatori.',
      fr: 'Scientifique alimentaire, nutritionniste et experte en comportement des consommateurs, diplômée de l\'Université de Maastricht et de l\'Université d\'Édimbourg. Simbiat traduit les découvertes scientifiques en solutions alimentaires pratiques et durables qui parlent aux vrais consommateurs.',
      ar: 'عالمة أغذية وأخصائية تغذية وخبيرة في سلوك المستهلك حاصلة على درجات علمية متقدمة من جامعة ماستريخت وجامعة إدنبرة. تترجم سمبيات الرؤى العلمية إلى حلول غذائية عملية ومستدامة تلقى صدى لدى المستهلكين الحقيقيين.',
      zh: '食品科学家、营养学家和消费者行为专家，拥有马斯特里赫特大学和爱丁堡大学的高级学位。Simbiat将科学见解转化为实用、可持续的食品解决方案，与真实消费者产生共鸣。',
      es: 'Científica alimentaria, nutricionista y experta en comportamiento del consumidor con títulos avanzados de la Universidad de Maastricht y la Universidad de Edimburgo. Simbiat traduce los descubrimientos científicos en soluciones alimentarias prácticas y sostenibles que conectan con los consumidores reales.',
      ja: '食品業界での豊富な経験を持つビジネスアドバイザー。',
      ko: '식품 업계에서 풍부한 경험을 가진 비즈니스 자문위원.'
    },
    'team.values.title': {
      en: 'Our Values',
      nl: 'Onze waarden',
      de: 'Unsere Werte',
      it: 'I nostri valori',
      fr: 'Nos valeurs',
      ar: 'قيمنا',
      zh: '我们的价值观',
      es: 'Nuestros valores',
      ja: '私たちの価値観',
      ko: '우리의 가치'
    },
    'team.values.subtitle': {
      en: 'The principles that guide everything we do',
      nl: 'De principes die alles wat we doen sturen',
      de: 'Die Prinzipien, die alles leiten, was wir tun',
      it: 'I principi che guidano tutto ciò che facciamo',
      fr: 'Les principes qui guident tout ce que nous faisons',
      ar: 'المبادئ التي توجه كل ما نقوم به',
      zh: '指导我们一切行动的原则',
      es: 'Los principios que guían todo lo que hacemos',
      ja: '私たちの仕事を導く原則。',
      ko: '우리의 일을 이끄는 원칙.'
    },
    'team.value1.title': {
      en: 'People First',
      nl: 'Mensen eerst',
      de: 'Menschen zuerst',
      it: 'Le persone prima di tutto',
      fr: 'Les personnes d\'abord',
      ar: 'الناس أولاً',
      zh: '以人为本',
      es: 'Las personas primero',
      ja: '透明性',
      ko: '투명성'
    },
    'team.value1.text': {
      en: 'We prioritize the wellbeing and happiness of our employees and the satisfaction of our clients, believing meaningful impact starts with people who are healthy, motivated, and fulfilled.',
      nl: 'We geven prioriteit aan het welzijn en geluk van onze medewerkers en de tevredenheid van onze klanten, in de overtuiging dat betekenisvolle impact begint bij mensen die gezond, gemotiveerd en voldaan zijn.',
      de: 'Wir priorisieren das Wohlbefinden und Glück unserer Mitarbeiter und die Zufriedenheit unserer Kunden, denn wir glauben, dass bedeutungsvolle Wirkung bei gesunden, motivierten und erfüllten Menschen beginnt.',
      it: 'Diamo priorità al benessere e alla felicità dei nostri dipendenti e alla soddisfazione dei nostri clienti, credendo che un impatto significativo inizi con persone sane, motivate e realizzate.',
      fr: 'Nous donnons la priorité au bien-être et au bonheur de nos employés et à la satisfaction de nos clients, convaincus qu\'un impact significatif commence par des personnes en bonne santé, motivées et épanouies.',
      ar: 'نعطي الأولوية لرفاهية وسعادة موظفينا ورضا عملائنا، إيماناً بأن التأثير الهادف يبدأ بأشخاص أصحاء ومتحمسين وراضين.',
      zh: '我们优先考虑员工的福祉和幸福以及客户的满意度，相信有意义的影响始于健康、有动力和充实的人。',
      es: 'Priorizamos el bienestar y la felicidad de nuestros empleados y la satisfacción de nuestros clientes, creyendo que el impacto significativo comienza con personas sanas, motivadas y realizadas.', ja: '従業員の幸福と幸せ、そして顧客の満足を最優先にします。', ko: '직원의 안녕과 행복, 그리고 고객의 만족을 최우선으로 합니다.' },
    'team.value2.title': {
      en: 'Integrity',
      nl: 'Integriteit',
      de: 'Integrität',
      it: 'Integrità',
      fr: 'Intégrité',
      ar: 'النزاهة',
      zh: '正直',
      es: 'Integridad',
      ja: 'イノベーション',
      ko: '혁신'
    },
    'team.value2.text': {
      en: 'We seek truth and accuracy, communicate openly, and act with transparency. We hold ourselves accountable and earn trust by being reliable and honest in everything we do.',
      nl: 'We streven naar waarheid en nauwkeurigheid, communiceren open en handelen transparant. We houden onszelf verantwoordelijk en verdienen vertrouwen door betrouwbaar en eerlijk te zijn in alles wat we doen.',
      de: 'Wir streben nach Wahrheit und Genauigkeit, kommunizieren offen und handeln transparent. Wir übernehmen Verantwortung und verdienen Vertrauen durch Zuverlässigkeit und Ehrlichkeit in allem, was wir tun.',
      it: 'Cerchiamo la verità e la precisione, comunichiamo apertamente e agiamo con trasparenza. Ci riteniamo responsabili e guadagniamo fiducia essendo affidabili e onesti in tutto ciò che facciamo.',
      fr: 'Nous recherchons la vérité et la précision, communiquons ouvertement et agissons avec transparence. Nous nous tenons responsables et gagnons la confiance en étant fiables et honnêtes dans tout ce que nous faisons.',
      ar: 'نسعى إلى الحقيقة والدقة، ونتواصل بشكل مفتوح، ونتصرف بشفافية. نحاسب أنفسنا ونكسب الثقة من خلال الموثوقية والصدق في كل ما نقوم به.',
      zh: '我们追求真理和准确性，开放沟通，透明行事。我们对自己负责，通过在一切事务中可靠和诚实来赢得信任。',
      es: 'Buscamos la verdad y la precisión, nos comunicamos abiertamente y actuamos con transparencia. Nos hacemos responsables y ganamos confianza siendo fiables y honestos en todo lo que hacemos.', ja: '真実と正確さを追求し、オープンにコミュニケーションし、透明性を持って行動します。', ko: '진실과 정확성을 추구하고 공개적으로 소통하며 투명하게 행동합니다.' },
    'team.value3.title': {
      en: 'Ambition & Excellence',
      nl: 'Ambitie & Uitmuntendheid',
      de: 'Ambition & Exzellenz',
      it: 'Ambizione & Eccellenza',
      fr: 'Ambition & Excellence',
      ar: 'الطموح والتميز',
      zh: '雄心与卓越',
      es: 'Ambición y excelencia',
      ja: 'インパクト',
      ko: '임팩트'
    },
    'team.value3.text': {
      en: 'We act proactively and take full responsibility for outcomes, pursuing bold goals with high standards and a continuous drive to improve.',
      nl: 'We handelen proactief en nemen volledige verantwoordelijkheid voor resultaten, streven gedurfde doelen na met hoge normen en een continue drang om te verbeteren.',
      de: 'Wir handeln proaktiv und übernehmen die volle Verantwortung für Ergebnisse, verfolgen mutige Ziele mit hohen Standards und einem kontinuierlichen Streben nach Verbesserung.',
      it: 'Agiamo in modo proattivo e ci assumiamo la piena responsabilità dei risultati, perseguendo obiettivi ambiziosi con standard elevati e una spinta continua al miglioramento.',
      fr: 'Nous agissons de manière proactive et assumons l\'entière responsabilité des résultats, poursuivant des objectifs audacieux avec des normes élevées et une volonté continue de s\'améliorer.',
      ar: 'نتصرف بشكل استباقي ونتحمل المسؤولية الكاملة عن النتائج، نسعى لتحقيق أهداف جريئة بمعايير عالية ودافع مستمر للتحسين.',
      zh: '我们积极主动，对结果承担全部责任，以高标准和持续改进的动力追求大胆的目标。',
      es: 'Actuamos de manera proactiva y asumimos la plena responsabilidad de los resultados, persiguiendo metas audaces con altos estándares y un impulso continuo de mejora.', ja: '積極的に行動し、結果に対して全責任を負い、大胆な目標を追求します。', ko: '적극적으로 행동하고 결과에 대한 전적인 책임을 지며 대담한 목표를 추구합니다.' },
    'team.cta.title': {
      en: 'Ready to Launch With Confidence?',
      nl: 'Klaar om met vertrouwen te lanceren?',
      de: 'Bereit für einen sicheren Marktstart?',
      it: 'Pronti a lanciare con sicurezza?',
      fr: 'Prêt à lancer en toute confiance ?',
      ar: 'هل أنت مستعد للإطلاق بثقة؟',
      zh: '准备好自信地发布产品了吗？',
      es: '¿Listo para lanzar con confianza?',
      ja: '一緒に食品の未来を作りましょう',
      ko: '함께 식품의 미래를 만들어요'
    },
    'team.cta.text': {
      en: '85% of food product launches fail. Our team helps you beat those odds with real consumer data — before you commit to production.',
      nl: '85% van de voedselproductlanceringen mislukt. Ons team helpt u die kansen te verslaan met echte consumentendata — voordat u zich vastlegt op productie.',
      de: '85 % der Lebensmittelprodukteinführungen scheitern. Unser Team hilft Ihnen, diese Quote zu schlagen — mit echten Verbraucherdaten, bevor Sie sich auf die Produktion festlegen.',
      it: 'L\'85% dei lanci di prodotti alimentari fallisce. Il nostro team ti aiuta a battere queste probabilità con dati reali sui consumatori — prima di impegnarti nella produzione.',
      fr: '85 % des lancements de produits alimentaires échouent. Notre équipe vous aide à défier ces statistiques avec des données consommateurs réelles — avant de vous engager en production.',
      ar: '85% من إطلاقات المنتجات الغذائية تفشل. فريقنا يساعدك على التغلب على هذه الاحتمالات ببيانات مستهلكين حقيقية — قبل أن تلتزم بالإنتاج.',
      zh: '85%的食品产品发布失败。我们的团队帮助您用真实的消费者数据打败这些概率——在您承诺投产之前。',
      es: 'El 85% de los lanzamientos de productos alimentarios fracasan. Nuestro equipo te ayuda a superar esas probabilidades con datos reales de consumidores — antes de comprometerte con la producción.',
      ja: 'あなたの製品について話し合いましょう。',
      ko: '당신의 제품에 대해 이야기합시다.'
    },
    'team.cta.btn': {
      en: 'Get Your Free Assessment',
      nl: 'Vraag uw gratis analyse aan',
      de: 'Kostenlose Analyse anfordern',
      it: 'Richiedi la tua analisi gratuita',
      fr: 'Obtenez votre analyse gratuite',
      ar: 'احصل على تقييمك المجاني',
      zh: '获取免费评估',
      es: 'Obtén tu evaluación gratuita',
      ja: '無料アセスメントを受ける',
      ko: '무료 평가 받기'
    },

    // ── Cookie Banner ──
    'cookie.title': { en: 'We value your privacy', ar: 'نحن نقدر خصوصيتك', zh: '我们重视您的隐私', nl: 'Wij respecteren uw privacy', it: 'Teniamo alla tua privacy', de: 'Wir schätzen Ihre Privatsphäre', es: 'Valoramos tu privacidad', fr: 'Nous respectons votre vie privée', ja: 'プライバシーを大切にしています', ko: '개인정보를 소중히 여깁니다' },
    'cookie.text': { en: 'We use cookies and Google Analytics to understand how you use our site and improve your experience. <a href="privacy_policy.html">Learn more</a>', ar: 'نستخدم ملفات تعريف الارتباط وGoogle Analytics لفهم كيفية استخدامك لموقعنا وتحسين تجربتك. <a href="privacy_policy.html">اعرف المزيد</a>', zh: '我们使用Cookie和Google Analytics来了解您如何使用我们的网站并改善您的体验。<a href="privacy_policy.html">了解更多</a>', nl: 'We gebruiken cookies en Google Analytics om te begrijpen hoe u onze site gebruikt en uw ervaring te verbeteren. <a href="privacy_policy.html">Meer informatie</a>', it: 'Utilizziamo cookie e Google Analytics per capire come usi il nostro sito e migliorare la tua esperienza. <a href="privacy_policy.html">Scopri di più</a>', de: 'Wir verwenden Cookies und Google Analytics, um zu verstehen, wie Sie unsere Website nutzen und Ihr Erlebnis zu verbessern. <a href="privacy_policy.html">Mehr erfahren</a>', es: 'Usamos cookies y Google Analytics para entender cómo usas nuestro sitio y mejorar tu experiencia. <a href="privacy_policy.html">Saber más</a>', fr: 'Nous utilisons des cookies et Google Analytics pour comprendre comment vous utilisez notre site et améliorer votre expérience. <a href="privacy_policy.html">En savoir plus</a>', ja: '当サイトではCookieとGoogle Analyticsを使用して、サイトの利用状況を把握し、体験を向上させています。<a href="privacy_policy.html">詳細はこちら</a>', ko: '저희는 쿠키와 Google Analytics를 사용하여 사이트 이용 방식을 파악하고 경험을 개선합니다. <a href="privacy_policy.html">자세히 알아보기</a>' },
    'cookie.decline': { en: 'Decline', ar: 'رفض', zh: '拒绝', nl: 'Weigeren', it: 'Rifiuta', de: 'Ablehnen', es: 'Rechazar', fr: 'Refuser', ja: '拒否', ko: '거부' },
    'cookie.accept': { en: 'Accept Cookies', ar: 'قبول الكوكيز', zh: '接受Cookie', nl: 'Cookies Accepteren', it: 'Accetta Cookie', de: 'Cookies Akzeptieren', es: 'Aceptar Cookies', fr: 'Accepter les Cookies', ja: 'Cookieを受け入れる', ko: '쿠키 수락' },

    // ── Testers Page ──
    'testers.hero.title': {
      en: 'Become a <span class="highlight">Food Tester</span>',
      ar: 'كن <span class="highlight">مختبر طعام</span>',
      zh: '成为<span class="highlight">食品测试员</span>',
      nl: 'Word <span class="highlight">Voedselproever</span>',
      it: 'Diventa <span class="highlight">Assaggiatore</span>',
      de: 'Werde <span class="highlight">Lebensmitteltester</span>',
      es: 'Conviértete en <span class="highlight">Catador de Alimentos</span>',
      fr: 'Devenez <span class="highlight">Testeur Alimentaire</span>', ja: 'Eatpolの<span class="hero-highlight">フードテスター</span>になろう', ko: 'Eatpol <span class="hero-highlight">식품 테스터</span>가 되세요' },
    'testers.hero.subtitle': {
      en: 'Get paid to share your opinion in a quick interview, or receive food at home and test it in your own kitchen.',
      ar: 'احصل على أجر مقابل مشاركة رأيك في مقابلة سريعة، أو استلم طعامًا في المنزل واختبره في مطبخك.',
      zh: '通过快速访谈分享您的观点获得报酬，或在家中收到食物并在您自己的厨房中测试。',
      nl: 'Verdien geld door je mening te delen in een kort interview, of ontvang eten thuis en test het in je eigen keuken.',
      it: 'Guadagna condividendo la tua opinione in una breve intervista, oppure ricevi cibo a casa e testalo nella tua cucina.',
      de: 'Verdienen Sie Geld, indem Sie Ihre Meinung in einem kurzen Interview teilen, oder erhalten Sie Lebensmittel nach Hause und testen Sie sie in Ihrer eigenen Küche.',
      es: 'Gana dinero compartiendo tu opinión en una entrevista rápida, o recibe alimentos en casa y pruébalos en tu propia cocina.',
      fr: "Soyez rémunéré pour partager votre avis lors d'un entretien rapide, ou recevez de la nourriture chez vous et testez-la dans votre propre cuisine.", ja: '短いインタビューで意見を共有して報酬を得るか、自宅に届く食品を自分のキッチンでテストしましょう。', ko: '짧은 인터뷰에서 의견을 나누고 보수를 받거나, 집으로 배달된 음식을 자신의 주방에서 테스트하세요.' },
    'testers.hero.cta.join': {
      en: 'Join as a Tester',
      ar: 'انضم كمختبر',
      zh: '加入成为测试员',
      nl: 'Word Tester',
      it: 'Iscriviti come Tester',
      de: 'Als Tester beitreten',
      es: 'Únete como Catador',
      fr: 'Rejoignez-nous comme Testeur',
      ja: 'テスターとして参加',
      ko: '테스터로 참가'
    },
    'testers.hero.cta.how': {
      en: 'How it works',
      ar: 'كيف يعمل',
      zh: '运作方式',
      nl: 'Hoe het werkt',
      it: 'Come funziona',
      de: 'So funktioniert es',
      es: 'Cómo funciona',
      fr: 'Comment ça marche',
      ja: '仕組みを見る',
      ko: '작동 방식 보기'
    },

    // ── Two Ways Section ──
    'testers.ways.title': {
      en: 'Two ways to participate',
      ar: 'طريقتان للمشاركة',
      zh: '两种参与方式',
      nl: 'Twee manieren om mee te doen',
      it: 'Due modi per partecipare',
      de: 'Zwei Wege zur Teilnahme',
      es: 'Dos formas de participar',
      fr: 'Deux façons de participer',
      ja: '2つの参加方法',
      ko: '두 가지 참여 방법'
    },
    'testers.ways.vox.title': {
      en: 'Vox — Quick Interview',
      ar: 'Vox — مقابلة سريعة',
      zh: 'Vox — 快速访谈',
      nl: 'Vox — Kort Interview',
      it: 'Vox — Intervista Rapida',
      de: 'Vox — Kurzinterview',
      es: 'Vox — Entrevista Rápida',
      fr: 'Vox — Entretien Rapide',
      ja: 'Vox — クイックインタビュー',
      ko: 'Vox — 빠른 인터뷰'
    },
    'testers.ways.vox.desc': {
      en: 'Share your opinion about food products in a short video interview from home. Takes about 15 minutes.',
      ar: 'شارك رأيك حول المنتجات الغذائية في مقابلة فيديو قصيرة من المنزل. تستغرق حوالي 15 دقيقة.',
      zh: '在家中通过短视频访谈分享您对食品产品的看法。大约需要15分钟。',
      nl: 'Deel je mening over voedingsproducten in een kort video-interview vanuit huis. Duurt ongeveer 15 minuten.',
      it: 'Condividi la tua opinione sui prodotti alimentari in una breve intervista video da casa. Dura circa 15 minuti.',
      de: 'Teilen Sie Ihre Meinung zu Lebensmittelprodukten in einem kurzen Videointerview von zu Hause aus. Dauert etwa 15 Minuten.',
      es: 'Comparte tu opinión sobre productos alimentarios en una breve entrevista en video desde casa. Dura unos 15 minutos.',
      fr: "Partagez votre avis sur des produits alimentaires lors d'un court entretien vidéo depuis chez vous. Environ 15 minutes.", ja: '自宅からの短いビデオインタビューで食品についての意見を共有。15〜20分で完了。', ko: '집에서 짧은 비디오 인터뷰로 식품에 대한 의견을 공유하세요. 15~20분이면 완료.' },
    'testers.ways.domus.title': {
      en: 'Vox + Domus — Full Test',
      ar: 'Vox + Domus — اختبار كامل',
      zh: 'Vox + Domus — 完整测试',
      nl: 'Vox + Domus — Volledige Test',
      it: 'Vox + Domus — Test Completo',
      de: 'Vox + Domus — Vollständiger Test',
      es: 'Vox + Domus — Prueba Completa',
      fr: 'Vox + Domus — Test Complet',
      ja: 'Domus — 在宅テスト',
      ko: 'Domus — 가정 내 테스트'
    },
    'testers.ways.domus.desc': {
      en: 'Receive food samples at your door, prepare and eat them in your kitchen while recording. Plus a short interview.',
      ar: 'استلم عينات طعام على باب منزلك، حضّرها وتناولها في مطبخك أثناء التسجيل. بالإضافة إلى مقابلة قصيرة.',
      zh: '在家门口接收食品样品，在厨房中准备和品尝并录制过程。另外还有一个简短的访谈。',
      nl: 'Ontvang voedselmonsters aan je deur, bereid en eet ze in je keuken terwijl je opneemt. Plus een kort interview.',
      it: 'Ricevi campioni di cibo a casa tua, preparali e mangiali nella tua cucina mentre registri. Più una breve intervista.',
      de: 'Erhalten Sie Lebensmittelproben an Ihre Haustür, bereiten Sie sie zu und essen Sie sie in Ihrer Küche, während Sie aufnehmen. Plus ein kurzes Interview.',
      es: 'Recibe muestras de alimentos en tu puerta, prepáralas y cómelas en tu cocina mientras grabas. Más una breve entrevista.',
      fr: "Recevez des échantillons alimentaires à votre porte, préparez-les et dégustez-les dans votre cuisine en filmant. Plus un court entretien.",
      ja: '自宅に届く食品を自分のキッチンでテスト。スマートフォンで体験を録画してください。',
      ko: '집으로 배달된 음식을 자신의 주방에서 테스트하세요. 스마트폰으로 경험을 녹화합니다.'
    },
    'testers.ways.privacy.title': {
      en: 'Privacy First',
      ar: 'الخصوصية أولاً',
      zh: '隐私优先',
      nl: 'Privacy Voorop',
      it: 'Privacy al Primo Posto',
      de: 'Datenschutz zuerst',
      es: 'Privacidad Primero',
      fr: "Confidentialité d'abord", ja: 'プライバシー最優先', ko: '개인정보 보호 우선' },
    'testers.ways.privacy.desc': {
      en: 'Your face is automatically masked by AI. All data is GDPR compliant, encrypted, and never shared.',
      ar: 'يتم إخفاء وجهك تلقائيًا بواسطة الذكاء الاصطناعي. جميع البيانات متوافقة مع GDPR ومشفرة ولا تتم مشاركتها أبدًا.',
      zh: '您的面部由AI自动遮挡。所有数据符合GDPR标准，经过加密，绝不共享。',
      nl: 'Je gezicht wordt automatisch gemaskeerd door AI. Alle gegevens zijn AVG-conform, versleuteld en worden nooit gedeeld.',
      it: "Il tuo volto viene mascherato automaticamente dall'IA. Tutti i dati sono conformi al GDPR, crittografati e mai condivisi.",
      de: 'Ihr Gesicht wird automatisch durch KI maskiert. Alle Daten sind DSGVO-konform, verschlüsselt und werden niemals weitergegeben.',
      es: 'Tu rostro se oculta automáticamente con IA. Todos los datos cumplen con el RGPD, están cifrados y nunca se comparten.',
      fr: "Votre visage est automatiquement masqué par l'IA. Toutes les données sont conformes au RGPD, chiffrées et jamais partagées.", ja: '顔はAIで自動マスク。全データはGDPR準拠、暗号化、安全に保管されます。', ko: '얼굴은 AI로 자동 마스킹. 모든 데이터는 GDPR 준수, 암호화, 안전하게 보관됩니다.' },

    // ── How It Works Section ──
    'testers.how.title': {
      en: 'How it works',
      ar: 'كيف يعمل',
      zh: '运作方式',
      nl: 'Hoe het werkt',
      it: 'Come funziona',
      de: 'So funktioniert es',
      es: 'Cómo funciona',
      fr: 'Comment ça marche',
      ja: '仕組み',
      ko: '작동 방식'
    },
    'testers.how.step1.title': {
      en: 'We match you to a test',
      ar: 'نطابقك مع اختبار',
      zh: '我们为您匹配测试',
      nl: 'We koppelen je aan een test',
      it: 'Ti abbiniamo a un test',
      de: 'Wir ordnen Ihnen einen Test zu',
      es: 'Te asignamos una prueba',
      fr: 'Nous vous associons à un test',
      ja: '登録',
      ko: '등록'
    },
    'testers.how.step1.desc': {
      en: "After you sign up, we'll invite you when a test fits your profile and location. For Domus tests, food samples arrive at your door.",
      ar: 'بعد التسجيل، سندعوك عندما يناسب اختبار ملفك الشخصي وموقعك. لاختبارات Domus، تصل عينات الطعام إلى باب منزلك.',
      zh: '注册后，当有符合您个人资料和位置的测试时，我们会邀请您。对于Domus测试，食品样品会送到您家门口。',
      nl: 'Na je aanmelding nodigen we je uit als een test bij je profiel en locatie past. Bij Domus-tests komen voedselmonsters bij je aan de deur.',
      it: 'Dopo la registrazione, ti inviteremo quando un test corrisponde al tuo profilo e alla tua posizione. Per i test Domus, i campioni di cibo arrivano alla tua porta.',
      de: 'Nach Ihrer Anmeldung laden wir Sie ein, wenn ein Test zu Ihrem Profil und Standort passt. Bei Domus-Tests kommen Lebensmittelproben an Ihre Haustür.',
      es: 'Después de inscribirte, te invitaremos cuando una prueba se ajuste a tu perfil y ubicación. Para las pruebas Domus, las muestras de alimentos llegan a tu puerta.',
      fr: "Après votre inscription, nous vous inviterons lorsqu'un test correspondra à votre profil et votre emplacement. Pour les tests Domus, les échantillons alimentaires arrivent chez vous.", ja: '登録後、テストの機会をマッチングするためご連絡します。', ko: '등록 후 테스트 기회를 매칭하기 위해 연락드립니다.' },
    'testers.how.step2.title': {
      en: 'Record your experience',
      ar: 'سجّل تجربتك',
      zh: '记录您的体验',
      nl: 'Neem je ervaring op',
      it: 'Registra la tua esperienza',
      de: 'Zeichnen Sie Ihre Erfahrung auf',
      es: 'Graba tu experiencia',
      fr: 'Enregistrez votre expérience',
      ja: '選考',
      ko: '선발'
    },
    'testers.how.step2.desc': {
      en: 'Use your phone to record a short interview (Vox) or your full cooking and eating experience at home (Domus). Our AI masks your face automatically.',
      ar: 'استخدم هاتفك لتسجيل مقابلة قصيرة (Vox) أو تجربة الطهي والأكل الكاملة في المنزل (Domus). يقوم الذكاء الاصطناعي بإخفاء وجهك تلقائيًا.',
      zh: '用手机录制一段简短的访谈（Vox）或在家中录制完整的烹饪和用餐体验（Domus）。我们的AI会自动遮挡您的面部。',
      nl: 'Gebruik je telefoon om een kort interview op te nemen (Vox) of je volledige kook- en eetervaring thuis (Domus). Onze AI maskeert je gezicht automatisch.',
      it: "Usa il telefono per registrare una breve intervista (Vox) o la tua esperienza completa di cucina e degustazione a casa (Domus). La nostra IA maschera automaticamente il tuo volto.",
      de: 'Verwenden Sie Ihr Telefon, um ein kurzes Interview (Vox) oder Ihre komplette Koch- und Esserfahrung zu Hause (Domus) aufzuzeichnen. Unsere KI maskiert Ihr Gesicht automatisch.',
      es: 'Usa tu teléfono para grabar una breve entrevista (Vox) o tu experiencia completa de cocina y degustación en casa (Domus). Nuestra IA oculta tu rostro automáticamente.',
      fr: "Utilisez votre téléphone pour enregistrer un court entretien (Vox) ou votre expérience complète de cuisine et dégustation à domicile (Domus). Notre IA masque automatiquement votre visage.",
      ja: 'テストに適しているか確認します。',
      ko: '테스트에 적합한지 확인합니다.'
    },
    'testers.how.step3.title': {
      en: 'Get paid',
      ar: 'احصل على أجرك',
      zh: '获得报酬',
      nl: 'Word betaald',
      it: 'Ricevi il pagamento',
      de: 'Erhalten Sie Ihre Bezahlung',
      es: 'Recibe tu pago',
      fr: 'Recevez votre paiement',
      ja: 'テスト',
      ko: '테스트'
    },
    'testers.how.step3.desc': {
      en: "Once your test is submitted, you receive payment within a few business days. That's it.",
      ar: 'بمجرد تقديم اختبارك، تتلقى الدفع خلال أيام عمل قليلة. هذا كل شيء.',
      zh: '提交测试后，您将在几个工作日内收到付款。就这么简单。',
      nl: 'Zodra je test is ingediend, ontvang je betaling binnen enkele werkdagen. Dat is alles.',
      it: "Una volta inviato il test, ricevi il pagamento entro pochi giorni lavorativi. È tutto.",
      de: 'Sobald Ihr Test eingereicht ist, erhalten Sie die Zahlung innerhalb weniger Werktage. Das war es.',
      es: 'Una vez enviada tu prueba, recibes el pago en pocos días hábiles. Así de simple.',
      fr: "Une fois votre test soumis, vous recevez le paiement sous quelques jours ouvrables. C'est tout.", ja: 'テスト提出後、数営業日以内に報酬を受け取ります。', ko: '테스트 제출 후 며칠 내에 보수를 받습니다.' },

    // ── Sign Up Form ──
    'testers.form.title': {
      en: 'Join Our Tester Community',
      ar: 'انضم إلى مجتمع المختبرين',
      zh: '加入我们的测试员社区',
      nl: 'Word lid van onze Tester Community',
      it: 'Unisciti alla nostra Comunità di Tester',
      de: 'Treten Sie unserer Tester-Community bei',
      es: 'Únete a nuestra Comunidad de Catadores',
      fr: 'Rejoignez notre Communauté de Testeurs',
      ja: 'テスターとして登録',
      ko: '테스터로 등록'
    },
    'testers.form.security': {
      en: '<strong>Your data is secure:</strong> We use bank-level encryption to protect your personal information. Your data is stored in compliance with GDPR regulations.',
      ar: '<strong>بياناتك آمنة:</strong> نستخدم تشفيرًا بمستوى البنوك لحماية معلوماتك الشخصية. يتم تخزين بياناتك وفقًا للائحة GDPR.',
      zh: '<strong>您的数据是安全的：</strong>我们使用银行级加密来保护您的个人信息。您的数据按照GDPR法规存储。',
      nl: '<strong>Je gegevens zijn veilig:</strong> We gebruiken encryptie op bankniveau om je persoonlijke gegevens te beschermen. Je gegevens worden opgeslagen conform de AVG.',
      it: '<strong>I tuoi dati sono al sicuro:</strong> Utilizziamo crittografia di livello bancario per proteggere le tue informazioni personali. I tuoi dati sono archiviati in conformità con il GDPR.',
      de: '<strong>Ihre Daten sind sicher:</strong> Wir verwenden Verschlüsselung auf Bankniveau, um Ihre persönlichen Daten zu schützen. Ihre Daten werden DSGVO-konform gespeichert.',
      es: '<strong>Tus datos están seguros:</strong> Usamos cifrado de nivel bancario para proteger tu información personal. Tus datos se almacenan conforme al RGPD.',
      fr: "<strong>Vos données sont sécurisées :</strong> Nous utilisons un chiffrement de niveau bancaire pour protéger vos informations personnelles. Vos données sont stockées conformément au RGPD.", ja: '<strong>データは安全です：</strong>銀行レベルの暗号化で個人情報を保護します。', ko: '<strong>데이터는 안전합니다:</strong> 은행 수준의 암호화로 개인 정보를 보호합니다.' },
    'testers.success.title': {
      en: "You're in!",
      ar: 'تم تسجيلك!',
      zh: '注册成功！',
      nl: 'Je bent erbij!',
      it: 'Ci sei!',
      de: 'Sie sind dabei!',
      es: '¡Estás dentro!',
      fr: 'Vous êtes inscrit !', ja: '登録完了！', ko: '등록 완료!' },
    'testers.success.text': {
      en: "We'll contact you when a study is available in your area. In the meantime, keep an eye on your inbox.",
      ar: 'سنتواصل معك عندما تتوفر دراسة في منطقتك. في هذه الأثناء، تابع بريدك الإلكتروني.',
      zh: '当您所在地区有可用的研究时，我们会联系您。在此期间，请关注您的收件箱。',
      nl: 'We nemen contact met je op zodra er een studie beschikbaar is in jouw regio. Houd in de tussentijd je inbox in de gaten.',
      it: "Ti contatteremo quando uno studio sarà disponibile nella tua zona. Nel frattempo, tieni d'occhio la tua casella di posta.",
      de: 'Wir kontaktieren Sie, wenn eine Studie in Ihrer Region verfügbar ist. In der Zwischenzeit behalten Sie Ihren Posteingang im Auge.',
      es: 'Te contactaremos cuando haya un estudio disponible en tu zona. Mientras tanto, revisa tu bandeja de entrada.',
      fr: "Nous vous contacterons lorsqu'une étude sera disponible dans votre région. En attendant, surveillez votre boîte de réception.", ja: 'プロフィールに合ったテスト機会をお知らせします。', ko: '프로필에 맞는 테스트 기회를 안내해 드리겠습니다.' },
    'testers.success.contact': {
      en: 'Questions? Reach us at <a href="mailto:info@eatpol.com">info@eatpol.com</a>',
      ar: 'أسئلة؟ تواصل معنا على <a href="mailto:info@eatpol.com">info@eatpol.com</a>',
      zh: '有问题？请联系我们 <a href="mailto:info@eatpol.com">info@eatpol.com</a>',
      nl: 'Vragen? Neem contact op via <a href="mailto:info@eatpol.com">info@eatpol.com</a>',
      it: 'Domande? Contattaci a <a href="mailto:info@eatpol.com">info@eatpol.com</a>',
      de: 'Fragen? Erreichen Sie uns unter <a href="mailto:info@eatpol.com">info@eatpol.com</a>',
      es: '¿Preguntas? Escríbenos a <a href="mailto:info@eatpol.com">info@eatpol.com</a>',
      fr: 'Des questions ? Contactez-nous à <a href="mailto:info@eatpol.com">info@eatpol.com</a>', ja: 'ご質問は <a href="mailto:info@eatpol.com">info@eatpol.com</a> までお問い合わせください。', ko: '질문이 있으시면 <a href="mailto:info@eatpol.com">info@eatpol.com</a>으로 문의하세요.' },
    'testers.form.interest.heading': {
      en: 'What interests you?',
      ar: 'ما الذي يثير اهتمامك؟',
      zh: '您对什么感兴趣？',
      nl: 'Wat interesseert je?',
      it: 'Cosa ti interessa?',
      de: 'Was interessiert Sie?',
      es: '¿Qué te interesa?',
      fr: "Qu'est-ce qui vous intéresse ?", ja: '興味のあるテスト', ko: '관심 있는 테스트' },
    'testers.form.interest.label': {
      en: "I'd like to participate in: <span style=\"color: var(--bright-blue);\">*</span>",
      ar: 'أود المشاركة في: <span style="color: var(--bright-blue);">*</span>',
      zh: '我想参加：<span style="color: var(--bright-blue);">*</span>',
      nl: 'Ik wil graag deelnemen aan: <span style="color: var(--bright-blue);">*</span>',
      it: 'Vorrei partecipare a: <span style="color: var(--bright-blue);">*</span>',
      de: 'Ich möchte teilnehmen an: <span style="color: var(--bright-blue);">*</span>',
      es: 'Me gustaría participar en: <span style="color: var(--bright-blue);">*</span>',
      fr: 'Je souhaite participer à : <span style="color: var(--bright-blue);">*</span>', ja: '参加したいテスト', ko: '참여하고 싶은 테스트' },
    'testers.form.radio.vox.title': {
      en: 'Vox — Interviews only',
      ar: 'Vox — مقابلات فقط',
      zh: 'Vox — 仅访谈',
      nl: 'Vox — Alleen interviews',
      it: 'Vox — Solo interviste',
      de: 'Vox — Nur Interviews',
      es: 'Vox — Solo entrevistas',
      fr: 'Vox — Entretiens uniquement', ja: 'Vox — インタビューのみ', ko: 'Vox — 인터뷰만' },
    'testers.form.radio.vox.desc': {
      en: 'Quick video interviews from home (~15 min)',
      ar: 'مقابلات فيديو سريعة من المنزل (~15 دقيقة)',
      zh: '在家进行快速视频访谈（约15分钟）',
      nl: 'Korte video-interviews vanuit huis (~15 min)',
      it: 'Brevi interviste video da casa (~15 min)',
      de: 'Kurze Videointerviews von zu Hause (~15 Min.)',
      es: 'Entrevistas en video rápidas desde casa (~15 min)',
      fr: 'Courts entretiens vidéo depuis chez vous (~15 min)', ja: '自宅からの短いビデオインタビュー（約15分）', ko: '집에서 짧은 비디오 인터뷰 (~15분)' },
    'testers.form.radio.domus.title': {
      en: 'Vox + Domus — Interviews & home testing',
      ar: 'Vox + Domus — مقابلات واختبار منزلي',
      zh: 'Vox + Domus — 访谈和家庭测试',
      nl: 'Vox + Domus — Interviews & thuistest',
      it: 'Vox + Domus — Interviste e test a domicilio',
      de: 'Vox + Domus — Interviews & Heimtest',
      es: 'Vox + Domus — Entrevistas y pruebas en casa',
      fr: 'Vox + Domus — Entretiens et test à domicile', ja: 'Vox + Domus — インタビュー＆在宅テスト', ko: 'Vox + Domus — 인터뷰 & 가정 내 테스트' },
    'testers.form.radio.domus.desc': {
      en: 'Receive food samples, test at home, plus interviews',
      ar: 'استلم عينات طعام، اختبرها في المنزل، بالإضافة إلى مقابلات',
      zh: '接收食品样品，在家测试，外加访谈',
      nl: 'Ontvang voedselmonsters, test thuis, plus interviews',
      it: 'Ricevi campioni alimentari, testa a casa, più interviste',
      de: 'Lebensmittelproben erhalten, zu Hause testen, plus Interviews',
      es: 'Recibe muestras de alimentos, prueba en casa, más entrevistas',
      fr: "Recevez des échantillons, testez chez vous, plus des entretiens", ja: '食品サンプルを受け取り、自宅でテスト、さらにインタビュー', ko: '식품 샘플을 받고 집에서 테스트, 인터뷰도 함께' },
    'testers.form.personal.heading': {
      en: 'Personal Information',
      ar: 'المعلومات الشخصية',
      zh: '个人信息',
      nl: 'Persoonlijke Gegevens',
      it: 'Informazioni Personali',
      de: 'Persönliche Daten',
      es: 'Información Personal',
      fr: 'Informations Personnelles', ja: '個人情報', ko: '개인 정보' },
    'testers.form.firstName.label': {
      en: 'First Name <span style="color: var(--bright-blue);">*</span>',
      ar: 'الاسم الأول <span style="color: var(--bright-blue);">*</span>',
      zh: '名 <span style="color: var(--bright-blue);">*</span>',
      nl: 'Voornaam <span style="color: var(--bright-blue);">*</span>',
      it: 'Nome <span style="color: var(--bright-blue);">*</span>',
      de: 'Vorname <span style="color: var(--bright-blue);">*</span>',
      es: 'Nombre <span style="color: var(--bright-blue);">*</span>',
      fr: 'Prénom <span style="color: var(--bright-blue);">*</span>', ja: '名 <span style="color: var(--bright-blue);">*</span>', ko: '이름 <span style="color: var(--bright-blue);">*</span>' },
    'testers.form.firstName.error': {
      en: 'Please enter your first name',
      ar: 'يرجى إدخال اسمك الأول',
      zh: '请输入您的名字',
      nl: 'Vul je voornaam in',
      it: 'Inserisci il tuo nome',
      de: 'Bitte geben Sie Ihren Vornamen ein',
      es: 'Por favor, introduce tu nombre',
      fr: 'Veuillez entrer votre prénom',
      ja: '名を入力してください',
      ko: '이름을 입력해 주세요'
    },
    'testers.form.lastName.label': {
      en: 'Last Name <span style="color: var(--bright-blue);">*</span>',
      ar: 'اسم العائلة <span style="color: var(--bright-blue);">*</span>',
      zh: '姓 <span style="color: var(--bright-blue);">*</span>',
      nl: 'Achternaam <span style="color: var(--bright-blue);">*</span>',
      it: 'Cognome <span style="color: var(--bright-blue);">*</span>',
      de: 'Nachname <span style="color: var(--bright-blue);">*</span>',
      es: 'Apellido <span style="color: var(--bright-blue);">*</span>',
      fr: 'Nom de famille <span style="color: var(--bright-blue);">*</span>', ja: '姓 <span style="color: var(--bright-blue);">*</span>', ko: '성 <span style="color: var(--bright-blue);">*</span>' },
    'testers.form.lastName.error': {
      en: 'Please enter your last name',
      ar: 'يرجى إدخال اسم العائلة',
      zh: '请输入您的姓氏',
      nl: 'Vul je achternaam in',
      it: 'Inserisci il tuo cognome',
      de: 'Bitte geben Sie Ihren Nachnamen ein',
      es: 'Por favor, introduce tu apellido',
      fr: 'Veuillez entrer votre nom de famille',
      ja: '姓を入力してください',
      ko: '성을 입력해 주세요'
    },
    'testers.form.email.label': {
      en: 'Email Address <span style="color: var(--bright-blue);">*</span>',
      ar: 'البريد الإلكتروني <span style="color: var(--bright-blue);">*</span>',
      zh: '电子邮箱 <span style="color: var(--bright-blue);">*</span>',
      nl: 'E-mailadres <span style="color: var(--bright-blue);">*</span>',
      it: 'Indirizzo Email <span style="color: var(--bright-blue);">*</span>',
      de: 'E-Mail-Adresse <span style="color: var(--bright-blue);">*</span>',
      es: 'Correo Electrónico <span style="color: var(--bright-blue);">*</span>',
      fr: 'Adresse Email <span style="color: var(--bright-blue);">*</span>', ja: 'メールアドレス <span style="color: var(--bright-blue);">*</span>', ko: '이메일 주소 <span style="color: var(--bright-blue);">*</span>' },
    'testers.form.email.error': {
      en: 'Please enter a valid email',
      ar: 'يرجى إدخال بريد إلكتروني صالح',
      zh: '请输入有效的电子邮箱',
      nl: 'Vul een geldig e-mailadres in',
      it: 'Inserisci un indirizzo email valido',
      de: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
      es: 'Por favor, introduce un correo electrónico válido',
      fr: 'Veuillez entrer une adresse email valide',
      ja: '有効なメールアドレスを入力してください',
      ko: '유효한 이메일 주소를 입력해 주세요'
    },
    'testers.form.phone.label': {
      en: 'Phone Number <span style="color: var(--bright-blue);">*</span>',
      ar: 'رقم الهاتف <span style="color: var(--bright-blue);">*</span>',
      zh: '电话号码 <span style="color: var(--bright-blue);">*</span>',
      nl: 'Telefoonnummer <span style="color: var(--bright-blue);">*</span>',
      it: 'Numero di Telefono <span style="color: var(--bright-blue);">*</span>',
      de: 'Telefonnummer <span style="color: var(--bright-blue);">*</span>',
      es: 'Número de Teléfono <span style="color: var(--bright-blue);">*</span>',
      fr: 'Numéro de Téléphone <span style="color: var(--bright-blue);">*</span>', ja: '電話番号 <span style="color: var(--bright-blue);">*</span>', ko: '전화번호 <span style="color: var(--bright-blue);">*</span>' },
    'testers.form.phone.error': {
      en: 'Please enter your phone number',
      ar: 'يرجى إدخال رقم هاتفك',
      zh: '请输入您的电话号码',
      nl: 'Vul je telefoonnummer in',
      it: 'Inserisci il tuo numero di telefono',
      de: 'Bitte geben Sie Ihre Telefonnummer ein',
      es: 'Por favor, introduce tu número de teléfono',
      fr: 'Veuillez entrer votre numéro de téléphone',
      ja: '電話番号を入力してください',
      ko: '전화번호를 입력해 주세요'
    },
    'testers.form.age.label': {
      en: 'Age Range <span style="color: var(--bright-blue);">*</span>',
      ar: 'الفئة العمرية <span style="color: var(--bright-blue);">*</span>',
      zh: '年龄范围 <span style="color: var(--bright-blue);">*</span>',
      nl: 'Leeftijdsgroep <span style="color: var(--bright-blue);">*</span>',
      it: 'Fascia di Età <span style="color: var(--bright-blue);">*</span>',
      de: 'Altersgruppe <span style="color: var(--bright-blue);">*</span>',
      es: 'Rango de Edad <span style="color: var(--bright-blue);">*</span>',
      fr: "Tranche d'Âge <span style=\"color: var(--bright-blue);\">*</span>", ja: '年齢層 <span style="color: var(--bright-blue);">*</span>', ko: '연령대 <span style="color: var(--bright-blue);">*</span>' },
    'testers.form.age.placeholder': {
      en: 'Select your age range',
      ar: 'اختر فئتك العمرية',
      zh: '选择您的年龄范围',
      nl: 'Selecteer je leeftijdsgroep',
      it: 'Seleziona la tua fascia di età',
      de: 'Wählen Sie Ihre Altersgruppe',
      es: 'Selecciona tu rango de edad',
      fr: "Sélectionnez votre tranche d'âge", ja: '年齢層を選択', ko: '연령대를 선택하세요' },
    'testers.form.gender.label': {
      en: 'Gender',
      ar: 'الجنس',
      zh: '性别',
      nl: 'Geslacht',
      it: 'Genere',
      de: 'Geschlecht',
      es: 'Género',
      fr: 'Genre',
      ja: '性別',
      ko: '성별'
    },
    'testers.form.gender.prefer': {
      en: 'Prefer not to say',
      ar: 'أفضل عدم الإفصاح',
      zh: '不愿透露',
      nl: 'Zeg ik liever niet',
      it: 'Preferisco non dire',
      de: 'Möchte ich nicht angeben',
      es: 'Prefiero no decir',
      fr: 'Je préfère ne pas dire',
      ja: '回答しない',
      ko: '밝히고 싶지 않음'
    },
    'testers.form.gender.male': {
      en: 'Male', ar: 'ذكر', zh: '男', nl: 'Man', it: 'Uomo', de: 'Männlich', es: 'Masculino', fr: 'Homme', ja: '男性', ko: '남성' },
    'testers.form.gender.female': {
      en: 'Female', ar: 'أنثى', zh: '女', nl: 'Vrouw', it: 'Donna', de: 'Weiblich', es: 'Femenino', fr: 'Femme', ja: '女性', ko: '여성' },
    'testers.form.gender.other': {
      en: 'Other', ar: 'آخر', zh: '其他', nl: 'Anders', it: 'Altro', de: 'Andere', es: 'Otro', fr: 'Autre', ja: 'その他', ko: '기타' },
    'testers.form.location.heading': {
      en: 'Location',
      ar: 'الموقع',
      zh: '位置',
      nl: 'Locatie',
      it: 'Posizione',
      de: 'Standort',
      es: 'Ubicación',
      fr: 'Localisation', ja: '所在地', ko: '위치' },
    'testers.form.country.label': {
      en: 'Country <span style="color: var(--bright-blue);">*</span>',
      ar: 'الدولة <span style="color: var(--bright-blue);">*</span>',
      zh: '国家 <span style="color: var(--bright-blue);">*</span>',
      nl: 'Land <span style="color: var(--bright-blue);">*</span>',
      it: 'Paese <span style="color: var(--bright-blue);">*</span>',
      de: 'Land <span style="color: var(--bright-blue);">*</span>',
      es: 'País <span style="color: var(--bright-blue);">*</span>',
      fr: 'Pays <span style="color: var(--bright-blue);">*</span>', ja: '国 <span style="color: var(--bright-blue);">*</span>', ko: '국가 <span style="color: var(--bright-blue);">*</span>' },
    'testers.form.country.placeholder': {
      en: 'Select Country',
      ar: 'اختر الدولة',
      zh: '选择国家',
      nl: 'Selecteer Land',
      it: 'Seleziona Paese',
      de: 'Land auswählen',
      es: 'Seleccionar País',
      fr: 'Sélectionner le Pays',
      ja: '国を選択',
      ko: '국가를 선택하세요'
    },
    'testers.form.city.label': {
      en: 'City <span style="color: var(--bright-blue);">*</span>',
      ar: 'المدينة <span style="color: var(--bright-blue);">*</span>',
      zh: '城市 <span style="color: var(--bright-blue);">*</span>',
      nl: 'Stad <span style="color: var(--bright-blue);">*</span>',
      it: 'Città <span style="color: var(--bright-blue);">*</span>',
      de: 'Stadt <span style="color: var(--bright-blue);">*</span>',
      es: 'Ciudad <span style="color: var(--bright-blue);">*</span>',
      fr: 'Ville <span style="color: var(--bright-blue);">*</span>', ja: '市区町村 <span style="color: var(--bright-blue);">*</span>', ko: '도시 <span style="color: var(--bright-blue);">*</span>' },
    'testers.form.postal.label': {
      en: 'Postal Code <span style="color: var(--bright-blue);">*</span>',
      ar: 'الرمز البريدي <span style="color: var(--bright-blue);">*</span>',
      zh: '邮政编码 <span style="color: var(--bright-blue);">*</span>',
      nl: 'Postcode <span style="color: var(--bright-blue);">*</span>',
      it: 'Codice Postale <span style="color: var(--bright-blue);">*</span>',
      de: 'Postleitzahl <span style="color: var(--bright-blue);">*</span>',
      es: 'Código Postal <span style="color: var(--bright-blue);">*</span>',
      fr: 'Code Postal <span style="color: var(--bright-blue);">*</span>', ja: '郵便番号 <span style="color: var(--bright-blue);">*</span>', ko: '우편번호 <span style="color: var(--bright-blue);">*</span>' },
    'testers.form.delivery.heading': {
      en: 'Delivery Address',
      ar: 'عنوان التوصيل',
      zh: '配送地址',
      nl: 'Bezorgadres',
      it: 'Indirizzo di Consegna',
      de: 'Lieferadresse',
      es: 'Dirección de Entrega',
      fr: 'Adresse de Livraison', ja: '配送先住所', ko: '배송 주소' },
    'testers.form.street.label': {
      en: 'Street Address <span style="color: var(--bright-blue);">*</span>',
      ar: 'عنوان الشارع <span style="color: var(--bright-blue);">*</span>',
      zh: '街道地址 <span style="color: var(--bright-blue);">*</span>',
      nl: 'Straatnaam <span style="color: var(--bright-blue);">*</span>',
      it: 'Indirizzo <span style="color: var(--bright-blue);">*</span>',
      de: 'Straße <span style="color: var(--bright-blue);">*</span>',
      es: 'Dirección <span style="color: var(--bright-blue);">*</span>',
      fr: 'Adresse <span style="color: var(--bright-blue);">*</span>', ja: '番地 <span style="color: var(--bright-blue);">*</span>', ko: '도로명 주소 <span style="color: var(--bright-blue);">*</span>' },
    'testers.form.dietary.heading': {
      en: 'Dietary Information',
      ar: 'المعلومات الغذائية',
      zh: '饮食信息',
      nl: 'Voedingsinformatie',
      it: 'Informazioni Alimentari',
      de: 'Ernährungsinformationen',
      es: 'Información Dietética',
      fr: 'Informations Alimentaires', ja: '食事情報', ko: '식이 정보' },
    'testers.form.dietary.label': {
      en: 'Dietary Restrictions (check all that apply):',
      ar: 'القيود الغذائية (حدد كل ما ينطبق):',
      zh: '饮食限制（勾选所有适用项）：',
      nl: 'Dieetbeperkingen (vink alles aan dat van toepassing is):',
      it: 'Restrizioni alimentari (seleziona tutto ciò che si applica):',
      de: 'Ernährungseinschränkungen (alles Zutreffende ankreuzen):',
      es: 'Restricciones alimentarias (marca todas las que apliquen):',
      fr: 'Restrictions alimentaires (cochez toutes les cases applicables) :',
      ja: '食事制限',
      ko: '식이 제한'
    },
    'testers.form.diet.vegetarian': {
      en: 'Vegetarian', ar: 'نباتي', zh: '素食', nl: 'Vegetarisch', it: 'Vegetariano', de: 'Vegetarisch', es: 'Vegetariano', fr: 'Végétarien', ja: 'ベジタリアン', ko: '채식주의' },
    'testers.form.diet.vegan': {
      en: 'Vegan', ar: 'نباتي صرف', zh: '纯素', nl: 'Veganistisch', it: 'Vegano', de: 'Vegan', es: 'Vegano', fr: 'Végan', ja: 'ビーガン', ko: '비건' },
    'testers.form.diet.glutenFree': {
      en: 'Gluten-Free', ar: 'خالٍ من الغلوتين', zh: '无麸质', nl: 'Glutenvrij', it: 'Senza Glutine', de: 'Glutenfrei', es: 'Sin Gluten', fr: 'Sans Gluten', ja: 'グルテンフリー', ko: '글루텐 프리' },
    'testers.form.diet.lactoseFree': {
      en: 'Lactose-Free', ar: 'خالٍ من اللاكتوز', zh: '无乳糖', nl: 'Lactosevrij', it: 'Senza Lattosio', de: 'Laktosefrei', es: 'Sin Lactosa', fr: 'Sans Lactose', ja: '乳糖不耐症', ko: '유당불내증' },
    'testers.form.diet.halal': {
      en: 'Halal', ar: 'حلال', zh: '清真', nl: 'Halal', it: 'Halal', de: 'Halal', es: 'Halal', fr: 'Halal', ja: 'ハラール', ko: '할랄' },
    'testers.form.diet.kosher': {
      en: 'Kosher', ar: 'كوشر', zh: '犹太洁食', nl: 'Koosjer', it: 'Kosher', de: 'Koscher', es: 'Kosher', fr: 'Casher', ja: 'コーシャ', ko: '코셔' },
    'testers.form.allergies.label': {
      en: 'Food Allergies (comma-separated, e.g., nuts, dairy, shellfish)',
      ar: 'حساسية الطعام (مفصولة بفاصلة، مثل: مكسرات، ألبان، محار)',
      zh: '食物过敏（用逗号分隔，例如：坚果、乳制品、贝类）',
      nl: 'Voedselallergieën (gescheiden door komma, bijv. noten, zuivel, schaaldieren)',
      it: 'Allergie alimentari (separate da virgola, es. noci, latticini, crostacei)',
      de: 'Lebensmittelallergien (kommagetrennt, z.B. Nüsse, Milchprodukte, Schalentiere)',
      es: 'Alergias alimentarias (separadas por comas, ej. frutos secos, lácteos, mariscos)',
      fr: 'Allergies alimentaires (séparées par des virgules, ex. noix, produits laitiers, crustacés)', ja: '食物アレルギー（カンマ区切り、例：ナッツ、乳製品、甲殻類）', ko: '식품 알레르기 (쉼표로 구분, 예: 견과류, 유제품, 갑각류)' },
    'testers.form.consent.heading': {
      en: 'Legal Consent',
      ar: 'الموافقة القانونية',
      zh: '法律同意',
      nl: 'Juridische Toestemming',
      it: 'Consenso Legale',
      de: 'Rechtliche Einwilligung',
      es: 'Consentimiento Legal',
      fr: 'Consentement Légal', ja: '法的同意', ko: '법적 동의' },
    'testers.form.consent.gdpr': {
      en: '<strong>I consent to the processing of my personal data</strong> as described in the <a href="privacy_policy.html">Privacy Policy</a>. I understand my data will be encrypted and stored securely. <span style="color: var(--bright-blue);">*</span>',
      ar: '<strong>أوافق على معالجة بياناتي الشخصية</strong> كما هو موضح في <a href="privacy_policy.html">سياسة الخصوصية</a>. أفهم أن بياناتي ستكون مشفرة ومخزنة بأمان. <span style="color: var(--bright-blue);">*</span>',
      zh: '<strong>我同意处理我的个人数据</strong>，如<a href="privacy_policy.html">隐私政策</a>中所述。我理解我的数据将被加密并安全存储。<span style="color: var(--bright-blue);">*</span>',
      nl: '<strong>Ik geef toestemming voor de verwerking van mijn persoonsgegevens</strong> zoals beschreven in het <a href="privacy_policy.html">Privacybeleid</a>. Ik begrijp dat mijn gegevens versleuteld en veilig worden opgeslagen. <span style="color: var(--bright-blue);">*</span>',
      it: '<strong>Acconsento al trattamento dei miei dati personali</strong> come descritto nella <a href="privacy_policy.html">Informativa sulla Privacy</a>. Comprendo che i miei dati saranno crittografati e archiviati in modo sicuro. <span style="color: var(--bright-blue);">*</span>',
      de: '<strong>Ich stimme der Verarbeitung meiner personenbezogenen Daten zu</strong>, wie in der <a href="privacy_policy.html">Datenschutzrichtlinie</a> beschrieben. Ich verstehe, dass meine Daten verschlüsselt und sicher gespeichert werden. <span style="color: var(--bright-blue);">*</span>',
      es: '<strong>Consiento el tratamiento de mis datos personales</strong> como se describe en la <a href="privacy_policy.html">Política de Privacidad</a>. Entiendo que mis datos serán cifrados y almacenados de forma segura. <span style="color: var(--bright-blue);">*</span>',
      fr: '<strong>Je consens au traitement de mes données personnelles</strong> tel que décrit dans la <a href="privacy_policy.html">Politique de Confidentialité</a>. Je comprends que mes données seront chiffrées et stockées en toute sécurité. <span style="color: var(--bright-blue);">*</span>', ja: '<strong>プライバシーポリシーに記載された個人データの処理に同意します</strong>', ko: '<strong>개인정보 처리방침에 명시된 개인 데이터 처리에 동의합니다</strong>' },
    'testers.form.consent.terms': {
      en: '<strong>I accept the Terms and Conditions</strong> for food testers. I understand the risks involved in food testing and accept them. Read the full <a href="terms.html">Terms and Conditions</a>. <span style="color: var(--bright-blue);">*</span>',
      ar: '<strong>أقبل الشروط والأحكام</strong> الخاصة بمختبري الطعام. أفهم المخاطر المتعلقة باختبار الطعام وأقبلها. اقرأ <a href="terms.html">الشروط والأحكام</a> كاملة. <span style="color: var(--bright-blue);">*</span>',
      zh: '<strong>我接受食品测试员的条款和条件</strong>。我了解食品测试涉及的风险并接受这些风险。阅读完整的<a href="terms.html">条款和条件</a>。<span style="color: var(--bright-blue);">*</span>',
      nl: '<strong>Ik accepteer de Algemene Voorwaarden</strong> voor voedselproevers. Ik begrijp de risico\'s van voedselproeven en accepteer deze. Lees de volledige <a href="terms.html">Algemene Voorwaarden</a>. <span style="color: var(--bright-blue);">*</span>',
      it: '<strong>Accetto i Termini e le Condizioni</strong> per gli assaggiatori. Comprendo i rischi legati alla degustazione di alimenti e li accetto. Leggi i <a href="terms.html">Termini e Condizioni</a> completi. <span style="color: var(--bright-blue);">*</span>',
      de: '<strong>Ich akzeptiere die Allgemeinen Geschäftsbedingungen</strong> für Lebensmitteltester. Ich verstehe die mit Lebensmitteltests verbundenen Risiken und akzeptiere sie. Lesen Sie die vollständigen <a href="terms.html">AGB</a>. <span style="color: var(--bright-blue);">*</span>',
      es: '<strong>Acepto los Términos y Condiciones</strong> para catadores de alimentos. Entiendo los riesgos implicados en la cata de alimentos y los acepto. Lee los <a href="terms.html">Términos y Condiciones</a> completos. <span style="color: var(--bright-blue);">*</span>',
      fr: '<strong>J\'accepte les Conditions Générales</strong> pour les testeurs alimentaires. Je comprends les risques liés aux tests alimentaires et les accepte. Lire les <a href="terms.html">Conditions Générales</a> complètes. <span style="color: var(--bright-blue);">*</span>', ja: '<strong>フードテスターの利用規約に同意します</strong>。テスト参加への参加を理解しています。', ko: '<strong>식품 테스터 이용약관에 동의합니다</strong>. 테스트 참여에 대해 이해합니다.' },
    'testers.form.consent.age': {
      en: '<strong>I confirm that I am 18 years or older</strong> and legally able to participate in food testing. <span style="color: var(--bright-blue);">*</span>',
      ar: '<strong>أؤكد أن عمري 18 عامًا أو أكثر</strong> وأنني مؤهل قانونيًا للمشاركة في اختبار الطعام. <span style="color: var(--bright-blue);">*</span>',
      zh: '<strong>我确认我已年满18周岁</strong>，并且具有参加食品测试的法定资格。<span style="color: var(--bright-blue);">*</span>',
      nl: '<strong>Ik bevestig dat ik 18 jaar of ouder ben</strong> en wettelijk in staat om deel te nemen aan voedselproeven. <span style="color: var(--bright-blue);">*</span>',
      it: '<strong>Confermo di avere 18 anni o più</strong> e di essere legalmente idoneo a partecipare a test alimentari. <span style="color: var(--bright-blue);">*</span>',
      de: '<strong>Ich bestätige, dass ich 18 Jahre oder älter bin</strong> und rechtlich zur Teilnahme an Lebensmitteltests berechtigt bin. <span style="color: var(--bright-blue);">*</span>',
      es: '<strong>Confirmo que tengo 18 años o más</strong> y estoy legalmente habilitado para participar en pruebas de alimentos. <span style="color: var(--bright-blue);">*</span>',
      fr: '<strong>Je confirme avoir 18 ans ou plus</strong> et être légalement apte à participer aux tests alimentaires. <span style="color: var(--bright-blue);">*</span>', ja: '<strong>18歳以上であることを確認します</strong>。法的にテストに参加できます。', ko: '<strong>18세 이상임을 확인합니다</strong>. 법적으로 테스트에 참여할 수 있습니다.' },
    'testers.form.consent.marketing': {
      en: 'I would like to receive updates about new testing opportunities via email (optional).',
      ar: 'أرغب في تلقي تحديثات حول فرص اختبار جديدة عبر البريد الإلكتروني (اختياري).',
      zh: '我希望通过电子邮件接收有关新测试机会的更新（可选）。',
      nl: 'Ik wil graag updates ontvangen over nieuwe testmogelijkheden via e-mail (optioneel).',
      it: 'Desidero ricevere aggiornamenti sulle nuove opportunità di test via email (facoltativo).',
      de: 'Ich möchte Updates über neue Testmöglichkeiten per E-Mail erhalten (optional).',
      es: 'Me gustaría recibir actualizaciones sobre nuevas oportunidades de prueba por correo electrónico (opcional).',
      fr: "Je souhaite recevoir des mises à jour sur les nouvelles opportunités de test par email (facultatif).", ja: '新しいテスト機会についてメールで更新を受け取りたいです（任意）', ko: '새로운 테스트 기회에 대한 이메일 업데이트를 받고 싶습니다 (선택사항)' },
    'testers.form.loading': {
      en: 'Securing your registration...',
      ar: 'جارٍ تأمين تسجيلك...',
      zh: '正在安全处理您的注册...',
      nl: 'Je registratie wordt beveiligd...',
      it: 'Stiamo proteggendo la tua registrazione...',
      de: 'Ihre Registrierung wird gesichert...',
      es: 'Asegurando tu registro...',
      fr: 'Sécurisation de votre inscription...', ja: '登録を処理中...', ko: '등록 처리 중...' },
    'testers.form.submit': {
      en: 'Sign Up & Start Earning',
      ar: 'سجّل وابدأ بالربح',
      zh: '注册并开始赚钱',
      nl: 'Aanmelden & Begin met Verdienen',
      it: 'Iscriviti e Inizia a Guadagnare',
      de: 'Anmelden & Geld verdienen',
      es: 'Regístrate y Empieza a Ganar',
      fr: "S'inscrire et Commencer à Gagner", ja: '登録して報酬を得る', ko: '등록하고 수입 시작' },

    // ── FAQ Section ──
    'testers.faq.title': {
      en: 'FAQs',
      ar: 'الأسئلة الشائعة',
      zh: '常见问题',
      nl: 'Veelgestelde Vragen',
      it: 'Domande Frequenti',
      de: 'Häufige Fragen',
      es: 'Preguntas Frecuentes',
      fr: 'Questions Fréquentes',
      ja: 'よくある質問',
      ko: '자주 묻는 질문'
    },
    'testers.faq.q1': {
      en: "What's the difference between Vox and Domus?",
      ar: 'ما الفرق بين Vox و Domus؟',
      zh: 'Vox和Domus有什么区别？',
      nl: 'Wat is het verschil tussen Vox en Domus?',
      it: 'Qual è la differenza tra Vox e Domus?',
      de: 'Was ist der Unterschied zwischen Vox und Domus?',
      es: '¿Cuál es la diferencia entre Vox y Domus?',
      fr: 'Quelle est la différence entre Vox et Domus ?',
      ja: '誰でも登録できますか？',
      ko: '누구나 등록할 수 있나요?'
    },
    'testers.faq.a1': {
      en: "Vox is a short video interview (~15 min) where you share your opinion about food products. Domus is a full in-home test — we ship food samples to your door and you record your cooking and eating experience. You can sign up for one or both.",
      ar: 'Vox هو مقابلة فيديو قصيرة (~15 دقيقة) تشارك فيها رأيك حول المنتجات الغذائية. Domus هو اختبار منزلي كامل — نرسل عينات طعام إلى باب منزلك وتسجل تجربة الطهي والأكل. يمكنك التسجيل لأحدهما أو كليهما.',
      zh: 'Vox是一个简短的视频访谈（约15分钟），您可以分享对食品产品的看法。Domus是完整的家庭测试——我们将食品样品送到您家门口，您录制烹饪和用餐体验。您可以注册其中一项或两项。',
      nl: 'Vox is een kort video-interview (~15 min) waarin je je mening deelt over voedingsproducten. Domus is een volledige thuistest — we sturen voedselmonsters naar je deur en je neemt je kook- en eetervaring op. Je kunt je voor een of beide aanmelden.',
      it: "Vox è una breve intervista video (~15 min) in cui condividi la tua opinione sui prodotti alimentari. Domus è un test completo a domicilio — spediamo campioni di cibo a casa tua e tu registri la tua esperienza di cucina e degustazione. Puoi iscriverti per uno o entrambi.",
      de: 'Vox ist ein kurzes Videointerview (~15 Min.), in dem Sie Ihre Meinung zu Lebensmittelprodukten teilen. Domus ist ein vollständiger Heimtest — wir senden Lebensmittelproben an Ihre Tür und Sie zeichnen Ihre Koch- und Esserfahrung auf. Sie können sich für eines oder beides anmelden.',
      es: 'Vox es una breve entrevista en video (~15 min) donde compartes tu opinión sobre productos alimentarios. Domus es una prueba completa en casa — enviamos muestras de alimentos a tu puerta y grabas tu experiencia de cocina y degustación. Puedes inscribirte en una o ambas.',
      fr: "Vox est un court entretien vidéo (~15 min) où vous partagez votre avis sur des produits alimentaires. Domus est un test complet à domicile — nous envoyons des échantillons alimentaires chez vous et vous filmez votre expérience de cuisine et dégustation. Vous pouvez vous inscrire pour l'un ou les deux.", ja: 'Voxは食品についての意見を共有する短いビデオインタビュー（約15分）です。Domusでは食品を自宅に受け取り、キッチンでテストします。', ko: 'Vox는 식품에 대한 의견을 공유하는 짧은 비디오 인터뷰(~15분)입니다. Domus에서는 식품을 집으로 받아 주방에서 테스트합니다.' },
    'testers.faq.q2': {
      en: 'How often will I be asked to test?',
      ar: 'كم مرة سيُطلب مني الاختبار؟',
      zh: '我多久会被邀请参加一次测试？',
      nl: 'Hoe vaak word ik gevraagd om te testen?',
      it: 'Con quale frequenza mi verrà chiesto di testare?',
      de: 'Wie oft werde ich zum Testen eingeladen?',
      es: '¿Con qué frecuencia me pedirán hacer pruebas?',
      fr: 'À quelle fréquence serai-je sollicité pour tester ?',
      ja: '報酬はどのくらいですか？',
      ko: '보수는 얼마나 되나요?'
    },
    'testers.faq.a2': {
      en: "It depends on your location and our current projects. Most testers participate in 1–3 tests per month. You can always decline if a test doesn't suit you.",
      ar: 'يعتمد ذلك على موقعك ومشاريعنا الحالية. يشارك معظم المختبرين في 1-3 اختبارات شهريًا. يمكنك دائمًا الرفض إذا لم يناسبك الاختبار.',
      zh: '这取决于您的位置和我们当前的项目。大多数测试员每月参加1-3次测试。如果测试不适合您，您可以随时拒绝。',
      nl: 'Dat hangt af van je locatie en onze huidige projecten. De meeste testers doen 1-3 tests per maand. Je kunt altijd weigeren als een test je niet past.',
      it: "Dipende dalla tua posizione e dai nostri progetti attuali. La maggior parte dei tester partecipa a 1-3 test al mese. Puoi sempre rifiutare se un test non fa per te.",
      de: 'Das hängt von Ihrem Standort und unseren aktuellen Projekten ab. Die meisten Tester nehmen an 1-3 Tests pro Monat teil. Sie können jederzeit ablehnen, wenn ein Test nicht zu Ihnen passt.',
      es: 'Depende de tu ubicación y nuestros proyectos actuales. La mayoría de los catadores participan en 1-3 pruebas al mes. Siempre puedes rechazar si una prueba no te conviene.',
      fr: "Cela dépend de votre emplacement et de nos projets en cours. La plupart des testeurs participent à 1 à 3 tests par mois. Vous pouvez toujours refuser si un test ne vous convient pas.",
      ja: '報酬はテストの種類によって異なります。詳細は選考後にお知らせします。',
      ko: '보수는 테스트 유형에 따라 다릅니다. 자세한 내용은 선발 후 안내해 드립니다.'
    },
    'testers.faq.q3': {
      en: 'How much will I get paid?',
      ar: 'كم سأحصل على أجر؟',
      zh: '我能获得多少报酬？',
      nl: 'Hoeveel krijg ik betaald?',
      it: 'Quanto verrò pagato?',
      de: 'Wie viel werde ich bezahlt?',
      es: '¿Cuánto me pagarán?',
      fr: 'Combien serai-je payé ?',
      ja: 'プライバシーはどうなりますか？',
      ko: '개인정보는 어떻게 되나요?'
    },
    'testers.faq.a3': {
      en: "Compensation varies depending on the type and complexity of the test. You'll always know the amount before you accept a test.",
      ar: 'يختلف التعويض حسب نوع وتعقيد الاختبار. ستعرف دائمًا المبلغ قبل قبول الاختبار.',
      zh: '报酬因测试类型和复杂程度而异。在接受测试之前，您始终会知道金额。',
      nl: 'De vergoeding varieert afhankelijk van het type en de complexiteit van de test. Je weet altijd het bedrag voordat je een test accepteert.',
      it: "Il compenso varia in base al tipo e alla complessità del test. Conoscerai sempre l'importo prima di accettare un test.",
      de: 'Die Vergütung variiert je nach Art und Komplexität des Tests. Sie kennen den Betrag immer, bevor Sie einen Test annehmen.',
      es: 'La compensación varía según el tipo y complejidad de la prueba. Siempre conocerás el monto antes de aceptar una prueba.',
      fr: "La rémunération varie selon le type et la complexité du test. Vous connaîtrez toujours le montant avant d'accepter un test.", ja: '報酬はテストの種類と複雑さによって異なります。', ko: '보수는 테스트 유형과 복잡성에 따라 다릅니다.' },
    'testers.faq.q4': {
      en: 'What happens to my video recording?',
      ar: 'ماذا يحدث لتسجيل الفيديو الخاص بي؟',
      zh: '我的视频录像会怎样处理？',
      nl: 'Wat gebeurt er met mijn video-opname?',
      it: 'Cosa succede alla mia registrazione video?',
      de: 'Was passiert mit meiner Videoaufnahme?',
      es: '¿Qué pasa con mi grabación de video?',
      fr: "Qu'advient-il de mon enregistrement vidéo ?", ja: 'ビデオ録画はどうなりますか？', ko: '비디오 녹화는 어떻게 되나요?' },
    'testers.faq.a4': {
      en: 'Your face is automatically masked by AI. Videos are analyzed by our system and securely stored in compliance with GDPR. We never share raw footage.',
      ar: 'يتم إخفاء وجهك تلقائيًا بواسطة الذكاء الاصطناعي. يتم تحليل الفيديوهات بواسطة نظامنا وتخزينها بأمان وفقًا لـ GDPR. لا نشارك أبدًا اللقطات الأصلية.',
      zh: '您的面部由AI自动遮挡。视频由我们的系统分析并按照GDPR合规安全存储。我们绝不分享原始录像。',
      nl: 'Je gezicht wordt automatisch gemaskeerd door AI. Video\'s worden geanalyseerd door ons systeem en veilig opgeslagen conform de AVG. We delen nooit onbewerkte beelden.',
      it: "Il tuo volto viene mascherato automaticamente dall'IA. I video vengono analizzati dal nostro sistema e archiviati in modo sicuro nel rispetto del GDPR. Non condividiamo mai il filmato originale.",
      de: 'Ihr Gesicht wird automatisch durch KI maskiert. Videos werden von unserem System analysiert und DSGVO-konform sicher gespeichert. Wir geben niemals Rohmaterial weiter.',
      es: 'Tu rostro se oculta automáticamente con IA. Los videos son analizados por nuestro sistema y almacenados de forma segura conforme al RGPD. Nunca compartimos las grabaciones originales.',
      fr: "Votre visage est automatiquement masqué par l'IA. Les vidéos sont analysées par notre système et stockées en toute sécurité conformément au RGPD. Nous ne partageons jamais les images brutes.", ja: '顔はAIで自動マスク。ビデオはシステムで分析され安全に保管されます。', ko: '얼굴은 AI로 자동 마스킹됩니다. 비디오는 시스템에서 분석되고 안전하게 보관됩니다.' },
    'testers.faq.q5': {
      en: 'Do I need special equipment?',
      ar: 'هل أحتاج إلى معدات خاصة؟',
      zh: '我需要特殊设备吗？',
      nl: 'Heb ik speciale apparatuur nodig?',
      it: 'Ho bisogno di attrezzature speciali?',
      de: 'Brauche ich spezielle Ausrüstung?',
      es: '¿Necesito equipo especial?',
      fr: "Ai-je besoin d'un équipement spécial ?", ja: '特別な機材は必要ですか？', ko: '특별한 장비가 필요한가요?' },
    'testers.faq.a5': {
      en: 'Just a smartphone with a camera and internet connection. We provide simple setup instructions inside the app.',
      ar: 'فقط هاتف ذكي مزود بكاميرا واتصال بالإنترنت. نقدم تعليمات إعداد بسيطة داخل التطبيق.',
      zh: '只需一部带摄像头和互联网连接的智能手机。我们在应用程序中提供简单的设置说明。',
      nl: 'Alleen een smartphone met camera en internetverbinding. We geven eenvoudige installatie-instructies in de app.',
      it: "Solo uno smartphone con fotocamera e connessione internet. Forniamo semplici istruzioni di configurazione all'interno dell'app.",
      de: 'Nur ein Smartphone mit Kamera und Internetverbindung. Wir stellen einfache Einrichtungsanweisungen in der App bereit.',
      es: 'Solo un smartphone con cámara y conexión a internet. Proporcionamos instrucciones sencillas de configuración dentro de la app.',
      fr: "Juste un smartphone avec caméra et connexion internet. Nous fournissons des instructions de configuration simples dans l'application.", ja: 'カメラ付きスマートフォンとインターネット接続だけで大丈夫。簡単なセットアップガイドを提供します。', ko: '카메라가 달린 스마트폰과 인터넷 연결만 있으면 됩니다. 간단한 설정 가이드를 제공합니다.' }
  };

  /* ──────────────────────────────────────────────
     ENGINE
     ────────────────────────────────────────────── */

  function getStoredLang() {
    var params = new URLSearchParams(window.location.search);
    return params.get('lang') || localStorage.getItem('eatpol_lang') || 'en';
  }

  function setLang(lang) {
    if (!LANGUAGES[lang]) lang = 'en';
    localStorage.setItem('eatpol_lang', lang);

    // Update HTML dir and lang attributes
    var html = document.documentElement;
    html.setAttribute('lang', lang);
    html.setAttribute('dir', LANGUAGES[lang].dir);

    // Update all [data-i18n] elements
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      if (T[key] && T[key][lang]) {
        // Check if element has data-i18n-attr (for attributes like placeholder, alt)
        var attr = el.getAttribute('data-i18n-attr');
        if (attr) {
          el.setAttribute(attr, T[key][lang]);
        } else {
          // Use safe HTML setter for formatted translations
          setHtml(el, T[key][lang]);
        }
      }
    });

    // Update meta tags
    if (T['meta.title'] && T['meta.title'][lang]) {
      document.title = T['meta.title'][lang].replace(/<[^>]*>/g, '');
    }
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && T['meta.description'] && T['meta.description'][lang]) {
      metaDesc.setAttribute('content', T['meta.description'][lang]);
    }
    var ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && T['meta.title'] && T['meta.title'][lang]) {
      ogTitle.setAttribute('content', T['meta.title'][lang].replace(/<[^>]*>/g, ''));
    }
    var ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && T['meta.description'] && T['meta.description'][lang]) {
      ogDesc.setAttribute('content', T['meta.description'][lang]);
    }

    // Update dropdown toggle and active states
    var info = LANGUAGES[lang];
    var toggleFlag = document.querySelector('.lang-toggle-flag');
    var toggleCode = document.querySelector('.lang-toggle-code');
    if (toggleFlag && info) toggleFlag.textContent = info.flag;
    if (toggleCode) toggleCode.textContent = lang.toUpperCase();
    document.querySelectorAll('.lang-option').forEach(function(opt) {
      opt.classList.toggle('lang-option--active', opt.dataset.lang === lang);
    });

    // Update URL without reload
    var url = new URL(window.location);
    if (lang === 'en') {
      url.searchParams.delete('lang');
    } else {
      url.searchParams.set('lang', lang);
    }
    window.history.replaceState({}, '', url);
  }

  function buildLangBar() {
    // Inject CSS for the nav dropdown language switcher (once)
    if (!document.getElementById('lang-bar-styles')) {
      var style = document.createElement('style');
      style.id = 'lang-bar-styles';
      style.textContent = [
        '/* Language dropdown in nav */',
        '.lang-dropdown{position:relative;margin-left:1.2rem;list-style:none}',
        '.lang-toggle{display:flex;align-items:center;gap:5px;cursor:pointer;padding:6px 10px;border:1.5px solid rgba(17,39,82,0.1);border-radius:8px;background:transparent;font-family:"Outfit",sans-serif;font-size:14px;font-weight:500;color:var(--warm-dark,#112752);transition:all 0.2s ease}',
        '.lang-toggle:hover{border-color:rgba(18,151,224,0.3);color:var(--bright-blue,#1297e0)}',
        '.lang-toggle-flag{font-size:18px;line-height:1}',
        '.lang-toggle-chevron{font-size:9px;transition:transform 0.25s ease;margin-left:1px;opacity:0.5}',
        '.lang-dropdown.open .lang-toggle-chevron{transform:rotate(180deg)}',
        '.lang-dropdown.open .lang-toggle{border-color:rgba(18,151,224,0.3);color:var(--bright-blue,#1297e0)}',
        '.lang-menu{position:absolute;top:calc(100% + 8px);right:0;min-width:170px;background:rgba(255,255,255,0.98);-webkit-backdrop-filter:saturate(180%) blur(20px);backdrop-filter:saturate(180%) blur(20px);border:1px solid rgba(17,39,82,0.08);border-radius:10px;box-shadow:0 8px 32px rgba(17,39,82,0.12),0 2px 8px rgba(17,39,82,0.06);padding:5px;opacity:0;pointer-events:none;transform:translateY(4px);transition:opacity 0.2s ease,transform 0.2s ease;z-index:1001;list-style:none}',
        '.lang-dropdown.open .lang-menu{opacity:1;pointer-events:all;transform:translateY(0)}',
        '.lang-option{display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:7px;cursor:pointer;transition:all 0.15s ease;border:none;background:none;width:100%;font-family:"Outfit",sans-serif;font-size:14px;font-weight:500;color:var(--warm-dark,#112752);text-align:left}',
        '.lang-option:hover{background:rgba(18,151,224,0.06);color:var(--bright-blue,#1297e0)}',
        '.lang-option--active{background:rgba(0,191,99,0.08);font-weight:600}',
        '.lang-option--active .lang-option-check{display:inline}',
        '.lang-option-flag{font-size:18px;line-height:1;flex-shrink:0}',
        '.lang-option-label{flex:1}',
        '.lang-option-check{display:none;font-size:11px;color:var(--green,#00bf63);flex-shrink:0}',
        '/* RTL adjustment */',
        '[dir="rtl"] .lang-dropdown{margin-left:0;margin-right:1.2rem}',
        '[dir="rtl"] .lang-menu{right:auto;left:0}',
        '/* Mobile: show in hamburger menu */',
        '@media(max-width:768px){.lang-dropdown{margin:0.75rem 0 0;padding-top:0.75rem;border-top:1px solid rgba(17,39,82,0.06);width:100%}.lang-toggle{width:100%;justify-content:center}.lang-menu{position:static;opacity:1;pointer-events:all;transform:none;box-shadow:none;border:1px solid rgba(17,39,82,0.06);margin-top:6px;max-height:0;overflow:hidden;padding:0;transition:max-height 0.3s ease,padding 0.2s ease}.lang-dropdown.open .lang-menu{max-height:400px;padding:5px}}'
      ].join('\n');
      document.head.appendChild(style);
    }

    // Build the dropdown structure
    var dropdown = document.createElement('li');
    dropdown.className = 'lang-dropdown';

    // Toggle button — shows current language flag + code
    var currentLang = getStoredLang();
    var currentInfo = LANGUAGES[currentLang] || LANGUAGES.en;

    var toggle = document.createElement('button');
    toggle.className = 'lang-toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-haspopup', 'true');

    var toggleFlag = document.createElement('span');
    toggleFlag.className = 'lang-toggle-flag';
    toggleFlag.textContent = currentInfo.flag;

    var toggleCode = document.createElement('span');
    toggleCode.className = 'lang-toggle-code';
    toggleCode.textContent = currentLang.toUpperCase();

    var toggleChevron = document.createElement('i');
    toggleChevron.className = 'fas fa-chevron-down lang-toggle-chevron';

    toggle.appendChild(toggleFlag);
    toggle.appendChild(toggleCode);
    toggle.appendChild(toggleChevron);
    dropdown.appendChild(toggle);

    // Dropdown menu
    var menu = document.createElement('ul');
    menu.className = 'lang-menu';

    Object.keys(LANGUAGES).forEach(function(code) {
      var info = LANGUAGES[code];
      var option = document.createElement('li');
      var btn = document.createElement('button');
      btn.className = 'lang-option' + (code === currentLang ? ' lang-option--active' : '');
      btn.dataset.lang = code;

      var optFlag = document.createElement('span');
      optFlag.className = 'lang-option-flag';
      optFlag.textContent = info.flag;

      var optLabel = document.createElement('span');
      optLabel.className = 'lang-option-label';
      optLabel.textContent = info.label;

      var optCheck = document.createElement('span');
      optCheck.className = 'lang-option-check';
      var checkIcon = document.createElement('i');
      checkIcon.className = 'fas fa-check';
      optCheck.appendChild(checkIcon);

      btn.appendChild(optFlag);
      btn.appendChild(optLabel);
      btn.appendChild(optCheck);
      option.appendChild(btn);
      menu.appendChild(option);

      btn.addEventListener('click', function() {
        setLang(code);
        // Update toggle display
        toggleFlag.textContent = info.flag;
        toggleCode.textContent = code.toUpperCase();
        // Update active states
        menu.querySelectorAll('.lang-option').forEach(function(o) {
          o.classList.toggle('lang-option--active', o.dataset.lang === code);
        });
        // Close dropdown
        dropdown.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    dropdown.appendChild(menu);

    // Toggle open/close
    toggle.addEventListener('click', function(e) {
      e.stopPropagation();
      var isOpen = dropdown.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close on outside click
    document.addEventListener('click', function(e) {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Insert into the nav-menu, after the last nav-item
    var navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
      navMenu.appendChild(dropdown);
    } else {
      // Fallback: append to body as fixed element
      dropdown.style.cssText = 'position:fixed;top:16px;right:16px;z-index:1002';
      document.body.appendChild(dropdown);
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    buildLangBar();
    var lang = getStoredLang();
    setLang(lang);
  }

  // Expose for external use
  window.eatpolI18n = { setLang: setLang, getStoredLang: getStoredLang, LANGUAGES: LANGUAGES };
})();
