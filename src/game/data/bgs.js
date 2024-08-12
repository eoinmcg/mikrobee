export default [
  {
    title: 'The Park',
    col: { bg: 15, ground: 11 },
    floor: 20,
    v: { x: 2, y: 0 },
    bg: [
      // { num: 1, name: 'sun' },
      // { num: 3, name: 'bush' },
      { num: 4, name: 'cloud' },
      { num: 8, name: 'star' },
    ],
    fg: [
      { num: 8, name: 'flower' },
    ],
    tree0: [16,15,200],
    nest0: [38,26],
    tree1: [16,15,200],
    nest1: [200,26],
    p1: [38,80],
    p2: [208,80],
    ledges: [
      {w: 15, x: 32, y: 40},
      {w: 20, x: 32, y: 90},
      {w: 40, x: 5, y: 150},
      {w: 25, x: 200, y: 40},
      {w: 20, x: 210, y: 90},
      {w: 40, x: 200, y: 150},
    ],
    events: [
      {t: 1000, n: 'Baddie', d: { i: 'hornet', yRange: 50} },
      {t: 2000, n: 'Baddie', d: { i: 'hornet', yRange: 180} },
      {t: 3000, n: 'Baddie', d: { i: 'hornet', yRange: 250} },
      {t: 5000, n: 'Cat', d: {} },
      {t: 7000, n: 'Baddie', d: { i: 'gull', yRange: 100} },
      {t: 8000, n: 'Baddie', d: { i: 'hornet', yRange: 50} }
    ]
  }
];
