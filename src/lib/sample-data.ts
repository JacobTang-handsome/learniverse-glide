import type { Language } from "./profile";

export type Word = {
  word: string;
  ipa: string;
  en: string;
  zh: string;
};

export const VOCAB: Record<Language, Word[]> = {
  Spanish: [
    { word: "hola", ipa: "ˈo.la", en: "hello", zh: "你好" },
    { word: "gracias", ipa: "ˈɡɾa.sjas", en: "thank you", zh: "谢谢" },
    { word: "amigo", ipa: "aˈmi.ɣo", en: "friend", zh: "朋友" },
    { word: "comida", ipa: "koˈmi.ða", en: "food", zh: "食物" },
    { word: "viaje", ipa: "ˈbja.xe", en: "trip", zh: "旅行" },
    { word: "música", ipa: "ˈmu.si.ka", en: "music", zh: "音乐" },
    { word: "ciudad", ipa: "θjuˈðað", en: "city", zh: "城市" },
    { word: "historia", ipa: "isˈto.ɾja", en: "history", zh: "历史" },
    { word: "manzana", ipa: "manˈθa.na", en: "apple", zh: "苹果" },
    { word: "tiempo", ipa: "ˈtjem.po", en: "time / weather", zh: "时间 / 天气" },
    { word: "libro", ipa: "ˈli.βɾo", en: "book", zh: "书" },
    { word: "trabajo", ipa: "tɾaˈβa.xo", en: "work", zh: "工作" },
  ],
  Catalan: [
    { word: "hola", ipa: "ˈɔ.lə", en: "hello", zh: "你好" },
    { word: "gràcies", ipa: "ˈɡɾa.si.əs", en: "thank you", zh: "谢谢" },
    { word: "amic", ipa: "əˈmik", en: "friend", zh: "朋友" },
    { word: "menjar", ipa: "mənˈʒa", en: "food", zh: "食物" },
    { word: "viatge", ipa: "biˈad.dʒə", en: "trip", zh: "旅行" },
    { word: "música", ipa: "ˈmu.zi.kə", en: "music", zh: "音乐" },
    { word: "ciutat", ipa: "siwˈtat", en: "city", zh: "城市" },
    { word: "història", ipa: "isˈtɔ.ɾi.ə", en: "history", zh: "历史" },
    { word: "poma", ipa: "ˈpo.mə", en: "apple", zh: "苹果" },
    { word: "temps", ipa: "ˈtems", en: "time / weather", zh: "时间 / 天气" },
    { word: "llibre", ipa: "ˈʎi.βɾə", en: "book", zh: "书" },
    { word: "feina", ipa: "ˈfej.nə", en: "work", zh: "工作" },
  ],
  Italian: [
    { word: "ciao", ipa: "ˈtʃa.o", en: "hello / bye", zh: "你好 / 再见" },
    { word: "grazie", ipa: "ˈɡrat.tsje", en: "thank you", zh: "谢谢" },
    { word: "amico", ipa: "aˈmi.ko", en: "friend", zh: "朋友" },
    { word: "cibo", ipa: "ˈtʃi.bo", en: "food", zh: "食物" },
    { word: "viaggio", ipa: "ˈvjad.dʒo", en: "trip", zh: "旅行" },
    { word: "musica", ipa: "ˈmu.zi.ka", en: "music", zh: "音乐" },
    { word: "città", ipa: "tʃitˈta", en: "city", zh: "城市" },
    { word: "storia", ipa: "ˈstɔ.rja", en: "history", zh: "历史" },
    { word: "mela", ipa: "ˈme.la", en: "apple", zh: "苹果" },
    { word: "tempo", ipa: "ˈtɛm.po", en: "time / weather", zh: "时间 / 天气" },
    { word: "libro", ipa: "ˈli.bro", en: "book", zh: "书" },
    { word: "lavoro", ipa: "laˈvo.ro", en: "work", zh: "工作" },
  ],
};

export type ReadingArticle = {
  title: string;
  intro: string;
  paragraphs: Array<Array<TextChunk>>;
};

