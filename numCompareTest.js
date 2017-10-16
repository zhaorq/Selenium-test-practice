
var webdriver = require('selenium-webdriver');
var browser = new webdriver.Builder().forBrowser('chrome').build();

var browsers = ['Firefox','Chrome','Safari'];
 

function compareNumber(num1,num2,compareNum) {
  let result; 
  if(compareNum>=num1 && compareNum<=num2)
    result = `${compareNum} is between ${num1} and ${num2}` 
  else 
    result = `${compareNum} is not between ${num1} and ${num2}` 
  
  return result; 
}


var randomNumber1 = Math.floor(Math.random()*200-100).toString(),
randomNumber2 = Math.floor(Math.random()*200-100).toString(),
randomNumberCompare = Math.floor(Math.random()*200-100).toString(); 

function checkTitle() {
    browser.getTitle()
    .then(function(title) {
         console.log("The title is: " + title)
     });
}

function handleFailure(err) {
	console.error('Something went wrong\n', err.stack, '\n');
	closeBrowser();
}


function closeBrowser() {
	browser.quit();
}

browser.get('http://localhost:3000/');
browser.findElement(webdriver.By.name('numFirst')).sendKeys(randomNumber1);
browser.findElement(webdriver.By.name('numSecond')).sendKeys(randomNumber2);
browser.findElement(webdriver.By.name('numToCompare')).sendKeys(randomNumberCompare); 
browser.findElement(webdriver.By.xpath('//*[@id="app"]/div/div/form/input')).click()
.then(
    browser.findElement(webdriver.By.xpath('//*[@id="app"]/div/div/div[2]/div/div[2]/p'))
.getText()
.then((result) => {
  let expectResult = compareNumber(randomNumber1,randomNumber2,randomNumberCompare); 
  if(result === expectResult) 
    console.log('Test passed, result is correct.')
  else 
    console.log('Test failed, result is incorrect.')
})
)

