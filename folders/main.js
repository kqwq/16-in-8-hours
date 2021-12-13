import fs from 'fs';

/*
First, let's write a nodejs app that automatically creates a folder for each project.
Advanced Calculator -> advanced_calculator
Unit Converter -> unit_converter
etc.
*/

const main = async() => {
  let notesContent = await fs.promises.readFile('../README.md', 'utf8');

  console.log(notesContent);
  notesContent = notesContent.split('\n');
  // Get all lines beginning with N. name-of-folder
  let folderNames = []
  notesContent.forEach(line => {
    if (line.slice(0, 3).includes(".")) {
      if (folderNames.length >= 16) {return;}
      folderNames.push(line.slice(3).trim().toLowerCase().replace(/ /g, '_'))
    }
  })

  for (let i = 0; i < folderNames.length; i++) {
    await fs.promises.mkdir(`../${i+1}_${folderNames[i]}`)
  }
}

main()