'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

//making movements work

const transaction = function (movement) {
  // removing html from
  containerMovements.innerHTML = '';
  movement.forEach((move, i) => {
    const type = move < 0 ? 'withdrawal' : 'deposit';
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">
    ${i + 1} ${type}
    </div>
     <div class="movements__date">24/01/2037</div>
     <div class="movements__value">${move}€</div>
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
const calacDisplayBalance = function (movement) {
  const balance = movement.reduce((acc, value) => {
    return acc + value;
  }, 0); // acc initail value
  labelBalance.textContent = `${balance}€`;
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
const calcTotalInOut = function (movements) {
  const totalIn = movements
    .filter(value => value > 0)
    .reduce((acc, value) => acc + value, 0);

  //setting value of in
  labelSumIn.textContent = `${totalIn}€`;

  //total amount in removed from account
  const totalout = movements
    .filter(value => value < 0)
    .reduce((acc, value) => acc + value, 0);

  //setting value of out
  labelSumOut.textContent = `${totalout}€`;

  //total interest
  const interest = movements
    .filter(value => value > 0)
    .map(value => (value * 1.2) / 100)
    .reduce((accu, value) => accu + value, 0);
  //setting value of Interst
  labelSumInterest.textContent = `${Math.round(interest)}€`;
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

    //showing logged in user details

    //transactions
    transaction(inputuser.movements);

    //total available balance
    calacDisplayBalance(inputuser.movements);

    //rest of in out and interst details
    calcTotalInOut(inputuser.movements);
  }
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
