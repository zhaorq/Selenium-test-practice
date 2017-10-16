
var webdriver = require('selenium-webdriver');

// var browsers = ['Firefox','Chrome','Safari'];

function compareNumber(num1, num2, compareNum) {
  let result;
  if ((num1 - compareNum) * (num2 - compareNum) <= 0)
    result = `${compareNum} is between ${num1} and ${num2}`
  else
    result = `${compareNum} is not between ${num1} and ${num2}`

  return result;
}

var testData = (times) => {
  let testData = [];
  while (times > 0) {
    let randomNumber1 = Math.floor(Math.random() * 200 - 100).toString(),
      randomNumber2 = Math.floor(Math.random() * 200 - 100).toString(),
      randomNumberCompare = Math.floor(Math.random() * 200 - 100).toString();
    testData.push([randomNumber1, randomNumber2, randomNumberCompare]);
    times--;
  }
  return testData;
}


// function checkTitle() {
//     browser.getTitle()
//     .then(function(title) {
//          console.log("The title is: " + title)
//      });
// }

// function handleFailure(err) {
// 	console.error('Something went wrong\n', err.stack, '\n');
// 	closeBrowser();
// }


testData(5).map((data) => {
  var browser = new webdriver.Builder().forBrowser('chrome').build();
  browser.get('http://localhost:3000/')
  let firstNum = data[0], secondNum = data[1], compareNum = data[2];
  browser.findElement(webdriver.By.name('numFirst')).sendKeys(firstNum);
  browser.findElement(webdriver.By.name('numSecond')).sendKeys(secondNum);
  browser.findElement(webdriver.By.name('numToCompare')).sendKeys(compareNum);
  browser.findElement(webdriver.By.xpath('//*[@id="app"]/div/div/form/input')).click()
    .then(
    browser.findElement(webdriver.By.xpath('//*[@id="app"]/div/div/div[2]/div/div[2]/p'))
      .getText()
      .then((result) => {
        let expectResult = compareNumber(firstNum, secondNum, compareNum);
        if (result === expectResult)
          console.log('Test passed, result is correct.')
        else
          console.log(`Test failed, result is incorrect. Expecting ${expectResult} but got ${result}`)
      })
    )
  browser.quit();
})



// .then(closeBrowser, handleFailure);