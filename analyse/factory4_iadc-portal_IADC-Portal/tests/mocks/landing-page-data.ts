export default [
  {
    title: 'SDM Portal',
    targetUrl: 'sdm',
    img: 'play-to-win.png',
    logo: 'digital.png',
    responsible: 'responsible2',
    description:
      'Description with more than 125 character, we have embarked on a large-scale digital transformation with short- and long-term goals that reflects the Play to Win strategy and drive growth for the company to allow the reinvestment',
    disabled: false,
    search: false,
    spaceKeys: [],
    spaceTitles: [],
    glisten: false,
  },
  {
    title: 'DIGITAL',
    targetUrl: 'digital',
    img: 'Digital-Banner.png',
    logo: 'digital.png',
    responsible: 'responsible1',
    description: 'Test site 1',
    disabled: true,
    search: false,
    spaceKeys: [],
    spaceTitles: [],
    glisten: false,
  },
  {
    title: 'IADC Portal',
    targetUrl: 'iadc',
    img: 'Digital-Factory-Cookbooks.png',
    logo: 'Factory4-icon.png',
    responsible: 'responsible3',
    description: 'Description with less than 125 character',
    disabled: false,
    search: true,
    spaceKeys: ['iadc', 'eoee', 'dgbi', 'fact'],
    spaceTitles: [
      'IADC Program',
      'eOEE Product',
      'DGBI Product',
      'FaCT Product',
    ],
    glisten: true,
    menus: [
      {
        href: '/iadc/feedback-dashboard',
        title: 'Feedback',
      },
    ],
  },
];
