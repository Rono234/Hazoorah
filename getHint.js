function getHint(userArray , solutionArray){

    // Function to generate the position name based on the puzzle size 
function generatePositionNames(totalBoxes) {
  const posNames = [];

  for (let i = 1; i <= totalBoxes; i++) {
    let suffix = "th";

    // handle exceptions for 1st, 2nd, 3rd 
    if (i % 10 === 1 && i % 100 !== 11) suffix = "st";
    else if (i % 10 === 2 && i % 100 !== 12) suffix = "nd";
    else if (i % 10 === 3 && i % 100 !== 13) suffix = "rd";

    posNames.push(`${i}${suffix}`);
  }

  return posNames;
}

    const templates  = [
        "Hmm... something seems off with box #{index}" , 
        "Take another look at the #{index} position - it doesn't seems right" ,
        "Maybe the #{correct} belongs in box #{index}",
        "The item in box #{index} doesn't look correct - what about #{correct}"
    ];
    
    // find the first mismatch 
    let misMatchIndex = -1 ; 

    for (let i = 0 ; i < userArray.length ; i++){
        if (userArray[i] !== solutionArray[i] ) {
            misMatchIndex = i ;
            break ; 
        }
    }


    

    const correct = solutionArray[misMatchIndex];
    const posNames = generatePositionNames(userArray.length)
    const indexLabel = posNames[misMatchIndex];

    const randomHintTemplate = templates[ Math.floor(Math.random() * templates.length)]


    return randomHintTemplate
    .replace("#{index}", indexLabel)
    .replace("#{correct}", correct);

   
}


// Make it available to other scripts
window.getHint = getHint;