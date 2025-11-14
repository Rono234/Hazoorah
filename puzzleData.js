const hintLimits = {
  easy: 1,
  medium: 2,
  hard: 3
};

const puzzles = [
  {
    level: 'easy',
    story: 'All the supplies in the art room are scattered! Gerold needs to place them neatly back on the shelf in the correct order before the students come to class.',
    clues: ['The crayons should be on the far left.',
       "The colored pencils are not next to the crayons."],

    items: [
      { id: 'crayons', img: 'images/purple-dahlias.PNG' },
      { id: 'paint brushes', img: 'images/white-daisies.PNG' },
      { id: 'colored pencils', img: 'images/orange-hibiscuses.PNG' }
    ],
    correctOrder: ['crayons', 'paint brushes', 'colored pencils']
  },

  {
    level: 'easy',
    story: 'Help Gerold set the experiment materials correctly before the science teacher arrives.',
    clues: ['The microscopes should be on the far right.',
       "The beakers are between the other two items."],

    items: [
      { id: 'test tubes', img: 'images/green-hydrangeas.PNG' },
      { id: 'beakers', img: 'images/red-roses.PNG' },
      { id: 'microscopes', img: 'images/yellow-tulips.PNG' }
    ],
    correctOrder: ['test tubes', 'beakers', 'microscopes']
  },

  {
    level: 'medium',
    story: 'When Gerold checks the library, he finds that all the books are misplaced! Help him return them to their proper shelves before the librarian arrives.',
    clues: ['The math books should be before the science books.',
      'The story books are between science and art books.',
      'The geography books belong at the far right.'
    ],
    items: [
      { id: 'math books', img: 'images/purple-roses.PNG' },
      { id: 'science books', img: 'images/white-roses.PNG' },
      { id: 'story books', img: 'images/pink-daisies.PNG' },
      { id: 'art books', img: 'images/orange-daisies.PNG' },
      { id: 'history books', img: 'images/red-dahlias.PNG' },
      { id: 'geography books', img: 'images/blue-dahlias.PNG' }
    ],
    correctOrder: ['math books','science books' ,'story books', 'art books', 'history books','geography books']
  },

  {
    level: 'medium',
    story: 'Gerold opens the supply closet and finds everything mixed up! He needs to organize the school essentials before the teachers get there.',
    clues: ['The chalks are between the erasers and the pieces of paper.',
      'The glues are at the far right.',
      'The notebooks come before the markers.'
    ],
    items: [
      { id: 'erasers', img: 'images/pink-hydrangeas.PNG' },
      { id: 'chalks', img: 'images/blue-hydrangeas.PNG' },
      { id: 'pieces of paper', img: 'images/black-hibiscuses.PNG' },
      { id: 'notebooks', img: 'images/yellow-hibiscuses.PNG' },
      { id: 'markers', img: 'images/orange-tulips.PNG' },
      { id: 'glues', img: 'images/purple-tulips.png' }
    ],
    correctOrder: ['erasers', 'chalks', 'pieces of paper', 'notebooks', 'markers', 'glues']
  },

  {
    level: 'hard',
    story: "Principal Gerold finally reaches the school doors, but they’re locked! The keypad to open them isn’t broken… it's just missing the right code.To open the school and begin the new semester, help him solve the math puzzle that reveals the secret 3×3 code!",
    clues: ["The number in the center of all codes are 5's",
      "The sum of each row, column, and diagonal are the same",
      "The number in the bottom-left of all codes are 8's",
      "The number above the bottom-right corner of all codes are 7's",
      "The bottom-left number is double the top-left number."
    ],

    items: [
      { id: "4's", img: 'images/red-roses.PNG' },
      { id: "9's", img: 'images/green-hydrangeas.PNG' },
      { id: "2's", img: 'images/blue-daisies.PNG' },
      { id: "3's", img: 'images/gray-roses.PNG' },
      { id: "5's", img: 'images/orange-daisies.PNG' },
      { id: "7's", img: 'images/yellow-daisies.PNG' },
      { id: "8's", img: 'images/white-hydrangeas.PNG' },
      { id: "1's", img: 'images/black-roses.PNG' },
      { id: "6's", img: 'images/purple-hydrangeas.PNG' }
    ],
    correctOrder: [
      "4's", "9's", "2's", "3's", "5's",
      "7's", "8's", "1's", "6's"
    ]
  },

  {
    level: 'easy',
    story: "These are some of Haroldene’s rarest flowers. Ease her mind by planting them in order!",
    clues: ['The purple dahlias should be planted far away from the white daisies.',
       "The white daisies are on the left."] ,

    items: [
      { id: 'purple dahlias', img: 'images/purple-dahlias.PNG' },
      { id: 'white daisies', img: 'images/white-daisies.PNG' },
      { id: 'orange hibiscuses', img: 'images/orange-hibiscuses.PNG' }
    ],
    correctOrder: ['white daisies', 'orange hibiscuses', 'purple dahlias']
  },

  {
    level: 'easy',
    story: 'Help Haroldene arrange her favorite flowers!',
    clues: ['The green hydrangeas are not in the second box.',
       "The red roses are next to the yellow tulips.", "The yellow tulips are on the right."] ,

    items: [
      { id: 'green hydrangeas', img: 'images/green-hydrangeas.PNG' },
      { id: 'red roses', img: 'images/red-roses.PNG' },
      { id: 'yellow tulips', img: 'images/yellow-tulips.PNG' }
    ],
    correctOrder: ['green hydrangeas', 'red roses', 'yellow tulips']
  },

  {
    level: 'medium',
    story: 'Roses are red, violets are blue, these flowers are messed up, but at least Haroldene has you!',
    clues: ['The colors of the first two boxes combined make the color in the third box.',
      'The red dahlias are furthest away from the blue dahlias.',
      'The white roses are on top of all other types of roses.'
    ],
    items: [
      { id: 'purple roses', img: 'images/purple-roses.PNG' },
      { id: 'white roses', img: 'images/white-roses.PNG' },
      { id: 'pink daisies', img: 'images/pink-daisies.PNG' },
      { id: 'orange daisies', img: 'images/orange-daisies.PNG' },
      { id: 'red dahlias', img: 'images/red-dahlias.PNG' },
      { id: 'blue dahlias', img: 'images/blue-dahlias.PNG' }
    ],
    correctOrder: ['red dahlias','white roses' ,'pink daisies', 'orange daisies', 'purple roses','blue dahlias']
  },

  {
    level: 'medium',
    story: 'These flowers were gifted to Haroldene by her grandmother. Please help her put them in the correct spots!',
    clues: ['The hydrangeas are directly next to each other with the reddish color first.',
      'There are no tulips in the first row.',
      'The black hibiscuses are on the right and diagonally adjacent with the other hibiscuses.', 
      'The purple tulips are not on the left.'
    ],
    items: [
      { id: 'pink hydrangeas', img: 'images/pink-hydrangeas.PNG' },
      { id: 'blue hydrangeas', img: 'images/blue-hydrangeas.PNG' },
      { id: 'black hibiscuses', img: 'images/black-hibiscuses.PNG' },
      { id: 'yellow hibiscuses', img: 'images/yellow-hibiscuses.PNG' },
      { id: 'orange tulips', img: 'images/orange-tulips.PNG' },
      { id: 'purple tulips', img: 'images/purple-tulips.png' }
    ],
    correctOrder: ['pink hydrangeas', 'blue hydrangeas', 'black hibiscuses', 'orange tulips', 'yellow hibiscuses', 'purple tulips']
  },

  {
    level: 'hard',
    story: 'Oh no..! Midnight is approaching soon, quick, finish arranging the last bit of flowers!',
    clues: ['The red roses are in the middle of the grid.',
      'The neighbors of the purple and green hydrangeas are never the roses.',
      'All the roses are near each other on the top left with the black ones away from the corner.',
      'The daisies are never in the corner.',
      'The white hydrangeas are on the corner on the right next to the orange daisies.',
      'The purple hydrangeas are on the bottom right, near the yellow daisies.'
],
    items: [
      { id: 'red roses', img: 'images/red-roses.PNG' },
      { id: 'green hydrangeas', img: 'images/green-hydrangeas.PNG' },
      { id: 'blue daisies', img: 'images/blue-daisies.PNG' },
      { id: 'gray roses', img: 'images/gray-roses.PNG' },
      { id: 'orange daisies', img: 'images/orange-daisies.PNG' },
      { id: 'yellow daisies', img: 'images/yellow-daisies.PNG' },
      { id: 'white hydrangeas', img: 'images/white-hydrangeas.PNG' },
      { id: 'black roses', img: 'images/black-roses.PNG' },
      { id: 'purple hydrangeas', img: 'images/purple-hydrangeas.PNG' }
    ],
    correctOrder: [
      'gray roses', 'black roses', 'white hydrangeas', 'blue daisies', 'red roses',
      'orange daisies', 'green hydrangeas', 'yellow daisies', 'purple hydrangeas'
    ]
  },

  {
    level: 'easy',
    story:'Jerrold needs to feed his farm animals. Put them in order from first fed to last fed.',
    clues: ['The cows eat after the chicken.',
       "The pigs are always fed last."] ,

    items: [
      { id: 'cows', img: 'images/Cow.PNG' },
      { id: 'pigs', img: 'images/Pig.PNG' },
      { id: 'chickens', img: 'images/Chicken.PNG' }
    ],
    correctOrder: ['chickens', 'cows', 'pigs']
  },

  {
    level: 'easy',
    story:'Jerrold is creating harvest baskets for his friends. Order the veggies from lightest to heaviest basket.',
    clues: ['The carrot basket weighs more than the apples.',
       "The corn basket is not the lightest.", "The apples are lighter than both other baskets."] ,

    items: [
      { id: 'carrots', img: 'images/Carrot.PNG' },
      { id: 'apples', img: 'images/Apple.PNG' },
      { id: 'corns', img: 'images/Corn.PNG' }
    ],
    correctOrder: ['apples', 'carrots', 'corns']
  },

  {
    level: 'medium',
    story:'Jerrold needs to fix his tractor for plowing! Order the parts based on how they fit in the tractor.',
    clues: ['The engine is in the middle of the setup.',
      'The wheel must come before the axle.',
      'The lever is right before the exhaust.',
      'The seat comes immediately after the engine.',
      'The axle and lever are not next to each other.'
    ],
    items: [
      { id: 'wheels', img: 'images/1_Tractor.PNG' },
      { id: 'axles', img: 'images/2_Tractor.PNG' },
      { id: 'engines', img: 'images/3_Tractor.PNG' },
      { id: 'seats', img: 'images/4_Tractor.PNG' },
      { id: 'levers', img: 'images/5_Tractor.PNG' },
      { id: 'exhausts', img: 'images/6_Tractor.PNG' }
    ],
    correctOrder: ['wheels','axles' ,'engines', 'seats', 'levers','exhausts']
  },

  {
    level: 'medium',
    story:'Jerrold is arranging his sheep for a farm show. Arrange them from left to right based on the clues.',
    clues: ['The yellow sheeps stand between the blue sheeps and the black sheeps.',
      'The brown sheeps are furthest to the right.',
      'The red sheeps are left of the blue sheeps.',
      'The white sheeps are next to the brown sheeps.',
      'The black sheeps are right of the yellow sheeps.'
    ],
    items: [
      { id: 'red sheeps', img: 'images/SheepRed.PNG' },
      { id: 'blue sheeps', img: 'images/SheepBlue.PNG' },
      { id: 'yellow sheeps', img: 'images/SheepYellow.PNG' },
      { id: 'black sheeps', img: 'images/SheepBlack.PNG' },
      { id: 'white sheeps', img: 'images/SheepWhite.PNG' },
      { id: 'brown sheeps', img: 'images/SheepBrown.PNG' }
    ],
    correctOrder: ['red sheeps', 'blue sheeps', 'yellow sheeps', 'black sheeps', 'white sheeps', 'brown sheeps']
  },

  {
    level: 'hard',
    story:'Jerrold is planting his crops on a 3x3 grid. Arrange the crops based on the clues provided.',
    clues: ['The wheats are directly above the rices.',
      'Cabbages grows earlier than the peanuts and wheats.',
      'Peas are planted to the right of the tomatoes.',
      'Potatoes are in the bottom-right corner.',
      'Corn cobs grows below the peanuts.',
      'Beans are right of the wheats.'
],
    items: [
      { id: 'cabbages', img: 'images/Cabbage.PNG' },
      { id: 'tomatoes', img: 'images/Tomatoes.PNG' },
      { id: 'peas', img: 'images/Peas.PNG' },
      { id: 'peanuts', img: 'images/Peanuts.PNG' },
      { id: 'wheats', img: 'images/Wheat.PNG' },
      { id: 'beans', img: 'images/Beans.PNG' },
      { id: 'corn cobs', img: 'images/Corn.PNG' },
      { id: 'rices', img: 'images/Rice.PNG' },
      { id: 'potatoes', img: 'images/Potatoes.PNG' }
    ],
    correctOrder: [
      'cabbages', 'tomatoes', 'peas', 'peanuts', 'wheats',
      'beans', 'corn cobs', 'rices', 'potatoes'
    ]
  }
];