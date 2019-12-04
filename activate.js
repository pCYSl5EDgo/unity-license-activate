var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import puppeteer from 'puppeteer';
import fs from 'fs';
const Run = () => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer.launch();
    const page = yield browser.newPage();
    const downloadPath = process.cwd();
    const client = yield page.target().createCDPSession();
    yield client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: downloadPath
    });
    yield page.goto('https://license.unity3d.com/manual');
    yield page.waitForNavigation({
        timeout: 60000,
        waitUntil: 'domcontentloaded'
    });
    const email = `${process.argv[2]}`;
    yield page.type('input[type=email]', email);
    const password = `${process.argv[3]}`;
    yield page.type('input[type=password]', password);
    yield page.click('input[name="commit"]');
    yield page.waitForNavigation({
        timeout: 60000,
        waitUntil: 'domcontentloaded'
    });
    const input = yield page.$('input[name="licenseFile"]');
    const alfPath = `${process.argv[4]}`;
    if (!input)
        throw "input is null";
    yield input.uploadFile(alfPath);
    yield page.click('input[name="commit"]');
    yield page.waitForNavigation({
        timeout: 60000,
        waitUntil: 'domcontentloaded'
    });
    const selectedTypePersonal = 'input[id="type_personal"][value="personal"]';
    yield page.evaluate(s => document.querySelector(s).click(), selectedTypePersonal);
    const selectedPersonalCapacity = 'input[id="option3"][name="personal_capacity"]';
    yield page.evaluate(s => document.querySelector(s).click(), selectedPersonalCapacity);
    yield page.click('input[class="btn mb10"]');
    yield page.waitForNavigation();
    yield page.click('input[name="commit"]');
    let _ = yield (() => __awaiter(void 0, void 0, void 0, function* () {
        let ulf = false;
        do {
            for (const file of fs.readdirSync(downloadPath)) {
                ulf = ulf || file.endsWith('.ulf');
            }
            yield sleep(1000);
        } while (!ulf);
    }))();
    function sleep(milliSeconds) {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, milliSeconds);
        });
    }
    yield browser.close();
});
Run();
