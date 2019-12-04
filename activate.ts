import puppeteer from 'puppeteer';
import fs from 'fs';

const Run = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const downloadPath = process.cwd();
    const client = await page.target().createCDPSession();

    await client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: downloadPath
    });

    await page.goto('https://license.unity3d.com/manual');

    await page.waitForNavigation({
        timeout: 60000,
        waitUntil: 'domcontentloaded'
    });

    const email = `${process.argv[2]}`;
    await page.type('input[type=email]', email);

    const password = `${process.argv[3]}`;
    await page.type('input[type=password]', password);
    await page.click('input[name="commit"]');

    await page.waitForNavigation({
        timeout: 60000,
        waitUntil: 'domcontentloaded'
    });

    const input = await page.$('input[name="licenseFile"]');

    const alfPath = `${process.argv[4]}`;

    if (!input) throw "input is null";

    await input.uploadFile(alfPath);

    await page.click('input[name="commit"]')

    await page.waitForNavigation({
        timeout: 60000,
        waitUntil: 'domcontentloaded'
    })

    const selectedTypePersonal = 'input[id="type_personal"][value="personal"]'
    await page.evaluate(
        s => document.querySelector(s).click(),
        selectedTypePersonal
    )

    const selectedPersonalCapacity =
        'input[id="option3"][name="personal_capacity"]'
    await page.evaluate(
        s => document.querySelector(s).click(),
        selectedPersonalCapacity
    )

    await page.click('input[class="btn mb10"]')

    await page.waitForNavigation()

    await page.click('input[name="commit"]')

    let _ = await (async () => {
        let ulf: Boolean = false;
        do {
            for (const file of fs.readdirSync(downloadPath)) {
                ulf = ulf || file.endsWith('.ulf');
            }
            await sleep(1000)
        } while (!ulf)
    })();

    function sleep(milliSeconds: number) {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, milliSeconds);
        });
    }

    await browser.close();
};

Run();