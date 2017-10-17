
var webdriver = require('selenium-webdriver');
var By = webdriver.By;
var browserName = 'chrome';
var webUrl = 'http://localhost:3000/';

/* I used Jasmine to make the code more organized and readable. Jasmine also
visualizes the testing procedure and result; hence it comes in handy when we 
execute a series of automated tests. */
describe('Compare Number Practice', function () {

  beforeEach(function (done) {
    this.driver = new webdriver.Builder().forBrowser(browserName).build();
    this.driver.get(webUrl).then(done);
  });

  afterEach(function (done) {
    this.driver.quit().then(done);
  });

  it('Should be on the home page', function (done) {
    this.driver.getTitle()
      .then((title) => {
        console.log(`The title is: ${title}`);
        expect(title).toBe('Compare Numbers Form');
        done();
      })
  });

  //test if input is empty or not a number. 
  function inputIsEmptyOrNaN() {
    var input = ['', 'a', 'null', 'undefined', "'1'"];
    var testGroup = {
      name: ['numFirst', 'numSecond', 'numToCompare'],
      alertNumber: [1, 2, 3],
      inputNumber: ['First number', 'Second number', 'Number to compare']
    }
    //The Jasmine test is wrapped in a funtion for later iteration to avoid the timeout issue.
    var testNaN = (input, name, alertNumber, inputNumber) => {
      it('Should alert when input is empty or not a number', function () {
        this.driver.findElement(By.name(`${name}`)).sendKeys(input);
        this.driver.findElement(By.xpath('//*[@id="app"]/div/div/form/input')).click()
          .then(
          this.driver.findElement(By.xpath(`//*[@id="app"]/div/div/form/div[${alertNumber}]/div/div`))
            .getText()
            .then((alert) => {
              if (input === '') expect(alert).toBe(`${inputNumber} cannot be empty`);
              else expect(alert).toBe(`${inputNumber} cannot be a non-number`);
              this.driver.quit();
            }))
      })
    }
    let count = 0;
    while (count < 3) {
      for (var i = 0; i < input.length; i++) {
        testNaN(input[i], testGroup.name[count], testGroup.alertNumber[count], testGroup.inputNumber[count]);
      }
      count++;
    }
  };


  function numberToCompareBetween() {
    //randomly generate an integer from -100 to 100. 
    var randomInt = () => (Math.floor(Math.random() * 200 - 100).toString());
    //randomly generate a decimal from -100 to 100. 
    var randomDecimal = () => ((Math.random() * 200 - 100).toFixed(2).toString());

    /* depends on how many times we want to run the test, each time this function will generate
    two sets of data: one contains three random integers and the other one
    contains three random decimals from -100 to 100, for later testing purpose. */
    var testData = (times) => {
      let testData = [];
      while (times > 0) {
        let randomInt1 = randomInt(), randomInt2 = randomInt(), randomIntCompare = randomInt();
        testData.push([randomInt1, randomInt2, randomIntCompare]);

        let randomDecimal1 = randomDecimal(), randomDecimal2 = randomDecimal(), randomDecimalCompare = randomDecimal();
        testData.push([randomDecimal1, randomDecimal2, randomDecimalCompare]);
        times--;
      }
      return testData;
    }

    var compareNumber = (num1, num2, compareNum) => {
      let result;
      if ((num1 - compareNum) * (num2 - compareNum) <= 0)
        result = `${compareNum} is between ${num1} and ${num2}`
      else
        result = `${compareNum} is not between ${num1} and ${num2}`
      return result;
    }

    var dataForTest = testData(2);

    dataForTest.forEach((data) => {
      let firstNum = data[0], secondNum = data[1], compareNum = data[2];
      it('Should correctly identify that the number to compare is between the first and second number',
        function () {
          this.driver.findElement(By.name('numFirst')).sendKeys(firstNum);
          this.driver.findElement(By.name('numSecond')).sendKeys(secondNum);
          this.driver.findElement(By.name('numToCompare')).sendKeys(compareNum);
          this.driver.findElement(By.xpath('//*[@id="app"]/div/div/form/input')).click()
            .then(
            this.driver.findElement(By.xpath('//*[@id="app"]/div/div/div[2]/div/div[2]/p'))
              .getText()
              .then((result) => {
                let expectResult = compareNumber(firstNum, secondNum, compareNum);
                expect(result).toBe(expectResult);
              }))
        })
    });
  }

  inputIsEmptyOrNaN();
  numberToCompareBetween();

});