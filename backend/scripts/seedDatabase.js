require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const mongoose  = require('mongoose');
const Monastery = require('../models/Monastery');
const Festival  = require('../models/Festival');
const Language  = require('../models/Language');
const Scripture = require('../models/Scripture');

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGODB_URI, { dbName: 'monastery360' });
  console.log(`Connected: ${conn.connection.host}`);
};

// ─── LANGUAGES ────────────────────────────────────────────────────────────────
const languages = [
  { code: 'en', name: 'English',  nativeName: 'English',   flagEmoji: '🇬🇧' },
  { code: 'hi', name: 'Hindi',    nativeName: 'हिन्दी',     flagEmoji: '🇮🇳' },
  { code: 'ne', name: 'Nepali',   nativeName: 'नेपाली',     flagEmoji: '🇳🇵' },
  { code: 'bo', name: 'Tibetan',  nativeName: 'བོད་སྐད་',   flagEmoji: '🏔️'  },
  { code: 'zh', name: 'Mandarin', nativeName: '普通话',      flagEmoji: '🇨🇳' },
];

// ─── AUDIO GUIDE SCRIPTS (read by Web Speech API on the frontend) ─────────────
const guides = {
  rumtek: {
    en: `Welcome to Rumtek Monastery, the largest and most magnificent monastery in Sikkim. Also known as the Dharma Chakra Centre, Rumtek serves as the seat of the Kagyu order of Tibetan Buddhism. Founded in the sixteenth century by the ninth Karmapa, the monastery was rebuilt in its current grand form in 1960 by the sixteenth Karmapa after fleeing Tibet. As you enter the main courtyard, you will notice the stunning golden stupa that houses sacred relics. The main prayer hall is adorned with elaborate thangkas, murals, and golden statues of the Buddha. Every year during Losar, the Tibetan New Year, the monastery comes alive with vibrant ceremonies and mask dances. The monastery complex also houses a Buddhist college and an institute for higher studies. Please walk clockwise around the prayer wheels, maintain silence in the prayer halls, and feel the profound spiritual energy of this sacred place.`,
    hi: `रुमटेक मठ में आपका स्वागत है, जो सिक्किम का सबसे बड़ा और सबसे भव्य मठ है। धर्म चक्र केंद्र के नाम से भी जाना जाने वाला यह मठ तिब्बती बौद्ध धर्म के काग्यू संप्रदाय का केंद्र है। सोलहवीं शताब्दी में नौवें कर्मापा द्वारा स्थापित, इस मठ का वर्तमान भव्य रूप 1960 में सोलहवें कर्मापा ने तिब्बत से पलायन के बाद बनवाया था। मुख्य प्रांगण में सोलहवें कर्मापा के पवित्र अवशेषों वाला सुनहरा स्तूप दिखेगा। मुख्य प्रार्थना कक्ष में थंगका, भित्तिचित्र और बुद्ध की सोने की मूर्तियाँ सुशोभित हैं। यहाँ शांति बनाए रखें और प्रार्थना चक्रों के चारों ओर दक्षिणावर्त चलें।`,
    ne: `रुम्टेक मठमा तपाईंलाई स्वागत छ, जो सिक्किमको सबैभन्दा ठूलो र भव्य मठ हो। धर्म चक्र केन्द्रको नामले पनि चिनिने यो मठ तिब्बती बौद्ध धर्मको काग्यु शाखाको सिंहासन हो। मुख्य प्रांगणमा सुनको स्तूप छ जसमा पवित्र अवशेष राखिएको छ। कृपया प्रार्थना कक्षमा मौनता राख्नुहोस् र प्रार्थना चक्रको वरिपरि घडी दिशामा हिड्नुहोस्।`,
    bo: `ཁྱེད་རྣམས་རུམ་ཏེཀ་དགོན་པར་བཀྲ་ཤིས་བདེ་ལེགས་ཞུ། རུམ་ཏེཀ་དགོན་པ་ནི་སི་ཀིམ་གྱི་དགོན་པ་ཆེ་ཤོས་ཤིག་ཡིན། ཀཱ་གྱུའི་སྐྱབས་མགོན་རིན་པོ་ཆེ་ཞལ་ནས་ཕྱག་བཞེངས་གནང་བ་ཡིན། གཙུག་ལག་ཁང་གི་ནང་དུ་ཐང་ཀ་དང་རྒྱན་བཀོད་མཛེས་པ་མང་པོ་ཡོད། ཀུན་གྱིས་ཞི་བདེའི་སེམས་ཀྱིས་མཆོད་རྟེན་གཡས་ཀར་སྐོར་རོགས་གནང་།`,
    zh: `欢迎来到隆德寺，锡金最大、最雄伟的寺庙。隆德寺也称法轮中心，是藏传佛教噶举派的驻锡地。寺庙由第十六世噶玛巴于1960年从西藏逃离后重建。进入主庭院，您将看到金色佛塔，内藏圣物。主殿装饰着精美的唐卡、壁画和金佛像。每年藏历新年期间，寺庙都会举行盛大的仪式和面具舞蹈。请顺时针绕转经轮，在禅堂内保持安静，感受这神圣之地的深厚灵气。`,
  },
  enchey: {
    en: `Welcome to Enchey Monastery, one of Gangtok's most beloved spiritual landmarks. Perched atop a forested hill at an altitude of 1650 meters, Enchey offers breathtaking panoramic views of the Himalayan peaks. Built in 1909 on a site blessed by the great tantric master Lama Druptob Karpo, this Nyingma monastery has stood as a beacon of peace for over a century. The name Enchey means solitary temple. The monastery is famous for its spectacular Chaam masked dance festival held each December, where monks perform elaborate dances depicting the triumph of good over evil. Inside the main hall you will find beautiful frescoes, ancient thangkas, and sacred objects brought from Tibet. Nearly a hundred resident monks engage in daily prayers here. Breathe in the mountain air and appreciate the perfect harmony of nature and Buddhist spirituality.`,
    hi: `एंचे मठ में आपका स्वागत है, जो गंगटोक का सबसे प्रिय आध्यात्मिक स्थल है। 1650 मीटर की ऊंचाई पर वनाच्छादित पहाड़ी पर स्थित यह मठ हिमालय की चोटियों का मनोरम दृश्य प्रस्तुत करता है। 1909 में महान तांत्रिक गुरु लामा द्रुपतोब कारपो द्वारा आशीर्वादित स्थान पर निर्मित, यह न्यिंगमा मठ सौ वर्षों से अधिक समय से शांति का प्रतीक है। एंचे नाम का अर्थ है एकांत मंदिर। दिसंबर में होने वाला चाम नृत्य उत्सव इस मठ की पहचान है।`,
    ne: `एन्चे मठमा तपाईंलाई स्वागत छ, गंगटोकको सबैभन्दा प्रिय आध्यात्मिक स्थल। १६५० मिटरको उचाईमा वनाच्छादित पहाडमा अवस्थित यो मठले हिमालयका चुचुराहरूको अद्भुत दृश्य प्रदान गर्छ। यहाँ प्रत्येक डिसेम्बरमा चाम नृत्य उत्सव हुन्छ जसमा भिक्षुहरू भव्य मुखौटा नृत्य प्रदर्शन गर्छन्।`,
    bo: `ཁྱེད་རྣམས་ཨེན་ཅེ་དགོན་པར་བཀྲ་ཤིས་བདེ་ལེགས་ཞུ། ཨེན་ཅེ་ཞེས་པའི་ དོན་ནི་དབེན་གནས་ལྷ་ཁང་ཞེས་པ་ཡིན། ལོ་ 1909 ལ་བཙུགས་པ། གཙུག་ལག་ཁང་ཆེན་མོའི་ནང་དུ་ཐང་ཀ་རྙིང་བ་དང་གཙང་དམ་པའི་དངོས་པོ་ མང་པོ་ཡོད། ལོ་རེར་ཆམ་གར་མངར་མོ་ཆེ་ཤོས་གཏོར་མ་མཛད་སྒོ་ཡོད།`,
    zh: `欢迎来到恩齐寺，甘托克最受喜爱的精神圣地之一。坐落在海拔1650米的林木山顶，恩齐寺提供壮观的喜马拉雅全景。寺庙建于1909年，以每年12月举行的壮观羌姆面具舞节著称，僧侣身着精美服装表演象征善战胜恶的神圣舞蹈。`,
  },
  pemayangtse: {
    en: `Welcome to Pemayangtse Monastery, one of the oldest and most sacred monasteries in Sikkim. The name Pemayangtse translates to Perfect Sublime Lotus. Founded in 1705 on a hilltop at 2085 meters in West Sikkim, this monastery belongs to the Nyingmapa order and is considered the mother monastery of all Nyingma monasteries in Sikkim. On the top floor, you will discover one of the monastery's greatest treasures: Zangdog Palri, a magnificent seven-tiered wooden model of Guru Rinpoche's heavenly paradise, hand-crafted by a single monk over five years. The monastery houses priceless thangkas, ancient manuscripts, and sacred masks. From the monastery compound, on clear days, you can see the majestic peak of Mount Kangchenjunga, the guardian deity of Sikkim.`,
    hi: `पेमायंगत्से मठ में आपका स्वागत है। पेमायंगत्से नाम का अर्थ है परम उदात्त कमल। 1705 में पश्चिम सिक्किम में 2085 मीटर की ऊंचाई पर स्थापित, यह न्यिंगमापा संप्रदाय का मठ सिक्किम के सभी न्यिंगमा मठों की मातृ मठ मानी जाती है। शीर्ष मंजिल पर ज़ंगडोग पाल्री है — गुरु रिनपोचे के स्वर्गीय निवास का सात-मंजिला लकड़ी का मॉडल, जिसे एक भिक्षु ने पांच वर्षों में हाथ से बनाया। स्पष्ट दिनों में कंचनजंघा की चोटी दिखती है।`,
    ne: `पेमायाङ्त्से मठमा तपाईंलाई स्वागत छ। पेमायाङ्त्से नामको अर्थ हो परिपूर्ण उदात्त कमल। सन् १७०५ मा पश्चिम सिक्किममा २०८५ मिटरको उचाईमा स्थापित यो मठ सिक्किमका सबै न्यिङ्मा मठहरूको मातृ मठ मानिन्छ। शीर्ष तलामा जाङडोग पाल्री छ — एक भिक्षुले पाँच वर्षमा हातले बनाएको सात तले काठको कलाकृति।`,
    bo: `ཁྱེད་རྣམས་པེ་མ་ཡང་ཙེ་དགོན་པར་བཀྲ་ཤིས་བདེ་ལེགས་ཞུ། དགོན་པ་འདི་ལོ 1705 ལ་བཙུགས་ཤིང་ རྙིང་མའི་གདན་ས་ཡིན། རྩ་བ་ཡི་ལ་ཐོག་ཏུ་གནས་ཤིང་ གངས་ཀི་རྗེ་ཆེན་ཀཉི་ཅེ་ཤེས་སྦྱོར་གྱི་ལྟ་བས་མདངས་ཀྱིས་ མི་ཐུབ་པའི་གཟིགས་རྟོག་ཡོད།`,
    zh: `欢迎来到白玛央则寺，锡金最古老、最重要的寺庙之一。白玛央则意为完美崇高的莲花。1705年建于西锡金海拔2085米的山顶，是锡金所有宁玛派寺庙的母寺。在顶层，您将发现寺庙最珍贵的宝藏：桑多帕尔瑞，一座七层木制莲花生大士天宫模型，由一位僧侣花费五年手工制作。晴天可以看到锡金守护神康泰詹嘉峰。`,
  },
  tashiding: {
    en: `Welcome to Tashiding Monastery, considered by many to be the holiest monastery in all of Sikkim. Founded in 1641, the monastery is perched dramatically on a conical hill at the confluence of the Rangit and Rathong rivers. According to Buddhist legend, Guru Padmasambhava meditated here and blessed this site as one of the most sacred in the Himalayas. It is believed that a single circumambulation of the monastery cleanses all sins, drawing thousands of pilgrims each year. The most important stupa here is the Thongwa Rangdol, said to grant liberation to all who see it. Each year during the Bumchu festival, the sacred water vase is opened and its water level read to predict the fortune of Sikkim. As you walk through this sacred ground, you walk in the footsteps of saints and seekers who have sought liberation here for nearly four centuries.`,
    hi: `ताशीडिंग मठ में आपका स्वागत है, जिसे कई लोग सिक्किम का सबसे पवित्र मठ मानते हैं। 1641 में स्थापित, यह मठ रंगित और राठोंग नदियों के संगम पर एक शंकुनुमा पहाड़ी पर स्थित है। माना जाता है कि गुरु पद्मसंभव ने यहाँ ध्यान किया था। एक परिक्रमा से सभी पाप धुल जाते हैं — इसीलिए हजारों तीर्थयात्री यहाँ आते हैं। थोंगवा रांगडोल चोर्टेन — जो भी इसे देखे, उसे मोक्ष मिले।`,
    ne: `ताशिडिङ मठमा तपाईंलाई स्वागत छ, जसलाई धेरैले सिक्किमको सबैभन्दा पवित्र मठ मान्छन्। सन् १६४१ मा स्थापित यो मठ रङ्गित र राठोङ नदीहरूको सङ्गममा शङ्कु आकारको पहाडमा अवस्थित छ। विश्वास गरिन्छ कि एक पटकको परिक्रमाले सबै पापहरू धुन्छ।`,
    bo: `ཁྱེད་རྣམས་བཀྲ་ཤིས་སྡིང་དགོན་པར་བཀྲ་ཤིས་བདེ་ལེགས་ཞུ། འདི་ལོ 1641 ལ་བཙུགས། གུ་རུ་རིན་པོ་ཆེས་ཐུགས་དམ་བཞེས་པའི་གནས་མཆོག་ཅིག་ཡིན། མཆོད་རྟེན་ཐོང་བ་རང་གྲོལ་མཐོང་བ་ཙམ་གྱིས་ཐར་པ་ཐོབ་ཀྱི་ཡིན། སྐོར་གཅིག་གིས་སྡིག་པ་ཐམས་ཅད་བཤགས་ཐུབ་ཀྱི་རེད།`,
    zh: `欢迎来到塔西丁寺，被许多人视为锡金最神圣的寺庙。建于1641年，寺庙戏剧性地矗立在朗吉特河与拉通河交汇处的锥形山上。据佛教传说，莲花生大士曾在此冥想并将其祝福为喜马拉雅最神圣的地点之一。据信，绕寺一圈可涤净所有罪业。每年邦秋节期间，神圣水瓶被打开，通过水位预测锡金的运势。`,
  },
  phodong: {
    en: `Welcome to Phodong Monastery, one of the six major monasteries of Sikkim and a proud representative of the Kagyu school of Tibetan Buddhism. Situated along the North Sikkim Highway at 1340 meters elevation, Phodong was founded around 1740 and continues to be an active centre of Buddhist learning. The monastery is renowned for its extraordinary collection of ancient wall paintings and murals depicting the entire Buddhist cosmology: the wheel of life, the realms of existence, and the lives of the great masters. These frescoes, painted centuries ago, remain vibrant to this day. During the sacred festival of Saga Dawa, which commemorates the birth, enlightenment, and passing of the Buddha, Phodong becomes the site of elaborate rituals and spiritual teachings. Take time to appreciate the incredible artistry and devotion that generations of monks have poured into preserving this sacred heritage.`,
    hi: `फोडोंग मठ में आपका स्वागत है, सिक्किम के छह प्रमुख मठों में से एक। उत्तर सिक्किम राजमार्ग पर 1340 मीटर की ऊंचाई पर 1740 के आसपास स्थापित, यह मठ प्राचीन भित्तिचित्रों के लिए प्रसिद्ध है जो बौद्ध ब्रह्मांड विज्ञान — जीवन का चक्र, अस्तित्व के क्षेत्र, महान गुरुओं के जीवन — को दर्शाते हैं। सागा दावा उत्सव के दौरान यहाँ विशेष प्रार्थनाएं और शिक्षाएं दी जाती हैं।`,
    ne: `फोडोङ्ग मठमा तपाईंलाई स्वागत छ, सिक्किमका छ प्रमुख मठहरूमध्ये एक। उत्तर सिक्किम राजमार्गमा १३४० मिटरको उचाईमा सन् १७४० मा स्थापित, यो मठ बौद्ध ब्रह्माण्डको अद्भुत प्राचीन भित्तिचित्रहरूका लागि प्रसिद्ध छ।`,
    bo: `ཁྱེད་རྣམས་ཕོ་དོང་དགོན་པར་བཀྲ་ཤིས་བདེ་ལེགས་ཞུ། ཕོ་དོང་ལོ 1740 ལ་བཙུགས་ཤིང་ ཀཱ་གྱུའི་གདན་ས་ཡིན། དགོན་འདིར་བོད་ཀྱི་འཛམ་གླིང་བཀོད་པར་ཐང་ཀ་དང་རྒྱུད་ལུགས་ཀྱི་རི་མོ་རྙིང་བ་ལེགས་ཤོས་རྙེད།`,
    zh: `欢迎来到佛东寺，锡金六大主要寺庙之一，藏传佛教噶举派的骄傲代表。坐落在北锡金公路海拔1340米处，佛东寺约建于1740年。寺庙以描绘完整佛教宇宙论的精美古代壁画著称：生命之轮、六道轮回和伟大导师的生平。萨噶达瓦节期间，这里会举行隆重的仪式和精神教学。`,
  },
  dubdi: {
    en: `Welcome to Dubdi Monastery, the oldest monastery in Sikkim and a place of profound historical and spiritual significance. Founded in 1701 by the great lama Lhatsun Chempo, Dubdi — also known as the Hermit's Cell — sits high above the sacred town of Yuksom in West Sikkim. Yuksom is where the first Chogyal, or sacred king of Sikkim, was crowned in 1642, making it the first capital of the Sikkimese kingdom. To reach Dubdi, you undertake a pleasant half-hour trek through a forest of ancient oak and pine, with rhododendrons blooming brilliantly in spring. The monastery is small and intimate but radiates an extraordinary atmosphere of peace and antiquity. Inside, you will find ancient thangkas, sacred masks, and prayer texts hundreds of years old. Standing at Dubdi and gazing across the forested hills toward the high peaks, you understand why this place has inspired seekers of wisdom for over three centuries.`,
    hi: `डबडी मठ में आपका स्वागत है, सिक्किम का सबसे पुराना मठ। 1701 में महान लामा ल्हात्सुन चेम्पो द्वारा स्थापित, डबडी — जिसे हर्मिट की कोठरी कहते हैं — पश्चिम सिक्किम में युक्सोम के ऊपर स्थित है। युक्सोम वह स्थान है जहाँ 1642 में सिक्किम के पहले चोग्याल का राज्याभिषेक हुआ था। यहाँ पहुँचने के लिए प्राचीन ओक और पाइन के जंगलों से 30 मिनट की ट्रेक करनी होती है।`,
    ne: `डब्डी मठमा तपाईंलाई स्वागत छ, सिक्किमको सबैभन्दा पुरानो मठ। सन् १७०१ मा लहात्सुन चेम्पोद्वारा स्थापित, डब्डी पश्चिम सिक्किममा युक्सोम भन्दा माथि अवस्थित छ। प्राचीन ओक र पाइनका जंगलहरू भएर ३० मिनेटको रमाइलो ट्रेकमार्फत पुग्नु पर्छ।`,
    bo: `ཁྱེད་རྣམས་དུབ་དི་དགོན་པར་བཀྲ་ཤིས་བདེ་ལེགས་ཞུ། དུབ་དི་ནི་སི་ཀིམ་གྱི་དགོན་པ་རྙིང་ཤོས་ཡིན་ཞིང་ལོ 1701 ལ་བཙུགས། ལྷ་བཙུན་ནམ་མཁའ་འཇིགས་མེད་ཀྱིས་བཙུགས་པའི་འདི་ཡང་གཏེར་གནས་ཤིག་ཡིན། ལྗོང་སྡོམ་གནམ་ས་གཉིས་ཀའི་ལྷ་ཚན་ལ་ཉེ་བར་ཡོད།`,
    zh: `欢迎来到竹迪寺，锡金最古老的寺庙，具有深厚的历史和精神意义。由伟大的喇嘛拉灿珍波于1701年创建，竹迪寺俗称隐士居室，高踞于西锡金神圣小镇尤克松之上。尤克松是1642年锡金第一位曲坚（神圣国王）加冕之处，是锡金王国的第一个都城。前往竹迪需要穿越古老橡树和松树林进行半小时的愉快徒步。`,
  },
};

