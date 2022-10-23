import mock from '../mock'
import { paginateArray } from '../utils'

const data = [
  {
    id: '#5036',
    name: 'REE',
    customer: 'KCN TT',
    investor: 'REE PRO',
    address: 'Lô I-4, Đường CN 13',
    phone: '(84.8) 2220.1177'
  },
  {
    id: '#5037',
    name: 'REE',
    customer: 'KCN TT',
    investor: 'REE PRO',
    address: 'Lô I-4, Đường CN 13',
    phone: '(84.8) 2220.1177'
  },
  {
    id: '#5038',
    name: 'REE',
    customer: 'KCN TT',
    investor: 'REE PRO',
    address: 'Lô I-4, Đường CN 13',
    phone: '(84.8) 2220.1177'
  },
  {
    id: '#5039',
    name: 'REE',
    customer: 'KCN TT',
    investor: 'REE PRO',
    address: 'Lô I-4, Đường CN 13',
    phone: '(84.8) 2220.1177'
  },
  {
    id: '#5040',
    name: 'REE',
    customer: 'KCN TT',
    investor: 'REE PRO',
    address: 'Lô I-4, Đường CN 13',
    phone: '(84.8) 2220.1177'
  }
  // {
  //   id: '#5041',
  //   name: 'REE',
  //   customer: "KCN TT",
  //   investor: 'REE PRO',
  //   address: 'Lô I-4, Đường CN 13',
  //   phone: '(84.8) 2220.1177'
  // },
  // {
  //   id: '#5042',
  //   name: 'REE',
  //   customer: "KCN TT",
  //   investor: 'REE PRO',
  //   address: 'Lô I-4, Đường CN 13',
  //   phone: '(84.8) 2220.1177'
  // },
  // {
  //   id: '#5043',
  //   name: 'REE',
  //   customer: "KCN TT",
  //   investor: 'REE PRO',
  //   address: 'Lô I-4, Đường CN 13',
  //   phone: '(84.8) 2220.1177'
  // },
  // {
  //   id: '#5044',
  //   name: 'REE',
  //   customer: "KCN TT",
  //   investor: 'REE PRO',
  //   address: 'Lô I-4, Đường CN 13',
  //   phone: '(84.8) 2220.1177'
  // },
  // {
  //   id: '#5045',
  //   name: 'REE',
  //   customer: "KCN TT",
  //   investor: 'REE PRO',
  //   address: 'Lô I-4, Đường CN 13',
  //   phone: '(84.8) 2220.1177'
  // },
  // {
  //   id: '#5046',
  //   name: 'REE',
  //   customer: "KCN TT",
  //   investor: 'REE PRO',
  //   address: 'Lô I-4, Đường CN 13',
  //   phone: '(84.8) 2220.1177'
  // },
  // {
  //   id: '#5047',
  //   name: 'REE',
  //   customer: "KCN TT",
  //   investor: 'REE PRO',
  //   address: 'Lô I-4, Đường CN 13',
  //   phone: '(84.8) 2220.1177'
  // },
  // {
  //   id: '#5048',
  //   name: 'REE',
  //   customer: "KCN TT",
  //   investor: 'REE PRO',
  //   address: 'Lô I-4, Đường CN 13',
  //   phone: '(84.8) 2220.1177'
  // },
  // {
  //   id: '#5049',
  //   name: 'REE',
  //   customer: "KCN TT",
  //   investor: 'REE PRO',
  //   address: 'Lô I-4, Đường CN 13',
  //   phone: '(84.8) 2220.1177'
  // },
  // {
  //   id: '#5050',
  //   name: 'REE',
  //   customer: "KCN TT",
  //   investor: 'REE PRO',
  //   address: 'Lô I-4, Đường CN 13',
  //   phone: '(84.8) 2220.1177'
  // },
  // {
  //   id: '#5051',
  //   name: 'REE',
  //   customer: "KCN TT",
  //   investor: 'REE PRO',
  //   address: 'Lô I-4, Đường CN 13',
  //   phone: '(84.8) 2220.1177'
  // },
  // {
  //   id: '#5052',
  //   name: 'REE',
  //   customer: "KCN TT",
  //   investor: 'REE PRO',
  //   address: 'Lô I-4, Đường CN 13',
  //   phone: '(84.8) 2220.1177'
  // },
  // {
  //   id: '#5053',
  //   name: 'REE',
  //   customer: "KCN TT",
  //   investor: 'REE PRO',
  //   address: 'Lô I-4, Đường CN 13',
  //   phone: '(84.8) 2220.1177'
  // },
  // {
  //   id: '#5054',
  //   name: 'REE',
  //   customer: "KCN TT",
  //   investor: 'REE PRO',
  //   address: 'Lô I-4, Đường CN 13',
  //   phone: '(84.8) 2220.1177'
  // },
  // {
  //   id: '#5055',
  //   name: 'REE',
  //   customer: "KCN TT",
  //   investor: 'REE PRO',
  //   address: 'Lô I-4, Đường CN 13',
  //   phone: '(84.8) 2220.1177'
  // }
]

const customerData = [
  {
    id: 'SC0021',
    name: 'TBS 1',
    email: 'info@gmail.com',
    phone: '0908393202',
    address: '545 Ly Thuong Kiet Street, 8 Ward, TB Dist',
    avatar: require('@src/assets/images/portrait/small/avatar-s-2.jpg').default,
    todayYield: 9.68,
    totalYield: 299.982,
    role: 'Admin',
    project: 'Project 01',
    totalAP: 'REE PRO',
    inverterStatus: 'Online',
    sn: '123123',
    model: 'SC0024_GRID',
    type: 'ĐK 3 pha',
    manufacturer: 'VINASINO'
  },
  {
    id: 'SC0022',
    name: 'TBS 2',
    email: 'info@gmail.com',
    phone: '0908393202',
    address: '545 Tran Hung Dao Street, 8 Ward, TB Dist',
    avatar: require('@src/assets/images/portrait/small/avatar-s-3.jpg').default,
    todayYield: 9.68,
    totalYield: 299.982,
    role: 'Admin',
    project: 'Project 01',
    totalAP: 'REE PRO',
    inverterStatus: 'Online',
    sn: '123123',
    model: 'SC0024_GRID',
    type: 'ĐK 3 pha',
    manufacturer: 'VINASINO'
  },
  {
    id: 'SC0023',
    name: 'TBS 3',
    email: 'info@gmail.com',
    phone: '0908393202',
    address: '545 Nguyen Gia Thieu Street, 8 Ward, TB Dist',
    avatar: require('@src/assets/images/portrait/small/avatar-s-4.jpg').default,
    todayYield: 9.68,
    totalYield: 299.982,
    role: 'Admin',
    project: 'Project 01',
    totalAP: 'REE PRO',
    inverterStatus: 'Offline',
    sn: '123123',
    model: 'SC0024_GRID',
    type: 'ĐK 3 pha',
    manufacturer: 'VINASINO'
  },
  {
    id: 'SC0024',
    name: 'TBS 4',
    email: 'info@gmail.com',
    phone: '0908393202',
    address: '545 Huynh Van Banh Street, 8 Ward, TB Dist',
    avatar: require('@src/assets/images/portrait/small/avatar-s-5.jpg').default,
    todayYield: 9.68,
    totalYield: 299.982,
    role: 'Onsite operator',
    project: 'Project 01',
    totalAP: 'REE PRO',
    inverterStatus: 'Offline',
    sn: '123123',
    model: 'SC0024_GRID',
    type: 'ĐK 3 pha',
    manufacturer: 'VINASINO'
  },
  {
    id: 'SC0025',
    name: 'TBS 5',
    email: 'info@gmail.com',
    phone: '0908393202',
    address: '545 Cong Hoa Street, 8 Ward, TB Dist',
    avatar: require('@src/assets/images/portrait/small/avatar-s-6.jpg').default,
    todayYield: 9.68,
    totalYield: 299.982,
    role: 'Onsite operator',
    project: 'Project 01',
    totalAP: 'REE PRO',
    inverterStatus: 'Online',
    sn: '123123',
    model: 'SC0024_GRID',
    type: 'ĐK 3 pha',
    manufacturer: 'VINASINO'
  }
]