export type TextChunk =
  | { type: "text"; text: string }
  | { type: "word"; word: string; ipa: string; translation: string };

export const READING: Record<Language, ReadingArticle> = {
  Spanish: {
    title: "Una mañana en Madrid",
    intro: "Tap any highlighted word to see its meaning and hear it.",
    paragraphs: [
      [
        { type: "text", text: "Cada " },
        { type: "word", word: "mañana", ipa: "maˈɲa.na", translation: "morning" },
        { type: "text", text: ", camino por las calles tranquilas de Madrid. El " },
        { type: "word", word: "sol", ipa: "ˈsol", translation: "sun" },
        { type: "text", text: " ilumina las plazas y los " },
        { type: "word", word: "cafés", ipa: "kaˈfes", translation: "cafés" },
        { type: "text", text: " comienzan a llenarse de gente." },
      ],
      [
        { type: "text", text: "Pido un café con leche y un pequeño " },
        { type: "word", word: "bocadillo", ipa: "bo.kaˈði.ʝo", translation: "sandwich" },
        { type: "text", text: ". Mientras como, escucho conversaciones en español y trato de entender cada " },
        { type: "word", word: "palabra", ipa: "paˈla.βɾa", translation: "word" },
        { type: "text", text: "." },
      ],
      [
        { type: "text", text: "Aprender un nuevo " },
        { type: "word", word: "idioma", ipa: "iˈðjo.ma", translation: "language" },
        { type: "text", text: " es como abrir una puerta a otro mundo." },
      ],
    ],
  },
  Catalan: {
    title: "Un matí a Barcelona",
    intro: "Tap any highlighted word to see its meaning and hear it.",
    paragraphs: [
      [
        { type: "text", text: "Cada " },
        { type: "word", word: "matí", ipa: "məˈti", translation: "morning" },
        { type: "text", text: ", camino pels carrers tranquils de Barcelona. El " },
        { type: "word", word: "sol", ipa: "ˈsɔɫ", translation: "sun" },
        { type: "text", text: " il·lumina les places." },
      ],
      [
        { type: "text", text: "Demano un cafè amb llet i un petit " },
        { type: "word", word: "entrepà", ipa: "ən.tɾəˈpa", translation: "sandwich" },
        { type: "text", text: ". Escolto la gent parlar i intento entendre cada " },
        { type: "word", word: "paraula", ipa: "pəˈɾaw.lə", translation: "word" },
        { type: "text", text: "." },
      ],
      [
        { type: "text", text: "Aprendre un nou " },
        { type: "word", word: "idioma", ipa: "iˈði.o.mə", translation: "language" },
        { type: "text", text: " és obrir una porta a un altre món." },
      ],
    ],
  },
  Italian: {
    title: "Una mattina a Roma",
    intro: "Tap any highlighted word to see its meaning and hear it.",
    paragraphs: [
      [
        { type: "text", text: "Ogni " },
        { type: "word", word: "mattina", ipa: "matˈti.na", translation: "morning" },
        { type: "text", text: ", cammino per le strade tranquille di Roma. Il " },
        { type: "word", word: "sole", ipa: "ˈso.le", translation: "sun" },
        { type: "text", text: " illumina le piazze." },
      ],
      [
        { type: "text", text: "Ordino un cappuccino e un piccolo " },
        { type: "word", word: "panino", ipa: "paˈni.no", translation: "sandwich" },
        { type: "text", text: ". Ascolto le persone parlare e cerco di capire ogni " },
        { type: "word", word: "parola", ipa: "paˈrɔ.la", translation: "word" },
        { type: "text", text: "." },
      ],
      [
        { type: "text", text: "Imparare una nuova " },
        { type: "word", word: "lingua", ipa: "ˈliŋ.ɡwa", translation: "language" },
        { type: "text", text: " è come aprire una porta su un altro mondo." },
      ],
    ],
  },
};

export const SPEECH_LANG: Record<Language, string> = {
  Spanish: "es-ES",
  Catalan: "ca-ES",
  Italian: "it-IT",
};