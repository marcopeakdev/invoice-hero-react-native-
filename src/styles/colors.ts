type Gradient = {
  [key: string]: {
    colors: (string | number)[];
    start?: {x: number; y: number};
    end?: {x: number; y: number};
    locations?: number[];
  };
};

export const colors = {
  screenBackground: '#F9FAFB',
  whiteColor: '#fff',
  bluePrimary: '#5799F8',
  lightGray: '#D1D5DB',
  gray: '#6B7280',
  lightPurple: '#EDE9FE',
  lightGreen: '#ECFDF5',
  lightRed: '#fef2f2',
  lightYellow: '#FFFBEB',
  green: '#065f46',
  red: '#b91c1c',
  black: {
    100: 'rgba(0, 0, 0, 1)',
    80: 'rgba(0, 0, 0, .8)',
    60: 'rgba(0, 0, 0, .6)',
    50: 'rgba(0, 0, 0, .5)',
    30: 'rgba(0, 0, 0, .3)',
    15: 'rgba(0, 0, 0, .15)',
    0: 'rgba(0, 0, 0, 0)',
  },
  text: {
    whiteText: '#fff',
    whiteTextOpacity: {
      30: 'rgba(255, 255, 255, 0.3)',
      50: 'rgba(255, 255, 255, 0.5)',
      80: 'rgba(255, 255, 255, 0.8)',
    },
    grayText: '#6B7280',
    darkGrayText: '#374151',
    dark: '#464240',
    black: '#000',
    blue: '#307CEB',
    blue2: '#468DF2',
    green: '#047857',
    red: '#B91C1C',
    yellow: '#8D6600'
  },
};

export const gradients: Gradient = {
  mainBlueGradient: {
    start: {x: 0, y: 0},
    end: {x: 1, y: 1},
    colors: ['#2D7AEA', '#6FABFF'],
    locations: [0, 1],
  },
  planGradient: {
    start: {x: 0, y: 0.5},
    end: {x: 1, y: 0.5},
    colors: ['#f3f8fe', '#FFFFFF'],
    locations: [0, 1],
  },
  purpleGradient: {
    start: {x: 0, y: 0.5},
    end: {x: 1, y: 0.5},
    colors: ['#F8CFFF', '#EB6FFF', '#7A97FF', '#6F74FF'],
    locations: [0, 0.22, 0.77, 1],
  }
};
