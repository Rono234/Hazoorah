const hintLimits = {
  easy: 1,
  medium: 2,
  hard: 3
};

const puzzles = [
  {
    level: 'easy',
    story: 'The art room is a mess! Gerold needs to neatly organize the supplies before students arrive.',
    clues: ['The crayons should be on the far left.',
       "The colored pencils are not next to the crayons."],

    items: [
      { id: 'crayons', img: 'school/crayon.PNG' },
      { id: 'paint brushes', img: 'school/paintbrush.PNG' },
      { id: 'colored pencils', img: 'school/colorpencil.PNG' }
    ],
    correctOrder: ['crayons', 'paint brushes', 'colored pencils']
  },

  {
    level: 'easy',
    story: 'Help Gerold set the experiment materials correctly before the science teacher arrives.',
    clues: ['The microscopes should be on the far right.',
       "The beakers are between the other two items."],

    items: [
      { id: 'test tubes', img: 'school/testTube.PNG' },
      { id: 'beakers', img: 'school/beaker.PNG' },
      { id: 'microscopes', img: 'school/microscope.PNG' }
    ],
    correctOrder: ['test tubes', 'beakers', 'microscopes']
  },

  {
    level: 'medium',
    story: 'Books are everywhere! Help Gerold shelve them correctly before the librarian arrives.',
    clues: ['The math books should be before the science books.',
      'The story books are between science and art books.',
      'The geography books belong at the far right.'
    ],
    items: [
      { id: 'math books', img: 'school/mathBook.PNG' },
      { id: 'science books', img: 'school/scienceBook.PNG' },
      { id: 'story books', img: 'school/storyBook.PNG' },
      { id: 'art books', img: 'school/artBook.PNG' },
      { id: 'history books', img: 'school/historyBook.PNG' },
      { id: 'geography books', img: 'school/geoBook.PNG' }
    ],
    correctOrder: ['math books','science books' ,'story books', 'art books', 'history books','geography books']
  },

  {
    level: 'medium',
    story: 'Gerold finds the supply closet a mess! He needs to organize everything before the teachers arrive.',
    clues: ['The chalks are between the erasers and the pieces of paper.',
      'The glues are at the far right.',
      'The notebooks come before the markers.'
    ],
    items: [
      { id: 'erasers', img: 'school/erasers.PNG' },
      { id: 'chalks', img: 'school/chalk.PNG' },
      { id: 'pieces of paper', img: 'school/paperReam.PNG' },
      { id: 'notebooks', img: 'school/notebooks.PNG' },
      { id: 'markers', img: 'school/markers.PNG' },
      { id: 'glues', img: 'school/glue.PNG' }
    ],
    correctOrder: ['erasers', 'chalks', 'pieces of paper', 'notebooks', 'markers', 'glues']
  },

  {
    level: 'hard',
    story: "The school doors are locked! Help Principal Gerold find the right keypad code!!",
    clues: ["The number in the center of all keypads are 5's",
      "The sum of each row, column, and diagonal are the same",
      "The number in the bottom-left of all keypads are 8's",
      "The number above the bottom-right corner of all keypads are 7's",
      "The bottom-left number is double the top-left number."
    ],

    items: [
      { id: "4's", img:'school/4_redNumber.PNG' },
      { id: "9's", img: 'school/9_redNumber.PNG' },
      { id: "2's", img: 'school/2_redNumber.PNG' },
      { id: "3's", img: 'school/3_redNumber.PNG' },
      { id: "5's", img: 'school/5_redNumber.PNG' },
      { id: "7's", img: 'school/7_redNumber.PNG' },
      { id: "8's", img: 'school/8_redNumber.PNG'},
      { id: "1's", img: 'school/1_redNumber.PNG' },
      { id: "6's", img: 'school/6_redNumber.PNG' }
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
      { id: 'purple dahlias', img: 'garden/purple-dahlias.PNG' },
      { id: 'white daisies', img: 'garden/white-daisies.PNG' },
      { id: 'orange hibiscuses', img: 'garden/orange-hibiscuses.PNG' }
    ],
    correctOrder: ['white daisies', 'orange hibiscuses', 'purple dahlias']
  },

  {
    level: 'easy',
    story: 'Help Haroldene arrange her favorite flowers! Lend her a hand in organizing them just the way she likes!',
    clues: ['The green hydrangeas are not in the second box.',
       "The red roses are next to the yellow tulips.", "The yellow tulips are on the right."] ,

    items: [
      { id: 'green hydrangeas', img: 'garden/green-hydrangeas.PNG' },
      { id: 'red roses', img: 'garden/red-roses.PNG' },
      { id: 'yellow tulips', img: 'garden/yellow-tulips.PNG' }
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
      { id: 'purple roses', img: 'garden/purple-roses.PNG' },
      { id: 'white roses', img: 'garden/white-roses.PNG' },
      { id: 'pink daisies', img: 'garden/pink-daisies.PNG' },
      { id: 'orange daisies', img: 'garden/orange-daisies.PNG' },
      { id: 'red dahlias', img: 'garden/red-dahlias.PNG' },
      { id: 'blue dahlias', img: 'garden/blue-dahlias.PNG' }
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
      { id: 'pink hydrangeas', img: 'garden/pink-hydrangeas.PNG' },
      { id: 'blue hydrangeas', img: 'garden/blue-hydrangeas.PNG' },
      { id: 'black hibiscuses', img: 'garden/black-hibiscuses.PNG' },
      { id: 'yellow hibiscuses', img: 'garden/yellow-hibiscuses.PNG' },
      { id: 'orange tulips', img: 'garden/orange-tulips.PNG' },
      { id: 'purple tulips', img: 'garden/purple-tulips.png' }
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
      { id: 'red roses', img: 'garden/red-roses.PNG' },
      { id: 'green hydrangeas', img: 'garden/green-hydrangeas.PNG' },
      { id: 'blue daisies', img: 'garden/blue-daisies.PNG' },
      { id: 'gray roses', img: 'garden/gray-roses.PNG' },
      { id: 'orange daisies', img: 'garden/orange-daisies.PNG' },
      { id: 'yellow daisies', img: 'garden/yellow-daisies.PNG' },
      { id: 'white hydrangeas', img: 'garden/white-hydrangeas.PNG' },
      { id: 'black roses', img: 'garden/black-roses.PNG' },
      { id: 'purple hydrangeas', img: 'garden/purple-hydrangeas.PNG' }
    ],
    correctOrder: [
      'gray roses', 'black roses', 'white hydrangeas', 'blue daisies', 'red roses',
      'orange daisies', 'green hydrangeas', 'yellow daisies', 'purple hydrangeas'
    ]
  },

  {
    level: 'easy',
    story:'The animals are making a fuss. Help Jerrold feed them in the correct order from first fed to last fed.',
    clues: ['The cows eat after the chicken.',
       "The pigs are always fed last."] ,

    items: [
      { id: 'cows', img: 'barn/Cow.PNG' },
      { id: 'pigs', img: 'barn/Pig.PNG' },
      { id: 'chickens', img: 'barn/Chicken.PNG' }
    ],
    correctOrder: ['chickens', 'cows', 'pigs']
  },

  {
    level: 'easy',
    story:'Jerrold is creating harvest baskets for his friends. Order the veggies from lightest to heaviest basket.',
    clues: ['The carrot basket weighs more than the apples.',
       "The corn basket is not the lightest.", "The apples are lighter than both other baskets."] ,

    items: [
      { id: 'carrots', img: 'barn/Carrot.PNG' },
      { id: 'apples', img: 'barn/Apple.PNG' },
      { id: 'corns', img: 'barn/Corn.PNG' }
    ],
    correctOrder: ['apples', 'carrots', 'corns']
  },

  {
    level: 'medium',
    story:'Jerrold needs to fix his tractor for plowing! Order the parts based on how they fit in the tractor.',
    clues: ['The big wheels are not on the right.',
      'The hoods of the tractor are placed on top right.',
      'There is at least one wheel in the corner.'
    ],
    items: [
      { id: 'wheels', img: 'barn/1_Tractor.PNG' },
      { id: 'axles', img: 'barn/2_Tractor.PNG' },
      { id: 'engines', img: 'barn/3_Tractor.PNG' },
      { id: 'seats', img: 'barn/4_Tractor.PNG' },
      { id: 'levers', img: 'barn/5_Tractor.PNG' },
      { id: 'exhausts', img: 'barn/6_Tractor.PNG' }
    ],
    correctOrder: ['wheels','axles' ,'engines', 'seats', 'levers','exhausts']
  },

  {
    level: 'medium',
    story:'Jerrold is arranging his sheep for a farm show. Arrange them from left to right based on the clues.',
    clues: ['The yellow sheeps stand on top of the brown sheeps.',
      'The brown sheeps are furthest to the right.',
      'The red sheeps are left of the blue sheeps.',
      'The white sheeps are next to the brown sheeps.',
    ],
    items: [
      { id: 'red sheeps', img: 'barn/SheepRed.PNG' },
      { id: 'blue sheeps', img: 'barn/SheepBlue.PNG' },
      { id: 'yellow sheeps', img: 'barn/SheepYellow.PNG' },
      { id: 'black sheeps', img: 'barn/SheepBlack.PNG' },
      { id: 'white sheeps', img: 'barn/SheepWhite.PNG' },
      { id: 'brown sheeps', img: 'barn/SheepBrown.PNG' }
    ],
    correctOrder: ['red sheeps', 'blue sheeps', 'yellow sheeps', 'black sheeps', 'white sheeps', 'brown sheeps']
  },

  {
    level: 'hard',
    story:'Jerrold is planting his crops on a 3×3 grid. Arrange the crops from earliest to latest harvest using the clues.',
    clues: ['The wheats are directly above the rices.',
      'Cabbages grows earlier than the peanuts and wheats.',
      'Peas are planted to the right of the tomatoes.',
      'Potatoes are harvested last.',
      'Corn cobs grows below the peanuts.',
      'Beans are right of the wheats.'
],
    items: [
      { id: 'cabbages', img: 'barn/Cabbage.PNG' },
      { id: 'tomatoes', img: 'barn/Tomatoes.PNG' },
      { id: 'peas', img: 'barn/Peas.PNG' },
      { id: 'peanuts', img: 'barn/Peanuts.PNG' },
      { id: 'wheats', img: 'barn/Wheat.PNG' },
      { id: 'beans', img: 'barn/Beans.PNG' },
      { id: 'corn cobs', img: 'barn/Corn.PNG' },
      { id: 'rices', img: 'barn/Rice.PNG' },
      { id: 'potatoes', img: 'barn/Potatoes.PNG' }
    ],
    correctOrder: [
      'cabbages', 'tomatoes', 'peas', 'peanuts', 'wheats',
      'beans', 'corn cobs', 'rices', 'potatoes'
    ]
  }
];