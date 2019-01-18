#LET'S
An app that let's the user set up a day of events depending on what state he or she is currently in.
The app generates a list of event that is divided into three timeslots, morning, afternoon and evening of the chosen day.
The user can then pick what events he or she wants to attend and make a whole day's schedule to print and share.


## How to get started

Since modern frameworks use some advanced features like compiling the templates and source code in pure
JavaScript and dynamically loading the needed content, you cannot anymore just open the HTML file
in the browser. Instead, you will need a local webserver that will serve your app. Follow the instructions
bellow to install all the needed dependencies (e.g. the framework libraries) and the development webserver.

1. First, make sure that you have npm installed on your system (follow the instructions
   at [Installing Node](https://docs.npmjs.com/getting-started/installing-node). The computers in the lab rooms
   should already have it, you will just need to do `module add node` to activate it (every time
   you start the terminal).

2. Run `npm install` through the terminal in the root of the repository. Let it
   install all the dependencies.

3. Run `npm install 'react-calendar'` for an extension of the react-library used in our app.

4. Run `npm start` through the terminal. This will start the webserver and the application should pop up in your
   browser ready for use. Alternatively you can open in through [http://localhost:3000]. Whenever you make changes in your code and save, the browser will update automatically, so you don't have to click refresh anymore.


This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).


#Initial idea
The initial idea was to propose events depending the user, i.e romantic, family etc, but the API turned out to not be as thorough as we first thought
so we had to scrap that idea. For example, there were only 300 events marked as family friendly in the whole database. We also wanted the user to be able to search for events in the whole world as was stated possible in the API documentation, but i turned out that the lion's share of the events take place in the US. 

Contributors:
Tania Christensen, Lilian Jap, Siri Blomqvist Lallerstedt, Pournami Krishnakumari 