const customerProjects = [
  {
    id: 'PROJ_000',
    name: 'TBS1-10',
    customer: {
      id: 'SC0022',
      name: 'Karli Weissnat'
    },
    investor: 'Rosario Considine',
    address: '537 Keshawn Common',
    phone: '424-574-8129 x7948',
    type: 2,
    installedPower: 37,
    realtimePower: 3,
    todayYield: 8,
    totalYield: 23,
    equivalentHour: 16,
    longitude: 106.1357,
    latitude: 10.4016,
    status: 1,
    province: 42
  },
  {
    id: 'PROJ_001',
    name: 'TBS1-11',
    customer: {
      id: 'SC0025',
      name: 'Wilma Ryan'
    },
    investor: 'Leonardo Crona',
    address: '8872 Farrell Trace',
    phone: '(276) 320-1127 x90179',
    type: 1,
    installedPower: 31,
    realtimePower: 1,
    todayYield: 2,
    totalYield: 79,
    equivalentHour: 1,
    longitude: 105.7610,
    latitude: 10.5409,
    status: 3,
    province: 39
  },
  {
    id: 'PROJ_002',
    name: 'TBS1-12',
    customer: {
      id: 'SC0021',
      name: 'Josiane Ferry'
    },
    investor: 'Joshua Schroeder',
    address: '23682 Blick Stravenue',
    phone: '1-326-394-5901',
    type: 2,
    installedPower: 14,
    realtimePower: 1,
    todayYield: 4,
    totalYield: 21,
    equivalentHour: 7,
    longitude: 105.7424,
    latitude: 10.5825,
    status: 2,
    province: 17
  },
  {
    id: 'PROJ_003',
    name: 'TBS1-13',
    customer: {
      id: 'SC0021',
      name: 'Alexander Ritchie'
    },
    investor: 'Marjorie Veum',
    address: '4374 Rosina Flat',
    phone: '1-527-381-9143 x72639',
    type: 2,
    installedPower: 37,
    realtimePower: 7,
    todayYield: 10,
    totalYield: 30,
    equivalentHour: 17,
    longitude: 105.6428,
    latitude: 10.5290,
    status: 3,
    province: 59
  },
  {
    id: 'PROJ_004',
    name: 'TBS1-14',
    customer: {
      id: 'SC0024',
      name: 'Jammie Kub'
    },
    investor: 'Dawn Flatley',
    address: '536 Irwin Center',
    phone: '(690) 636-8262 x305',
    type: 2,
    installedPower: 50,
    realtimePower: 5,
    todayYield: 4,
    totalYield: 17,
    equivalentHour: 22,
    longitude: 106.5604,
    latitude: 10.6736,
    status: 2,
    province: 46
  },
  {
    id: 'PROJ_005',
    name: 'TBS1-15',
    customer: {
      id: 'SC0024',
      name: 'Kip Cummerata'
    },
    investor: 'Toby Schroeder',
    address: '836 Rau Union',
    phone: '(807) 337-2199 x997',
    type: 2,
    installedPower: 15,
    realtimePower: 8,
    todayYield: 1,
    totalYield: 61,
    equivalentHour: 3,
    longitude: 105.8295,
    latitude: 10.7734,
    status: 3,
    province: 48
  },
  {
    id: 'PROJ_006',
    name: 'TBS1-16',
    customer: {
      id: 'SC0025',
      name: 'Alexandra Bogisich'
    },
    investor: 'Gideon Blanda',
    address: '2910 Baumbach Ports',
    phone: '(902) 545-0118',
    type: 2,
    installedPower: 18,
    realtimePower: 4,
    todayYield: 2,
    totalYield: 15,
    equivalentHour: 7,
    longitude: 106.5803,
    latitude: 10.9345,
    status: 3,
    province: 56
  },
  {
    id: 'PROJ_007',
    name: 'TBS1-17',
    customer: {
      id: 'SC0023',
      name: 'Selina Kemmer'
    },
    investor: 'Carson Kihn',
    address: '7580 Lucie Stream',
    phone: '(914) 749-9887',
    type: 2,
    installedPower: 32,
    realtimePower: 8,
    todayYield: 6,
    totalYield: 78,
    equivalentHour: 14,
    longitude: 106.3997,
    latitude: 10.8908,
    status: 3,
    province: 25
  },
  {
    id: 'PROJ_008',
    name: 'TBS1-18',
    customer: {
      id: 'SC0024',
      name: 'Ed Pacocha'
    },
    investor: 'Tyshawn Jakubowski',
    address: '599 Stiedemann Streets',
    phone: '1-621-503-9658 x95256',
    type: 2,
    installedPower: 13,
    realtimePower: 6,
    todayYield: 3,
    totalYield: 74,
    equivalentHour: 8,
    longitude: 105.6123,
    latitude: 10.7703,
    status: 1,
    province: 53
  },
  {
    id: 'PROJ_009',
    name: 'TBS1-19',
    customer: {
      id: 'SC0021',
      name: 'Hyman Bernier'
    },
    investor: 'Hollie Hand',
    address: '625 Eliseo Isle',
    phone: '215.371.8786 x95168',
    type: 2,
    installedPower: 26,
    realtimePower: 4,
    todayYield: 6,
    totalYield: 52,
    equivalentHour: 24,
    longitude: 105.5797,
    latitude: 10.8514,
    status: 0,
    province: 6
  },
  {
    id: 'PROJ_0010',
    name: 'TBS1-110',
    customer: {
      id: 'SC0021',
      name: 'Napoleon Schimmel'
    },
    investor: 'Dessie Leuschke',
    address: '9870 Laisha Turnpike',
    phone: '1-831-955-5287',
    type: 1,
    installedPower: 24,
    realtimePower: 8,
    todayYield: 7,
    totalYield: 59,
    equivalentHour: 17,
    longitude: 105.9284,
    latitude: 10.3697,
    status: 2,
    province: 27
  },
  {
    id: 'PROJ_0011',
    name: 'TBS1-111',
    customer: {
      id: 'SC0025',
      name: 'Amani Towne'
    },
    investor: 'Gertrude Walker',
    address: '35742 Sheila Plaza',
    phone: '801-401-1379 x371',
    type: 1,
    installedPower: 34,
    realtimePower: 6,
    todayYield: 4,
    totalYield: 70,
    equivalentHour: 18,
    longitude: 106.1078,
    latitude: 10.2348,
    status: 2,
    province: 56
  },
  {
    id: 'PROJ_0012',
    name: 'TBS1-112',
    customer: {
      id: 'SC0021',
      name: 'Glennie Jast'
    },
    investor: 'Sheldon Corwin',
    address: '3036 Hilpert Falls',
    phone: '691.932.4684 x7576',
    type: 2,
    installedPower: 29,
    realtimePower: 5,
    todayYield: 10,
    totalYield: 83,
    equivalentHour: 11,
    longitude: 105.5584,
    latitude: 10.3923,
    status: 2,
    province: 50
  },
  {
    id: 'PROJ_0013',
    name: 'TBS1-113',
    customer: {
      id: 'SC0023',
      name: 'Madelynn Carter'
    },
    investor: 'Stone Schaden',
    address: '932 Arielle Parkways',
    phone: '652-583-7862',
    type: 1,
    installedPower: 48,
    realtimePower: 10,
    todayYield: 3,
    totalYield: 96,
    equivalentHour: 24,
    longitude: 106.2176,
    latitude: 10.2335,
    status: 2,
    province: 10
  },
  {
    id: 'PROJ_0014',
    name: 'TBS1-114',
    customer: {
      id: 'SC0022',
      name: 'Isabel Dach'
    },
    investor: 'Avery Jakubowski',
    address: '9288 Carolyne Estate',
    phone: '(844) 764-3686 x85308',
    type: 1,
    installedPower: 29,
    realtimePower: 8,
    todayYield: 2,
    totalYield: 54,
    equivalentHour: 7,
    longitude: 106.4287,
    latitude: 10.6955,
    status: 2,
    province: 16
  },
  {
    id: 'PROJ_0015',
    name: 'TBS1-115',
    customer: {
      id: 'SC0021',
      name: 'Maxine Abshire'
    },
    investor: 'Makenna Keebler',
    address: '564 Hadley Ways',
    phone: '726-958-7952 x16306',
    type: 2,
    installedPower: 45,
    realtimePower: 4,
    todayYield: 5,
    totalYield: 58,
    equivalentHour: 1,
    longitude: 106.1650,
    latitude: 10.3128,
    status: 3,
    province: 53
  },
  {
    id: 'PROJ_0016',
    name: 'TBS1-116',
    customer: {
      id: 'SC0021',
      name: 'Reva Mayer'
    },
    investor: 'Hannah Mraz',
    address: '064 Stoltenberg Shores',
    phone: '(775) 353-6618 x1450',
    type: 2,
    installedPower: 17,
    realtimePower: 3,
    todayYield: 2,
    totalYield: 96,
    equivalentHour: 22,
    longitude: 106.0099,
    latitude: 10.6317,
    status: 1,
    province: 48
  },
  {
    id: 'PROJ_0017',
    name: 'TBS1-117',
    customer: {
      id: 'SC0025',
      name: 'Angel O\'Conner'
    },
    investor: 'Mervin Kohler',
    address: '627 Estrella Neck',
    phone: '409.997.1336',
    type: 2,
    installedPower: 43,
    realtimePower: 5,
    todayYield: 6,
    totalYield: 47,
    equivalentHour: 18,
    longitude: 106.4820,
    latitude: 10.9339,
    status: 0,
    province: 31
  },
  {
    id: 'PROJ_0018',
    name: 'TBS1-118',
    customer: {
      id: 'SC0023',
      name: 'Augustine Hoppe'
    },
    investor: 'Carmela Nikolaus',
    address: '30721 Earl Causeway',
    phone: '(576) 803-0092 x430',
    type: 2,
    installedPower: 15,
    realtimePower: 1,
    todayYield: 8,
    totalYield: 43,
    equivalentHour: 12,
    longitude: 106.1496,
    latitude: 10.7744,
    status: 2,
    province: 33
  },
  {
    id: 'PROJ_0019',
    name: 'TBS1-119',
    customer: {
      id: 'SC0021',
      name: 'Ramona Feest'
    },
    investor: 'Turner Douglas',
    address: '95727 Garth Via',
    phone: '391.799.7681 x89918',
    type: 1,
    installedPower: 42,
    realtimePower: 6,
    todayYield: 8,
    totalYield: 58,
    equivalentHour: 9,
    longitude: 105.6143,
    latitude: 10.1505,
    status: 3,
    province: 36
  },
  {
    id: 'PROJ_0020',
    name: 'TBS1-120',
    customer: {
      id: 'SC0024',
      name: 'Alta Medhurst'
    },
    investor: 'Monty Buckridge',
    address: '286 Goldner Hills',
    phone: '(276) 995-6553',
    type: 1,
    installedPower: 41,
    realtimePower: 5,
    todayYield: 7,
    totalYield: 76,
    equivalentHour: 9,
    longitude: 106.4950,
    latitude: 10.9630,
    status: 3,
    province: 60
  },
  {
    id: 'PROJ_0021',
    name: 'TBS1-121',
    customer: {
      id: 'SC0022',
      name: 'Laury Hoeger'
    },
    investor: 'Leopold Dicki',
    address: '08999 Hoeger Meadows',
    phone: '(401) 652-9674 x383',
    type: 2,
    installedPower: 45,
    realtimePower: 1,
    todayYield: 1,
    totalYield: 86,
    equivalentHour: 13,
    longitude: 106.1675,
    latitude: 10.9987,
    status: 2,
    province: 46
  },
  {
    id: 'PROJ_0022',
    name: 'TBS1-122',
    customer: {
      id: 'SC0021',
      name: 'Savanah Parker'
    },
    investor: 'Edgar Cormier',
    address: '65344 Ullrich Islands',
    phone: '536.851.2781',
    type: 1,
    installedPower: 50,
    realtimePower: 7,
    todayYield: 3,
    totalYield: 76,
    equivalentHour: 3,
    longitude: 105.7692,
    latitude: 10.2611,
    status: 2,
    province: 31
  },
  {
    id: 'PROJ_0023',
    name: 'TBS1-123',
    customer: {
      id: 'SC0022',
      name: 'Wava Johnson'
    },
    investor: 'Pearl Kuhn',
    address: '4024 Jacobs Lights',
    phone: '892-539-8784',
    type: 2,
    installedPower: 28,
    realtimePower: 2,
    todayYield: 2,
    totalYield: 11,
    equivalentHour: 23,
    longitude: 105.6922,
    latitude: 10.3140,
    status: 2,
    province: 14
  },
  {
    id: 'PROJ_0024',
    name: 'TBS1-124',
    customer: {
      id: 'SC0024',
      name: 'Kendall Turner'
    },
    investor: 'Kassandra Bernier',
    address: '915 Satterfield Ranch',
    phone: '1-264-626-5590 x2095',
    type: 1,
    installedPower: 15,
    realtimePower: 3,
    todayYield: 5,
    totalYield: 88,
    equivalentHour: 13,
    longitude: 105.9779,
    latitude: 10.8517,
    status: 0,
    province: 13
  },
  {
    id: 'PROJ_0025',
    name: 'TBS1-125',
    customer: {
      id: 'SC0023',
      name: 'Kobe Thiel'
    },
    investor: 'Kaia Trantow',
    address: '9510 Block Ridge',
    phone: '1-400-934-0373 x86701',
    type: 1,
    installedPower: 10,
    realtimePower: 1,
    todayYield: 2,
    totalYield: 16,
    equivalentHour: 23,
    longitude: 106.4567,
    latitude: 10.9183,
    status: 0,
    province: 53
  },
  {
    id: 'PROJ_0026',
    name: 'TBS1-126',
    customer: {
      id: 'SC0024',
      name: 'Lonny Rodriguez'
    },
    investor: 'Einar Hand',
    address: '44666 Norris Landing',
    phone: '(254) 826-2394 x541',
    type: 1,
    installedPower: 32,
    realtimePower: 4,
    todayYield: 8,
    totalYield: 38,
    equivalentHour: 4,
    longitude: 106.0680,
    latitude: 10.0568,
    status: 1,
    province: 60
  },
  {
    id: 'PROJ_0027',
    name: 'TBS1-127',
    customer: {
      id: 'SC0024',
      name: 'Assunta Yundt'
    },
    investor: 'Selmer Kris',
    address: '64868 Joannie Stravenue',
    phone: '1-540-812-7780',
    type: 2,
    installedPower: 38,
    realtimePower: 2,
    todayYield: 3,
    totalYield: 87,
    equivalentHour: 3,
    longitude: 105.6030,
    latitude: 10.9219,
    status: 0,
    province: 57
  },
  {
    id: 'PROJ_0028',
    name: 'TBS1-128',
    customer: {
      id: 'SC0023',
      name: 'Cleve Brown'
    },
    investor: 'Lenora D\'Amore',
    address: '2796 Lemke Fall',
    phone: '(431) 780-7434',
    type: 2,
    installedPower: 48,
    realtimePower: 8,
    todayYield: 10,
    totalYield: 35,
    equivalentHour: 24,
    longitude: 105.7502,
    latitude: 10.9319,
    status: 0,
    province: 3
  },
  {
    id: 'PROJ_0029',
    name: 'TBS1-129',
    customer: {
      id: 'SC0023',
      name: 'Dimitri Smitham'
    },
    investor: 'Hailey Breitenberg',
    address: '43599 Dare Points',
    phone: '1-886-431-3653 x572',
    type: 1,
    installedPower: 27,
    realtimePower: 5,
    todayYield: 1,
    totalYield: 93,
    equivalentHour: 22,
    longitude: 105.8117,
    latitude: 10.3164,
    status: 1,
    province: 27
  },
  {
    id: 'PROJ_0030',
    name: 'TBS1-130',
    customer: {
      id: 'SC0024',
      name: 'Una Mayer'
    },
    investor: 'Tomasa Powlowski',
    address: '357 Quitzon Oval',
    phone: '980.944.6309 x55666',
    type: 1,
    installedPower: 43,
    realtimePower: 1,
    todayYield: 9,
    totalYield: 70,
    equivalentHour: 15,
    longitude: 106.2797,
    latitude: 10.2166,
    status: 1,
    province: 34
  },
  {
    id: 'PROJ_0031',
    name: 'TBS1-131',
    customer: {
      id: 'SC0025',
      name: 'Camilla Stoltenberg'
    },
    investor: 'Coy Nitzsche',
    address: '121 Jermain Extension',
    phone: '775.370.6127',
    type: 1,
    installedPower: 12,
    realtimePower: 8,
    todayYield: 3,
    totalYield: 89,
    equivalentHour: 12,
    longitude: 105.9334,
    latitude: 10.6462,
    status: 1,
    province: 27
  },
  {
    id: 'PROJ_0032',
    name: 'TBS1-132',
    customer: {
      id: 'SC0024',
      name: 'Geovanny Macejkovic'
    },
    investor: 'Jeanne Kunze',
    address: '74483 Bradtke Wall',
    phone: '(379) 455-3984',
    type: 1,
    installedPower: 17,
    realtimePower: 3,
    todayYield: 2,
    totalYield: 29,
    equivalentHour: 10,
    longitude: 106.5700,
    latitude: 10.3658,
    status: 2,
    province: 9
  },
  {
    id: 'PROJ_0033',
    name: 'TBS1-133',
    customer: {
      id: 'SC0022',
      name: 'Jordan Schulist'
    },
    investor: 'Sandrine Rutherford',
    address: '609 Crooks Locks',
    phone: '391.358.6901 x303',
    type: 1,
    installedPower: 39,
    realtimePower: 5,
    todayYield: 5,
    totalYield: 88,
    equivalentHour: 9,
    longitude: 106.0737,
    latitude: 10.5249,
    status: 0,
    province: 45
  },
  {
    id: 'PROJ_0034',
    name: 'TBS1-134',
    customer: {
      id: 'SC0021',
      name: 'Drake Armstrong'
    },
    investor: 'Rebeka Harvey',
    address: '2205 Dach Circles',
    phone: '(480) 361-9626 x586',
    type: 1,
    installedPower: 15,
    realtimePower: 7,
    todayYield: 2,
    totalYield: 16,
    equivalentHour: 16,
    longitude: 105.7544,
    latitude: 10.1553,
    status: 2,
    province: 39
  },
  {
    id: 'PROJ_0035',
    name: 'TBS1-135',
    customer: {
      id: 'SC0021',
      name: 'Jazmyn Gleichner'
    },
    investor: 'Kraig Kuhn',
    address: '624 Quigley Gardens',
    phone: '229.741.6451',
    type: 2,
    installedPower: 40,
    realtimePower: 9,
    todayYield: 8,
    totalYield: 26,
    equivalentHour: 18,
    longitude: 106.0002,
    latitude: 10.0365,
    status: 1,
    province: 40
  },
  {
    id: 'PROJ_0036',
    name: 'TBS1-136',
    customer: {
      id: 'SC0025',
      name: 'Adelia Kozey'
    },
    investor: 'Jaylen Runte',
    address: '5886 Langosh Dale',
    phone: '252.586.7693',
    type: 2,
    installedPower: 28,
    realtimePower: 6,
    todayYield: 2,
    totalYield: 44,
    equivalentHour: 19,
    longitude: 105.5408,
    latitude: 10.3019,
    status: 0,
    province: 51
  },
  {
    id: 'PROJ_0037',
    name: 'TBS1-137',
    customer: {
      id: 'SC0024',
      name: 'Ettie Hermann'
    },
    investor: 'Delia Wilkinson',
    address: '516 Susana Plaza',
    phone: '1-453-241-5978 x665',
    type: 1,
    installedPower: 44,
    realtimePower: 9,
    todayYield: 2,
    totalYield: 11,
    equivalentHour: 5,
    longitude: 106.3726,
    latitude: 10.5697,
    status: 1,
    province: 4
  },
  {
    id: 'PROJ_0038',
    name: 'TBS1-138',
    customer: {
      id: 'SC0023',
      name: 'Shanel Konopelski'
    },
    investor: 'Florida Dickinson',
    address: '6809 Keeling Ridges',
    phone: '612-658-4221',
    type: 1,
    installedPower: 38,
    realtimePower: 5,
    todayYield: 5,
    totalYield: 53,
    equivalentHour: 23,
    longitude: 106.5091,
    latitude: 10.5594,
    status: 2,
    province: 52
  },
  {
    id: 'PROJ_0039',
    name: 'TBS1-139',
    customer: {
      id: 'SC0023',
      name: 'Robert Quigley'
    },
    investor: 'Ida Simonis',
    address: '28593 Gerhold Lights',
    phone: '723.814.5614 x86801',
    type: 1,
    installedPower: 32,
    realtimePower: 6,
    todayYield: 8,
    totalYield: 98,
    equivalentHour: 2,
    longitude: 106.3344,
    latitude: 10.4758,
    status: 1,
    province: 9
  },
  {
    id: 'PROJ_0040',
    name: 'TBS1-140',
    customer: {
      id: 'SC0021',
      name: 'Adelbert Jenkins'
    },
    investor: 'Rosemarie Lubowitz',
    address: '8245 Abagail Lake',
    phone: '1-372-756-2357 x141',
    type: 1,
    installedPower: 35,
    realtimePower: 5,
    todayYield: 3,
    totalYield: 57,
    equivalentHour: 21,
    longitude: 106.5911,
    latitude: 10.7328,
    status: 0,
    province: 11
  },
  {
    id: 'PROJ_0041',
    name: 'TBS1-141',
    customer: {
      id: 'SC0025',
      name: 'Mya Christiansen'
    },
    investor: 'Reed Towne',
    address: '88342 Ignacio Forest',
    phone: '724-208-5548 x62991',
    type: 1,
    installedPower: 12,
    realtimePower: 1,
    todayYield: 4,
    totalYield: 82,
    equivalentHour: 1,
    longitude: 106.2138,
    latitude: 10.9336,
    status: 1,
    province: 34
  },
  {
    id: 'PROJ_0042',
    name: 'TBS1-142',
    customer: {
      id: 'SC0022',
      name: 'Jesse Treutel'
    },
    investor: 'Garrick Smith',
    address: '87397 Schmitt Plains',
    phone: '1-389-247-4544',
    type: 1,
    installedPower: 19,
    realtimePower: 1,
    todayYield: 8,
    totalYield: 24,
    equivalentHour: 13,
    longitude: 105.9794,
    latitude: 10.9262,
    status: 2,
    province: 55
  },
  {
    id: 'PROJ_0043',
    name: 'TBS1-143',
    customer: {
      id: 'SC0022',
      name: 'Eladio Parisian'
    },
    investor: 'Marco Swaniawski',
    address: '669 Bailee Row',
    phone: '(973) 487-2384',
    type: 2,
    installedPower: 31,
    realtimePower: 1,
    todayYield: 1,
    totalYield: 27,
    equivalentHour: 14,
    longitude: 106.1174,
    latitude: 10.1385,
    status: 0,
    province: 58
  },
  {
    id: 'PROJ_0044',
    name: 'TBS1-144',
    customer: {
      id: 'SC0023',
      name: 'Elyssa Predovic'
    },
    investor: 'Julian Flatley',
    address: '786 Bartell View',
    phone: '1-797-825-6201 x506',
    type: 1,
    installedPower: 50,
    realtimePower: 8,
    todayYield: 4,
    totalYield: 39,
    equivalentHour: 3,
    longitude: 106.0452,
    latitude: 10.7347,
    status: 3,
    province: 61
  },
  {
    id: 'PROJ_0045',
    name: 'TBS1-145',
    customer: {
      id: 'SC0021',
      name: 'Emory Wiza'
    },
    investor: 'Damon Gutmann',
    address: '2762 McLaughlin Dale',
    phone: '442-713-6719',
    type: 2,
    installedPower: 27,
    realtimePower: 4,
    todayYield: 7,
    totalYield: 81,
    equivalentHour: 17,
    longitude: 105.6416,
    latitude: 10.0383,
    status: 3,
    province: 25
  },
  {
    id: 'PROJ_0046',
    name: 'TBS1-146',
    customer: {
      id: 'SC0023',
      name: 'Bret Hyatt'
    },
    investor: 'Gudrun Bogisich',
    address: '68859 Murray Fort',
    phone: '904.890.0383',
    type: 1,
    installedPower: 27,
    realtimePower: 8,
    todayYield: 10,
    totalYield: 35,
    equivalentHour: 11,
    longitude: 105.8031,
    latitude: 10.4756,
    status: 3,
    province: 61
  },
  {
    id: 'PROJ_0047',
    name: 'TBS1-147',
    customer: {
      id: 'SC0025',
      name: 'Gregorio McDermott'
    },
    investor: 'Jairo Daniel',
    address: '10702 Lacey Branch',
    phone: '(458) 812-3199',
    type: 1,
    installedPower: 39,
    realtimePower: 9,
    todayYield: 5,
    totalYield: 66,
    equivalentHour: 17,
    longitude: 105.7280,
    latitude: 10.6118,
    status: 0,
    province: 1
  },
  {
    id: 'PROJ_0048',
    name: 'TBS1-148',
    customer: {
      id: 'SC0024',
      name: 'Ardella Maggio'
    },
    investor: 'Bryce Ziemann',
    address: '51609 Willms Pines',
    phone: '1-300-391-7232',
    type: 1,
    installedPower: 37,
    realtimePower: 1,
    todayYield: 6,
    totalYield: 35,
    equivalentHour: 6,
    longitude: 106.5988,
    latitude: 10.0421,
    status: 1,
    province: 30
  },
  {
    id: 'PROJ_0049',
    name: 'TBS1-149',
    customer: {
      id: 'SC0021',
      name: 'Helene Schmeler'
    },
    investor: 'Jason Heller',
    address: '4357 Rowan Ferry',
    phone: '912-923-1014 x0315',
    type: 1,
    installedPower: 34,
    realtimePower: 9,
    todayYield: 2,
    totalYield: 44,
    equivalentHour: 18,
    longitude: 105.6085,
    latitude: 10.5372,
    status: 0,
    province: 46
  },
  {
    id: 'PROJ_0050',
    name: 'TBS1-150',
    customer: {
      id: 'SC0025',
      name: 'Kari Kshlerin'
    },
    investor: 'Lavina Block',
    address: '6062 McKenzie Loop',
    phone: '1-498-865-6316 x0552',
    type: 1,
    installedPower: 39,
    realtimePower: 2,
    todayYield: 1,
    totalYield: 78,
    equivalentHour: 18,
    longitude: 105.8907,
    latitude: 10.8379,
    status: 3,
    province: 33
  },
  {
    id: 'PROJ_0051',
    name: 'TBS1-151',
    customer: {
      id: 'SC0025',
      name: 'Ewald Schaefer'
    },
    investor: 'Joy Kshlerin',
    address: '2541 Hyman Trail',
    phone: '(246) 518-1752 x072',
    type: 2,
    installedPower: 24,
    realtimePower: 6,
    todayYield: 5,
    totalYield: 52,
    equivalentHour: 18,
    longitude: 105.5107,
    latitude: 10.0981,
    status: 1,
    province: 36
  },
  {
    id: 'PROJ_0052',
    name: 'TBS1-152',
    customer: {
      id: 'SC0025',
      name: 'Jovani Hagenes'
    },
    investor: 'Dorris Rippin',
    address: '21406 Roberto Freeway',
    phone: '1-582-872-4368',
    type: 2,
    installedPower: 22,
    realtimePower: 5,
    todayYield: 9,
    totalYield: 37,
    equivalentHour: 10,
    longitude: 105.8974,
    latitude: 10.9425,
    status: 2,
    province: 21
  },
  {
    id: 'PROJ_0053',
    name: 'TBS1-153',
    customer: {
      id: 'SC0023',
      name: 'Noah Stark'
    },
    investor: 'Imelda Price',
    address: '78223 Dawson Place',
    phone: '484.694.6863',
    type: 2,
    installedPower: 34,
    realtimePower: 10,
    todayYield: 6,
    totalYield: 61,
    equivalentHour: 17,
    longitude: 106.4544,
    latitude: 10.6832,
    status: 3,
    province: 12
  },
  {
    id: 'PROJ_0054',
    name: 'TBS1-154',
    customer: {
      id: 'SC0025',
      name: 'Danika Hauck'
    },
    investor: 'Nia Streich',
    address: '004 Raynor Hills',
    phone: '641.369.3291 x57247',
    type: 1,
    installedPower: 40,
    realtimePower: 7,
    todayYield: 4,
    totalYield: 99,
    equivalentHour: 13,
    longitude: 105.6684,
    latitude: 10.5818,
    status: 1,
    province: 31
  },
  {
    id: 'PROJ_0055',
    name: 'TBS1-155',
    customer: {
      id: 'SC0021',
      name: 'Annabell Reichel'
    },
    investor: 'Citlalli Barrows',
    address: '4365 Clay River',
    phone: '297-807-4224',
    type: 1,
    installedPower: 48,
    realtimePower: 3,
    todayYield: 7,
    totalYield: 48,
    equivalentHour: 10,
    longitude: 106.5138,
    latitude: 10.1483,
    status: 3,
    province: 61
  },
  {
    id: 'PROJ_0056',
    name: 'TBS1-156',
    customer: {
      id: 'SC0021',
      name: 'Berta Gleichner'
    },
    investor: 'Kendra Brown',
    address: '347 Greta Pine',
    phone: '1-753-215-4169 x455',
    type: 2,
    installedPower: 42,
    realtimePower: 2,
    todayYield: 4,
    totalYield: 37,
    equivalentHour: 10,
    longitude: 106.2156,
    latitude: 10.5675,
    status: 0,
    province: 33
  },
  {
    id: 'PROJ_0057',
    name: 'TBS1-157',
    customer: {
      id: 'SC0023',
      name: 'Dayne Orn'
    },
    investor: 'Anthony McDermott',
    address: '55479 Ellsworth Station',
    phone: '1-335-286-8930 x676',
    type: 1,
    installedPower: 25,
    realtimePower: 5,
    todayYield: 2,
    totalYield: 31,
    equivalentHour: 6,
    longitude: 106.2922,
    latitude: 10.7529,
    status: 3,
    province: 53
  },
  {
    id: 'PROJ_0058',
    name: 'TBS1-158',
    customer: {
      id: 'SC0022',
      name: 'Jaron Zieme'
    },
    investor: 'Tracy Hammes',
    address: '480 Labadie Island',
    phone: '963-811-9254',
    type: 2,
    installedPower: 22,
    realtimePower: 4,
    todayYield: 7,
    totalYield: 26,
    equivalentHour: 4,
    longitude: 106.3457,
    latitude: 10.3918,
    status: 0,
    province: 15
  },
  {
    id: 'PROJ_0059',
    name: 'TBS1-159',
    customer: {
      id: 'SC0025',
      name: 'Braeden Lakin'
    },
    investor: 'Narciso Nolan',
    address: '92148 Malinda Track',
    phone: '780-305-2347 x2125',
    type: 2,
    installedPower: 10,
    realtimePower: 2,
    todayYield: 7,
    totalYield: 18,
    equivalentHour: 13,
    longitude: 105.5404,
    latitude: 10.9263,
    status: 1,
    province: 47
  },
  {
    id: 'PROJ_0060',
    name: 'TBS1-160',
    customer: {
      id: 'SC0021',
      name: 'Alfreda Kirlin'
    },
    investor: 'Javier Conroy',
    address: '34376 Dibbert Throughway',
    phone: '212-338-0972',
    type: 2,
    installedPower: 30,
    realtimePower: 3,
    todayYield: 3,
    totalYield: 57,
    equivalentHour: 17,
    longitude: 106.3161,
    latitude: 10.1581,
    status: 0,
    province: 58
  },
  {
    id: 'PROJ_0061',
    name: 'TBS1-161',
    customer: {
      id: 'SC0021',
      name: 'Joanie Berge'
    },
    investor: 'Courtney Greenholt',
    address: '812 Gaston Common',
    phone: '307-323-2160 x5916',
    type: 1,
    installedPower: 38,
    realtimePower: 6,
    todayYield: 7,
    totalYield: 13,
    equivalentHour: 10,
    longitude: 105.7779,
    latitude: 10.5985,
    status: 1,
    province: 55
  },
  {
    id: 'PROJ_0062',
    name: 'TBS1-162',
    customer: {
      id: 'SC0024',
      name: 'Derick Schamberger'
    },
    investor: 'Cooper Pollich',
    address: '04602 Brionna Plaza',
    phone: '1-615-970-8843',
    type: 1,
    installedPower: 34,
    realtimePower: 2,
    todayYield: 10,
    totalYield: 91,
    equivalentHour: 6,
    longitude: 105.5859,
    latitude: 10.5525,
    status: 1,
    province: 23
  },
  {
    id: 'PROJ_0063',
    name: 'TBS1-163',
    customer: {
      id: 'SC0022',
      name: 'Madonna Schuster'
    },
    investor: 'Brock Kreiger',
    address: '86075 Jalyn Ferry',
    phone: '424-408-0445 x2975',
    type: 2,
    installedPower: 18,
    realtimePower: 9,
    todayYield: 5,
    totalYield: 31,
    equivalentHour: 20,
    longitude: 105.5886,
    latitude: 10.4399,
    status: 1,
    province: 39
  },
  {
    id: 'PROJ_0064',
    name: 'TBS1-164',
    customer: {
      id: 'SC0021',
      name: 'Twila Hessel'
    },
    investor: 'Hassie Gleichner',
    address: '29078 Dietrich Walks',
    phone: '1-476-250-3156 x91477',
    type: 2,
    installedPower: 18,
    realtimePower: 7,
    todayYield: 5,
    totalYield: 44,
    equivalentHour: 20,
    longitude: 106.4481,
    latitude: 10.7147,
    status: 1,
    province: 32
  },
  {
    id: 'PROJ_0065',
    name: 'TBS1-165',
    customer: {
      id: 'SC0024',
      name: 'Brown Dickinson'
    },
    investor: 'Bernardo Rutherford',
    address: '8158 Fernando Branch',
    phone: '(298) 574-2182',
    type: 2,
    installedPower: 31,
    realtimePower: 3,
    todayYield: 5,
    totalYield: 36,
    equivalentHour: 15,
    longitude: 106.2339,
    latitude: 10.7061,
    status: 3,
    province: 14
  },
  {
    id: 'PROJ_0066',
    name: 'TBS1-166',
    customer: {
      id: 'SC0021',
      name: 'Alejandra Medhurst'
    },
    investor: 'Ubaldo Stokes',
    address: '52245 Chyna Shoal',
    phone: '(266) 931-5162 x775',
    type: 1,
    installedPower: 13,
    realtimePower: 5,
    todayYield: 1,
    totalYield: 97,
    equivalentHour: 23,
    longitude: 106.2730,
    latitude: 10.5561,
    status: 1,
    province: 56
  },
  {
    id: 'PROJ_0067',
    name: 'TBS1-167',
    customer: {
      id: 'SC0022',
      name: 'Violette Hahn'
    },
    investor: 'Zoila Legros',
    address: '74613 Clint Junction',
    phone: '292.932.0732 x3016',
    type: 2,
    installedPower: 40,
    realtimePower: 5,
    todayYield: 7,
    totalYield: 60,
    equivalentHour: 1,
    longitude: 106.5075,
    latitude: 10.6228,
    status: 2,
    province: 20
  },
  {
    id: 'PROJ_0068',
    name: 'TBS1-168',
    customer: {
      id: 'SC0024',
      name: 'Daisy Price'
    },
    investor: 'Kevin Keebler',
    address: '188 Ferry Canyon',
    phone: '728.781.4214 x730',
    type: 2,
    installedPower: 36,
    realtimePower: 2,
    todayYield: 3,
    totalYield: 88,
    equivalentHour: 1,
    longitude: 106.1252,
    latitude: 10.9898,
    status: 3,
    province: 31
  },
  {
    id: 'PROJ_0069',
    name: 'TBS1-169',
    customer: {
      id: 'SC0024',
      name: 'Kennith Connelly'
    },
    investor: 'Darlene Kilback',
    address: '097 Weimann Rue',
    phone: '(594) 509-4869 x121',
    type: 2,
    installedPower: 41,
    realtimePower: 7,
    todayYield: 3,
    totalYield: 75,
    equivalentHour: 10,
    longitude: 105.7247,
    latitude: 10.4171,
    status: 0,
    province: 57
  },
  {
    id: 'PROJ_0070',
    name: 'TBS1-170',
    customer: {
      id: 'SC0021',
      name: 'Bernhard Ankunding'
    },
    investor: 'Flossie Macejkovic',
    address: '29505 Koch Camp',
    phone: '1-709-946-9319 x0109',
    type: 1,
    installedPower: 36,
    realtimePower: 1,
    todayYield: 5,
    totalYield: 33,
    equivalentHour: 10,
    longitude: 106.4211,
    latitude: 10.2905,
    status: 1,
    province: 44
  },
  {
    id: 'PROJ_0071',
    name: 'TBS1-171',
    customer: {
      id: 'SC0024',
      name: 'Lenna Treutel'
    },
    investor: 'Anissa Stiedemann',
    address: '38299 Bertrand Heights',
    phone: '1-395-423-1441 x02409',
    type: 2,
    installedPower: 14,
    realtimePower: 5,
    todayYield: 2,
    totalYield: 63,
    equivalentHour: 5,
    longitude: 105.6576,
    latitude: 10.1145,
    status: 1,
    province: 44
  },
  {
    id: 'PROJ_0072',
    name: 'TBS1-172',
    customer: {
      id: 'SC0022',
      name: 'Bernice Ritchie'
    },
    investor: 'Amani Mills',
    address: '472 Casimer Circle',
    phone: '405-978-8590',
    type: 2,
    installedPower: 41,
    realtimePower: 8,
    todayYield: 4,
    totalYield: 16,
    equivalentHour: 20,
    longitude: 105.6947,
    latitude: 10.0147,
    status: 3,
    province: 20
  },
  {
    id: 'PROJ_0073',
    name: 'TBS1-173',
    customer: {
      id: 'SC0021',
      name: 'Cristobal Keeling'
    },
    investor: 'Jules Hettinger',
    address: '4727 Huels Rue',
    phone: '363-896-4385',
    type: 1,
    installedPower: 14,
    realtimePower: 5,
    todayYield: 5,
    totalYield: 48,
    equivalentHour: 16,
    longitude: 106.2228,
    latitude: 10.6727,
    status: 1,
    province: 30
  },
  {
    id: 'PROJ_0074',
    name: 'TBS1-174',
    customer: {
      id: 'SC0024',
      name: 'Riley Bashirian'
    },
    investor: 'Katarina Champlin',
    address: '828 McLaughlin Shores',
    phone: '1-436-750-7575 x06921',
    type: 1,
    installedPower: 30,
    realtimePower: 5,
    todayYield: 8,
    totalYield: 56,
    equivalentHour: 17,
    longitude: 105.6422,
    latitude: 10.8910,
    status: 0,
    province: 8
  },
  {
    id: 'PROJ_0075',
    name: 'TBS1-175',
    customer: {
      id: 'SC0024',
      name: 'Frieda Konopelski'
    },
    investor: 'Remington Koelpin',
    address: '95544 Aliyah Land',
    phone: '623.829.8057',
    type: 2,
    installedPower: 50,
    realtimePower: 2,
    todayYield: 8,
    totalYield: 51,
    equivalentHour: 9,
    longitude: 105.6872,
    latitude: 10.0015,
    status: 1,
    province: 32
  },
  {
    id: 'PROJ_0076',
    name: 'TBS1-176',
    customer: {
      id: 'SC0024',
      name: 'Rosella Wilkinson'
    },
    investor: 'Forrest Aufderhar',
    address: '56159 Senger Ferry',
    phone: '(740) 732-0192 x072',
    type: 2,
    installedPower: 20,
    realtimePower: 8,
    todayYield: 10,
    totalYield: 53,
    equivalentHour: 13,
    longitude: 106.1862,
    latitude: 10.9528,
    status: 3,
    province: 13
  },
  {
    id: 'PROJ_0077',
    name: 'TBS1-177',
    customer: {
      id: 'SC0025',
      name: 'Elisabeth Runolfsdottir'
    },
    investor: 'Nickolas Labadie',
    address: '4137 Noe Skyway',
    phone: '263-682-0030',
    type: 1,
    installedPower: 26,
    realtimePower: 6,
    todayYield: 10,
    totalYield: 45,
    equivalentHour: 4,
    longitude: 105.7645,
    latitude: 10.2426,
    status: 2,
    province: 13
  },
  {
    id: 'PROJ_0078',
    name: 'TBS1-178',
    customer: {
      id: 'SC0023',
      name: 'Arno Shields'
    },
    investor: 'Caterina Greenfelder',
    address: '7450 Herzog Flats',
    phone: '1-803-867-4651 x41361',
    type: 2,
    installedPower: 39,
    realtimePower: 10,
    todayYield: 10,
    totalYield: 58,
    equivalentHour: 23,
    longitude: 106.2449,
    latitude: 10.3963,
    status: 3,
    province: 42
  },
  {
    id: 'PROJ_0079',
    name: 'TBS1-179',
    customer: {
      id: 'SC0024',
      name: 'Lynn Balistreri'
    },
    investor: 'Cynthia Mitchell',
    address: '488 Corrine Vista',
    phone: '1-244-263-1812 x54380',
    type: 1,
    installedPower: 14,
    realtimePower: 1,
    todayYield: 1,
    totalYield: 81,
    equivalentHour: 8,
    longitude: 105.8592,
    latitude: 10.1313,
    status: 2,
    province: 13
  },
  {
    id: 'PROJ_0080',
    name: 'TBS1-180',
    customer: {
      id: 'SC0023',
      name: 'Miguel Beatty'
    },
    investor: 'Evert Sporer',
    address: '7939 Ernest Vista',
    phone: '1-794-553-1681 x9050',
    type: 2,
    installedPower: 33,
    realtimePower: 2,
    todayYield: 7,
    totalYield: 86,
    equivalentHour: 8,
    longitude: 106.4679,
    latitude: 10.0272,
    status: 1,
    province: 43
  },
  {
    id: 'PROJ_0081',
    name: 'TBS1-181',
    customer: {
      id: 'SC0023',
      name: 'Wyman Muller'
    },
    investor: 'Baron Mueller',
    address: '0035 Jaskolski Field',
    phone: '1-694-463-2678 x51920',
    type: 2,
    installedPower: 27,
    realtimePower: 4,
    todayYield: 10,
    totalYield: 70,
    equivalentHour: 13,
    longitude: 106.4504,
    latitude: 10.5400,
    status: 3,
    province: 42
  },
  {
    id: 'PROJ_0082',
    name: 'TBS1-182',
    customer: {
      id: 'SC0023',
      name: 'Layne Daniel'
    },
    investor: 'Quinten Block',
    address: '77580 Jakubowski Hills',
    phone: '205.416.2908 x640',
    type: 1,
    installedPower: 39,
    realtimePower: 3,
    todayYield: 6,
    totalYield: 62,
    equivalentHour: 13,
    longitude: 105.7688,
    latitude: 10.2994,
    status: 1,
    province: 62
  },
  {
    id: 'PROJ_0083',
    name: 'TBS1-183',
    customer: {
      id: 'SC0021',
      name: 'Gina Paucek'
    },
    investor: 'Theresia Klein',
    address: '98788 Cummings Mount',
    phone: '(434) 652-9965',
    type: 2,
    installedPower: 36,
    realtimePower: 9,
    todayYield: 2,
    totalYield: 35,
    equivalentHour: 6,
    longitude: 106.2688,
    latitude: 10.9316,
    status: 1,
    province: 39
  },
  {
    id: 'PROJ_0084',
    name: 'TBS1-184',
    customer: {
      id: 'SC0021',
      name: 'Crawford Hackett'
    },
    investor: 'Rosina Balistreri',
    address: '33490 Maxie Expressway',
    phone: '350.754.3072',
    type: 1,
    installedPower: 13,
    realtimePower: 7,
    todayYield: 7,
    totalYield: 84,
    equivalentHour: 7,
    longitude: 106.4341,
    latitude: 10.1059,
    status: 2,
    province: 33
  },
  {
    id: 'PROJ_0085',
    name: 'TBS1-185',
    customer: {
      id: 'SC0022',
      name: 'Maria Moen'
    },
    investor: 'Vella Spinka',
    address: '114 Turner Greens',
    phone: '466-482-9519 x17098',
    type: 1,
    installedPower: 43,
    realtimePower: 4,
    todayYield: 9,
    totalYield: 20,
    equivalentHour: 17,
    longitude: 106.5056,
    latitude: 10.1447,
    status: 0,
    province: 58
  },
  {
    id: 'PROJ_0086',
    name: 'TBS1-186',
    customer: {
      id: 'SC0021',
      name: 'Precious Schultz'
    },
    investor: 'Providenci Mraz',
    address: '51833 Libby Pines',
    phone: '352.622.9100 x8483',
    type: 1,
    installedPower: 27,
    realtimePower: 6,
    todayYield: 9,
    totalYield: 42,
    equivalentHour: 19,
    longitude: 105.8605,
    latitude: 10.4568,
    status: 1,
    province: 44
  },
  {
    id: 'PROJ_0087',
    name: 'TBS1-187',
    customer: {
      id: 'SC0025',
      name: 'Boris Trantow'
    },
    investor: 'Carolanne Kemmer',
    address: '947 Wilson Ridge',
    phone: '(413) 635-4244 x105',
    type: 2,
    installedPower: 21,
    realtimePower: 8,
    todayYield: 6,
    totalYield: 50,
    equivalentHour: 2,
    longitude: 105.6985,
    latitude: 10.7399,
    status: 2,
    province: 1
  },
  {
    id: 'PROJ_0088',
    name: 'TBS1-188',
    customer: {
      id: 'SC0021',
      name: 'Ida Daugherty'
    },
    investor: 'Giles Smitham',
    address: '66687 Skiles Views',
    phone: '1-969-752-7600',
    type: 1,
    installedPower: 44,
    realtimePower: 10,
    todayYield: 2,
    totalYield: 33,
    equivalentHour: 14,
    longitude: 105.8290,
    latitude: 10.1028,
    status: 3,
    province: 38
  },
  {
    id: 'PROJ_0089',
    name: 'TBS1-189',
    customer: {
      id: 'SC0022',
      name: 'Stone Kautzer'
    },
    investor: 'Vicky Pouros',
    address: '238 Bruce Expressway',
    phone: '(556) 503-5496 x6694',
    type: 1,
    installedPower: 23,
    realtimePower: 7,
    todayYield: 4,
    totalYield: 100,
    equivalentHour: 13,
    longitude: 106.1718,
    latitude: 10.1652,
    status: 3,
    province: 48
  },
  {
    id: 'PROJ_0090',
    name: 'TBS1-190',
    customer: {
      id: 'SC0023',
      name: 'Erick Waters'
    },
    investor: 'Gianni Stroman',
    address: '317 Dixie Mount',
    phone: '(597) 253-4724 x739',
    type: 1,
    installedPower: 43,
    realtimePower: 4,
    todayYield: 8,
    totalYield: 23,
    equivalentHour: 15,
    longitude: 105.6578,
    latitude: 10.1366,
    status: 0,
    province: 61
  },
  {
    id: 'PROJ_0091',
    name: 'TBS1-191',
    customer: {
      id: 'SC0023',
      name: 'Aaliyah Rutherford'
    },
    investor: 'Napoleon Wolf',
    address: '3651 Murphy Glen',
    phone: '(236) 772-2208 x532',
    type: 1,
    installedPower: 43,
    realtimePower: 3,
    todayYield: 7,
    totalYield: 47,
    equivalentHour: 12,
    longitude: 106.0040,
    latitude: 10.9401,
    status: 2,
    province: 25
  },
  {
    id: 'PROJ_0092',
    name: 'TBS1-192',
    customer: {
      id: 'SC0022',
      name: 'Federico Ernser'
    },
    investor: 'Yazmin Hayes',
    address: '442 Hamill Spur',
    phone: '(790) 929-6610 x5691',
    type: 2,
    installedPower: 35,
    realtimePower: 5,
    todayYield: 4,
    totalYield: 65,
    equivalentHour: 18,
    longitude: 106.2984,
    latitude: 10.3964,
    status: 0,
    province: 16
  },
  {
    id: 'PROJ_0093',
    name: 'TBS1-193',
    customer: {
      id: 'SC0024',
      name: 'Mathias Hermann'
    },
    investor: 'Anahi Russel',
    address: '201 Bernier Union',
    phone: '484-506-8648 x05790',
    type: 1,
    installedPower: 40,
    realtimePower: 4,
    todayYield: 10,
    totalYield: 35,
    equivalentHour: 21,
    longitude: 106.5637,
    latitude: 10.9817,
    status: 2,
    province: 35
  },
  {
    id: 'PROJ_0094',
    name: 'TBS1-194',
    customer: {
      id: 'SC0025',
      name: 'Frank Renner'
    },
    investor: 'Lorena White',
    address: '73771 Spencer Ford',
    phone: '345.713.5101',
    type: 2,
    installedPower: 48,
    realtimePower: 4,
    todayYield: 2,
    totalYield: 55,
    equivalentHour: 17,
    longitude: 105.8600,
    latitude: 10.0690,
    status: 1,
    province: 8
  },
  {
    id: 'PROJ_0095',
    name: 'TBS1-195',
    customer: {
      id: 'SC0025',
      name: 'Alfreda Lemke'
    },
    investor: 'Craig Kub',
    address: '9234 Ransom Trail',
    phone: '505-807-4848 x79526',
    type: 1,
    installedPower: 28,
    realtimePower: 7,
    todayYield: 1,
    totalYield: 13,
    equivalentHour: 23,
    longitude: 105.6019,
    latitude: 10.8210,
    status: 2,
    province: 51
  },
  {
    id: 'PROJ_0096',
    name: 'TBS1-196',
    customer: {
      id: 'SC0023',
      name: 'Lavina Fay'
    },
    investor: 'Ena Breitenberg',
    address: '35714 Brown Ramp',
    phone: '404-817-3656 x7975',
    type: 2,
    installedPower: 19,
    realtimePower: 7,
    todayYield: 3,
    totalYield: 24,
    equivalentHour: 19,
    longitude: 105.5109,
    latitude: 10.7237,
    status: 1,
    province: 42
  },
  {
    id: 'PROJ_0097',
    name: 'TBS1-197',
    customer: {
      id: 'SC0025',
      name: 'Lenny Anderson'
    },
    investor: 'Freeda Yundt',
    address: '7566 Gerhold Corner',
    phone: '(275) 211-6837 x59687',
    type: 2,
    installedPower: 18,
    realtimePower: 5,
    todayYield: 10,
    totalYield: 74,
    equivalentHour: 22,
    longitude: 106.2895,
    latitude: 10.1981,
    status: 1,
    province: 50
  },
  {
    id: 'PROJ_0098',
    name: 'TBS1-198',
    customer: {
      id: 'SC0022',
      name: 'Moises Lockman'
    },
    investor: 'Winona Dietrich',
    address: '78292 Torey Mills',
    phone: '801.481.9953',
    type: 2,
    installedPower: 37,
    realtimePower: 9,
    todayYield: 8,
    totalYield: 11,
    equivalentHour: 1,
    longitude: 105.8625,
    latitude: 10.1523,
    status: 1,
    province: 18
  },
  {
    id: 'PROJ_0099',
    name: 'TBS1-199',
    customer: {
      id: 'SC0022',
      name: 'Narciso Larkin'
    },
    investor: 'Josefina Ryan',
    address: '8014 Nils Road',
    phone: '681-326-2535 x9290',
    type: 1,
    installedPower: 33,
    realtimePower: 5,
    todayYield: 3,
    totalYield: 62,
    equivalentHour: 18,
    longitude: 106.5519,
    latitude: 10.0301,
    status: 2,
    province: 60
  }
]

