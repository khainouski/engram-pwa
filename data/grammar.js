// Content comes from the learner's own notes ("English grammar.docx"):
// rules, formulas and examples are copied verbatim.

export const GROUPS = [
  {
    id: 'time',
    title: 'Talking About Time in English',
    subtitle: 'Present · Past · Future',
    icon: '⏳',
    subgroups: [
      {
        id: 'present',
        title: 'Talking About the Present',
        topics: ['present-simple', 'present-continuous', 'present-perfect', 'present-perfect-continuous'],
        mix: 'Present Simple / Present Continuous / Present Perfect / Present Perfect Continuous',
        table: {
          head: ['Type', "When it's used", 'Structure', 'Example'],
          rows: [
            ['Present Simple', 'Habits, routines, general truths, facts', 'V / V+s/es', 'I usually start work at 9 AM. ❓ Do you work remotely or from the office?'],
            ['Present Continuous', 'Actions happening now or temporary situations', 'am/is/are + V-ing', 'We are testing a new feature this week. ❓ What are you working on at the moment?'],
            ['Present Perfect', 'Actions with present results or unspecified past time', 'have/has + V3', 'She has already deployed the update. ❓ Have you ever been to London?'],
            ['Present Perfect Continuous', 'Actions continuing from the past until now', 'have/has been + V-ing', 'They have been working on this project since Monday. ❓ How long have you been using Drupal?'],
          ],
        },
        story: {
          title: 'Story example',
          text: 'I work (работаю) as a backend developer, and our team releases (выпускает) a new version every two weeks. At the moment we are rebuilding (перестраиваем) the payment service.\nWe have already migrated (уже перенесли) half of the endpoints. I have been working (работаю уже) on this migration since March, so I know (знаю) the code well. Right now my colleague is reviewing (просматривает) my pull request, and he has not found (не нашёл) a single critical bug yet.\nUsually we deploy (деплоим) on Thursdays, but this week we are deploying (деплоим — на этой неделе) on Friday, because the client wants (хочет) to see the demo first.',
        },
      },
      {
        id: 'past',
        title: 'Talking About the Past',
        topics: ['past-simple', 'past-continuous', 'past-perfect', 'past-perfect-continuous'],
        mix: 'Past Simple / Past Continuous / Past Perfect / Past Perfect Continuous',
        table: {
          head: ['Type', "When it's used", 'Structure', 'Example'],
          rows: [
            ['Past Simple', 'Completed actions in the past', 'V2 / V-ed', 'I finished the report yesterday. ❓ When did you join the company?'],
            ['Past Continuous', 'Actions in progress at a specific moment in the past', 'was/were + V-ing', 'They were testing the feature when the bug appeared. ❓ What were you doing when the server crashed?'],
            ['Past Perfect', 'Actions completed before another past action or moment', 'had + V3', 'I had finished my task before the meeting started. ❓ Had you ever used Drupal before you joined this project?'],
            ['Past Perfect Continuous', 'Actions continuing for some time before another past event', 'had been + V-ing', 'They had been working on the release all night. ❓ How long had you been working at EPAM before you moved to another team?'],
          ],
        },
        story: {
          title: 'Story example',
          text: 'Our team was developing (разрабатывала) a mobile app for personal finance. We wanted (хотели) to simplify how users monitored (отслеживали) their spending.\nWhen we were adding (добавляли) new features, a critical bug caused (вызвал) the app to crash. Previously, I had written (написал заранее) the code that tracked user expenses, and by then I had been working (работал уже) on it for two months, so I took up (взялся за) the fix.\nThe bug was resolved quickly. We launched (запустили) the app, which became (стало) a tool used globally.',
        },
      },
      {
        id: 'future',
        title: 'Talking About the Future',
        topics: ['future-simple', 'be-going-to', 'present-continuous-future', 'future-continuous', 'present-simple-schedule', 'future-perfect'],
        mix: 'will / be going to / Present Continuous / Future Continuous / Present Simple / Future Perfect',
        table: {
          head: ['Type', "When it's used", 'Structure', 'Example'],
          rows: [
            ['Future Simple', 'Spontaneous decisions, predictions', 'will + Verb', 'I will send you the report tomorrow. ❓ What will you do if the system crashes?'],
            ['Be going to', 'Intentions, plans, predictions based on evidence', 'am/is/are + going to + Verb', 'The team is going to deploy the update tomorrow. ❓ Are you going to join the meeting tomorrow?'],
            ['Present Continuous', 'Arranged activities, definite plans', 'am/is/are + V-ing', 'I am flying to London next Monday. ❓ Who are you meeting this afternoon?'],
            ['Present Simple', 'Timetables, schedules, regular events', 'V / V+s/es (he, she, it)', 'The train leaves at 9:30 AM tomorrow. ❓ When does the next sprint start?'],
            ['Future Perfect', 'Actions completed by a specific time in the future', 'will have + V3', 'They will have fixed the bugs by Friday. ❓ Will they have finished testing by Friday?'],
          ],
        },
        story: {
          title: 'Story example',
          text: 'Next month our team will launch (запустит) the new payment service. We are going to move (собираемся перенести) the last endpoints next week.\nI am meeting (встречаюсь — договорённость) the client on Tuesday, and the demo starts (начинается — расписание) at 10:00 sharp. While you are presenting, I will be monitoring (буду следить) the logs, and if anything goes wrong, we will roll back (откатим) the release.\nBy the end of the sprint we will have fixed (исправим — к этому моменту) all the blockers. I think (думаю) the client is going to be (будет) happy.',
        },
      },
    ],
  },
  {
    id: 'conditionals',
    title: 'Conditionals',
    subtitle: 'Zero · First · Second · Third · Mixed',
    icon: '🔀',
    topics: ['zero-conditional', 'first-conditional', 'second-conditional', 'third-conditional', 'mixed-conditional'],
    mix: 'Zero / First / Second / Third / Mixed Conditional',
  },
  {
    id: 'modals',
    title: 'Modal Verbs',
    subtitle: 'can, could, may, must, should, etc.',
    icon: '🗝️',
    topics: ['modals-ability', 'modals-possibility', 'modals-permission', 'modals-obligation', 'modals-advice', 'modals-politeness'],
    mix: 'can / could / may / might / must / should / would',
  },
  {
    id: 'verb-patterns',
    title: 'Verb Patterns',
    subtitle: 'Gerunds, Infinitives and related constructions',
    icon: '🔗',
    topics: ['gerund', 'infinitive', 'gerund-vs-infinitive', 'verb-constructions', 'related-constructions'],
  },
  {
    id: 'sentence-structure',
    title: 'Sentence Structure & Questions',
    subtitle: 'Basic structures · Direct & Indirect · Negative · Tags',
    icon: '🧱',
    topics: ['basic-structures', 'direct-indirect-questions', 'negative-questions', 'question-tags'],
  },
  {
    id: 'passive',
    title: 'Passive Voice',
    subtitle: '8 форм: Subject + to be + V3',
    icon: '🔄',
    topics: ['passive-present-simple', 'passive-past-simple', 'passive-future-simple', 'passive-present-continuous', 'passive-past-continuous', 'passive-present-perfect', 'passive-past-perfect', 'passive-future-perfect'],
    mix: 'все формы Passive Voice',
    intro: {
      use: 'When the focus is on the action or the object, not on who performs it.',
      useRu: 'Когда важно само действие или объект, а не тот, кто его выполняет.',
      formula: 'Subject + to be (in correct tense) + Past Participle (V3) [+ by + doer (optional)]',
      formulaRu: 'Подлежащее здесь не выполняет действие, а испытывает его. Время показывает только to be, смысловой глагол всегда остаётся в V3. «by + исполнитель» добавляют, лишь когда он важен.',
    },
    table: {
      head: ['Tense', "When it's used", 'Structure', 'Example'],
      rows: [
        ['Present Simple', 'Facts, routines', 'am/is/are + V3', 'Emails are sent automatically.'],
        ['Past Simple', 'Finished past actions', 'was/were + V3', 'The server was restarted yesterday.'],
        ['Future Simple', 'Future actions', 'will be + V3', 'The report will be sent tomorrow.'],
        ['Present Continuous', 'Actions happening now', 'am/is/are + being + V3', 'The website is being updated.'],
        ['Past Continuous', 'Actions happening in the past', 'was/were + being + V3', 'The data was being processed.'],
        ['Present Perfect', 'Recent or result actions', 'has/have been + V3', 'The module has been deployed.'],
        ['Past Perfect', 'Action before another in the past', 'had been + V3', 'The system had been tested.'],
        ['Future Perfect', 'Action before a future moment', 'will have been + V3', 'The update will have been deployed.'],
      ],
    },
  },
  {
    id: 'reported-speech',
    title: 'Reported Speech',
    subtitle: 'Statements · Questions · Commands & Requests',
    icon: '💬',
    topics: ['reported-statements', 'reported-questions', 'reported-commands', 'reported-real-life', 'reported-phrases'],
  },
];

