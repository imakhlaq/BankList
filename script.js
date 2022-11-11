'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-07-26T17:01:17.194Z',
    '2020-07-28T23:36:17.929Z',
    '2020-08-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-11T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2022-11-09T18:49:59.371Z',
    '2022-11-11T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const formatTime = function (time) {
  //crating custom object for values that needed from API
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };

  const local = inputuser.locale;
  //first parameter is local (eg (en-UK)) second is custom needed values .format(time.object)
  return new Intl.DateTimeFormat(local, options).format(time);
};
// currancy change
const calcCurrency = function (curr) {
  const options = {
    style: 'currency',
    currency: `${inputuser.currency}`,
  };
  const moveWithcurr = new Intl.NumberFormat(inputuser.locale, options).format(
    curr
  );
  return moveWithcurr;
};
//making movements work

const transaction = function (movement, acc) {
  // removing html from
  containerMovements.innerHTML = '';
  movement.forEach((move, i) => {
    //accesing and creating dates
    const dateofTc = new Date(acc.movementsDates[i]);
    const curDate = new Date();
    //
    // const year = dateofTc.getFullYear();
    // const month = `${dateofTc.getMonth() + 1}`.padStart(2, 0);
    // const day = `${dateofTc.getDate()}`.padStart(2, 0);

    //for today and yesterday logic
    const dayCal = function (day1, day2) {
      return Math.floor(Math.abs((day1 - day2) / (1000 * 60 * 60 * 24)));
    };

    let transdate;
    if (dayCal(curDate, dateofTc) === 0) {
      transdate = `Today`;
    } else if (dayCal(curDate, dateofTc) === 1) {
      transdate = `Yesterday`;
    } else {
      transdate = formatTime(dateofTc);
    }

    const type = move < 0 ? 'withdrawal' : 'deposit';

    const moveWithcurr = calcCurrency(move);

    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">
    ${i + 1} ${type}
    </div>
     <div class="movements__date">${transdate}</div>
     <div class="movements__value">${moveWithcurr}</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//converting euros to dollers
const eurosToDollers = 1.1;
const movementsInDoller = account1.movements.map(value => {
  return value * 2;
});

//calculating final amount in acc
const calacDisplayBalance = function (acc) {
  const balance = acc.movements.reduce((accu, value) => {
    return accu + value;
  }, 0); // acc initail value
  labelBalance.textContent = calcCurrency(balance);
  acc.balance = balance;
};

//computing usernames property for objects

const createUserName = function (acc) {
  acc.forEach(acc => {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(value => {
        return value[0];
      })
      .join('');
  });

  //chaing of methods all those methos that return some thing you can cain them
};
createUserName(accounts);

//total amount in account
const calcTotalInOut = function (account) {
  const totalIn = account.movements
    .filter(value => value > 0)
    .reduce((acc, value) => acc + value, 0);

  //setting value of in
  labelSumIn.textContent = calcCurrency(totalIn);

  //total amount in removed from account
  const totalout = account.movements
    .filter(value => value < 0)
    .reduce((acc, value) => acc + value, 0);

  //setting value of out
  labelSumOut.textContent = calcCurrency(totalout);

  //total interest
  const interest = account.movements
    .filter(value => value > 0)
    .map(value => (account.interestRate * value) / 100)
    .reduce((accu, value) => accu + value, 0);
  //setting value of Interst
  labelSumInterest.textContent = calcCurrency(interest);
};

const uiUpdate = function (user) {
  //transactions
  transaction(user.movements, user);

  //total available balance
  calacDisplayBalance(user);

  //rest of in out and interst details
  calcTotalInOut(user);
};

//input username
let inputuser;

//event handlers
btnLogin.addEventListener('click', function (e) {
  //preventing refresh on form button click
  e.preventDefault();
  //if you press enter key and you are in input area(any one of them) it will tigger submit button
  inputuser = accounts.find(user => user.userName === inputLoginUsername.value);

  const inputPin = inputLoginPin.value;

  if (inputuser?.pin === Number(inputPin)) {
    //changing uI
    labelWelcome.textContent = `WelCome ${inputuser.owner}`;

    //opacity
    containerApp.style.opacity = 100;

    // deleting value from input feilds
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();

    //showing logged in user details

    uiUpdate(inputuser);

    //setting date

    //using API
    const localFormat = formatTime(new Date());
    labelDate.textContent = localFormat;

    //normaly
    // const year = time.getFullYear();
    // const month = `${time.getMonth() + 1}`.padStart(2, 0);
    // const day = `${time.getDate()}`.padStart(2, 0);
    // const hour = time.getHours();
    // const min = time.getMinutes();

    // labelDate.textContent = `${day}/${month}/${year} at ${hour}:${min}`;
  }
});

//transfer money

btnTransfer.addEventListener('click', function (e) {
  //preventing refresh on form button click
  e.preventDefault();

  const reciverid = accounts.find(
    user => user.userName === inputTransferTo.value
  );

  const sentAmount = Number(inputTransferAmount.value);

  if (
    reciverid &&
    sentAmount > 0 &&
    reciverid !== inputuser &&
    inputuser.balance >= sentAmount
  ) {
    //add reciver amount
    reciverid.movements.push(sentAmount);
    //recive time
    reciverid.movementsDates.push(new Date().toISOString());
    //remove sender amount
    inputuser.movements.push(-1 * sentAmount);
    //recive time
    inputuser.movementsDates.push(new Date().toISOString());

    //updating UI
    uiUpdate(inputuser);

    //reseting feilds
    // deleting value from input feilds
    inputTransferTo.value = inputTransferAmount.value = '';
    inputTransferAmount.blur();
  }
});

//loan (only if 10% of requested anount is deposited in the account)

btnLoan.addEventListener('click', function (e) {
  //default
  e.preventDefault();

  const reqloanAmt = Math.floor(inputLoanAmount.value);

  const req10p = (reqloanAmt / 100) * 10;

  const isEligible = inputuser.movements.some(amt => amt >= req10p);

  if (isEligible) {
    //giving loan
    inputuser.movements.push(reqloanAmt);
    // time
    inputuser.movementsDates.push(new Date().toISOString());

    //updating ui
    uiUpdate(inputuser);
  }
});

//delete account

btnClose.addEventListener('click', function (e) {
  //preventing refresh on form button click
  e.preventDefault();

  const closeAccId = inputCloseUsername.value;

  const closeAccPin = Number(inputClosePin.value);

  if (closeAccId === inputuser.userName && closeAccPin === inputuser.pin) {
    const accToDelete = accounts.findIndex(acc => acc.userName === closeAccId);
    //deleting exactly one element
    accounts.splice(accToDelete, 1);
    //hiding UI
    containerApp.style.opacity = 0;
  }
  //setting back input feilds
  inputCloseUsername.value = inputClosePin.value = '';
});

//sorting functinality
let isSorted = false;
btnSort.addEventListener('click', () => {
  const sorted = [...inputuser.movements];
  //sort function by default work on strings to correct this we have to use comnparator function
  sorted.sort((el1, el2) => {
    if (el1 < el2) {
      return -1;
    } else {
      return 1;
    }
  });
  if (!isSorted) {
    transaction(sorted, inputuser);
    isSorted = !isSorted;
  } else {
    transaction(inputuser.movements, inputuser);
    isSorted = !isSorted;
  }
});

// practice
// const total = accounts
//   .map(value => {
//     return value.movements;
//   })
//   .flat()
//   .reduce((acu, value) => acu + value, 0);
// console.log(total);

// const atlest1k = accounts
//   .flatMap(value => value.movements)
//   .reduce((acu, value) => (value >= 1000 ? acu + 1 : acu), 0);

// console.log(atlest1k);

// const { deposite: p, withdraw: hi } = accounts
//   .flatMap(value => value.movements)
//   .reduce(
//     (sums, value) => {
//       value > 0 ? (sums.deposite += value) : (sums.withdraw += value);
//       return sums;
//     },
//     { deposite: 0, withdraw: 0 }
//   );
// console.log(p, hi);

// Coding Challenge #4

/* 


2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

GOOD LUCK 😀
*/
// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] },
// ];

// dogs.forEach(obj => {
//   obj.recommanded = Math.floor(obj.weight ** 0.75 * 28);
// });

// const saradog = dogs.find(obj => obj.owners.includes('Sarah'));
// const eatingTomuchorlittle = `sara dog is eating ${
//   saradog.curFood > saradog.recommended * 0.9 ? 'Too much' : 'To little'
// }`;
// //console.log(eatingTomuchorlittle);

// const ownersDogEatToomuch = dogs
//   .filter(obj => obj.recommanded < obj.curFood)
//   .flatMap(obj => obj.owners);
// console.log(ownersDogEatToomuch);

// //

// const ownersEatTooLittle = dogs
//   .filter(obj => obj.curFood < obj.recommanded)
//   .flatMap(obj => obj.owners);
// //console.log(ownersEatTooLittle);

// const eatmuch = ownersDogEatToomuch.join(' and ');
// //console.log(`${eatmuch} dogs eat too much`);

// //
// const exactly = dogs.some(obj => obj.recommanded === obj.curFood);
// //console.log(exactly); false

// const eatingOK = function (obj) {
//   return (
//     obj.curFood > obj.recommanded * 0.9 && obj.curFood < obj.recommanded * 1.1
//   );
// };
// const okay = dogs.some(obj => eatingOK(obj));
// //console.log(okay);

// const dogsThatEatOk = dogs.filter(obj => eatingOK(obj));
// //console.log(dogsThatEatOk);

// const newdogs = dogs.slice().sort((a, b) => a.recommanded - b.recommanded);
// console.log(newdogs);

//using API to format in acces zone
// const now = new Date();

// const options = {
//   hour: 'numeric',
//   minute: 'numeric',
//   day: 'numeric',
//   month: 'short',
//   year: 'numeric',
// };
// getting locak from browaer
//const local = navigator.language;

// const localFormat = new Intl.DateTimeFormat(
//   'ja-JP-u-ca-japanese',
//   options
// ).format(now);

// console.log(localFormat);