mock.onGet('/api/datatables/initial-data').reply(() => {
  return [200, data]
})

mock.onGet('/api/datatables/data').reply(config => {
  // eslint-disable-next-line object-curly-newline
  const { q = '', perPage = 10, page = 1 } = config.params ? config.params : config
  /* eslint-enable */

  const queryLowered = q.toLowerCase()
  const filteredData = data.filter(
    item =>
      /* eslint-disable operator-linebreak, implicit-arrow-linebreak */
      item.id.toLowerCase().includes(queryLowered) ||
      item.name.toLowerCase().includes(queryLowered) ||
      item.customer.toLowerCase().includes(queryLowered) ||
      item.investor.toLowerCase().includes(queryLowered) ||
      item.address.toLowerCase().includes(queryLowered) ||
      item.phone.toLowerCase().includes(queryLowered)
  )
  /* eslint-enable  */

  return [
    200,
    {
      allData: data,
      invoices: paginateArray(filteredData, perPage, page),
      total: filteredData.length
    }
  ]
})

mock.onGet('/api/v1/glf_customers').reply(config => {
  // eslint-disable-next-line object-curly-newline
  const { q = '', perPage = 10, page = 1 } = config.params ? config.params : config
  /* eslint-enable */

  const queryLowered = q.toLowerCase()
  const filteredData = customerData.filter(
    item =>
      /* eslint-disable operator-linebreak, implicit-arrow-linebreak */
      item.id.toLowerCase().includes(queryLowered) ||
      item.name.toLowerCase().includes(queryLowered) ||
      item.email.toLowerCase().includes(queryLowered) ||
      item.address.toLowerCase().includes(queryLowered) ||
      item.phone.toLowerCase().includes(queryLowered)
  )
  /* eslint-enable  */

  return [
    200,
    {
      allData: customerData,
      invoices: paginateArray(filteredData, perPage, page),
      total: filteredData.length
    }
  ]
})

