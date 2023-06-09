const readline = require("readline");
const { appendFile } = require("fs").promises;
const { program } = require("commander");
require("colors");

const rl = readline.createInterface({
   input: process.stdin,
   output: process.stdout,
});

program.option("-f, --file <file name>", "log file name", "result.txt");
program.parse(process.argv);

const errorMessagesIfNan = [
   "Вы ввели не номер! Повторите попытку.".yellow,
   "Номер, мне нужен только НОМЕР!".blue,
   "Циферками, пожалуйста!".red,
   "Я понимаю только цифры, мешок с костями!".magenta,
];

const errorMessagesIfOutOfRange = [
   "Только между 1 и 10!".yellow,
   "Ты вышел за рамки!".blue,
   "Диапазон не тот!".red,
   "Можно ввести только 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ".magenta,
];

const errorAnswerMessages = [
   "Не угадал!".yellow,
   "Ещё, попробуй ещё и тебе повезёт!".blue,
   "Отлично, но НЕТ!".red,
   "Ну ты и тугой! Не ВЕРНА!".magenta,
];

let errorRandomAnswer = 0;
// console.log(errorMessagesIfNan[errorRandomAnswer]);

let tryCounter = 0;
const computerNumber = Math.ceil(Math.random() * 10); // from 1 to 10
const logFilePath = program.opts().file;

console.log("random number = ".bgBlue, computerNumber);

/**
 * Number validator
 * @param {number} val
 * @returns {boolian}
 */
const isValid = (val) => {
   if (!isNaN(val) && val >= 1 && val <= 10 && val % Math.floor(val) === 0) return true;

   if (isNaN(val)) console.log(`${errorMessagesIfNan[errorRandomAnswer]}`);
   if (val < 0 || val > 10) console.log(`${errorMessagesIfOutOfRange[errorRandomAnswer]}`);

   false;
};

/**
 *
 * @param {string} msg
 * @returns {Promice<void>}
 */
const logToFile = async (msg) => {
   try {
      await appendFile(logFilePath, `${msg}\n`);

      console.log(`Результат сохранён в: ${logFilePath}`.yellow);
   } catch (err) {
      console.log(`Error at LOG: ${err.mesaahe}`.red);
   }
};

const game = () => {
   rl.question("<--Enter number from 1 to 10-->\n".red, (val) => {
      const userNumber = +val; //+val - string to number
      // console.log("answer (Value): ", val);
      // console.log("answer (Number): ", userNumber);
      errorRandomAnswer = Math.floor(Math.random() * 4);

      console.log(errorRandomAnswer);

      if (!isValid(userNumber)) return game();

      tryCounter++;
      console.log(`Попытка № ${tryCounter}`.random);

      if (userNumber !== computerNumber) {
         console.log(`${errorAnswerMessages[errorRandomAnswer]}`);

         // game();
         // return;

         return game();
      }

      console.log(`Поздравляю! Ты угадал число за ${tryCounter} попыток`.bgGreen);

      logToFile(
         `${new Date().toLocaleString(
            "uk-UA"
         )}. Поздравляю! Ты угадал число за ${tryCounter} попыток.`
      );

      rl.close();
   });
};

game();
