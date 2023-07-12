# employee-tracker

## Description

I wanted to build an application that, though it is to be used in the command line, would provide an easy user experience. This application provides a simple way to look through company records and manipulate the data stored therein, and it should help any HR department easily sort through and update records. Whenever possible, the user is guided through the application with helpful prompts and listed options. On possibly larger datasets, like the employee table, the user can enter the employee's name instead of searching through a huge list, and a simple check will make sure they exist before any data is changed. Any non-technical person should feel comfortable using this application!

One of the most important things learned by building this application is that every move of the user needs to be explored. This mindset is critical when creating applications geared towards good user experience. Even when the code is well-written, actual testing is important! 

USER STORY:
AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business


## Table of Contents 

- [Installation](#installation)
- [Usage](#usage)
- [Credits](#credits)
- [License](#license)
- [Features](#features)



## Installation

To use this application in your own command line, simply clone the repository from my github: https://github.com/AndrewNalley/employee-tracker

Once completed, remember to install the node modules with 'npm install'.

In the server.js file, please add your mysql user and password to make sure the database seeds and runs properly.

In mysql, run the following commands: 'source db/schema.sql' and 'source db/seeds.sql'. Exit mysql.

Finally, run the application with 'npm start'!


## Usage

Here's a video showing how to use the application:
https://drive.google.com/file/d/1U2WGHAmye6WUoo1uu2cx2ryOVIo9gkiy/view


## Credits

npm documentation: https://www.npmjs.com/package/inquirer#documentation
Fun with ASCII: http://patorjk.com/software/taag/

## License

MIT License

Copyright (c) 2023 AndrewNalley

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


## Features

- node.js
- npm inquirer
- mysql

## How to Contribute

[Contributor Covenant](https://www.contributor-covenant.org/)

