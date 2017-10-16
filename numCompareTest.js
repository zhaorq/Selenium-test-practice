
var webdriver = require('selenium-webdriver');

/* This function returns the expected output. I can integrate testing frameworks such as 
Chai, Mocha, or Jasmine to make the testing more organized, but for this simple practice 
I just wrote the function from scratch. */
function compareNumber(num1, num2, compareNum) {
  let result;
  if ((num1 - compareNum) * (num2 - compareNum) <= 0)
    result = `${compareNum} is between ${num1} and ${num2}`
  else
    result = `${compareNum} is not between ${num1} and ${num2}`
  return result;
}

var randomInt = () => {
  return Math.floor(Math.random() * 200 - 100).toString(); 
}

var randomDecimal = () => {
  return (Math.random() * 200 - 100).toFixed(2).toString(); 
}

/* depends how many times we want to run the test, each time this function will generate
two sets of data: one contains three random integers and the other one
contains three random decimals from -100 to 100, for later testing purpose. */
var testData = (times) => {
  let testData = [];
  while (times > 0) {
    let randomInt1 = randomInt(), randomInt2 = randomInt(), randomIntCompare = randomInt();
    testData.push([randomInt1, randomInt2, randomIntCompare]);

    let randomDecimal1 = randomDecimal(), randomDecimal2 = randomDecimal(), 
    randomDecimalCompare = randomDecimal();
    testData.push([randomDecimal1, randomDecimal2, randomDecimalCompare]);
    times--;
  }
  return testData;
}

// function handleFailure(err) {
// 	console.error('Something went wrong\n', err.stack, '\n');
// 	closeBrowser();
// }

var compareNumberTest = (browserName) => {
  var browser = new webdriver.Builder().forBrowser(browserName).build();
  browser.get('http://localhost:3000/');
  browser.getTitle()
    .then((title) => {
      console.log(`Now using ${browserName}, the title is: ${title}`)
    })

  testData(1).map((data) => {
    var browser = new webdriver.Builder().forBrowser(browserName).build();
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
  browser.quit();
}

compareNumberTest('chrome');
compareNumberTest('firefox'); 
// compareNumberTest('safari'); 