// ─── MONASTERIES ──────────────────────────────────────────────────────────────
const monasteries = [
  {
    name: 'Rumtek Monastery',
    location: 'Gangtok, East Sikkim',
    founded: '16th century',
    festival: 'Losar',
    description: 'The largest monastery in Sikkim, also called the Dharma Chakra Centre. Seat of the Kagyu order of Tibetan Buddhism, housing a stunning golden stupa containing sacred relics of the 16th Karmapa. Built in its current grand form in 1960 after the 16th Karmapa fled Tibet.',
    image: 'rumtek.jpg',
    link: 'https://en.wikipedia.org/wiki/Rumtek_Monastery',
    audioGuideText: guides.rumtek,
    audio: { en: '', hi: '', ne: '', bo: '', zh: '' },
    views: [
      { type: 'iframe', src: 'https://www.google.com/maps/embed?pb=!3m2!1sen!2sin!4v1757353181280!5m2!1sen!2sin!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQ2t2ZXZVaXdF!2m2!1d27.28884361783851!2d88.56089980788117!3f261.75189485249376!4f-7.178210760899532!5f0.7820865974627469', order: 0 },
    ],
    videos: ['https://youtu.be/yE4QXBQMT4E?si=0mMoP9lo_22WKEvD'],
    coordinates: { latitude: 27.2888, longitude: 88.5609 },
    translations: [
      { languageCode: 'en', name: 'Rumtek Monastery', location: 'Gangtok, East Sikkim',   festival: 'Losar', description: 'The largest monastery in Sikkim, also called the Dharma Chakra Centre. Seat of the Kagyu order of Tibetan Buddhism.' },
      { languageCode: 'hi', name: 'रुमटेक मठ',         location: 'गंगटोक, पूर्व सिक्किम', festival: 'लोसार', description: 'सिक्किम का सबसे बड़ा मठ, जिसे धर्म चक्र केंद्र भी कहा जाता है। तिब्बती बौद्ध धर्म के काग्यू संप्रदाय का केंद्र।' },
      { languageCode: 'ne', name: 'रुम्टेक मठ',         location: 'गंगटोक, पूर्वी सिक्किम', festival: 'लोसार', description: 'सिक्किमको सबैभन्दा ठूलो मठ, जसलाई धर्म चक्र केन्द्र पनि भनिन्छ।' },
      { languageCode: 'bo', name: 'རུམ་ཏེཀ་དགོན་པ།',  location: 'སི་ཀིམ་གྱི་ཤར་གང་ཏོག', festival: 'ལོ་གསར།', description: 'སི་ཀིམ་གྱི་དགོན་པ་ཆེ་ཤོས། ཀཱ་གྱུའི་གདན་ས།' },
      { languageCode: 'zh', name: '隆德寺',              location: '锡金东部甘托克', festival: '洛萨节', description: '锡金最大的寺庙，也称法轮中心，是藏传佛教噶举派的驻锡地。' },
    ],
  },
  {
    name: 'Enchey Monastery',
    location: 'Gangtok, Sikkim',
    founded: '1909',
    festival: 'Chaam Dance Festival',
    description: 'Known for colorful Cham masked dances and panoramic Himalayan views. Built in 1909 on a site blessed by the tantric master Lama Druptob Karpo, this Nyingma monastery sits at 1650m above Gangtok with magnificent views of snow-capped peaks.',
    image: 'enchey.jpg',
    link: 'https://en.wikipedia.org/wiki/Enchey_Monastery',
    audioGuideText: guides.enchey,
    audio: { en: '', hi: '', ne: '', bo: '', zh: '' },
    views: [
      { type: 'iframe', src: 'https://www.google.com/maps/embed?pb=!3m2!1sen!2sin!4v1757354232402!5m2!1sen!2sin!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQ0pzTXEzOWdF!2m2!1d27.33593677395685!2d88.61916587167339!3f201.35475516780912!4f-8.737394027737281!5f0.7820865974627469', order: 0 },
    ],
    videos: ['https://youtu.be/KNLtJhcMkac?si=B4Qdx0kLnqCEAYFy'],
    coordinates: { latitude: 27.3359, longitude: 88.6192 },
    translations: [
      { languageCode: 'en', name: 'Enchey Monastery', location: 'Gangtok, Sikkim', festival: 'Chaam Dance Festival', description: 'Known for colorful Cham dances and panoramic Himalayan views at 1650m.' },
      { languageCode: 'hi', name: 'एंचे मठ',          location: 'गंगटोक, सिक्किम', festival: 'चाम नृत्य उत्सव', description: 'रंगीन चाम नृत्य और हिमालय के मनोरम दृश्यों के लिए प्रसिद्ध। 1650 मीटर पर स्थित न्यिंगमा मठ।' },
      { languageCode: 'ne', name: 'एन्चे मठ',          location: 'गंगटोक, सिक्किम', festival: 'चाम नृत्य उत्सव', description: 'रंगीन चाम नृत्य र हिमालयको दृश्यका लागि प्रसिद्ध।' },
      { languageCode: 'bo', name: 'ཨེན་ཅེ་དགོན་པ།',  location: 'སི་ཀིམ་གང་ཏོག',  festival: 'ཆམ་གར་དུས་ཆེན།', description: 'ཆམ་གཟུགས་གསལ་བ་དང་མཐོ་རིས་ལ་གྲགས་པ།' },
      { languageCode: 'zh', name: '恩齐寺',             location: '锡金甘托克',       festival: '羌姆舞节',      description: '以多彩羌姆面具舞和喜马拉雅全景著称，海拔1650米。' },
    ],
  },
  {
    name: 'Pemayangtse Monastery',
    location: 'Pelling, West Sikkim',
    founded: '1705',
    festival: 'Bumchu Festival',
    description: "One of the oldest and most important monasteries of Sikkim. A three-storey structure at 2085m housing priceless thangkas, murals, and the magnificent Zangdog Palri — a seven-tiered wooden model of Guru Rinpoche's heavenly abode, hand-crafted by a single monk over five years.",
    image: 'pemayangtse.jpg',
    link: 'https://en.wikipedia.org/wiki/Pemayangtse_Monastery',
    audioGuideText: guides.pemayangtse,
    audio: { en: '', hi: '', ne: '', bo: '', zh: '' },
    views: [
      { type: 'iframe', src: 'https://www.google.com/maps/embed?pb=!3m2!1sen!2sin!4v1757930529795!5m2!1sen!2sin!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJREVoSlhucEFF!2m2!1d27.30518919282202!2d88.25156580066201!3f171.1725596376822!4f-2.3092914809421217!5f0.7820865974627469', order: 0 },
    ],
    videos: ['https://youtu.be/9JvxfFO2a6c?si=lTGMcXvg78eU2rQq'],
    coordinates: { latitude: 27.3069, longitude: 88.2397 },
    translations: [
      { languageCode: 'en', name: 'Pemayangtse Monastery', location: 'Pelling, West Sikkim',    festival: 'Bumchu Festival', description: 'One of the oldest monasteries of Sikkim. Houses Zangdog Palri — a seven-tiered wooden model of Guru Rinpoche\'s paradise.' },
      { languageCode: 'hi', name: 'पेमायंगत्से मठ',       location: 'पेलिंग, पश्चिम सिक्किम', festival: 'बुमचू उत्सव',   description: 'सिक्किम के सबसे पुराने मठों में से एक। ज़ंगडोग पाल्री — गुरु रिनपोचे के स्वर्गीय निवास का सात-मंजिला मॉडल।' },
      { languageCode: 'ne', name: 'पेमायाङ्त्से मठ',       location: 'पेलिङ, पश्चिम सिक्किम', festival: 'बुम्छु पर्व',    description: 'सिक्किमका सबैभन्दा पुरानो मठहरूमध्ये एक।' },
      { languageCode: 'bo', name: 'པེ་མ་ཡང་ཙེ་དགོན་པ།', location: 'སི་ཀིམ་ནུབ་པེ་ལིང།',  festival: 'བུམ་ཆུ་དུས་ཆེན།', description: 'སི་ཀིམ་གྱི་དགོན་པ་རྙིང་ཤོས་དང་གཙོ་བོ།' },
      { languageCode: 'zh', name: '白玛央则寺',             location: '锡金西部佩林',            festival: '邦秋节',         description: '锡金最古老的寺庙之一，珍藏七层木制莲花生大士天宫模型。' },
    ],
  },
  {
    name: 'Tashiding Monastery',
    location: 'Tashiding, West Sikkim',
    founded: '1641',
    festival: 'Bumchu Festival',
    description: 'Considered the holiest monastery in Sikkim. Perched on a conical hill between the Rangit and Rathong rivers, a single circumambulation is believed to cleanse all sins. Home to the Thongwa Rangdol stupa — seeing it is said to grant liberation.',
    image: 'tashiding.jpg',
    link: 'https://en.wikipedia.org/wiki/Tashiding_Monastery',
    audioGuideText: guides.tashiding,
    audio: { en: '', hi: '', ne: '', bo: '', zh: '' },
    views: [
      { type: 'iframe', src: 'https://www.google.com/maps/embed?pb=!3m2!1sen!2sin!4v1757931414327!5m2!1sen!2sin!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQ0V6c08zSWc.!2m2!1d27.30891943909927!2d88.29787983128344!3f44.59177757253322!4f-9.494706325070695!5f0.40030473129073946', order: 0 },
    ],
    videos: ['https://youtu.be/VIGwqAcVmVw?si=iLZtHrhaj-SAoyUZ'],
    coordinates: { latitude: 27.3167, longitude: 88.2833 },
    translations: [
      { languageCode: 'en', name: 'Tashiding Monastery', location: 'Tashiding, West Sikkim',    festival: 'Bumchu Festival', description: 'The holiest monastery in Sikkim. Perched between two rivers, one circumambulation is believed to cleanse all sins.' },
      { languageCode: 'hi', name: 'ताशीडिंग मठ',          location: 'ताशीडिंग, पश्चिम सिक्किम', festival: 'भुमचू उत्सव',   description: 'सिक्किम का सबसे पवित्र मठ। दो नदियों के बीच शंकु पहाड़ी पर स्थित।' },
      { languageCode: 'ne', name: 'ताशिडिङ मठ',           location: 'ताशिडिङ, पश्चिम सिक्किम', festival: 'भुम्छु पर्व',    description: 'सिक्किमको सबैभन्दा पवित्र मठ, दुई नदीबीचको पहाडमा।' },
      { languageCode: 'bo', name: 'བཀྲ་ཤིས་སྡིང་དགོན་པ།', location: 'སི་ཀིམ་ནུབ་བཀྲ་ཤིས་སྡིང།', festival: 'བུམ་ཆུ་དུས་ཆེན།', description: 'སི་ཀིམ་གྱི་དགོན་གཙང་མ་ཆེས་གཙོ།' },
      { languageCode: 'zh', name: '塔西丁寺',              location: '锡金西部塔西丁',            festival: '邦秋节',         description: '锡金最神圣的寺庙，绕行一圈可涤净所有罪业。' },
    ],
  },
  {
    name: 'Phodong Monastery',
    location: 'Phodong, North Sikkim',
    founded: '1740',
    festival: 'Saga Dawa',
    description: 'One of the six major monasteries of Sikkim, renowned for extraordinary ancient murals depicting Buddhist cosmology — the wheel of life and realms of existence. A Kagyu school monastery at 1340m on the North Sikkim Highway.',
    image: 'phodong.jpg',
    link: 'https://en.wikipedia.org/wiki/Phodong_Monastery',
    audioGuideText: guides.phodong,
    audio: { en: '', hi: '', ne: '', bo: '', zh: '' },
    views: [
      { type: 'iframe', src: 'https://www.google.com/maps/embed?pb=!3m2!1sen!2sin!4v1757952352242!5m2!1sen!2sin!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJRGg0OURqV3c.!2m2!1d27.41303405816734!2d88.58375766744783!3f247.7422504481915!4f-5.956619337319168!5f0.7820865974627469', order: 0 },
    ],
    videos: ['https://youtu.be/tGi2jx8DP2Y?si=tavCQGjNfAdVSBm9'],
    coordinates: { latitude: 27.3789, longitude: 88.5772 },
    translations: [
      { languageCode: 'en', name: 'Phodong Monastery', location: 'Phodong, North Sikkim',  festival: 'Saga Dawa', description: 'One of six major monasteries of Sikkim, known for ancient murals depicting Buddhist cosmology.' },
      { languageCode: 'hi', name: 'फोडोंग मठ',          location: 'फोडोंग, उत्तर सिक्किम', festival: 'सागा दावा', description: 'सिक्किम के छह प्रमुख मठों में से एक, बौद्ध ब्रह्मांड विज्ञान के प्राचीन भित्तिचित्रों के लिए प्रसिद्ध।' },
      { languageCode: 'ne', name: 'फोडोङ्ग मठ',          location: 'फोडोङ्ग, उत्तरी सिक्किम', festival: 'सागा दावा', description: 'सिक्किमका छ प्रमुख मठहरूमध्ये एक।' },
      { languageCode: 'bo', name: 'ཕོ་དོང་དགོན་པ།',    location: 'སི་ཀིམ་བྱང་ཕོ་དོང།',  festival: 'ས་ག་དྲག་པ།', description: 'སི་ཀིམ་གྱི་དགོན་པ་དྲུག་གི་གཅིག' },
      { languageCode: 'zh', name: '佛东寺',              location: '锡金北部佛东',           festival: '萨噶达瓦节', description: '锡金六大主要寺庙之一，以古代佛教宇宙论壁画著称。' },
    ],
  },
  {
    name: 'Dubdi Monastery',
    location: 'Yuksom, West Sikkim',
    founded: '1701',
    festival: 'Drupka Teshi',
    description: "The oldest monastery in Sikkim, also known as the Hermit's Cell. Founded by Lhatsun Chempo in 1701 above Yuksom — Sikkim's first capital. Requires a 30-minute scenic trek through pine and oak forests. Holds centuries-old thangkas and sacred objects.",
    image: 'dubdi.jpg',
    link: 'https://en.wikipedia.org/wiki/Dubdi_Monastery',
    audioGuideText: guides.dubdi,
    audio: { en: '', hi: '', ne: '', bo: '', zh: '' },
    views: [
      { type: 'iframe', src: 'https://www.google.com/maps/embed?pb=!3m2!1sen!2sin!4v1757952056844!5m2!1sen!2sin!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJRFVpdHkxNndF!2m2!1d27.36655288826205!2d88.22999220879571!3f326.35718!4f0!5f0.7820865974627469', order: 0 },
    ],
    videos: ['https://youtu.be/45K_c0f1zWg?si=BNgSvQ5VK_4elm7U'],
    coordinates: { latitude: 27.3719, longitude: 88.2225 },
    translations: [
      { languageCode: 'en', name: 'Dubdi Monastery', location: 'Yuksom, West Sikkim',      festival: 'Drupka Teshi', description: "Sikkim's oldest monastery, the Hermit's Cell. 30-minute trek above Yuksom, Sikkim's first capital. Founded 1701." },
      { languageCode: 'hi', name: 'डबडी मठ',          location: 'युक्सोम, पश्चिम सिक्किम', festival: 'द्रुपका तेशी', description: 'सिक्किम का सबसे पुराना मठ। सिक्किम की प्रथम राजधानी युक्सोम के ऊपर 30 मिनट की ट्रेक।' },
      { languageCode: 'ne', name: 'डब्डी मठ',          location: 'युक्सोम, पश्चिमी सिक्किम', festival: 'द्रुपका तेशी', description: 'सिक्किमको सबैभन्दा पुरानो मठ। युक्सोम माथि ३० मिनेटको ट्रेक।' },
      { languageCode: 'bo', name: 'དུབ་དི་དགོན་པ',    location: 'ཡུག་སོམ་སི་ཀིམ་ནུབ།',   festival: 'དྲུཔ་ཀ་ཏེ་ཤི', description: 'སི་ཀིམ་གྱི་དགོན་པ་རྙིང་ཤོས།' },
      { languageCode: 'zh', name: '竹迪寺',             location: '锡金西部尤克松',          festival: '竹巴祈禧节',  description: '锡金最古老的寺庙，隐士居室，位于锡金首都尤克松上方。' },
    ],
  },
];