export const TOPICS = {
  // ─────────────────────────────── PRESENT ───────────────────────────────
  'present-simple': {
    title: 'Present Simple',
    formula: 'V / V+s/es',
    detail: `Обычная форма глагола. Исключение — he, she, it: там нужен -s/-es.
Отрицание и вопрос строим через do/does. Как только появляется do/does, -s у основного глагола пропадает.
He works → He doesn't work → Does he work?`,
    markers: ['usually', 'always', 'often', 'never', 'every day', 'on Mondays'],
    use: [{ en: 'Habits, routines, general truths, and facts.', ru: 'Привычки, распорядок, общие истины и факты.' }],
    examples: [
      { en: 'I usually start work at 9 AM.' },
      { en: 'Water boils at 100°C.' },
      { en: 'Do you work remotely or from the office?', q: true },
    ],
    compare: ['present-continuous', 'present-perfect'],
  },
  'present-continuous': {
    title: 'Present Continuous',
    formula: 'am/is/are + V-ing',
    detail: 'Показывает, что действие идёт прямо сейчас или временно — в этот период жизни, а не вообще. Не употребляется с глаголами состояния: know, like, want, need, believe, understand.',
    markers: ['now', 'at the moment', 'currently', 'this week', 'today'],
    use: [{ en: 'Actions happening now or temporary situations.', ru: 'Действия, происходящие сейчас, или временные ситуации.' }],
    examples: [
      { en: 'I am writing documentation right now.' },
      { en: 'We are testing a new feature this week.' },
      { en: 'What are you working on at the moment?', q: true },
    ],
    compare: ['present-simple', 'present-perfect-continuous'],
  },
  'present-perfect': {
    title: 'Present Perfect',
    formula: 'have/has + V3',
    detail: 'Связывает прошлое с настоящим: важен не момент действия, а его результат сейчас. Поэтому не сочетается с точным временем в прошлом — как только появляется yesterday или in 2020, нужен Past Simple.',
    markers: ['already', 'yet', 'just', 'ever', 'never', 'so far', 'recently'],
    use: [{ en: 'Actions that happened at an unspecified time or have results in the present.', ru: 'Действия, произошедшие когда-то в прошлом, но связанные с настоящим.' }],
    examples: [
      { en: 'I have finished the report.' },
      { en: 'She has already deployed the update.' },
      { en: 'Have you ever been to London?', q: true },
    ],
    compare: ['past-simple', 'present-perfect-continuous'],
  },
  'present-perfect-continuous': {
    title: 'Present Perfect Continuous',
    formula: 'have/has been + V-ing',
    detail: 'Подчёркивает длительность: действие началось в прошлом и всё ещё идёт или только что закончилось. Внимание на процесс и его продолжительность, а не на результат.',
    markers: ['for two hours', 'since Monday', 'all day', 'How long…?'],
    use: [{ en: 'Actions that started in the past and continue up to now (or have just stopped).', ru: 'Действия, начавшиеся в прошлом и продолжающиеся до настоящего момента (или только что завершившихся).' }],
    examples: [
      { en: 'I have been learning English for three years.' },
      { en: 'They have been working on this project since Monday.' },
      { en: 'How long have you been using Drupal?', q: true },
    ],
    compare: ['present-perfect', 'present-continuous'],
  },

  // ───────────────────────────────── PAST ─────────────────────────────────
  'past-simple': {
    title: 'Past Simple',
    formula: 'V2 / V-ed',
    detail: 'Действие целиком в прошлом, связи с настоящим нет. Правильные глаголы получают -ed, неправильные меняют форму (V2).',
    markers: ['yesterday', 'last week', 'in 2020', 'two days ago'],
    use: [{ en: 'Completed actions in the past.', ru: 'Завершённые действия в прошлом.' }],
    examples: [
      { en: 'I finished the report yesterday.' },
      { en: 'We launched the website last week.' },
      { en: 'When did you join the company?', q: true },
    ],
    compare: ['present-perfect', 'past-continuous'],
  },
  'past-continuous': {
    title: 'Past Continuous',
    formula: 'was/were + V-ing',
    detail: 'Фон в прошлом: действие уже шло в определённый момент. Часто в паре с Past Simple — длинное действие в Continuous, короткое, прервавшее его, в Simple.',
    markers: ['at 8 PM yesterday', 'while', 'when… happened', 'all morning'],
    use: [
      { en: 'Actions in progress at a specific moment in the past.', ru: 'Действие было в процессе в конкретный момент в прошлом.' },
      { en: 'Background description / setting the scene in a story.', ru: 'Фон рассказа: что происходило вокруг, декорации сцены.' },
      { en: 'Long action interrupted by a shorter action (short = Past Simple).', ru: 'Длинное действие, которое прервало короткое (короткое — в Past Simple).' },
    ],
    notes: [{ en: 'NOT used with: stative verbs (know, like, believe, be, have (в значении «иметь»), etc.) or for permanent features.', ru: 'Не используется с глаголами состояния и для постоянных признаков.' }],
    examples: [
      { en: 'I was working on the project at 8 PM yesterday.' },
      { en: 'They were testing the feature when the bug appeared.' },
      { en: 'When I arrived at the trade fair, some exhibitors were setting up their stands and others were unpacking materials.' },
      { en: 'What were you doing when the server crashed?', q: true },
    ],
    compare: ['past-simple', 'past-perfect-continuous'],
  },
  'past-perfect': {
    title: 'Past Perfect',
    formula: 'had + V3',
    detail: '«Прошлое до прошлого»: одно действие завершилось раньше другого. Нужен только там, где порядок событий важен и не очевиден — иначе достаточно двух Past Simple.',
    markers: ['before', 'after', 'by the time', 'already'],
    use: [{ en: 'Actions completed before another past action or moment.', ru: 'Действия, завершённые до другого действия или момента в прошлом.' }],
    examples: [
      { en: 'I had finished my task before the meeting started.' },
      { en: 'She had already deployed the update when I joined the call.' },
      { en: 'Had you ever used Drupal before you joined this project?', q: true },
    ],
    compare: ['past-simple', 'past-perfect-continuous'],
  },
  'past-perfect-continuous': {
    title: 'Past Perfect Continuous',
    formula: 'had been + V-ing',
    detail: 'Показывает, сколько времени действие длилось до момента в прошлом. Отличие от Past Perfect: там важен факт завершения, здесь — протяжённость процесса.',
    markers: ['for two years before…', 'since…', 'all night', 'How long had…?'],
    use: [{ en: 'Actions that continued for some time before another past event.', ru: 'Действия, которые длились в течение некоторого времени до другого события в прошлом.' }],
    examples: [
      { en: 'I had been studying English for two years before I took the exam.' },
      { en: 'They had been working on the release all night.' },
      { en: 'How long had you been working at EPAM before you moved to another team?', q: true },
    ],
    compare: ['past-perfect', 'present-perfect-continuous'],
  },

  // ──────────────────────────────── FUTURE ────────────────────────────────
  'future-simple': {
    title: 'Future Simple',
    formula: 'will + Verb',
    detail: 'Решение, принятое в момент речи, обещание или прогноз, основанный на мнении. Если решение принято заранее — нужен be going to.',
    markers: ['probably', 'I think', 'I promise', 'tomorrow'],
    use: [{ en: 'Spontaneous decisions, predictions.', ru: 'Спонтанные решения, предсказания.' }],
    examples: [
      { en: 'I will send you the report tomorrow.' },
      { en: 'The system will crash if the server overloads.' },
      { en: 'What will you do if the system crashes?', q: true },
    ],
    compare: ['be-going-to', 'present-continuous-future'],
  },
  'be-going-to': {
    title: 'Be going to',
    formula: 'am/is/are + going to + Verb',
    detail: 'Намерение, о котором решили заранее, или прогноз по видимым признакам — тучи на небе, красный индикатор на мониторинге.',
    markers: ['tonight', 'tomorrow', 'Look!', 'I’ve decided'],
    use: [{ en: 'Intentions, plans, or predictions based on evidence.', ru: 'Намерения, планы или предсказания, основанные на фактах.' }],
    examples: [
      { en: 'The team is going to deploy the update tomorrow.' },
      { en: 'Look at the sky! It is going to rain.' },
      { en: 'Are you going to join the meeting tomorrow?', q: true },
    ],
    compare: ['future-simple', 'present-continuous-future'],
  },
  'present-continuous-future': {
    title: 'Present Continuous (future)',
    formula: 'am/is/are + V-ing',
    detail: 'Договорённость, которая уже существует: время назначено, место известно, люди предупреждены. Ближе всего к русскому «я лечу в понедельник».',
    markers: ['tomorrow at 5', 'next Monday', 'this evening'],
    use: [{ en: 'Already arranged activities or definite future plans.', ru: 'Уже организованные действия или определённые планы на будущее.' }],
    examples: [
      { en: 'I am flying to London next Monday.' },
      { en: 'We are testing the new feature this week.' },
      { en: 'Who are you meeting this afternoon?', q: true },
    ],
    compare: ['be-going-to', 'present-simple-schedule'],
  },
  'future-continuous': {
    title: 'Future Continuous',
    formula: 'will be + V-ing',
    detail: 'Действие будет в процессе в конкретный момент будущего. Часто нужно, чтобы объяснить, почему в это время будешь недоступен.',
    markers: ['at 7 tomorrow', 'this time next week', 'when you call'],
    use: [
      { en: 'Actions that will be in progress at a specific time in the future.', ru: 'Действие будет в процессе в конкретный момент в будущем.' },
      { en: 'Future actions that are interrupted by another action.', ru: 'Будущее действие, которое прервёт другое действие.' },
    ],
    examples: [
      { en: "Call me tomorrow at 7 because after that I'll be watching TV." },
      { en: "I'll be driving a car when you call." },
    ],
    compare: ['future-simple', 'future-perfect'],
  },
  'present-simple-schedule': {
    title: 'Present Simple (schedules)',
    formula: 'V / V+s/es',
    detail: 'Расписания и графики — то, что задано извне и не зависит от чьих-то планов: поезда, рейсы, начало встречи, старт спринта.',
    markers: ['at 9:30', 'on Monday', 'the train', 'the meeting'],
    use: [{ en: 'Timetables, schedules, regular events.', ru: 'Расписания, графики, регулярные события.' }],
    examples: [
      { en: 'The train leaves at 9:30 AM tomorrow.' },
      { en: 'The weekly meeting starts at 10 AM.' },
      { en: 'When does the next sprint start?', q: true },
    ],
    compare: ['present-continuous-future', 'be-going-to'],
  },
  'future-perfect': {
    title: 'Future Perfect',
    formula: 'will have + V3',
    detail: 'Действие завершится к сроку в будущем. Почти всегда рядом стоит дедлайн: by Friday, by the time you arrive.',
    markers: ['by Friday', 'by then', 'by the time…'],
    use: [{ en: 'Actions that will be completed by a specific time in the future.', ru: 'Действия, которые будут завершены к определённому моменту в будущем.' }],
    examples: [
      { en: 'They will have fixed the bugs by Friday.' },
      { en: 'By the time you arrive, I will have finished my part.' },
      { en: 'Will they have finished testing by Friday?', q: true },
    ],
    compare: ['future-continuous', 'future-simple'],
  },

  // ───────────────────────────── CONDITIONALS ─────────────────────────────
  'zero-conditional': {
    title: '0 Conditional (Нулевой условный)',
    formula: 'if/when + Present Simple → Present Simple',
    detail: 'Обе части в Present Simple: условие всегда даёт один и тот же результат. Именно поэтому if здесь свободно заменяется на when — смысл не меняется.',
    markers: ['if', 'when', 'whenever', 'always'],
    use: [{ en: 'We use the zero conditional to talk about things that are generally true, especially for laws and rules.', ru: 'Говорим о том, что верно всегда: законы природы, правила, закономерности. Оба действия — в Present Simple, if можно заменить на when.' }],
    examples: [
      { en: "If I drink too much coffee, I can't sleep at night.", ru: 'Если я пью слишком много кофе, я не могу спать ночью.' },
      { en: 'Ice melts if you heat it.', ru: 'Лёд тает, если его нагреть.' },
      { en: 'When the sun goes down, it gets dark.', ru: 'Когда солнце садится, становится темно.' },
      { en: 'What happens if you mix red and blue paint?', ru: 'Что происходит, если смешать красную и синюю краску?', q: true },
    ],
    compare: ['first-conditional'],
  },
  'first-conditional': {
    title: '1 Conditional (Первый условный)',
    formula: 'if + Present Simple → will + Verb (без to)',
    detail: 'Реальное условие в будущем. После if — настоящее время, будущее только во второй части.',
    markers: ['if', 'unless', 'as soon as', 'as long as', 'in case'],
    use: [{ en: 'We use the first conditional to talk about real and possible situations in the future. It is also common to use this structure with unless, as long as, as soon as, or in case instead of if.', ru: 'Реальное, вполне возможное условие в будущем. После if — настоящее время, будущее только во второй части. Вместо if бывают unless, as long as, as soon as, in case.' }],
    examples: [
      { en: 'If it rains tomorrow, we will stay at home.', ru: 'Если завтра пойдет дождь, мы останемся дома.' },
      { en: 'If I study hard, I will pass the exam.', ru: 'Если я буду усердно учиться, я сдам экзамен.' },
      { en: "I'll send you a message as soon as I arrive.", ru: 'Я отправлю тебе сообщение, как только приеду.' },
      { en: 'What will you do if you get promoted?', ru: 'Что ты будешь делать, если тебя повысят?', q: true },
    ],
    compare: ['second-conditional', 'zero-conditional'],
  },
  'second-conditional': {
    title: '2 Conditional (Второй условный)',
    formula: 'if + Past Simple → would + Verb (без to)',
    detail: 'Ситуация нереальная или маловероятная. Прошедшее время здесь не про прошлое — оно лишь сигнал «это фантазия».',
    markers: ['if I were you', 'would', 'imagine'],
    use: [{ en: 'We use the second conditional to talk about unreal or unlikely situations in the present or future.', ru: 'Нереальная или маловероятная ситуация в настоящем или будущем — «если бы да кабы». С to be обычно were для всех лиц: if I were.' }],
    examples: [
      { en: 'If I had more free time, I would travel more.', ru: 'Если бы у меня было больше свободного времени, я бы больше путешествовал.' },
      { en: 'If I were rich, I would buy a big house.', ru: 'Если бы я был богат, я бы купил большой дом.' },
      { en: "If I didn't have this flexibility, I would feel less motivated.", ru: 'Если бы у меня не было этой гибкости, я бы чувствовал себя менее мотивированным.' },
      { en: 'What would you do if you won the lottery?', ru: 'Что бы ты сделал, если бы выиграл в лотерею?', q: true },
    ],
    compare: ['first-conditional', 'third-conditional'],
  },
  'third-conditional': {
    title: '3 Conditional (Третий условный)',
    formula: 'if + Past Perfect → would have + Past Participle (V3)',
    detail: 'Прошлое, которое уже не изменить, и воображаемый результат. Обычно это сожаление или разбор полётов: что было бы, поступи мы иначе.',
    markers: ['if… had', 'would have', 'could have'],
    use: [
      { en: 'We use the Third Conditional to talk about unreal, impossible past situations and their imagined results.', ru: 'Нереальное прошлое и его воображаемый результат — то, что уже нельзя изменить.' },
      { en: "We use it when something couldn't happen in the past because that moment is gone.", ru: 'Третий условный используется для описания нереального прошлого, которое невозможно изменить, и его воображаемого результата. Это часто сожаления и фразы «если бы я тогда…».' },
    ],
    examples: [
      { en: 'If I had studied harder, I would have passed the exam.', ru: 'Если бы я учился усерднее, я бы сдал экзамен.' },
      { en: "If they had left earlier, they wouldn't have missed the train.", ru: 'Если бы они вышли раньше, они бы не опоздали на поезд.' },
      { en: 'If we had planned better, the project would have been more successful.', ru: 'Если бы мы лучше спланировали, проект был бы успешнее.' },
      { en: 'What would you have done differently if you had had to do this again?', ru: 'Что бы ты сделал по-другому, если бы пришлось сделать это снова?', q: true },
    ],
    compare: ['mixed-conditional', 'second-conditional'],
  },
  'mixed-conditional': {
    title: 'Mixed Conditional',
    formula: 'If + Past Perfect, would + V1',
    detail: 'Смешивает времена: условие в прошлом, а результат — в настоящем. Прошлое реально произошло (или не произошло), и мы разбираем, как это сказывается сейчас.',
    markers: ['if… had', 'would', 'now', 'today'],
    use: [{ en: 'We use this mixed conditional to talk about a real past situation that could have been different and its imagined result in the present.', ru: 'Если бы в прошлом было иначе, то сейчас ситуация была бы другой. Говорим о реальном прошлом.' }],
    examples: [
      { en: "If I had gone to bed earlier, I wouldn't be so tired now." },
      { en: 'If I had completed the Kubernetes course last year, I would deploy this service without help now.' },
      { en: 'If we had set up monitoring last year, we would understand the system behavior better now.' },
      { en: 'If I had started learning Go earlier, I would work on an interesting project now.' },
    ],
    compare: ['third-conditional', 'second-conditional'],
  },

  // ─────────────────────────────── MODALS ───────────────────────────────
  'modals-ability': {
    title: 'Ability (Способность)',
    formula: 'can / could / be able to / managed to',
    detail: 'Модальные глаголы не меняются по лицам и идут с голым инфинитивом. У can нет форм будущего и перфекта — их заменяет be able to.',
    markers: ['can', 'could', 'be able to', 'manage to'],
    use: [
      { en: 'Present → can', ru: 'Умение или возможность сейчас.', ex: 'I can read this log.' },
      { en: 'Past (general ability) → could', ru: 'Умение вообще, в целом в прошлом.', ex: 'When I was a junior, I could code only in PHP.' },
      { en: 'Past (single successful action) → was/were able to / managed to', ru: 'Один конкретный удавшийся случай — здесь could не годится.', ex: 'After two tries we were able to fix the bug.' },
      { en: "Past (failed attempt / попытка) → couldn't / wasn't able to", ru: 'Попытка, которая не удалась.', ex: "We couldn't reproduce the issue yesterday." },
      { en: 'Future → will be able to (❌ not will can)', ru: 'В будущем can заменяется на be able to: двух модальных подряд не бывает.', ex: 'I will be able to join after 5 pm.' },
      { en: 'Perfect (ability up to now) → have/has been able to', ru: 'Возможность, сохранявшаяся до настоящего момента.', ex: 'So far, we have been able to keep SLAs.' },
    ],
    examples: [
      { en: 'I can read this log.' },
      { en: 'When I was a junior, I could code only in PHP.' },
      { en: 'After two tries we were able to fix the bug.' },
      { en: "We couldn't reproduce the issue yesterday." },
      { en: 'I will be able to join after 5 pm.' },
      { en: 'So far, we have been able to keep SLAs.' },
    ],
    compare: ['modals-possibility'],
  },
  'modals-possibility': {
    title: 'Possibility / Probability (Вероятность)',
    formula: 'may / might / can',
    detail: 'Оценка вероятности: may — шансы неплохие, might — слабее и осторожнее. Can о вероятности конкретного события не говорит, он про возможность в принципе.',
    markers: ['may', 'might', 'perhaps', 'possibly'],
    use: [
      { en: 'May / Might → possibility (may = higher chance, might = weaker)', ru: 'Возможность: may — шансов больше, might — слабее и осторожнее.' },
      { en: 'Can → general truth or ability in principle', ru: 'Общая закономерность: так бывает в принципе.' },
    ],
    examples: [
      { en: 'We may go to the cinema.' },
      { en: 'It might rain later.' },
      { en: 'Deploys can fail if checks are skipped.' },
    ],
    compare: ['modals-ability', 'modals-permission'],
  },
  'modals-permission': {
    title: 'Permission (Разрешение)',
    formula: 'can / may / might',
    detail: 'По возрастанию формальности: can в разговоре, may в официальной речи и документах, might — совсем осторожно и вежливо. В вопросах can I звучит нейтрально, could I — вежливее.',
    markers: ['can I', 'may I', 'could I'],
    use: [
      { en: 'Can → neutral permission', ru: 'Нейтральное разрешение, обычная разговорная форма.' },
      { en: 'May → formal permission', ru: 'Формальное разрешение: документы, официальная речь.' },
      { en: 'Might → polite or cautious permission', ru: 'Особенно вежливое, осторожное разрешение.' },
    ],
    examples: [
      { en: 'You can leave early today.' },
      { en: 'You may enter the office now.' },
      { en: "We might come in if it's not too late." },
    ],
    compare: ['modals-obligation', 'modals-politeness'],
  },
  'modals-obligation': {
    title: 'Obligation / Necessity (Обязанность / Необходимость)',
    formula: "must / have to / don't have to / needn't",
    detail: 'Must — необходимость изнутри: правило, закон, собственная убеждённость. Have to — обстоятельства извне, выбора нет.',
    markers: ['must', 'have to', 'need to', 'don’t have to', 'needn’t'],
    use: [
      { en: 'Must → strong necessity, rule, or law', ru: 'Сильная необходимость: правило, закон, личная убеждённость.' },
      { en: 'Have to → external necessity («have no choice»)', ru: 'Необходимость извне: так сложились обстоятельства, выбора нет.' },
      { en: "Don't have to / Needn't → no necessity", ru: 'Необходимости нет — но это и не запрет (запрет — mustn\'t).' },
    ],
    examples: [
      { en: 'You must wear a seatbelt.' },
      { en: 'I have to finish this report by 6.' },
      { en: "You don't have to work tomorrow." },
    ],
    compare: ['modals-advice', 'modals-permission'],
  },
  'modals-advice': {
    title: 'Advice (Совет)',
    formula: 'should / ought to',
    detail: 'Should — обычный совет, годится почти всегда. Ought to звучит формальнее и с оттенком морального долга, в разговорной речи встречается реже.',
    markers: ['should', 'ought to', 'had better'],
    use: [
      { en: 'Should → giving advice', ru: 'Обычный совет: «стоит сделать».' },
      { en: 'Ought to → formal or moral advice', ru: 'Формальный или моральный совет — «следует».' },
    ],
    examples: [
      { en: 'You should see a doctor.' },
      { en: 'We ought to respect our parents.' },
    ],
    compare: ['modals-obligation'],
  },
  'modals-politeness': {
    title: 'Politeness and Hypothetical Situations',
    formula: 'would / could',
    detail: 'Прошедшая форма модального делает фразу вежливее, а не переносит её в прошлое: could you мягче, чем can you, would like вежливее, чем want. На этом же строятся условные предложения.',
    markers: ['would you', 'could you', 'would like'],
    use: [
      { en: 'Would → politeness, conditionals', ru: 'Вежливость и условные предложения: «бы».' },
      { en: 'Could → polite request', ru: 'Вежливая просьба — мягче, чем can.' },
      { en: 'Could → hypothetical ability', ru: 'Гипотетическая возможность: «смогли бы, если бы».' },
    ],
    notes: [
      { en: 'Summary: Can → present ability, fact, permission, general possibility. Could → past ability, politeness, hypothetical possibility. Be able to → replaces can/could in future or perfect tenses. May / Might → possibility or permission (may = stronger, might = weaker). Must / Have to → obligation (must = rule, have to = external need). Should / Ought to → advice. Will / Would → future, politeness, conditionals.', ru: 'Итоговая схема: can — умение и разрешение сейчас; could — прошлое, вежливость и гипотеза; be able to — замена can в будущем и перфекте; may/might — возможность; must/have to — обязанность; should/ought to — совет; will/would — будущее и вежливость.' },
    ],
    examples: [
      { en: 'Would you like some tea?' },
      { en: 'I would help you if I had more time.' },
      { en: 'Could you review my PR?' },
      { en: 'If we had more time, we could refactor it.' },
    ],
    compare: ['modals-permission', 'second-conditional'],
  },

  // ──────────────────────── VERB PATTERNS ────────────────────────
  gerund: {
    title: 'Gerund (V-ing)',
    formula: 'V + -ing',
    intro: 'Глагол с окончанием -ing работает как существительное: Reading is useful.',
    patterns: [
      { scheme: 'like, love, enjoy, prefer, dislike, hate', name: 'Глаголы «нравится / не нравится»', ru: 'После них всегда V-ing.',
        examples: [{ en: 'I enjoy reading books.' }, { en: 'She hates getting up early.' }] },
      { scheme: 'finish, stop, avoid, give up, keep (on), consider, suggest, imagine, practice', name: 'Глаголы «заканчивать / прекращать / избегать»', ru: 'Тоже требуют V-ing.',
        examples: [{ en: 'He finished writing the report.' }, { en: 'They suggested going to the park.' }] },
      { scheme: 'in, on, at, without, about …', name: 'После предлогов', ru: 'После любого предлога — только V-ing.',
        examples: [{ en: 'She is interested in learning English.' }, { en: 'He left without saying goodbye.' }] },
      { scheme: "can't help, can't stand, it's no use, it's worth", name: 'После выражений', ru: 'Устойчивые выражения с V-ing.',
        examples: [{ en: "I can't help laughing at that joke." }, { en: "It's worth trying again." }] },
    ],
    compare: ['infinitive', 'gerund-vs-infinitive'],
  },
  infinitive: {
    title: 'Infinitive (to + V)',
    formula: 'to + V',
    intro: 'Начальная форма глагола с to: I want to read this book.',
    patterns: [
      { scheme: 'want, would like, plan, hope, decide, agree, promise, refuse, learn, expect, need, manage, fail, offer, seem', name: 'Глаголы желания / намерения', ru: 'После них — to + V.',
        examples: [{ en: 'I want to learn English.' }, { en: 'She promised to help me.' }, { en: 'They decided to move abroad.' }] },
      { scheme: 'happy, glad, sorry, surprised, difficult, easy, ready, afraid', name: 'После прилагательных', ru: 'Прилагательное + to + V.',
        examples: [{ en: "I'm happy to see you." }, { en: "It's difficult to explain." }] },
      { scheme: 'too … / … enough', name: 'Выражения с too и enough', ru: '«Слишком, чтобы» и «достаточно, чтобы».',
        examples: [{ en: 'She is too tired to work.' }, { en: 'He is strong enough to carry it.' }] },
    ],
    compare: ['gerund', 'gerund-vs-infinitive'],
  },
  'gerund-vs-infinitive': {
    title: 'V-ing vs to + V (разница в значении)',
    formula: 'remember · forget · stop · try · regret',
    intro: 'Пять глаголов, у которых форма после них меняет смысл.',
    patterns: [
      { scheme: 'remember / forget', name: 'помнить / забыть', ru: 'to + V — не забыл и сделал. V-ing — помню сам процесс.',
        examples: [{ en: 'I remembered to lock the door.', ru: 'Не забыл и сделал.' }, { en: 'I remember locking the door.', ru: 'Помню сам процесс.' }] },
      { scheme: 'stop', name: 'остановиться', ru: 'to + V — остановился, чтобы. V-ing — прекратил делать.',
        examples: [{ en: 'He stopped to smoke.', ru: 'Остановился, чтобы покурить.' }, { en: 'He stopped smoking.', ru: 'Бросил курить.' }] },
      { scheme: 'try', name: 'пробовать', ru: 'to + V — попытаться. V-ing — попробовать как эксперимент.',
        examples: [{ en: 'Try to open the window.', ru: 'Попробуй открыть — попытайся.' }, { en: 'Try opening the window.', ru: 'Попробуй как эксперимент.' }] },
      { scheme: 'regret', name: 'сожалеть', ru: 'to + V — сожалею о том, что говорю сейчас. V-ing — о том, что сделал раньше.',
        examples: [{ en: 'I regret to inform you that your flight is canceled.', ru: 'Сожалею о том, что сообщаю.' }, { en: 'I regret saying that.', ru: 'Сожалею о сказанном раньше.' }] },
    ],
    compare: ['gerund', 'infinitive'],
  },
  'verb-constructions': {
    title: 'Важные конструкции',
    formula: 'would rather + V1 · make / let + V1 · be made + to V',
    intro: 'Три случая, где привычное to пропадает — или, наоборот, появляется.',
    patterns: [
      { scheme: 'would rather + V1', name: 'без to', ru: '«Я бы лучше…» — дальше голый глагол.',
        examples: [{ en: "I'd rather stay at home." }] },
      { scheme: 'make / let + V1', name: 'без to', ru: 'Заставить и разрешить — тоже без to.',
        examples: [{ en: 'She made me cry.' }, { en: 'They let us leave early.' }] },
      { scheme: 'be made + to V', name: 'пассив, с to', ru: 'А вот в пассиве to возвращается.',
        examples: [{ en: 'I was made to repeat the task.' }] },
    ],
    notes: [{ en: 'Итоговая шпаргалка: После like, enjoy, finish, avoid, suggest, prepositions → V-ing. После want, plan, decide, promise, adjectives → to + V. Разница в значении: stop, try, remember, forget, regret. Исключения: would rather + V1, make/let + V1, be made + to V.', ru: 'Проще всего запомнить так: предлог рядом — значит V-ing; намерение или цель — значит to + V.' }],
    compare: ['related-constructions', 'gerund-vs-infinitive'],
  },
  'related-constructions': {
    title: 'prefer · would rather · used to · be used to · be interested in',
    formula: 'prefer + V-ing / to + V · used to + V1 · be used to + V-ing',
    intro: 'Пять конструкций, которые легко перепутать между собой.',
    patterns: [
      { scheme: 'prefer + V-ing / to + V', name: 'предпочтение', ru: 'Выражает предпочтение.',
        examples: [{ en: 'I prefer working from home.', ru: 'Я предпочитаю работать из дома.' }, { en: 'I prefer tea to coffee.', ru: 'Я предпочитаю чай кофе.' }] },
      { scheme: 'would rather + V1', name: '«лучше бы»', ru: '«Предпочёл бы» — глагол без to.',
        examples: [{ en: "I'd rather stay at home tonight.", ru: 'Я бы лучше остался дома сегодня.' }, { en: "I'd rather not talk about it.", ru: 'Я бы предпочёл не говорить об этом.' }] },
      { scheme: 'used to + V1', name: 'раньше делал', ru: 'Привычка или состояние в прошлом, которого больше нет.',
        examples: [{ en: 'I used to play basketball at school.', ru: 'Раньше я играл в баскетбол в школе.' }, { en: 'She used to live in London.', ru: 'Она раньше жила в Лондоне.' }] },
      { scheme: 'be used to + V-ing / noun', name: 'привык к', ru: 'Не путать с used to: здесь речь о привычности, а не о прошлом.',
        examples: [{ en: "I'm used to waking up early.", ru: 'Я привык вставать рано.' }, { en: "She's used to cold weather.", ru: 'Она привыкла к холодной погоде.' }] },
      { scheme: 'be interested in + V-ing / noun', name: 'интересуюсь', ru: 'После предлога in — только V-ing.',
        examples: [{ en: "I'm interested in learning new technologies.", ru: 'Мне интересно изучать новые технологии.' }, { en: "He's interested in design.", ru: 'Он интересуется дизайном.' }] },
    ],
    compare: ['verb-constructions', 'gerund'],
  },

  // ─────────────────── SENTENCE STRUCTURE & QUESTIONS ───────────────────
  'basic-structures': {
    title: 'Basic Sentence Structures',
    formula: 'S + V · S + V + O · S + V + IO + DO · S + V + C · …',
    intro: 'Одиннадцать базовых схем английского предложения — из чего оно собирается.',
    patterns: [
      { scheme: 'S + V', name: 'Subject + Verb', ru: 'Простое предложение с непереходным глаголом (нет дополнения).',
        examples: [{ en: 'He sleeps.', ru: 'Он спит.' }, { en: 'She runs every morning.', ru: 'Она бегает каждое утро.' }] },
      { scheme: 'S + V + O', name: 'Subject + Verb + Object', ru: 'Переходный глагол + прямое дополнение (что?).',
        examples: [{ en: 'She reads a book.', ru: 'Она читает книгу.' }, { en: 'We watched a movie.', ru: 'Мы смотрели фильм.' }] },
      { scheme: 'S + V + IO + DO', name: 'Subject + Verb + Indirect Object + Direct Object', ru: 'Глагол + косвенное дополнение (кому?) + прямое (что?).',
        examples: [{ en: 'He gave me a letter.', ru: 'Он дал мне письмо.' }, { en: 'She showed us her new phone.', ru: 'Она показала нам свой новый телефон.' }] },
      { scheme: 'S + V + C', name: 'Subject + Verb + Complement', ru: 'Сказуемое + именная часть (характеристика подлежащего).',
        examples: [{ en: 'She is tired.', ru: 'Она устала.' }, { en: 'The report is finished.', ru: 'Отчёт завершён.' }] },
      { scheme: 'S + V + O + C', name: 'Subject + Verb + Object + Complement', ru: 'Объект + его характеристика.',
        examples: [{ en: 'We painted the room blue.', ru: 'Мы покрасили комнату в синий.' }, { en: 'They elected him president.', ru: 'Его избрали президентом.' }] },
      { scheme: '(AUX) + S + V …?', name: 'Auxiliary + Subject + Verb', ru: 'Общий вопрос (инверсия).',
        examples: [{ en: 'Do you like it?', ru: 'Тебе это нравится?' }, { en: 'Can she drive?', ru: 'Она умеет водить?' }] },
      { scheme: 'WH + AUX + S + V …?', name: 'Question word + Auxiliary + Subject + Verb', ru: 'Специальный вопрос.',
        examples: [{ en: 'What do you want?', ru: 'Что ты хочешь?' }, { en: 'Where are you going?', ru: 'Куда ты идёшь?' }] },
      { scheme: 'V (без S)', name: 'Verb', ru: 'Императив / приказ.',
        examples: [{ en: 'Close the window.', ru: 'Закрой окно.' }, { en: 'Please sit down.', ru: 'Пожалуйста, садитесь.' }] },
      { scheme: 'There is / are + S', name: 'There is/are + Subject', ru: 'Конструкция существования: что-то где-то есть.',
        examples: [{ en: 'There is a book on the table.', ru: 'На столе книга.' }, { en: 'There are many people in the room.', ru: 'В комнате много людей.' }] },
      { scheme: 'It is / was + Adj / Noun', name: 'It is/was + …', ru: 'Формальное подлежащее “it”: погода, время, мнение.',
        examples: [{ en: 'It is cold today.', ru: 'Сегодня холодно.' }, { en: 'It was a great party.', ru: 'Это была отличная вечеринка.' }] },
      { scheme: 'S + V + Object Clause', name: 'Subject + Verb + [Clause]', ru: 'Главное предложение + придаточное.',
        examples: [{ en: 'I know that she is right.', ru: 'Я знаю, что она права.' }, { en: 'Tell me what you need.', ru: 'Скажи мне, что тебе нужно.' }] },
    ],
    compare: ['direct-indirect-questions'],
  },
  'direct-indirect-questions': {
    title: 'Direct and Indirect Questions',
    formula: 'Direct: глагол перед подлежащим · Indirect: подлежащее перед глаголом',
    detail: 'Косвенный вопрос звучит вежливее прямого, поэтому его и используют с малознакомыми людьми. Главное — после вводной фразы порядок слов прямой, как в утверждении, и do/does/did исчезают.',
    markers: ['Do you know…', 'Could you tell me…', 'if', 'whether'],
    use: [
      { en: 'Indirect questions начинаются с выражений: Do you know…?, Could you tell me…?', ru: 'Косвенный вопрос звучит вежливее прямого, поэтому он и нужен в разговоре с малознакомыми людьми.' },
      { en: 'В косвенных вопросах не используется do/does/did.', ru: 'Вспомогательный глагол исчезает, а окончание -s возвращается к смысловому глаголу.', ex: 'Direct: Where does Mr Elmore work? → Indirect: Could you tell me where Mr Elmore works?' },
      { en: 'Wh- и How-слова сохраняются.', ru: 'Вопросительное слово остаётся, но порядок слов после него — прямой.', ex: 'Direct: How much does it cost? → Indirect: Can you tell me how much it costs?' },
      { en: 'Если who/what — подлежащее, структура не меняется.', ru: 'Менять нечего: порядок слов и так прямой.', ex: 'Direct: Who left this message? → Indirect: Do you know who left this message?' },
      { en: 'Для Yes/No-вопросов → if или whether.', ru: 'Вопросительного слова нет, поэтому его роль берёт на себя if или whether.', ex: "Direct: Is it going to rain tomorrow? → Indirect: Do you know whether it's going to rain tomorrow?" },
    ],
    examples: [
      { en: 'Direct: When is Mr Patel leaving?', q: true },
      { en: 'Indirect: Do you know when Mr Patel is leaving?', q: true },
      { en: 'Direct: Where does Mr Elmore work? → Indirect: Could you tell me where Mr Elmore works?', q: true },
      { en: 'Direct: How much does it cost? → Indirect: Can you tell me how much it costs?', q: true },
      { en: 'Direct: Who left this message? → Indirect: Do you know who left this message?', q: true },
      { en: "Direct: Is it going to rain tomorrow? → Indirect: Do you know whether it's going to rain tomorrow?", q: true },
    ],
    compare: ['negative-questions', 'question-tags'],
  },
  'negative-questions': {
    title: 'Negative Questions',
    formula: "isn't / didn't / can't / won't … + S + V?",
    detail: 'Такой вопрос спрашивает не столько информацию, сколько передаёт эмоцию: удивление, упрёк, предложение. Отвечать на них нужно по смыслу, а не по русской логике «да/нет».',
    markers: ['isn’t', 'didn’t', 'can’t', 'won’t', 'why don’t you'],
    use: [
      { en: 'Начинаются с отрицательной формы вспомогательного или модального глагола: isn’t, didn’t, can’t, won’t…', ru: 'Такой вопрос не про информацию: он передаёт эмоцию или ожидание говорящего.' },
      { en: 'Жалоба', ru: 'Разве ты ещё не закончил? — недовольство задержкой.', ex: "Haven't you finished yet?" },
      { en: 'Предложение', ru: 'Почему бы не присоединиться? — мягкое приглашение.', ex: "Why don't you join us?" },
      { en: 'Уточнение', ru: 'Разве это не твоё? — говорящий уверен и ждёт подтверждения.', ex: "Isn't this yours?" },
      { en: 'Просьба', ru: 'Можно ли нам присоединиться? — вежливая просьба.', ex: "Can't we join you at the meeting?" },
    ],
    examples: [
      { en: "Aren't you based in Milan?", q: true },
      { en: "Didn't they sell hardware?", q: true },
      { en: "Can't you work later?", q: true },
      { en: "Haven't you finished yet?", ru: 'Разве ты ещё не закончил?', q: true },
      { en: "Why don't you join us?", ru: 'Почему бы не присоединиться?', q: true },
      { en: "Isn't this yours?", ru: 'Разве это не твоё?', q: true },
    ],
    compare: ['question-tags', 'direct-indirect-questions'],
  },
  'question-tags': {
    title: 'Question Tags',
    formula: 'утверждение + короткий вопрос (auxiliary + subject)',
    detail: 'Хвостик переспрашивает и держит разговор. Правило простое: знак меняется на противоположный, а глагол берётся тот же, что в основной части; если его нет — do/does/did.',
    markers: ['isn’t it', 'don’t you', 'have you', 'right?'],
    use: [
      { en: 'Положительное утверждение → отрицательный тег.', ru: 'Знак всегда меняется на противоположный.', ex: "It's hot, isn't it?" },
      { en: 'Отрицательное утверждение → положительный тег.', ru: 'И наоборот: после отрицания тег без not.', ex: "You haven't seen my keys, have you?" },
      { en: 'Если есть модальный/вспомогательный → повторяется.', ru: 'Берём тот же глагол, что уже стоит в предложении.', ex: "She won't go, will she? · You can swim, can't you?" },
      { en: 'Если нет вспомогательного → используем do/does/did.', ru: 'Смысловой глагол в тег не переносится — его заменяет do.', ex: "You work for Siemens, don't you?" },
      { en: 'Тег в том же времени.', ru: 'Прошедшее — значит и тег в прошедшем.', ex: "He left early, didn't he?" },
      { en: 'Для someone/somebody/anyone/everybody → they.', ru: 'Пол неизвестен, поэтому местоимение — they.', ex: "Anyone can join, can't they?" },
      { en: 'Для nobody/no one → тег положительный.', ru: 'Отрицание уже внутри подлежащего, второй раз его не ставят.', ex: 'Nobody knew about that, did they?' },
    ],
    examples: [
      { en: "It's hot, isn't it?", ru: 'Жарко, не так ли?', q: true },
      { en: "You haven't seen my keys, have you?", ru: 'Ты ведь не видел мои ключи, да?', q: true },
      { en: "She won't go, will she?", q: true },
      { en: "You can swim, can't you?", q: true },
      { en: "You work for Siemens, don't you?", q: true },
      { en: "He left early, didn't he?", q: true },
      { en: "Anyone can join, can't they?", q: true },
      { en: 'Nobody knew about that, did they?', q: true },
    ],
    compare: ['negative-questions'],
  },

  // ─────────────────────────────── PASSIVE ───────────────────────────────
  'passive-present-simple': {
    title: 'Present Simple Passive',
    formula: 'am / is / are + V3',
    detail: 'Регулярное действие, где важен не исполнитель, а сам процесс: так устроен регламент или система. Частая форма в документации и описании процессов.',
    markers: ['every Friday', 'automatically', 'usually'],
    use: [{ en: 'General truths, facts, regular actions.', ru: 'Общие истины, факты и регулярные действия.' }],
    examples: [
      { en: 'Emails are sent automatically.' },
      { en: 'The code is reviewed every Friday.' },
      { en: 'Is the system tested regularly?', q: true },
    ],
    compare: ['passive-past-simple', 'present-simple'],
  },
  'passive-past-simple': {
    title: 'Past Simple Passive',
    formula: 'was / were + V3',
    detail: 'Завершённое действие в прошлом без указания исполнителя — обычная форма для отчётов и постмортемов: важно, что произошло, а не кто сделал.',
    markers: ['yesterday', 'last week', 'in 2023'],
    use: [{ en: 'Completed actions in the past.', ru: 'Завершённые действия в прошлом.' }],
    examples: [
      { en: 'The server was restarted yesterday.' },
      { en: 'These bugs were fixed last week.' },
      { en: 'When was the update released?', q: true },
    ],
    compare: ['passive-present-perfect', 'past-simple'],
  },
  'passive-future-simple': {
    title: 'Future Simple Passive',
    formula: 'will be + V3',
    detail: 'Планируемое действие в будущем, исполнитель неизвестен или неважен. Типичная форма для анонсов и планов релиза.',
    markers: ['tomorrow', 'soon', 'next release'],
    use: [{ en: 'Future actions where the doer is unknown or unimportant.', ru: 'Действия в будущем, когда исполнитель неизвестен или неважен.' }],
    examples: [
      { en: 'The report will be sent tomorrow.' },
      { en: 'A new version will be deployed soon.' },
      { en: 'Will the task be completed by Friday?', q: true },
    ],
    compare: ['passive-future-perfect', 'future-simple'],
  },
  'passive-present-continuous': {
    title: 'Present Continuous Passive',
    formula: 'am / is / are + being + V3',
    detail: 'Действие идёт прямо сейчас. В пассиве появляется being — именно оно отличает «сейчас чинят» от «починено».',
    markers: ['now', 'at the moment', 'currently'],
    use: [{ en: 'Actions happening right now.', ru: 'Действия, которые происходят прямо сейчас.' }],
    examples: [
      { en: 'The website is being updated.' },
      { en: 'The issue is being investigated.' },
      { en: 'Why is the system being restarted?', q: true },
    ],
    compare: ['passive-past-continuous', 'passive-present-simple'],
  },
  'passive-past-continuous': {
    title: 'Past Continuous Passive',
    formula: 'was / were + being + V3',
    detail: 'Действие шло в конкретный момент в прошлом. Часто рядом стоит второе событие, которое его прервало.',
    markers: ['when… crashed', 'all night', 'at that time'],
    use: [{ en: 'Actions that were happening at a specific moment in the past.', ru: 'Действия, которые шли в конкретный момент в прошлом.' }],
    examples: [
      { en: 'The data was being processed when the system crashed.' },
      { en: 'The files were being uploaded all night.' },
      { en: 'What was being done at that time?', q: true },
    ],
    compare: ['passive-present-continuous', 'passive-past-simple'],
  },
  'passive-present-perfect': {
    title: 'Present Perfect Passive',
    formula: 'has / have been + V3',
    detail: 'Действие завершено, и важен результат сейчас: задача сделана, модуль выкачен. Самая частая пассивная форма в рабочих статусах.',
    markers: ['already', 'just', 'yet', 'so far'],
    use: [{ en: 'Actions that have been completed recently or have a result now.', ru: 'Действия, только что завершённые или важные своим результатом сейчас.' }],
    examples: [
      { en: 'The module has been deployed.' },
      { en: 'All tasks have been completed.' },
      { en: 'Has the bug been fixed yet?', q: true },
    ],
    compare: ['passive-past-perfect', 'passive-past-simple'],
  },
  'passive-past-perfect': {
    title: 'Past Perfect Passive',
    formula: 'had been + V3',
    detail: 'Действие завершилось до другого момента в прошлом. Обычно объясняет, почему дальше всё пошло именно так.',
    markers: ['before', 'by the time', 'already'],
    use: [{ en: 'Actions completed before another action in the past.', ru: 'Действия, завершённые до другого действия в прошлом.' }],
    examples: [
      { en: 'The system had been tested before launch.' },
      { en: 'The database had been backed up before the crash.' },
      { en: 'Had the issue been resolved before deployment?', q: true },
    ],
    compare: ['passive-present-perfect', 'past-perfect'],
  },
  'passive-future-perfect': {
    title: 'Future Perfect Passive',
    formula: 'will have been + V3',
    detail: 'К названному сроку в будущем действие будет завершено. Форма для обязательств и дедлайнов.',
    markers: ['by Monday', 'by the deadline', 'by then'],
    use: [{ en: 'Actions that will be completed by a specific time in the future.', ru: 'Действия, которые будут завершены к определённому моменту в будущем.' }],
    examples: [
      { en: 'The update will have been deployed by Monday.' },
      { en: 'All documents will have been signed by tomorrow.' },
      { en: 'Will the bugs have been fixed by the deadline?', q: true },
    ],
    compare: ['passive-future-simple', 'future-perfect'],
  },

  // ──────────────────────────── REPORTED SPEECH ────────────────────────────
  'reported-statements': {
    title: 'Reported Statements',
    formula: 'say / tell + (that) + sentence',
    detail: 'Say и tell различаются адресатом: say просто говорит, tell обязательно кому-то — told me. That почти всегда опускают.',
    markers: ['he said', 'she told me', 'explained', 'mentioned'],
    use: [
      { en: 'Goal: naturally tell what someone said, asked, or told you.', ru: 'Цель — естественно передать чужие слова своими.' },
      { en: '“that” можно опустить.', ru: 'В живой речи that чаще опускают, чем произносят.' },
      { en: 'В реальной речи время не меняют, если факт всё ещё актуален.', ru: 'Механический сдвиг времён нужен не всегда — смотри на смысл, а не на правило.' },
    ],
    examples: [
      { en: 'He said (that) he works remotely.' },
      { en: 'She told me (that) she is working on the report.' },
      { en: 'My manager said (that) he wants to discuss it later.' },
    ],
    compare: ['reported-questions', 'reported-real-life'],
  },
  'reported-questions': {
    title: 'Reported Questions',
    formula: 'ask + if / question word + normal word order',
    detail: 'Главная ошибка русскоязычных — сохранять вопросительный порядок слов. В косвенном вопросе он прямой, do/does/did исчезают, знака вопроса в конце нет.',
    markers: ['asked if', 'asked whether', 'wanted to know'],
    use: [
      { en: 'После ask порядок слов прямой — как в утверждении, без do/does/did.', ru: 'Это главная ошибка в косвенных вопросах: инверсия здесь не нужна.', ex: 'Правильно: He asked where it was. Неправильно: He asked where was it.' },
      { en: 'Yes/No-вопрос вводится через if или whether.', ru: 'Вопросительного слова нет — его место занимает if.', ex: 'He asked if I could join the meeting.' },
    ],
    examples: [
      { en: 'He asked if I could join the meeting.' },
      { en: 'She asked where the config file is.' },
      { en: 'My teammate asked who tested the feature.' },
    ],
    compare: ['reported-statements', 'direct-indirect-questions'],
  },
  'reported-commands': {
    title: 'Commands & Requests (приказы и просьбы)',
    formula: 'tell / ask + person + (not) to + verb',
    detail: 'Конструкция одна: tell/ask + человек + to + глагол. Tell — указание, ask — просьба.',
    markers: ['told me to', 'asked me to', 'not to'],
    use: [
      { en: 'tell — приказ / указание', ru: 'Указание сверху вниз: руководитель — команде.' },
      { en: 'ask — просьба / вежливо', ru: 'Просьба между равными, вежливый вариант.' },
      { en: 'Отрицание: tell / ask + person + not to + verb', ru: 'not ставится перед to, а не после.' },
    ],
    examples: [
      { en: 'He told me to restart the container.' },
      { en: 'She asked me to send the report.' },
      { en: 'They told me not to update the branch.' },
      { en: 'My lead asked me to review the PR before merge.' },
    ],
    compare: ['reported-statements'],
  },
  'reported-real-life': {
    title: 'Real-Life Logic (время по смыслу)',
    formula: 'сдвигать время или нет — по актуальности факта',
    detail: 'Механический сдвиг времён из учебника в живой речи работает не всегда. Смотри на факт: он ещё верен — оставляй настоящее; уже неактуален — сдвигай в прошедшее.',
    markers: ['he said he works', 'still', 'now'],
    use: [
      { en: 'Всё ещё актуально', ru: 'She said she works remotely. — Она всё ещё работает удалённо.' },
      { en: 'Прошлое, неактуально', ru: 'She said she worked remotely. — Тогда работала, сейчас — нет.' },
      { en: 'Процесс сейчас', ru: 'He said he is fixing the bug. — Всё ещё чинит.' },
      { en: 'Общий факт', ru: 'Общие истины не сдвигают во времени никогда.', ex: 'He said the sun rises in the east.' },
    ],
    examples: [
      { en: 'She said she works remotely.', ru: 'Она всё ещё работает удалённо.' },
      { en: 'She said she worked remotely.', ru: 'Тогда работала, сейчас — нет.' },
      { en: 'He said he is fixing the bug.', ru: 'Всё ещё чинит.' },
      { en: 'He said the sun rises in the east.', ru: 'Общий факт.' },
    ],
    compare: ['reported-statements'],
  },
  'reported-phrases': {
    title: 'Common Reported Speech Phrases (must-know set)',
    formula: 'He said (that)… · She told me (that)… · They asked if I could…',
    detail: 'Набор готовых оборотов для рабочих разговоров. Explain и mention передают оттенок: explain — объяснил причину, mention — упомянул вскользь.',
    markers: ['said', 'told me', 'asked if', 'explained that', 'mentioned that'],
    use: [
      { en: 'He said (that)…', ru: 'Он сказал, что… — say без адресата.' },
      { en: 'She told me (that)…', ru: 'Она сказала мне, что… — после tell обязательно кому.' },
      { en: 'They asked if I could…', ru: 'Они спросили, могу ли я… — косвенный Yes/No-вопрос.' },
      { en: 'He told me to…', ru: 'Он велел мне… — указание.' },
      { en: 'She asked me not to…', ru: 'Она попросила меня не… — просьба с отрицанием.' },
      { en: 'He explained (that)…', ru: 'Он объяснил, что… — когда передаёшь причину.' },
      { en: 'She mentioned (that)…', ru: 'Она упомянула, что… — вскользь, между делом.' },
    ],
    notes: [{ en: 'Sounds natural at work: He said he’s checking it. · She told me to create a Jira ticket. · They asked if we can deploy today. · He explained that it’s a frontend issue. · She mentioned that QA is still testing.', ru: 'Живые рабочие формулировки: время в них часто не сдвигают, потому что дело ещё не закончено.' }],
    examples: [
      { en: "He said he's working on the release." },
      { en: "She told me she'll be late to the meeting." },
      { en: 'They asked if I could review the code today.' },
      { en: 'He told me to restart the container.' },
      { en: 'She asked me not to push to main.' },
      { en: 'He explained that the issue was on the API side.' },
      { en: 'She mentioned that QA will test it tomorrow.' },
    ],
    compare: ['reported-statements', 'reported-commands'],
  },
};

// topic id → { groupId, subId }, for navigation and breadcrumbs
export const TOPIC_INDEX = (() => {
  const index = {};
  for (const g of GROUPS) {
    if (g.subgroups) {
      for (const s of g.subgroups) {
        for (const t of s.topics) index[t] = { groupId: g.id, subId: s.id };
      }
    } else {
      for (const t of g.topics || []) index[t] = { groupId: g.id, subId: null };
    }
  }
  return index;
})();

export function findGroup(id) {
  return GROUPS.find((g) => g.id === id) || null;
}

export function findSubgroup(groupId, subId) {
  const g = findGroup(groupId);
  return g && g.subgroups ? g.subgroups.find((s) => s.id === subId) || null : null;
}

export function topicTitle(id) {
  return TOPICS[id] ? TOPICS[id].title : id;
}
