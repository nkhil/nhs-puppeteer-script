const puppeteer = require('puppeteer');
const schedule = require('node-schedule');

const unavailableStatus = 'We are sorry but we are unable to register any';

async function scheduledJob() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  console.log('new page created');
  await page.goto('https://www.campusdoctor.co.uk/bruntonplace/capacity.html');
  console.log('go to campusdoctor.com');
  let content = await page.evaluate(() => {
    let divs = [...document.querySelectorAll('.auto-style1')];
    return divs.map((div) => div.textContent.trim());
  });
  const placesNotAvailable = content.reduce((acc, val) => {
    if(val.includes(unavailableStatus)) {
      acc = true;
      return acc;
    }
    return acc;
  }, false)
  if(!placesNotAvailable) {
    console.log('Places are available!!!');
    console.log('Send text messages!!!');
  } else {
    console.log('No places available yet!')
  }
  browser.close();
}

// TODO: WIP - below runs every 10 seconds
const job = schedule.scheduleJob('* * 23 * * *', async function() {
  console.log('Attempting to check the NHS website');
  await scheduledJob();
});

job.invoke();