// ─── FESTIVALS ────────────────────────────────────────────────────────────────
const festivals = [
  // 2025
  { name: 'Losar — Tibetan New Year', date: new Date('2025-02-12'), time: '6:00 AM – 6:00 PM', description: 'Losar is the Tibetan New Year, celebrated with prayers, butter lamps, traditional Cham mask dances, feasts, and new garments. Monks perform elaborate rituals to expel evil spirits and invite prosperity. One of the most joyful festivals in the Sikkimese Buddhist calendar.', location: 'Rumtek Monastery, East Sikkim' },
  { name: 'Bumchu — Sacred Water Festival', date: new Date('2025-03-14'), time: 'All Day', description: "One of Sikkim's most sacred festivals at Tashiding Monastery. A sealed vase containing holy water is opened and the water level read by the head lama to predict Sikkim's fortune for the year. Pilgrims travel from across the Himalayas to receive a drop of this holy water.", location: 'Tashiding Monastery, West Sikkim' },
  { name: "Saga Dawa — Buddha's Enlightenment Month", date: new Date('2025-05-23'), time: 'All Day', description: "The holiest month in the Tibetan Buddhist calendar, commemorating the birth, enlightenment, and mahaparinirvana of Shakyamuni Buddha. Monks and laypeople engage in merit-making activities. A special procession carrying a large thangka of Buddha takes place at Phodong.", location: 'Phodong Monastery, North Sikkim' },
  { name: 'Drupka Teshi — First Dharma Teaching', date: new Date('2025-08-08'), time: '8:00 AM – 5:00 PM', description: "Celebrates the first turning of the Wheel of Dharma by Lord Buddha — the day he gave his first teaching at Sarnath. All positive actions are multiplied ten million times on this day, making it highly auspicious for spiritual practice.", location: 'Dubdi Monastery, Yuksom' },
  { name: 'Pang Lhabsol — Kangchenjunga Festival', date: new Date('2025-09-15'), time: '9:00 AM – 5:00 PM', description: "A uniquely Sikkimese festival honoring Mount Kangchenjunga, guardian deity of Sikkim. Warrior dances (Pang Lhabsol Cham) are performed to thank the mountain deity for protection. Celebrates the brotherhood oath between the Lepcha and Bhutia peoples.", location: 'Pemayangtse Monastery, West Sikkim' },
  { name: 'Losoong — Sikkimese New Year', date: new Date('2025-12-15'), time: 'All Day', description: 'Sikkimese New Year celebrated with traditional archery competitions, local brews like Tongba and Chang, Cham dance performances, and communal feasts marking the end of harvest season.', location: 'Rumtek Monastery, East Sikkim' },
  { name: 'Chaam Dance Festival', date: new Date('2025-12-28'), time: '9:00 AM – 4:00 PM', description: 'Spectacular masked dance festival at Enchey Monastery where monks in elaborate costumes perform sacred dances depicting the triumph of good over evil. A form of moving meditation and prayer.', location: 'Enchey Monastery, Gangtok' },
  // 2026
  { name: 'Losar — Tibetan New Year', date: new Date('2026-03-02'), time: '6:00 AM – 6:00 PM', description: 'Losar is the Tibetan New Year, celebrated with prayers, butter lamps, traditional Cham mask dances, feasts, and new garments. Monks perform elaborate rituals to expel evil spirits and invite prosperity for the coming year.', location: 'Rumtek Monastery, East Sikkim' },
  { name: 'Bumchu — Sacred Water Festival', date: new Date('2026-03-22'), time: 'All Day', description: "Sacred water vase opening ceremony at Tashiding Monastery. The water level is read to predict Sikkim's fortune. Pilgrims travel from across the Himalayas to receive this holy water.", location: 'Tashiding Monastery, West Sikkim' },
  { name: 'Pemayangtse Bumchu', date: new Date('2026-04-05'), time: '8:00 AM – 6:00 PM', description: "Annual Bumchu festival at Pemayangtse Monastery featuring prayers, mask dances, and display of the magnificent Zangdog Palri — the seven-tiered wooden model of Guru Rinpoche's paradise.", location: 'Pemayangtse Monastery, West Sikkim' },
  { name: "Saga Dawa — Buddha's Enlightenment Month", date: new Date('2026-06-11'), time: 'All Day', description: "The holiest month in the Tibetan Buddhist calendar commemorating the birth, enlightenment, and passing of Shakyamuni Buddha. Special procession and teachings at Phodong Monastery.", location: 'Phodong Monastery, North Sikkim' },
  { name: 'Drupka Teshi — First Dharma Teaching', date: new Date('2026-08-27'), time: '8:00 AM – 5:00 PM', description: 'Celebrates the first turning of the Wheel of Dharma by Lord Buddha. All positive actions are multiplied ten million times on this day.', location: 'Dubdi Monastery, Yuksom' },
  { name: 'Pang Lhabsol — Kangchenjunga Festival', date: new Date('2026-09-04'), time: '9:00 AM – 5:00 PM', description: "Uniquely Sikkimese festival honoring Mount Kangchenjunga, guardian deity of Sikkim. Warrior dances performed to thank the mountain deity.", location: 'Pemayangtse Monastery, West Sikkim' },
  { name: 'Losoong — Sikkimese New Year', date: new Date('2026-12-15'), time: 'All Day', description: 'Sikkimese New Year with traditional archery, local brews, Cham dance performances, and communal feasts.', location: 'Rumtek Monastery, East Sikkim' },
  { name: 'Chaam Dance Festival', date: new Date('2026-12-17'), time: '9:00 AM – 4:00 PM', description: 'Spectacular masked dance festival at Enchey Monastery where monks perform sacred dances depicting the triumph of good over evil.', location: 'Enchey Monastery, Gangtok' },
];