mock.onGet('/api/v1/glf_project').reply(config => {
  const { projectId } = config.params
  const filteredData = customerProjects.filter(item => item.id === projectId)

  return [
    200,
    {
      data: { ...filteredData[0] }
    }
  ]
})

mock.onGet('/api/v1/glf_customer').reply(config => {
  const { customerId } = config.params
  const filteredData = customerData.filter(item => item.id === customerId)

  return [
    200,
    {
      data: { ...filteredData[0] }
    }
  ]
})

mock.onGet('/api/v1/glf_projects').reply(config => {
  // eslint-disable-next-line object-curly-newline
  const { q = '', perPage = 10, page = 1, customerId } = config.params ? config.params : config
  /* eslint-enable */

  let tempCustomerProjects = customerProjects

  if (customerId) {
    tempCustomerProjects = customerProjects.filter(item => item.customer.id === customerId)
  }

  const queryLowered = q.toLowerCase()
  const filteredData = tempCustomerProjects.filter(
    item =>
      /* eslint-disable operator-linebreak, implicit-arrow-linebreak */
      (item.id.toLowerCase().includes(queryLowered) ||
      item.name.toLowerCase().includes(queryLowered) ||
      item.email.toLowerCase().includes(queryLowered) ||
      item.address.toLowerCase().includes(queryLowered) ||
      item.phone.toLowerCase().includes(queryLowered))
  )
  /* eslint-enable  */

  return [
    200,
    {
      allData: customerProjects,
      invoices: config.params ? paginateArray(filteredData, perPage, page) : customerProjects,
      total: filteredData.length
    }
  ]
})
