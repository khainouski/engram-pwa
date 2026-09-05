// Vocabulary & Expressions — из личного конспекта "English grammar.docx".
// Единая форма: раздел → группы → выражения { term, ru?, example? }.

export const VOCAB = [
  {
    id: 'have',
    title: 'HAVE',
    icon: '🤝',
    subtitle: 'часто = действие / опыт',
    tip: 'have = что-то «имеем / испытываем» (have a problem, have a cold, have lunch).',
    groups: [
      { label: 'Еда и напитки', items: [
        { term: 'have breakfast' }, { term: 'have lunch' }, { term: 'have dinner' }, { term: 'have a drink' },
      ] },
      { label: 'Здоровье', items: [
        { term: 'have a cold' }, { term: 'have a headache' }, { term: 'have an operation' },
      ] },
      { label: 'Повседневность', items: [
        { term: 'have a bath/shower' }, { term: 'have a haircut' }, { term: 'have a look' }, { term: 'have a talk' },
      ] },
      { label: 'Досуг / эмоции', items: [
        { term: 'have fun' }, { term: 'have a good time' }, { term: 'have a rest' }, { term: 'have a dream' },
      ] },
      { label: 'Работа / дела', items: [
        { term: 'have a meeting', ru: 'проводить встречу', example: 'We will have a meeting tomorrow morning.' },
        { term: 'have a discussion', ru: 'обсуждать', example: "Let's have a discussion about the new project." },
        { term: 'have a problem', ru: 'иметь проблему', example: 'I have a problem with my laptop.' },
      ] },
      { label: 'Отношения', items: [
        { term: 'have a baby' }, { term: 'have a row', ru: 'ссориться' },
      ] },
    ],
  },
  {
    id: 'get',
    title: 'GET',
    icon: '🎯',
    subtitle: 'часто = получить / стать / добраться',
    tip: 'get = что-то «получаем / становимся / добираемся» (get a job, get tired, get home).',
    groups: [
      { label: 'Получение', items: [
        { term: 'get a job', ru: 'получить работу', example: 'He finally got a job in IT.' },
        { term: 'get a salary' }, { term: 'get a present' }, { term: 'get an email' },
      ] },
      { label: 'Состояние', items: [
        { term: 'get tired', ru: 'устать', example: 'I get tired after long meetings.' },
        { term: 'get ready' }, { term: 'get angry' },
        { term: 'get better/worse', ru: 'становиться лучше / хуже', example: 'The situation is getting better now.' },
        { term: 'get married/divorced' },
      ] },
      { label: 'Передвижение', items: [
        { term: 'get home', ru: 'добраться домой', example: 'I usually get to work at 9 am.' },
        { term: 'get to work', ru: 'добраться на работу', example: 'I usually get to work at 9 am.' },
        { term: 'get on/off the bus' }, { term: 'get into/out of a car' },
      ] },
      { label: 'Понимание', items: [
        { term: 'get the idea', ru: 'понять мысль', example: 'Did you get the idea of my presentation?' },
        { term: 'get the joke', ru: 'понять шутку', example: 'Did you get the joke?' },
        { term: 'get permission' },
      ] },
      { label: 'Фразовые', items: [
        { term: 'get up' }, { term: 'get along (with)' }, { term: 'get over' }, { term: 'get by' },
      ] },
    ],
  },
  {
    id: 'must-know',
    title: 'Must-know Expressions',
    icon: '🔟',
    subtitle: 'обязательный набор для ассесмента',
    tip: 'Используй эти выражения в своих ответах, даже если можешь сказать проще. Вместо “I relax” → “I usually have a rest after work.” Вместо “I understood” → “Yes, I got the idea.”',
    groups: [
      { label: 'HAVE', items: [
        { term: 'have a meeting', ru: 'проводить встречу', example: 'We will have a meeting tomorrow morning.' },
        { term: 'have a problem', ru: 'иметь проблему', example: 'I have a problem with my laptop.' },
        { term: 'have a discussion', ru: 'обсуждать', example: "Let's have a discussion about the new project." },
        { term: 'have fun / have a good time', ru: 'веселиться / хорошо проводить время', example: 'We had a good time at the team event.' },
        { term: 'have a rest / have a break', ru: 'отдыхать', example: "Let's have a short break after this task." },
      ] },
      { label: 'GET', items: [
        { term: 'get a job', ru: 'получить работу', example: 'He finally got a job in IT.' },
        { term: 'get home / get to work', ru: 'добраться домой / на работу', example: 'I usually get to work at 9 am.' },
        { term: 'get tired', ru: 'устать', example: 'I get tired after long meetings.' },
        { term: 'get better / get worse', ru: 'становиться лучше / хуже', example: 'The situation is getting better now.' },
        { term: 'get the idea / get the joke', ru: 'понять мысль / шутку', example: 'Did you get the idea of my presentation?' },
      ] },
    ],
  },
  {
    id: 'processes',
    title: 'Processes & Tasks',
    icon: '🔧',
    subtitle: 'Процессы и задачи',
    groups: [
      { items: [
        { term: 'develop', ru: 'разрабатывать', example: 'I develop custom Drupal modules and services.' },
        { term: 'implement', ru: 'внедрять, реализовывать', example: 'I implement new features based on client needs.' },
        { term: 'deliver', ru: 'поставлять, выпускать (результат)', example: 'We deliver product updates every sprint.' },
        { term: 'improve', ru: 'улучшать', example: 'I improve performance and code quality.' },
        { term: 'optimize', ru: 'оптимизировать', example: 'We optimize system speed and stability.' },
        { term: 'analyze', ru: 'анализировать', example: 'I analyze requirements before development.' },
        { term: 'document', ru: 'документировать', example: 'I document technical solutions for the team.' },
        { term: 'deploy', ru: 'развёртывать (релизы, код)', example: 'We deploy releases through CI/CD pipelines.' },
      ] },
    ],
  },
  {
    id: 'communication',
    title: 'Communication & Leadership',
    icon: '👥',
    subtitle: 'Коммуникация и лидерство',
    groups: [
      { items: [
        { term: 'explain', ru: 'объяснять', example: 'I explain complex ideas in simple terms.' },
        { term: 'discuss', ru: 'обсуждать', example: 'We discuss different approaches during meetings.' },
        { term: 'support', ru: 'поддерживать', example: 'I support teammates with technical advice.' },
        { term: 'delegate', ru: 'делегировать', example: 'I delegate tasks according to skills.' },
        { term: 'coordinate', ru: 'координировать', example: 'I coordinate work between dev, QA, and design.' },
        { term: 'mentor', ru: 'наставлять, менторить', example: 'I mentor junior developers in the team.' },
        { term: 'encourage', ru: 'поощрять, стимулировать', example: 'I encourage open communication and feedback.' },
        { term: 'handle', ru: 'разбираться с, управлять', example: 'I handle client requests and unexpected issues.' },
        { term: 'resolve', ru: 'разрешать (проблемы, конфликты)', example: 'I resolve conflicts quickly and professionally.' },
      ] },
    ],
  },
  {
    id: 'opinions',
    title: 'Opinions & Discussion',
    icon: '💬',
    subtitle: 'Мнения и рассуждения',
    groups: [
      { items: [
        { term: 'believe', ru: 'считать, верить', example: 'I believe teamwork is essential for success.' },
        { term: 'consider', ru: 'считать, рассматривать как', example: 'I consider communication one of my strengths.' },
        { term: 'prefer', ru: 'предпочитать', example: 'I prefer long-term planning to quick fixes.' },
        { term: 'agree / disagree', ru: 'соглашаться / не соглашаться', example: 'I agree that remote work improves focus.' },
        { term: 'suggest', ru: 'предлагать (идею)', example: 'I suggest testing changes before merging.' },
        { term: 'recommend', ru: 'рекомендовать', example: 'I recommend simplifying the workflow.' },
        { term: 'evaluate', ru: 'оценивать', example: 'I evaluate risks before making a decision.' },
      ] },
    ],
  },
  {
    id: 'growth',
    title: 'Growth & Future',
    icon: '🚀',
    subtitle: 'Развитие и будущее',
    groups: [
      { items: [
        { term: 'learn', ru: 'изучать, учиться', example: 'I constantly learn new technologies.' },
        { term: 'improve', ru: 'совершенствовать', example: 'I improve both technical and soft skills.' },
        { term: 'achieve', ru: 'достигать', example: 'I achieved all my yearly goals.' },
        { term: 'aim', ru: 'стремиться, нацеливаться', example: 'I aim to become a stronger team lead.' },
        { term: 'grow', ru: 'расти, развиваться', example: 'I want to grow in leadership and management.' },
        { term: 'adapt', ru: 'адаптироваться', example: 'I adapt quickly to changes in technology.' },
        { term: 'focus on', ru: 'сосредотачиваться на', example: 'I focus on delivering business value.' },
      ] },
    ],
  },
  {
    id: 'phrasal',
    title: 'Phrasal Verbs & Useful Expressions',
    icon: '🧠',
    subtitle: 'Фразовые глаголы и выражения',
    groups: [
      { items: [
        { term: 'deal with', ru: 'иметь дело с, решать', example: 'I deal with performance and integration issues.' },
        { term: 'take part in', ru: 'принимать участие в', example: 'I take part in release planning meetings.' },
        { term: 'look into', ru: 'изучать, рассматривать', example: "I'm looking into possible performance improvements." },
        { term: 'come up with', ru: 'придумать, предложить', example: 'I came up with a faster caching solution.' },
        { term: 'carry out', ru: 'выполнять, проводить', example: 'I carry out code reviews and QA checks.' },
        { term: 'set up', ru: 'настраивать, устанавливать', example: 'I set up CI/CD pipelines for deployment.' },
        { term: 'point out', ru: 'указывать, отмечать', example: 'I pointed out several UX issues to the team.' },
        { term: 'look forward to', ru: 'с нетерпением ждать', example: 'I look forward to new challenges and projects.' },
      ] },
    ],
  },
];

export function findVocabSection(id) {
  return VOCAB.find((s) => s.id === id) || null;
}

/** Плоский список выражений раздела — индекс в нём используется в ссылках. */
export function flatItems(section) {
  const out = [];
  for (const g of section.groups) {
    for (const it of g.items) out.push({ ...it, groupLabel: g.label || '' });
  }
  return out;
}

export function vocabSize(section) {
  return section.groups.reduce((n, g) => n + g.items.length, 0);
}
