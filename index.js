const axios = require('axios');
const inquirer = require('inquirer');
const puppeteer = require('pdf-puppeteer');
const options = { path: "./github-profile.pdf", printBackground:true,}
const callback = function (pdf) {
    console.log("Generating PDF");
}

//Color Schemes
const colors = {
    green: {
      wrapperBackground: "#64CC77",
      headerBackground: "#F0D6FF",
      blockColor: "#9DEB63",
      photoBorderColor: "#8A64CC"
    },
    blue: {
      wrapperBackground: "#7383F5",
      headerBackground: "#191C36",
      blockColor: "#5560B5",
      photoBorderColor: "#6775DB"
    },
    gray: {
      wrapperBackground: "#7A6F74",
      headerBackground: "#E0CCD5",
      blockColor: "#BAA9B0",
      photoBorderColor: "#3B3538"
    },
    red: {
      wrapperBackground: "#E64B40",
      headerBackground: "#401512",
      blockColor: "#BF3F36",
      photoBorderColor: "#FF5447"
    }
  };

//query url
var url;

//inquirer
function inq(){
    return inquirer.prompt([
        {
            type: "input",
            message: "What is your gitHub username?",
            name: "username"
        },
        {
            type: "list",
            message: "What is your favorite color",
            choices: ["red", "green", "blue", "gray"],
            name: "color"
        }
    ]);
}

//get git hub data based on question responses
function gitHub(){
    return axios.get(url);
};

//get git hub stars
function gitHubStars(){
    return axios.get(url + '/starred')
};

//generate html
async function generateHTML(){
    let prompt = await inq();
    url = `https://api.github.com/users/${prompt.username}`;
    let res = await gitHub();
    let stars = await gitHubStars();
    let html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <script src="https://kit.fontawesome.com/490a5cd13f.js" crossorigin="anonymous"></script>
            <!-- <link rel="stylesheet" type="text/css" href="./style.css"> -->
            <title>Profile Generator</title>
            <style>

                @import url('https://fonts.googleapis.com/css?family=Montserrat:600|Roboto&display=swap');

                html, body{
                    margin: 0;
                    font-family: 'Roboto', sans-serif;
                }

                h1,h2,h3,h4,h5 {
                    font-family: 'Montserrat', sans-serif;
                }

                a {
                    color: white
                }

                a:hover {
                    text-decoration: underline;
                }

                body {
                    background-color: azure;
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                }

                header, footer{
                    background-color: ${colors[prompt.color].headerBackground};
                    flex-basis: 10%;
                }

                main {
                    flex-grow: 1;
                    position: relative;
                }

                .top-content{
                    background-color: ${colors[prompt.color].wrapperBackground};
                    color:white;
                    width: 80vw;
                    margin-top: -2rem;
                    margin-left: auto;
                    margin-right: auto;
                    text-align: center;
                    border-radius: 0.3rem;
                }

                #profile-pic{
                    position: relative;
                    top:-2rem;
                    height: 10rem;
                    width: 10rem;
                    border-radius: 50%;
                    background-color: crimson;
                    border: 2px solid ${colors[prompt.color].photoBorderColor};
                    margin-left:auto;
                    margin-right:auto;
                    background-image: url('${res.data.avatar_url}');
                    background-size: contain;
                    -webkit-box-shadow: 0px 0px 12px 5px rgba(230,230,230,0.91);
                    -moz-box-shadow: 0px 0px 12px 5px rgba(230,230,230,0.91);
                    box-shadow: 0px 0px 12px 5px rgba(230,230,230,0.91);

                }

                #hi {
                    margin-top:0;
                }

                #links{
                    padding-bottom:1rem;
                }

                #links i {
                    margin-left: 0.3rem;
                }

                .bio {
                    font-size:24px;
                    margin-top: 1rem;
                    margin-bottom: 1rem;
                    color:#586069;
                }

                .block-container{
                    display: flex;
                    flex-direction: column;
                    width: 70vw;
                    margin-left:auto;
                    margin-right:auto;
                    text-align: center;
                    margin-bottom: 2rem;
                }

                .row{
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    margin-bottom: 1rem;
                }

                .block{
                    flex-basis: 45%;
                    background-color: ${colors[prompt.color].blockColor};
                    color: white;
                    border-radius: 0.3rem;
                    padding-bottom: 1rem;
                }

                .block span {
                    font-size: 24px;
                    margin-bottom: 1rem;
                }
            </style>
        </head>
        <body>
            <header></header>
            <main>
                <div class="top-content">
                    <div id="profile-pic"></div>
                    <h1 id="hi">Hi!</h1>
                    <h2>My Name is ${res.data.name}</h2>
                    <h3 id="subtitle">Currently @ ${res.data.company}</h3>
                    <div id="links"><i class="fas fa-location-arrow"></i> ${res.data.location} <i class="fab fa-github"></i> <a href="${res.data.html_url}">GitHub</a> <i class="fas fa-rss"></i> <a href="${res.data.blog}">Blog</a></div>
                </div>

                <div class="block-container">
                    
                    <div class="bio">${res.data.bio}</div>

                    <div class="row">
                        <div class="block">
                            <h3><i class="fas fa-code-branch"></i> Public Repos</h3>
                            <span>${res.data.public_repos}</span>
                        </div>
                        <div class="block">
                            <h3><i class="fas fa-users"></i> Followers</h3>
                            <span>${res.data.followers}</span>
                        </div>
                    </div>

                    <div class="row">
                        <div class="block">
                            <h3><i class="fas fa-star"></i> Git Hub Stars</h3>
                            <span>${stars.data.length}</span>
                        </div>
                        <div class="block">
                            <h3><i class="far fa-eye"></i> Following</h3>
                            <span>${res.data.following}</span>
                        </div>
                    </div>

                </div>

            </main>
            <footer></footer>
        </body>
        </html>
    `
    //create pdf
    puppeteer(html, callback, options);
}

//make the magic happen 
//1. inq() 
//2. gitHub() 
//3. gitHubStars() 
//4. puppeteer()
generateHTML();