// ─── SCRIPTURES ───────────────────────────────────────────────────────────────
const scriptures = [
  {
    title: 'Kangyur',
    type: 'Canon',
    description: 'The Kangyur (Translation of the Word) is the collection of texts in the Tibetan Buddhist canon accepted as direct teachings of the Buddha. It contains over 100 volumes with more than 1,000 texts including sutras, tantras, and the Vinaya (monastic code). Every monastery in Sikkim possesses and reveres the Kangyur.',
    origin: 'India / Tibet',
    significance: 'Forms the primary division of the Tibetan Buddhist canon. Recitation of even a single line is considered a profound act of merit. The texts were translated from Sanskrit originals over centuries. Physical Kangyur sets are treated as sacred objects and worshipped with offerings at monasteries throughout Sikkim.',
    src: 'https://en.wikipedia.org/wiki/Kangyur',
    source: 'Wikipedia / BDRC',
  },
  {
    title: 'Tengyur',
    type: 'Commentary',
    description: 'The Tengyur (Translation of Treatises) is the second division of the Tibetan Buddhist canon, containing commentaries on the Buddha\'s words written by great Indian and Tibetan masters. It comprises over 3,800 texts in more than 200 volumes, covering philosophy, tantra, medicine, astrology, and grammar.',
    origin: 'Tibet (compiled 13th–14th century)',
    significance: 'Essential companion to the Kangyur, providing scholarly framework for understanding and practicing the Buddha\'s teachings. Works by Nagarjuna, Asanga, Chandrakirti, and Dharmakirti are included. Together with the Kangyur, it forms the complete Tibetan Buddhist canon.',
    src: 'https://en.wikipedia.org/wiki/Tengyur',
    source: 'Wikipedia / BDRC',
  },
  {
    title: 'Bardo Thodol',
    type: 'Tantric Text',
    description: 'Known in the West as the "Tibetan Book of the Dead," the Bardo Thodol is read aloud to the dying and recently deceased to guide consciousness through the intermediate states between death and rebirth. Revealed by the treasure-finder Karma Lingpa in the 14th century and attributed to Padmasambhava.',
    origin: 'Tibet — revealed by Karma Lingpa (14th century)',
    significance: 'One of the most widely known Tibetan Buddhist texts, describing luminous visions encountered after death and providing instructions for achieving liberation. In Sikkim, monks recite it for 49 days beside the deceased. Deeply embedded in the religious life of all Sikkim\'s monasteries.',
    src: 'https://en.wikipedia.org/wiki/Bardo_Thodol',
    source: 'Wikipedia',
  },
  {
    title: 'Gesar Epic',
    type: 'Epic Poem',
    description: 'The Epic of King Gesar is the longest epic poem in the world, spanning over one million verses still being recited by living oral bards. It tells the story of Gesar of Ling, a divine warrior-king who battles demons and brings the teachings of the Buddha to humanity.',
    origin: 'Tibet / Sikkim (oral tradition from at least the 11th century)',
    significance: 'More than a literary work, the Gesar Epic is a living spiritual tradition. Bards receive the epic in visionary experiences and recite it from memory over days or weeks. In Sikkim, Gesar is revered as a protector deity, blending Buddhist teachings with Himalayan folk traditions and history.',
    src: 'https://en.wikipedia.org/wiki/Epic_of_King_Gesar',
    source: 'Wikipedia',
  },
  {
    title: 'Guru Rinpoche Prayers',
    type: 'Liturgical Text',
    description: 'Collections of prayers, invocations, and praises dedicated to Padmasambhava (Guru Rinpoche), the Indian tantric master who brought Vajrayana Buddhism to Tibet and Sikkim in the 8th century. Includes the famous Barché Lamsel and the seven-line prayer considered the most important prayer in Tibetan Buddhism.',
    origin: 'India / Tibet (8th century and later terma revelations)',
    significance: 'Guru Rinpoche is uniquely revered in Sikkim, where he is said to have visited, hidden sacred treasures (terma), and blessed the land as a hidden paradise. The Nyingma monasteries of Pemayangtse, Tashiding, and Dubdi were all founded in his lineage. These prayers are recited daily in all Nyingma monasteries.',
    src: 'https://en.wikipedia.org/wiki/Padmasambhava',
    source: 'Wikipedia',
  },
  {
    title: 'Heart Sutra (Prajnaparamita)',
    type: 'Sutra',
    description: 'The Heart Sutra encapsulates the entire Prajnaparamita (Perfection of Wisdom) teaching in a few hundred words. The famous line "Form is emptiness, emptiness is form" comes from this sutra. It is one of the most frequently chanted texts in Tibetan Buddhism.',
    origin: 'India (circa 1st–2nd century CE)',
    significance: 'Recited at the start of most Buddhist ceremonies in Sikkim\'s monasteries. The Heart Sutra is the foundational text on sunyata (emptiness). Also used as a protective text and inscribed on prayer flags and wheels throughout Sikkim.',
    src: 'https://en.wikipedia.org/wiki/Heart_Sutra',
    source: 'Wikipedia',
  },
  {
    title: "Milarepa's Songs of Realization",
    type: 'Devotional Poetry',
    description: "The collected songs (dohas) of Milarepa (1052–1135), one of Tibet's greatest saints and poets. Born into poverty, enslaved by karma, Milarepa achieved full enlightenment in a single lifetime through fierce practice under the teacher Marpa. His 100,000 songs are treasured as spontaneous expressions of realization.",
    origin: 'Tibet (11th–12th century)',
    significance: 'Milarepa is the exemplar of the Kagyu school — the lineage of Rumtek and Phodong monasteries. His life demonstrates that complete enlightenment is possible in one lifetime. His teachings on impermanence deeply inform monastery culture throughout Sikkim.',
    src: 'https://en.wikipedia.org/wiki/Milarepa',
    source: 'Wikipedia',
  },
  {
    title: 'Mahakala Puja Texts',
    type: 'Ritual Text',
    description: 'Liturgical manuals for propitiating Mahakala, the fierce wrathful protector deity widely worshipped in Sikkim\'s Kagyu and Nyingma monasteries. These texts include complex visualization sequences, mantra recitations, and elaborate ritual procedures.',
    origin: 'India / Tibet',
    significance: 'Mahakala is the principal protector deity of most monasteries in Sikkim. The Mahakala shrine at Rumtek Monastery is particularly famous. Regular Mahakala pujas remove obstacles, protect the dharma, and benefit all beings. The black-cloaked form is considered the protector of the entire Sikkimese kingdom.',
    src: 'https://en.wikipedia.org/wiki/Mahakala',
    source: 'Wikipedia',
  },
  {
    title: "Lhatsun Chempo's Chronicles of Sikkim",
    type: 'Historical Text',
    description: "Sacred chronicles and writings of Lhatsun Namkha Jigme (Lhatsun Chempo), one of three founding lamas who established the Sikkimese kingdom in 1642. These texts document the founding of Sikkim, the coronation of the first Chogyal, and the discovery of Sikkim as a beyul — a sacred hidden land blessed by Guru Rinpoche.",
    origin: 'Sikkim (17th century)',
    significance: "These chronicles are the primary source for Sikkim's founding mythology and early history. They explain why Sikkim is a sacred land and why monasteries — Dubdi, Pemayangtse, and Tashiding — hold such spiritual significance. Copies are preserved at Pemayangtse Monastery.",
    src: 'https://en.wikipedia.org/wiki/Lhatsun_Namkha_Jigme',
    source: 'Wikipedia',
  },
  {
    title: 'Dorje Chang Tungma',
    type: 'Liturgical Text',
    description: 'The principal lineage supplication of the Kagyu school, tracing the transmission of dharma from Vajradhara through Tilopa, Naropa, Marpa, Milarepa, Gampopa, and down to the Karmapas and current masters. Recited at every Kagyu practice session.',
    origin: 'Tibet (composed by Karmapa Rangjung Dorje, 14th century)',
    significance: 'Of central importance at Rumtek and Phodong monasteries. It connects practitioners to the living lineage of realized masters and is considered a direct line of blessings from the Buddha. Reciting it is believed to bring realization of mahamudra — the nature of mind.',
    src: 'https://www.kagyu.org',
    source: 'Kagyu Office',
  },
];

// ─── SEED ─────────────────────────────────────────────────────────────────────
const seedDatabase = async () => {
  try {
    await connectDB();

    await Promise.all([
      Monastery.deleteMany({}),
      Festival.deleteMany({}),
      Language.deleteMany({}),
      Scripture.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    await Language.insertMany(languages);
    console.log(`Inserted ${languages.length} languages`);

    const createdMonasteries = await Monastery.insertMany(monasteries);
    console.log(`Inserted ${createdMonasteries.length} monasteries`);

    const festivalDocs = festivals.map(f => {
      const linked = createdMonasteries.find(m =>
        f.location && f.location.toLowerCase().includes(
          m.name.toLowerCase().split(' ')[0]
        )
      );
      return { ...f, monastery: linked ? linked._id : null };
    });
    await Festival.insertMany(festivalDocs);
    console.log(`Inserted ${festivalDocs.length} festivals`);

    await Scripture.insertMany(scriptures);
    console.log(`Inserted ${scriptures.length} scriptures`);

    console.log('\n Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
