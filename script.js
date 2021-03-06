//init

const errortext = document.querySelector(`.errormsg`);
const url = `https://yeshwanth-todo.herokuapp.com/comments`;
renderdata();
adddatacheck();
todaysdate();

// Date and Time

const dateandtime = document.querySelector(`.datetime`);

const months = [
  `January`,
  `February`,
  `March`,
  `April`,
  `May`,
  `June`,
  `july`,
  `August`,
  `September`,
  `October`,
  `November`,
  `December`,
];

const weeks = [
  `Sunday`,
  `Monday`,
  `Tuesday`,
  `Wednesday`,
  `Thrusday`,
  `Friday`,
  `Saturday`,
];

setInterval(function () {
  const today = new Date();
  const day = today.getDay();
  const dat = `${today.getDate()}`;
  const date = dat.padStart(`2`, 0);
  const hr = `${today.getHours()}`;
  const hour = hr.padStart(`2`, 0);
  const min = `${today.getMinutes()}`;
  const minute = min.padStart(`2`, 0);
  const sec = `${today.getSeconds()}`;
  const seconds = sec.padStart(`2`, 0);

  dateandtime.innerHTML = `${weeks[day]},  ${date} ${
    months[today.getMonth()]
  } ${today.getFullYear()} || ${hour} : ${minute} : ${seconds}`;
}, 100);

function todaysdate() {
  const today = new Date();
  const year = `${today.getFullYear()}`;
  const month = `${today.getMonth() + 1}`;
  const month01 = month.padStart(`2`, 0);
  const date = `${today.getDate()}`;
  const date01 = date.padStart(`2`, 0);

  const currentdate = `${year}-${month01}-${date01}`;

  const att = document.getElementById(`calenderinp_01`);
  const att01 = document.getElementById(`calenderinp_02`);
  att.setAttribute("min", currentdate);
  att01.setAttribute("min", currentdate);
}

// blur elements

function addblur() {
  document.querySelector(`.headerbox`).classList.add(`blur`);
  document.querySelector(`.quicklinks`).classList.add(`blur`);
  document.querySelector(`.dateandtime`).classList.add(`blur`);
  document.querySelector(`.searchsection`).classList.add(`blur`);
  document.querySelector(`.maincontainer`).classList.add(`blur`);
}

function removeblur() {
  document.querySelector(`.headerbox`).classList.remove(`blur`);
  document.querySelector(`.quicklinks`).classList.remove(`blur`);
  document.querySelector(`.dateandtime`).classList.remove(`blur`);
  document.querySelector(`.searchsection`).classList.remove(`blur`);
  document.querySelector(`.maincontainer`).classList.remove(`blur`);
}

// add task

const maincontainer = document.querySelector(`.maincontainer`);
const addbtn = document.querySelector(`.addcontainer`);
const newtaskpop = document.querySelector(`.tasknewboxnew`);
const newtaskcancel = document.querySelector(`.canceladd`);
const newtaskinput = document.querySelector(`.newtaskinpadd`);
const addtask = document.querySelector(`.addtask`);
const caldate = document.querySelector(`.caladd`);
const keyadd = document.querySelector(`.addtaskbtn_key`);

addbtn.addEventListener(`click`, function () {
  newtaskpop.classList.remove(`hidden`);
  errortext.innerHTML = ``;
  newtaskinput.focus();
  addblur();
});

newtaskcancel.addEventListener(`click`, function () {
  newtaskpop.classList.add(`hidden`);
  newtaskinput.value = ``;
  caldate.value = ``;
  errortext.innerHTML = ``;
  removeblur();
});

async function adddatacheck() {
  try {
    let result = await fetch(url);
    let data = await result.json();
    await data?.forEach(async function (elem) {
      darray.push(elem.task);
    });
  } catch {
    errortext.innerHTML = `Failed to Fetch, Server Not Found`;
    document.querySelector(`.loading`).classList.add(`hidden`);
  }
}

let darray = [];

addtask.addEventListener(`click`, async function (e) {
  e.preventDefault();

  let today = new Date();
  let day = `${today.getDate()}`;
  let day01 = day.padStart(`2`, 0);
  let month = `${today.getMonth() + 1}`;
  let month01 = month.padStart(`2`, 0);
  let year = today.getFullYear();
  const value = newtaskinput.value;
  const newvalue =
    value.charAt(0).toUpperCase() + value.slice(1).toLowerCase().trim();
  const date = caldate.value || `${year}-${month01}-${day01}`;

  if (darray.includes(newvalue)) {
    errortext.innerHTML = `Task Already Exist`;
  } else if (!darray.includes(newvalue)) {
    await getdata(newvalue, date);
    location.reload();
  }
});

newtaskinput.addEventListener(`keyup`, async function (e) {
  e.preventDefault();

  if (e.key === `Enter`) {
    let today = new Date();
    let day = `${today.getDate()}`;
    let day01 = day.padStart(`2`, 0);
    let month = `${today.getMonth() + 1}`;
    let month01 = month.padStart(`2`, 0);
    let year = today.getFullYear();
    const value = newtaskinput.value;
    const newvalue =
      value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    const date = caldate.value || `${year}-${month01}-${day01}`;

    if (darray.includes(newvalue)) {
      errortext.innerHTML = `Task Already Exist`;
    } else if (!darray.includes(newvalue)) {
      await getdata(newvalue, date);
      location.reload();
    }
  }
});

async function getdata(newvalue, date) {
  if (newvalue && date) {
    let res = await fetch(url, {
      method: `POST`,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        task: newvalue,
        date: date,
        status: false,
      }),
    });
    if (res.ok) {
      renderdata();
    }
    newtaskpop.classList.add(`hidden`);
    newtaskinput.value = ``;
    caldate.value = ``;
  } else {
    errortext.innerHTML = `Please Enter Task Data`;
  }
  removeblur();
}

async function renderdata() {
  let html = "";
  document.querySelector(`.loading`).classList.remove(`hidden`);
  try {
    errortext.innerHTML = ``;
    let res = await fetch(url);
    let data = await res.json();
    data?.forEach((elem, i) => {
      if (elem.status) {
        html += `<div class="eventcontainer eventcontainer finupd anmi${i}">
        <div class="event decor">
          <p class="sno">${i + 1}</p>
          <p class="task">${elem.task}</p>
        </div>

        <div class="showdate decor">
          <p class="dateshow_1">Task Date : ${elem.date}</p>
        </div>

        <div class="btnsupdate">
          <button class="updatebtn finished" onclick="finishfunc(${
            elem.id
          })">Incomplete</button>
          <button class="updatebtn update hidden" onclick="edittask(${
            elem.id
          })">Update</button>
          <button class="updatebtn delete" onclick="deletetask(${
            elem.id
          }); delanmi(${i})">Delete</button>
        </div>
      </div>`;
      } else {
        html += `<div class="eventcontainer eventcontainer anmi${i}">
        <div class="event">
          <p class="sno">${i + 1}</p>
          <p class="task">${elem.task}</p>
        </div>

        <div class="showdate">
          <p class="dateshow_1">Task Date : ${elem.date}</p>
        </div>

        <div class="btnsupdate">
          <button class="updatebtn finished" onclick="finishfunc(${
            elem.id
          })">Complete</button>
          <button class="updatebtn update" onclick="edittask(${
            elem.id
          })">Update</button>
          <button class="updatebtn delete" onclick="deletetask(${
            elem.id
          }); delanmi(${i})">Delete</button>
        </div>
      </div>`;
      }
    });
    maincontainer.innerHTML = html;
    document.querySelector(`.loading`).classList.add(`hidden`);
    if (!maincontainer.innerHTML) {
      errortext.innerHTML = `No Tasks Exist`;
    }
  } catch {
    errortext.innerHTML = `Error Fetching Data Please Check the Server`;
  }
}

//delete task

function delanmi(i) {
  document.querySelector(`.anmi${i}`).classList.add(`delanmi`);
}

async function deletetask(id) {
  setTimeout(async function () {
    let res = await fetch(
      `https://yeshwanth-todo.herokuapp.com/comments/${id}`,
      {
        method: `DELETE`,
      }
    );
    await renderdata();
    location.reload();
  }, 200);
}

// edit task

const updpop = document.querySelector(`.tasknewboxup`);
const taskup = document.querySelector(`.taskupd`);
const calup = document.querySelector(`.calup`);
const addupbtn = document.querySelector(`.addupd`);
const cancelupbtn = document.querySelector(`.cancelup`);

let idvalue;

async function edittask(id) {
  updpop.classList.remove(`hidden`);
  taskup.focus();
  idvalue = id;
  addblur();
}

cancelupbtn.addEventListener(`click`, function () {
  updpop.classList.add(`hidden`);
  removeblur();
  errortext.innerHTML = ``;
  taskup.value = ``;
});

addupbtn.addEventListener(`click`, async function () {
  let updvalue = taskup.value;
  let crctupdvalue =
    updvalue.charAt(0).toUpperCase() + updvalue.slice(1).toLowerCase().trim();

  if (darray.includes(crctupdvalue)) {
    errortext.innerHTML = `Task Already Exist in the List`;
  } else {
    let res = await fetch(`${url}/${idvalue}`);
    let data = await res.json();

    let updcal = calup.value;

    await fetch(`https://yeshwanth-todo.herokuapp.com/comments/${idvalue}`, {
      method: `PUT`,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        task: crctupdvalue || data.task,
        date: updcal || data.date,
        status: false,
      }),
    });
    updpop.classList.add(`hidden`);
    await renderdata();
    removeblur();
    location.reload();
  }
});

taskup.addEventListener(`keyup`, async function (e) {
  e.preventDefault();

  if (e.key === `Enter`) {
    let updvalue = taskup.value;
    let crctupdvalue =
      updvalue.charAt(0).toUpperCase() + updvalue.slice(1).toLowerCase().trim();

    if (darray.includes(crctupdvalue)) {
      errortext.innerHTML = `Task Already Exist in the List`;
    } else {
      let res = await fetch(`${url}/${idvalue}`);
      let data = await res.json();

      let updcal = calup.value;

      await fetch(`https://yeshwanth-todo.herokuapp.com/comments/${idvalue}`, {
        method: `PUT`,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          task: crctupdvalue || data.task,
          date: updcal || data.date,
          status: false,
        }),
      });
      updpop.classList.add(`hidden`);
      await renderdata();
      removeblur();
      location.reload();
    }
  }
});

// finished

async function finishfunc(id) {
  let res = await fetch(`${url}/${id}`);
  let data = await res.json();

  if (!data.status) {
    await fetch(`https://yeshwanth-todo.herokuapp.com/comments/${id}`, {
      method: `PUT`,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        task: data.task,
        date: data.date,
        status: true,
      }),
    });
  } else {
    await fetch(`https://yeshwanth-todo.herokuapp.com/comments/${id}`, {
      method: `PUT`,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        task: data.task,
        date: data.date,
        status: false,
      }),
    });
  }

  renderdata();
}

// search

const search = document.querySelector(`.search`);

search.addEventListener(`keyup`, async function (e) {
  let res = await fetch(url);
  let data = await res.json();
  let html = "";

  await data.forEach(async function (elem, i) {
    const searchval = search.value;
    const searchvalue_01 =
      searchval.charAt(0).toUpperCase() + searchval.slice(1).toLowerCase();
    errortext.innerHTML = ` `;
    if (elem.task.includes(searchvalue_01)) {
      let data = await elem;
      function datarender(data, i) {
        if (data.status) {
          html += `<div class="eventcontainer eventcontainer finupd anmi${i}">
        <div class="event decor">
          <p class="sno">${i + 1}</p>
          <p class="task">${data.task}</p>
        </div>

        <div class="showdate decor">
          <p class="dateshow_1">Task Date : ${data.date}</p>
        </div>

        <div class="btnsupdate">
          <button class="updatebtn finished" onclick="finishfunc(${
            data.id
          })">Incomplete</button>
          <button class="updatebtn update hidden" onclick="edittask(${
            data.id
          })">Update</button>
          <button class="updatebtn delete" onclick="deletetask(${
            data.id
          }); delanmi(${i})">Delete</button>
        </div>
      </div>`;
        } else {
          html += `<div class="eventcontainer eventcontainer anmi${i}">
        <div class="event">
          <p class="sno">${i + 1}</p>
          <p class="task">${data.task}</p>
        </div>

        <div class="showdate">
          <p class="dateshow_1">Task Date : ${data.date}</p>
        </div>

        <div class="btnsupdate">
          <button class="updatebtn finished" onclick="finishfunc(${
            data.id
          })">Complete</button>
          <button class="updatebtn update" onclick="edittask(${
            data.id
          })">Update</button>
          <button class="updatebtn delete" onclick="deletetask(${
            data.id
          }); delanmi(${i})">Delete</button>
        </div>
      </div>`;
        }
      }
      datarender(data, i);
    }

    maincontainer.innerHTML = html;
  });
  if (!maincontainer.innerHTML) {
    errortext.innerHTML = `No Search Found`;
  }
});

// Functional keys

// All Task Btn

const alltaskbtn = document.querySelector(`.tasksall`);

alltaskbtn.addEventListener(`click`, async function () {
  search.value = ``;
  await renderdata();
  if (!maincontainer.innerHTML) {
    errortext.innerHTML = `No Tasks added`;
  }
});

// completed

const completedbtn = document.querySelector(`.completed`);

completedbtn.addEventListener(`click`, async function () {
  let res = await fetch(url);
  let data = await res.json();
  let html = "";

  await data.forEach(async function (data, i) {
    errortext.innerHTML = ` `;
    if (data.status) {
      html += `<div class="eventcontainer eventcontainer finupd anmi${i}">
        <div class="event decor">
          <p class="sno">${i + 1}</p>
          <p class="task">${data.task}</p>
        </div>
        <div class="showdate decor">
          <p class="dateshow_1">Task Date : ${data.date}</p>
        </div>
        <div class="btnsupdate">
          <button class="updatebtn finished" onclick="finishfunc(${
            data.id
          })">Incomplete</button>
          <button class="updatebtn update hidden" onclick="edittask(${
            data.id
          })">Update</button>
          <button class="updatebtn delete" onclick="deletetask(${
            data.id
          }); delanmi(${i})">Delete</button>
        </div>
      </div>`;
    }
  });

  maincontainer.innerHTML = html;

  if (!maincontainer.innerHTML) {
    errortext.innerHTML = `No Completed Tasks Found`;
  }
});

// Incomplete

const incompletebtn = document.querySelector(`.incomplete`);

incompletebtn.addEventListener(`click`, async function () {
  let res = await fetch(url);
  let data = await res.json();
  let html = "";

  await data.forEach(async function (data, i) {
    errortext.innerHTML = ` `;
    if (!data.status) {
      html += `<div class="eventcontainer eventcontainer finup anmi${i}">
        <div class="event">
          <p class="sno">${i + 1}</p>
          <p class="task">${data.task}</p>
        </div>
        <div class="showdate">
          <p class="dateshow_1">Task Date : ${data.date}</p>
        </div>
        <div class="btnsupdate">
          <button class="updatebtn finished" onclick="finishfunc(${
            data.id
          })">Complete</button>
          <button class="updatebtn update" onclick="edittask(${
            data.id
          })">Update</button>
          <button class="updatebtn delete" onclick="deletetask(${
            data.id
          }); delanmi(${i})">Delete</button>
        </div>
      </div>`;
    }
  });

  maincontainer.innerHTML = html;

  if (!maincontainer.innerHTML) {
    errortext.innerHTML = `No Incomplete Tasks Found`;
  }
});

// missed

const missedbtn = document.querySelector(`.taskprevious`);

missedbtn.addEventListener(`click`, async function () {
  let res = await fetch(url);
  let data = await res.json();
  let html = "";
  errortext.innerHTML = ` `;

  let today = new Date();
  let day = `${today.getDate()}`;
  let day01 = day.padStart(`2`, 0);
  let month = `${today.getMonth() + 1}`;
  let month01 = month.padStart(`2`, 0);
  let year = today.getFullYear();

  let curdate = new Date(`${year}-${month01}-${day01}`);

  await data?.forEach(function (data, i) {
    let datadate = new Date(data.date);
    if (curdate > datadate) {
      if (data.status) {
        html += `<div class="eventcontainer eventcontainer finupd anmi${i}">
        <div class="event decor">
          <p class="sno">${i + 1}</p>
          <p class="task">${data.task}</p>
        </div>

        <div class="showdate decor">
          <p class="dateshow_1">Task Date : ${data.date}</p>
        </div>

        <div class="btnsupdate">
          <button class="updatebtn finished" onclick="finishfunc(${
            data.id
          })">Incomplete</button>
          <button class="updatebtn update hidden" onclick="edittask(${
            data.id
          })">Update</button>
          <button class="updatebtn delete" onclick="deletetask(${
            data.id
          }); delanmi(${i})">Delete</button>
        </div>
      </div>`;
      } else {
        html += `<div class="eventcontainer eventcontainer anmi${i}">
        <div class="event">
          <p class="sno">${i + 1}</p>
          <p class="task">${data.task}</p>
        </div>

        <div class="showdate">
          <p class="dateshow_1">Task Date : ${data.date}</p>
        </div>

        <div class="btnsupdate">
          <button class="updatebtn finished" onclick="finishfunc(${
            data.id
          })">Complete</button>
          <button class="updatebtn update" onclick="edittask(${
            data.id
          })">Update</button>
          <button class="updatebtn delete" onclick="deletetask(${
            data.id
          }); delanmi(${i})">Delete</button>
        </div>
      </div>`;
      }
    }
  });

  maincontainer.innerHTML = html;

  if (!maincontainer.innerHTML) {
    errortext.innerHTML = `No Previous Tasks Found`;
  }
});

// Today Tasks

const tasktodaybtn = document.querySelector(`.tasktoday`);

tasktodaybtn.addEventListener(`click`, async function () {
  let res = await fetch(url);
  let data = await res.json();
  let html = "";
  errortext.innerHTML = ` `;

  let today = new Date();
  let day = `${today.getDate()}`;
  let day01 = day.padStart(`2`, 0);
  let month = `${today.getMonth() + 1}`;
  let month01 = month.padStart(`2`, 0);
  let year = today.getFullYear();

  let curdate = new Date(`${year}-${month01}-${day01}`);

  await data?.forEach(function (data, i) {
    let datadate = new Date(data.date);
    if (curdate > datadate) {
      let x = `not matched`;
    } else if (curdate < datadate) {
      let y = `not matched`;
    } else {
      if (data.status) {
        html += `<div class="eventcontainer eventcontainer finupd">
        <div class="event decor">
          <p class="sno">${i + 1}</p>
          <p class="task">${data.task}</p>
        </div>

        <div class="showdate decor">
          <p class="dateshow_1">Task Date : ${data.date}</p>
        </div>

        <div class="btnsupdate">
          <button class="updatebtn finished" onclick="finishfunc(${
            data.id
          })">Incomplete</button>
          <button class="updatebtn update hidden" onclick="edittask(${
            data.id
          })">Update</button>
          <button class="updatebtn delete delete${i}" onclick="deletetask(${
          data.id
        })">Delete</button>
        </div>
      </div>`;
      } else {
        html += `<div class="eventcontainer eventcontainer">
        <div class="event">
          <p class="sno">${i + 1}</p>
          <p class="task">${data.task}</p>
        </div>

        <div class="showdate">
          <p class="dateshow_1">Task Date : ${data.date}</p>
        </div>

        <div class="btnsupdate">
          <button class="updatebtn finished" onclick="finishfunc(${
            data.id
          })">Complete</button>
          <button class="updatebtn update" onclick="edittask(${
            data.id
          })">Update</button>
          <button class="updatebtn delete delete${i}" onclick="deletetask(${
          data.id
        })">Delete</button>
        </div>
      </div>`;
      }
    }
  });

  maincontainer.innerHTML = html;

  if (!maincontainer.innerHTML) {
    errortext.innerHTML = `No Tasks Today`;
  }
});

// Upcoming Tasks

const upcomingbtn = document.querySelector(`.taskupcoming`);

upcomingbtn.addEventListener(`click`, async function () {
  let res = await fetch(url);
  let data = await res.json();
  let html = "";
  errortext.innerHTML = ` `;

  let today = new Date();
  let day = `${today.getDate()}`;
  let day01 = day.padStart(`2`, 0);
  let month = `${today.getMonth() + 1}`;
  let month01 = month.padStart(`2`, 0);
  let year = today.getFullYear();

  let curdate = new Date(`${year}-${month01}-${day01}`);

  await data?.forEach(function (data, i) {
    let datadate = new Date(data.date);
    if (curdate < datadate) {
      if (data.status) {
        html += `<div class="eventcontainer eventcontainer finupd anmi${i}">
        <div class="event decor">
          <p class="sno">${i + 1}</p>
          <p class="task">${data.task}</p>
        </div>

        <div class="showdate decor">
          <p class="dateshow_1">Task Date : ${data.date}</p>
        </div>

        <div class="btnsupdate">
          <button class="updatebtn finished" onclick="finishfunc(${
            data.id
          })">Incomplete</button>
          <button class="updatebtn update hidden" onclick="edittask(${
            data.id
          })">Update</button>
          <button class="updatebtn delete delete${i}" onclick="deletetask(${
          data.id
        }); delanmi(${i})">Delete</button>
        </div>
      </div>`;
      } else {
        html += `<div class="eventcontainer eventcontainer anmi${i}">
        <div class="event">
          <p class="sno">${i + 1}</p>
          <p class="task">${data.task}</p>
        </div>

        <div class="showdate">
          <p class="dateshow_1">Task Date : ${data.date}</p>
        </div>

        <div class="btnsupdate">
          <button class="updatebtn finished" onclick="finishfunc(${
            data.id
          })">Complete</button>
          <button class="updatebtn update" onclick="edittask(${
            data.id
          })">Update</button>
          <button class="updatebtn delete delete${i}" onclick="deletetask(${
          data.id
        }); delanmi(${i})">Delete</button>
        </div>
      </div>`;
      }
    }
  });

  maincontainer.innerHTML = html;

  if (!maincontainer.innerHTML) {
    errortext.innerHTML = `No Upcoming Tasks Found`;
  }
});

// light and Dark Mode

const themebtn = document.querySelector(`.theme`);

const body = document.querySelector(`body`);
const todo = document.querySelector(`.todo`);
const datetime = document.querySelector(`.datetime`);
const mainlogo = document.querySelector(`.svgicon`);
const flb = document.querySelector(`.loginname`);

function Darkmode() {
  body.style.background = `linear-gradient(to right,rgba(0, 0, 0, 0.900), rgba(0, 0, 0, 0.907)), url("KQ1BHw.jpg")`;
  todo.style.color = `white`;
  datetime.style.color = `white`;
  mainlogo.innerHTML = `<svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              version="1.1"
              id="Layer_1"
              x="0px"
              y="0px"
              viewBox="0 0 122.88 99.56"
              style="enable-background: new 0 0 122.88 99.56"
              xml:space="preserve"
            >
              <style type="text/css">
                .st0 {
                  fill: #ffffff;
                }
                .st1 {
                  fill-rule: evenodd;
                  clip-rule: evenodd;
                  fill: #38ae48;
                }
              </style>
              <g>
                <path
                  class="st0"
                  d="M73.1,0c6.73,0,13.16,1.34,19.03,3.78c6.09,2.52,11.57,6.22,16.16,10.81c4.59,4.58,8.28,10.06,10.81,16.17 c2.43,5.87,3.78,12.3,3.78,19.03c0,6.73-1.34,13.16-3.78,19.03c-2.52,6.09-6.22,11.58-10.81,16.16 c-4.58,4.59-10.06,8.28-16.17,10.81c-5.87,2.43-12.3,3.78-19.03,3.78c-6.73,0-13.16-1.34-19.03-3.77 c-6.09-2.52-11.57-6.22-16.16-10.81l-0.01-0.01c-4.59-4.59-8.29-10.07-10.81-16.16c-0.78-1.89-1.45-3.83-2-5.82 c1.04,0.1,2.1,0.15,3.17,0.15c2.03,0,4.01-0.18,5.94-0.53c0.32,0.96,0.67,1.91,1.05,2.84c2.07,5,5.11,9.51,8.9,13.29 c3.78,3.78,8.29,6.82,13.29,8.9c4.81,1.99,10.11,3.1,15.66,3.1c5.56,0,10.85-1.1,15.66-3.1c5-2.07,9.51-5.11,13.29-8.9 c3.78-3.78,6.82-8.29,8.9-13.29c1.99-4.81,3.1-10.11,3.1-15.66c0-5.56-1.1-10.85-3.1-15.66c-2.07-5-5.11-9.51-8.9-13.29 c-3.78-3.78-8.29-6.82-13.29-8.9c-4.81-1.99-10.11-3.1-15.66-3.1c-5.56,0-10.85,1.1-15.66,3.1c-0.43,0.18-0.86,0.37-1.28,0.56 c-1.64-2.58-3.62-4.92-5.89-6.95c1.24-0.64,2.51-1.23,3.8-1.77C59.94,1.34,66.37,0,73.1,0L73.1,0z M67.38,26.12 c0-1.22,0.5-2.33,1.3-3.13c0.8-0.8,1.9-1.3,3.12-1.3c1.22,0,2.33,0.5,3.13,1.3c0.8,0.8,1.3,1.91,1.3,3.13v23.22l17.35,10.29 c1.04,0.62,1.74,1.6,2.03,2.7c0.28,1.09,0.15,2.29-0.47,3.34c-0.62,1.04-1.6,1.74-2.7,2.03c-1.09,0.28-2.29,0.15-3.33-0.47 L69.65,55.71c-0.67-0.37-1.22-0.91-1.62-1.55c-0.41-0.67-0.65-1.46-0.65-2.3V26.12L67.38,26.12z"
                />
                <path
                  class="st1"
                  d="M26.99,2.56c14.91,0,26.99,12.08,26.99,26.99c0,14.91-12.08,26.99-26.99,26.99C12.08,56.54,0,44.45,0,29.55 C0,14.64,12.08,2.56,26.99,2.56L26.99,2.56z M15.05,30.27c0.36-2.1,2.76-3.27,4.65-2.13c0.17,0.1,0.34,0.22,0.49,0.36l0.02,0.01 c0.85,0.81,1.8,1.66,2.74,2.5l0.81,0.73l9.59-10.06c0.57-0.6,0.99-0.99,1.85-1.18c2.94-0.65,5.01,2.95,2.93,5.15L26.17,38.19 c-1.13,1.2-3.14,1.31-4.35,0.16c-0.69-0.64-1.45-1.3-2.21-1.96c-1.32-1.15-2.67-2.32-3.77-3.48 C15.18,32.25,14.89,31.17,15.05,30.27L15.05,30.27z"
                />
              </g>
            </svg>`;

  flb.innerHTML = `<svg
              width="314"
              height="49"
              viewBox="0 0 314 49"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.6236 17.4662C22.4093 18.0089 22.0877 18.4431 21.659 18.7687C21.1232 19.0943 20.4802 19.3114 19.8371 19.5285C19.0869 19.6371 18.1224 19.7456 16.9435 19.7456H6.54778V23.219H13.9427V27.018H6.54778V29.9487C6.54778 31.6854 6.01192 32.8794 4.94019 33.5306C4.40433 33.8563 3.86847 34.0734 3.11827 34.1819C2.47524 34.2904 1.72503 34.2904 0.974826 34.2904H0.438965V19.6371C0.438965 18.6602 0.653309 17.9004 0.974826 17.3576C1.40351 16.8149 1.8322 16.4893 2.36806 16.1637C2.90392 15.838 3.54696 15.7295 4.18999 15.7295C4.83302 15.7295 5.47606 15.7295 6.01192 15.7295H22.9451C22.8379 16.2722 22.8379 16.8149 22.6236 17.4662Z"
                fill="#ffffff"
              />
              <path
                d="M32.2705 34.2905C31.5203 34.2905 30.8772 34.182 30.127 33.9649C29.484 33.7478 28.9481 33.5307 28.4123 33.2051C27.8764 32.8795 27.5549 32.4453 27.2334 32.0111C26.9119 31.577 26.8047 31.0342 26.8047 30.383V15.8381H32.9135V34.3991H32.2705V34.2905Z"
                fill="#ffffff"
              />
              <path
                d="M60.7756 33.4221C59.7039 34.0734 58.3107 34.399 56.4888 34.399H43.5209C42.7707 34.399 42.0205 34.2905 41.3775 34.1819C40.6273 33.9648 40.0914 33.7477 39.5556 33.4221C39.0197 33.0965 38.591 32.6623 38.2695 32.2281C37.948 31.7939 37.7336 31.2512 37.7336 30.6H56.3816V27.018H43.3066C42.5564 27.018 41.9134 26.9095 41.2703 26.8009C40.6273 26.5839 39.9843 26.3668 39.4484 26.0411C38.9125 25.7155 38.4838 25.2813 38.1623 24.8472C37.8408 24.413 37.7336 23.7617 37.7336 23.1105V19.9627C37.7336 19.2029 37.8408 18.5516 38.1623 18.0089C38.4838 17.4662 38.9125 17.032 39.4484 16.7064C39.9843 16.3808 40.5201 16.0551 41.2703 15.9466C41.9134 15.7295 42.6636 15.7295 43.4138 15.7295H56.7031C58.4178 15.7295 59.8111 16.0551 60.8828 16.5978C61.9545 17.2491 62.4904 18.226 62.4904 19.6371H44.0568V23.1105H56.5959C57.3461 23.1105 58.0963 23.219 58.7394 23.3275C59.4896 23.4361 60.0254 23.6532 60.5613 23.9788C61.0971 24.3044 61.5258 24.6301 61.8474 25.1728C62.1689 25.607 62.3832 26.2582 62.3832 26.8009V30.4914C62.3832 31.7939 61.8474 32.7708 60.7756 33.4221Z"
                fill="#ffffff"
              />
              <path
                d="M90.3572 33.4221C89.2855 34.0734 87.8922 34.399 86.0703 34.399H73.1025C72.3523 34.399 71.6021 34.2905 70.959 34.1819C70.2088 33.9648 69.673 33.7477 69.1371 33.4221C68.6012 33.0965 68.1726 32.6623 67.851 32.2281C67.5295 31.7939 67.3152 31.2512 67.3152 30.6H85.9631V27.018H72.781C72.0308 27.018 71.3877 26.9095 70.7447 26.8009C70.1017 26.5839 69.4586 26.3668 68.9228 26.0411C68.3869 25.7155 67.9582 25.2813 67.6367 24.8472C67.3152 24.413 67.208 23.7617 67.208 23.1105V19.9627C67.208 19.2029 67.3152 18.5516 67.6367 18.0089C67.9582 17.4662 68.3869 17.032 68.9228 16.7064C69.4586 16.3808 69.9945 16.0551 70.7447 15.9466C71.3877 15.7295 72.1379 15.7295 72.8881 15.7295H86.1775C87.8922 15.7295 89.2855 16.0551 90.3572 16.5978C91.4289 17.2491 91.9648 18.226 91.9648 19.6371H73.5312V23.1105H86.0703C86.8205 23.1105 87.5707 23.219 88.2138 23.3275C88.964 23.4361 89.4998 23.6532 90.0357 23.9788C90.5715 24.3044 91.0002 24.6301 91.3218 25.1728C91.6433 25.607 91.8576 26.2582 91.8576 26.8009V30.4914C91.9648 31.7939 91.4289 32.7708 90.3572 33.4221Z"
                fill="#ffffff"
              />
              <path
                d="M102.252 34.2905C101.502 34.2905 100.859 34.182 100.108 33.9649C99.4654 33.7478 98.9296 33.5307 98.3937 33.2051C97.8579 32.8795 97.5363 32.4453 97.2148 32.0111C96.8933 31.577 96.7861 31.0342 96.7861 30.383V15.8381H102.895V34.3991H102.252V34.2905Z"
                fill="#ffffff"
              />
              <path
                d="M132.369 30.6002C132.369 31.2514 132.262 31.7941 131.94 32.2283C131.619 32.6625 131.297 33.0967 130.761 33.4223C130.226 33.7479 129.69 33.965 129.047 34.0736C128.404 34.1821 127.653 34.2906 126.903 34.2906H113.4C112.649 34.2906 111.899 34.1821 111.256 33.965C110.613 33.7479 109.97 33.5308 109.541 33.2052C109.006 32.8796 108.684 32.4454 108.363 32.0112C108.041 31.5771 107.934 31.0343 107.934 30.4916V19.6373C107.934 19.0945 108.041 18.5518 108.363 18.1176C108.684 17.6835 109.006 17.2493 109.541 16.9237C110.077 16.598 110.613 16.381 111.256 16.1639C111.899 15.9468 112.649 15.9468 113.4 15.9468H126.903C128.511 15.9468 129.904 16.2724 130.869 16.9237C131.94 17.5749 132.369 18.5518 132.369 19.7458V30.6002ZM126.26 19.6373H113.935V30.4916H126.26V19.6373Z"
                fill="#ffffff"
              />
              <path
                d="M158.088 34.182C157.766 34.182 157.338 34.182 156.909 34.182C156.48 34.182 155.945 34.0734 155.409 33.9649C154.873 33.8564 154.337 33.6393 153.801 33.4222C153.265 33.2051 152.729 32.7709 152.301 32.3368L145.763 26.1498L143.298 23.8704V34.2905H137.189V15.8381H138.476C138.797 15.8381 139.226 15.8381 139.654 15.8381C140.19 15.8381 140.619 15.9467 141.155 16.1638C141.691 16.2723 142.227 16.4894 142.762 16.7065C143.298 16.9236 143.834 17.3577 144.263 17.7919L150.693 23.9789C150.693 23.9789 150.907 24.0874 151.122 24.3045C151.336 24.5216 151.658 24.8472 152.086 25.1729C152.515 25.4985 152.837 25.8241 153.158 26.1498V19.5286C153.158 18.2261 153.694 17.2492 154.766 16.7065C155.837 16.1638 157.123 15.8381 158.838 15.8381H159.374V34.2905H158.088V34.182Z"
                fill="#ffffff"
              />
              <path
                d="M226.895 32.2282C226.573 32.7709 226.145 33.0966 225.716 33.4222C225.18 33.7478 224.644 33.9649 224.001 34.0734C223.358 34.182 222.608 34.2905 221.858 34.2905H214.356C213.605 34.2905 212.855 34.182 212.212 34.0734C211.569 33.8564 210.926 33.6393 210.39 33.3136C209.854 32.988 209.426 32.5538 209.211 32.1197C208.89 31.6855 208.783 31.0342 208.783 30.383V15.8381H209.319C211.033 15.8381 212.319 16.1638 213.391 16.815C214.356 17.4663 214.892 18.4432 214.892 19.7457V30.6001H227.645C227.324 31.1428 227.216 31.794 226.895 32.2282Z"
                fill="#ffffff"
              />
              <path
                d="M248.756 34.2905V27.018H236.431V29.9487C236.431 30.8171 236.324 31.5769 236.002 32.011C235.681 32.5538 235.359 32.8794 234.716 33.3136C234.18 33.6392 233.537 33.8563 232.894 34.0734C232.144 34.2905 231.394 34.399 230.644 34.399H230.215V19.8541C230.215 19.0943 230.322 18.5516 230.644 18.0089C230.965 17.4662 231.394 17.032 231.822 16.7064C232.358 16.3808 232.894 16.1637 233.644 15.9466C234.287 15.7295 235.038 15.7295 235.788 15.7295H254.864V34.2905H248.756ZM248.756 19.6371H236.431V23.1105H248.756V19.6371Z"
                fill="#ffffff"
              />
              <path
                d="M284.338 29.6232C284.338 30.4915 284.124 31.2513 283.802 31.9026C283.481 32.5538 283.052 32.988 282.409 33.3136C281.873 33.6393 281.23 33.8564 280.48 34.0734C279.73 34.182 278.98 34.2905 278.122 34.2905H259.796V15.8381H278.23C280.159 15.8381 281.659 16.1638 282.731 16.815C283.802 17.4663 284.338 18.2261 284.338 19.203V19.7457C284.338 20.2884 284.231 20.7226 283.91 21.2653C283.588 21.808 283.159 22.2422 282.624 22.5678C281.873 23.002 280.909 23.2191 279.837 23.3276C280.373 23.4362 280.909 23.5447 281.338 23.6533C281.873 23.7618 282.302 23.9789 282.624 24.3045C283.159 24.6302 283.588 24.9558 283.91 25.4985C284.231 25.9327 284.338 26.4754 284.338 27.0181V29.6232ZM278.23 19.6372H265.905V23.1106H278.23V19.6372ZM265.905 27.0181V30.4915H278.23V27.0181H265.905Z"
                fill="#ffffff"
              />
              <path
                d="M312.31 33.4221C311.238 34.0734 309.845 34.399 308.023 34.399H295.055C294.305 34.399 293.555 34.2905 292.912 34.1819C292.269 34.0734 291.626 33.7477 291.09 33.4221C290.554 33.0965 290.125 32.6623 289.804 32.2281C289.482 31.7939 289.268 31.2512 289.268 30.6H307.809V27.018H294.734C293.983 27.018 293.34 26.9095 292.697 26.8009C292.054 26.5839 291.411 26.3668 290.875 26.0411C290.34 25.7155 289.911 25.2813 289.589 24.8472C289.268 24.413 289.161 23.7617 289.161 23.1105V19.9627C289.161 19.2029 289.268 18.5516 289.589 18.0089C289.911 17.4662 290.34 17.032 290.875 16.7064C291.411 16.3808 291.947 16.0551 292.697 15.9466C293.34 15.7295 294.091 15.7295 294.841 15.7295H308.13C309.845 15.7295 311.238 16.0551 312.31 16.5978C313.381 17.2491 313.917 18.226 313.917 19.6371H295.484V23.1105H308.023C308.773 23.1105 309.523 23.219 310.166 23.3275C310.917 23.4361 311.452 23.6532 311.988 23.9788C312.524 24.3044 312.953 24.6301 313.274 25.1728C313.596 25.607 313.81 26.2582 313.81 26.8009V30.4914C313.917 31.7939 313.381 32.7708 312.31 33.4221Z"
                fill="#ffffff"
              />
              <path
                d="M204.278 15.5126C205.136 14.8614 205.671 13.7759 205.671 12.5819C205.671 10.5196 203.957 8.78291 201.92 8.78291C200.956 8.78291 200.098 9.21709 199.455 9.75981C198.92 9.65126 198.384 9.65126 197.741 9.65126C196.026 9.65126 194.097 9.97689 191.953 10.5196C190.346 4.65826 187.666 0.967773 184.451 0.967773C181.236 0.967773 178.557 4.65826 176.949 10.5196C174.806 9.97689 172.877 9.65126 171.162 9.65126C167.411 9.65126 165.803 11.0623 165.053 12.2563C164.41 13.3417 164.303 14.6443 164.732 16.1639C164.089 16.8151 163.767 17.6835 163.767 18.6604C163.767 20.7227 165.482 22.4594 167.518 22.4594C167.84 22.4594 168.161 22.4594 168.375 22.3509C168.697 22.785 169.126 23.1107 169.447 23.5448C165.268 27.8866 163.446 32.1198 165.053 34.9419C165.696 36.1359 167.304 37.547 171.162 37.547C172.877 37.547 174.806 37.2213 176.949 36.6786C177.914 40.2606 179.307 43.0827 181.022 44.7108C181.129 46.6646 182.737 48.1842 184.773 48.1842C186.809 48.1842 188.524 46.4475 188.524 44.3852C188.524 44.2767 188.524 44.1681 188.524 44.0596C189.917 42.4314 191.096 39.8264 192.061 36.6786C194.204 37.2213 196.133 37.547 197.848 37.547C201.599 37.547 203.206 36.1359 203.957 34.9419C205.564 32.1198 203.742 27.9951 199.563 23.6534C202.242 20.7227 203.957 17.9006 204.278 15.5126ZM190.989 16.9237C190.346 16.4895 189.703 16.0553 188.953 15.7297C188.31 15.2955 187.559 14.9699 186.916 14.6443C188.095 14.1015 189.274 13.6674 190.346 13.3417C190.667 14.3186 190.882 15.6212 190.989 16.9237ZM193.454 21.2654C194.526 22.0252 195.383 22.8936 196.24 23.6534C195.383 24.4132 194.418 25.2815 193.454 26.0413C193.454 25.2815 193.454 24.5217 193.454 23.6534C193.561 22.785 193.561 22.0252 193.454 21.2654ZM191.418 23.6534C191.418 25.0645 191.418 26.367 191.31 27.6695C190.239 28.4293 189.167 29.0806 187.988 29.8404C186.809 30.4916 185.63 31.1429 184.559 31.6856C183.38 31.1429 182.201 30.4916 181.129 29.8404C179.95 29.1891 178.878 28.4293 177.807 27.778C177.699 26.4755 177.699 25.173 177.699 23.7619C177.699 22.3509 177.699 21.0483 177.807 19.7458C178.878 18.986 179.95 18.3347 181.129 17.5749C182.308 16.9237 183.487 16.2724 184.559 15.7297C185.737 16.2724 186.916 16.9237 187.988 17.5749C189.167 18.2262 190.239 18.986 191.31 19.7458C191.31 20.9398 191.418 22.2423 191.418 23.6534ZM190.346 34.0736C189.274 33.7479 188.095 33.3138 186.916 32.771C187.559 32.4454 188.31 32.0112 188.953 31.6856C189.596 31.2514 190.346 30.9258 190.989 30.4916C190.882 31.6856 190.667 32.8796 190.346 34.0736ZM177.914 30.3831C178.557 30.8173 179.2 31.2514 179.95 31.5771C180.593 32.0112 181.343 32.3369 181.986 32.6625C180.807 33.2052 179.629 33.6394 178.557 33.965C178.235 32.8796 178.021 31.6856 177.914 30.3831ZM175.449 25.9328C174.484 25.173 173.52 24.4132 172.662 23.5448C173.52 22.785 174.484 21.9167 175.449 21.1569C175.449 21.9167 175.449 22.6765 175.449 23.5448C175.342 24.4132 175.342 25.173 175.449 25.9328ZM178.557 13.2332C179.629 13.5588 180.807 13.993 181.986 14.5357C181.343 14.8614 180.593 15.2955 179.95 15.6212C179.307 16.0553 178.557 16.381 177.914 16.8151C178.021 15.6212 178.235 14.3186 178.557 13.2332ZM184.451 3.13865C186.38 3.13865 188.524 6.17787 189.917 11.1709C188.202 11.7136 186.38 12.4734 184.451 13.3417C182.629 12.4734 180.807 11.7136 178.986 11.1709C180.379 6.17787 182.522 3.13865 184.451 3.13865ZM167.518 14.9699C167.197 14.9699 166.982 14.9699 166.661 15.0784C166.554 14.4272 166.661 13.7759 166.875 13.3417C167.411 12.3649 168.911 11.8221 171.162 11.8221C172.662 11.8221 174.484 12.1478 176.413 12.5819C175.985 14.4272 175.77 16.381 175.556 18.4433C173.841 19.6373 172.341 20.8313 170.948 22.1338C170.733 21.8081 170.412 21.5911 170.197 21.2654C170.84 20.6142 171.162 19.7458 171.162 18.7689C171.269 16.7066 169.554 14.9699 167.518 14.9699ZM171.162 35.3761C169.019 35.3761 167.518 34.8334 166.875 33.8565C165.911 32.1198 167.411 28.7549 170.948 25.0645C172.341 26.367 173.841 27.561 175.449 28.7549C175.663 30.8173 175.878 32.771 176.306 34.6163C174.484 35.159 172.77 35.3761 171.162 35.3761ZM187.452 41.8887C186.809 41.1289 185.845 40.6947 184.773 40.6947C183.487 40.6947 182.415 41.346 181.772 42.3229C180.807 40.9118 179.843 38.8495 179.093 36.2444C180.807 35.7017 182.629 34.9419 184.559 34.0736C186.38 34.9419 188.202 35.7017 190.024 36.2444C189.167 38.5239 188.417 40.4776 187.452 41.8887ZM202.028 33.8565C201.492 34.8334 199.991 35.3761 197.741 35.3761C196.24 35.3761 194.418 35.0505 192.489 34.6163C192.918 32.771 193.132 30.8173 193.347 28.7549C195.061 27.561 196.562 26.367 197.955 25.0645C201.385 28.8635 202.992 32.1198 202.028 33.8565ZM193.347 18.4433C193.132 16.381 192.918 14.4272 192.489 12.5819C194.418 12.0392 196.24 11.8221 197.741 11.8221C197.955 11.8221 198.169 11.8221 198.277 11.8221C198.277 12.0392 198.169 12.2563 198.169 12.5819C198.169 14.6443 199.777 16.2724 201.813 16.381C201.17 18.0091 199.777 20.0714 197.741 22.1338C196.562 20.8313 194.954 19.6373 193.347 18.4433Z"
                fill="#ffffff"
              />
              <circle cx="167.416" cy="18.3706" r="2.24706" fill="#F26531" />
              <circle cx="184.721" cy="44.0422" r="2.24706" fill="#F26531" />
              <circle cx="201.942" cy="12.1665" r="2.24706" fill="#F26531" />
            </svg>`;

  themebtn.innerHTML = `Light Mode`;
}

function lightmode() {
  body.style.background = `linear-gradient(to right, rgba(212, 212, 212, 0.594), rgba(212, 212, 212, 0.594)), url("white.jpg")`;
  todo.style.color = `black`;
  datetime.style.color = `black`;
  mainlogo.innerHTML = `<svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              version="1.1"
              id="Layer_1"
              x="0px"
              y="0px"
              viewBox="0 0 122.88 99.56"
              style="enable-background: new 0 0 122.88 99.56"
              xml:space="preserve"
            >
              <style type="text/css">
                .st0 {
                  fill: #120F1A;
                }
                .st1 {
                  fill-rule: evenodd;
                  clip-rule: evenodd;
                  fill: #38ae48;
                }
              </style>
              <g>
                <path
                  class="st0"
                  d="M73.1,0c6.73,0,13.16,1.34,19.03,3.78c6.09,2.52,11.57,6.22,16.16,10.81c4.59,4.58,8.28,10.06,10.81,16.17 c2.43,5.87,3.78,12.3,3.78,19.03c0,6.73-1.34,13.16-3.78,19.03c-2.52,6.09-6.22,11.58-10.81,16.16 c-4.58,4.59-10.06,8.28-16.17,10.81c-5.87,2.43-12.3,3.78-19.03,3.78c-6.73,0-13.16-1.34-19.03-3.77 c-6.09-2.52-11.57-6.22-16.16-10.81l-0.01-0.01c-4.59-4.59-8.29-10.07-10.81-16.16c-0.78-1.89-1.45-3.83-2-5.82 c1.04,0.1,2.1,0.15,3.17,0.15c2.03,0,4.01-0.18,5.94-0.53c0.32,0.96,0.67,1.91,1.05,2.84c2.07,5,5.11,9.51,8.9,13.29 c3.78,3.78,8.29,6.82,13.29,8.9c4.81,1.99,10.11,3.1,15.66,3.1c5.56,0,10.85-1.1,15.66-3.1c5-2.07,9.51-5.11,13.29-8.9 c3.78-3.78,6.82-8.29,8.9-13.29c1.99-4.81,3.1-10.11,3.1-15.66c0-5.56-1.1-10.85-3.1-15.66c-2.07-5-5.11-9.51-8.9-13.29 c-3.78-3.78-8.29-6.82-13.29-8.9c-4.81-1.99-10.11-3.1-15.66-3.1c-5.56,0-10.85,1.1-15.66,3.1c-0.43,0.18-0.86,0.37-1.28,0.56 c-1.64-2.58-3.62-4.92-5.89-6.95c1.24-0.64,2.51-1.23,3.8-1.77C59.94,1.34,66.37,0,73.1,0L73.1,0z M67.38,26.12 c0-1.22,0.5-2.33,1.3-3.13c0.8-0.8,1.9-1.3,3.12-1.3c1.22,0,2.33,0.5,3.13,1.3c0.8,0.8,1.3,1.91,1.3,3.13v23.22l17.35,10.29 c1.04,0.62,1.74,1.6,2.03,2.7c0.28,1.09,0.15,2.29-0.47,3.34c-0.62,1.04-1.6,1.74-2.7,2.03c-1.09,0.28-2.29,0.15-3.33-0.47 L69.65,55.71c-0.67-0.37-1.22-0.91-1.62-1.55c-0.41-0.67-0.65-1.46-0.65-2.3V26.12L67.38,26.12z"
                />
                <path
                  class="st1"
                  d="M26.99,2.56c14.91,0,26.99,12.08,26.99,26.99c0,14.91-12.08,26.99-26.99,26.99C12.08,56.54,0,44.45,0,29.55 C0,14.64,12.08,2.56,26.99,2.56L26.99,2.56z M15.05,30.27c0.36-2.1,2.76-3.27,4.65-2.13c0.17,0.1,0.34,0.22,0.49,0.36l0.02,0.01 c0.85,0.81,1.8,1.66,2.74,2.5l0.81,0.73l9.59-10.06c0.57-0.6,0.99-0.99,1.85-1.18c2.94-0.65,5.01,2.95,2.93,5.15L26.17,38.19 c-1.13,1.2-3.14,1.31-4.35,0.16c-0.69-0.64-1.45-1.3-2.21-1.96c-1.32-1.15-2.67-2.32-3.77-3.48 C15.18,32.25,14.89,31.17,15.05,30.27L15.05,30.27z"
                />
              </g>
            </svg>`;

  flb.innerHTML = `<svg width="314" height="49" viewBox="0 0 314 49" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M22.6236 17.4662C22.4093 18.0089 22.0877 18.4431 21.659 18.7687C21.1232 19.0943 20.4802 19.3114 19.8371 19.5285C19.0869 19.6371 18.1224 19.7456 16.9435 19.7456H6.54778V23.219H13.9427V27.018H6.54778V29.9487C6.54778 31.6854 6.01192 32.8794 4.94019 33.5306C4.40433 33.8563 3.86847 34.0734 3.11827 34.1819C2.47524 34.2904 1.72503 34.2904 0.974826 34.2904H0.438965V19.6371C0.438965 18.6602 0.653309 17.9004 0.974826 17.3576C1.40351 16.8149 1.8322 16.4893 2.36806 16.1637C2.90392 15.838 3.54696 15.7295 4.18999 15.7295C4.83302 15.7295 5.47606 15.7295 6.01192 15.7295H22.9451C22.8379 16.2722 22.8379 16.8149 22.6236 17.4662Z" fill="#120F1A"/>
<path d="M32.2705 34.2905C31.5203 34.2905 30.8772 34.182 30.127 33.9649C29.484 33.7478 28.9481 33.5307 28.4123 33.2051C27.8764 32.8795 27.5549 32.4453 27.2334 32.0111C26.9119 31.577 26.8047 31.0342 26.8047 30.383V15.8381H32.9135V34.3991H32.2705V34.2905Z" fill="#120F1A"/>
<path d="M60.7756 33.4221C59.7039 34.0734 58.3107 34.399 56.4888 34.399H43.5209C42.7707 34.399 42.0205 34.2905 41.3775 34.1819C40.6273 33.9648 40.0914 33.7477 39.5556 33.4221C39.0197 33.0965 38.591 32.6623 38.2695 32.2281C37.948 31.7939 37.7336 31.2512 37.7336 30.6H56.3816V27.018H43.3066C42.5564 27.018 41.9134 26.9095 41.2703 26.8009C40.6273 26.5839 39.9843 26.3668 39.4484 26.0411C38.9125 25.7155 38.4838 25.2813 38.1623 24.8472C37.8408 24.413 37.7336 23.7617 37.7336 23.1105V19.9627C37.7336 19.2029 37.8408 18.5516 38.1623 18.0089C38.4838 17.4662 38.9125 17.032 39.4484 16.7064C39.9843 16.3808 40.5201 16.0551 41.2703 15.9466C41.9134 15.7295 42.6636 15.7295 43.4138 15.7295H56.7031C58.4178 15.7295 59.8111 16.0551 60.8828 16.5978C61.9545 17.2491 62.4904 18.226 62.4904 19.6371H44.0568V23.1105H56.5959C57.3461 23.1105 58.0963 23.219 58.7394 23.3275C59.4896 23.4361 60.0254 23.6532 60.5613 23.9788C61.0971 24.3044 61.5258 24.6301 61.8474 25.1728C62.1689 25.607 62.3832 26.2582 62.3832 26.8009V30.4914C62.3832 31.7939 61.8474 32.7708 60.7756 33.4221Z" fill="#120F1A"/>
<path d="M90.3572 33.4221C89.2855 34.0734 87.8922 34.399 86.0703 34.399H73.1025C72.3523 34.399 71.6021 34.2905 70.959 34.1819C70.2088 33.9648 69.673 33.7477 69.1371 33.4221C68.6012 33.0965 68.1726 32.6623 67.851 32.2281C67.5295 31.7939 67.3152 31.2512 67.3152 30.6H85.9631V27.018H72.781C72.0308 27.018 71.3877 26.9095 70.7447 26.8009C70.1017 26.5839 69.4586 26.3668 68.9228 26.0411C68.3869 25.7155 67.9582 25.2813 67.6367 24.8472C67.3152 24.413 67.208 23.7617 67.208 23.1105V19.9627C67.208 19.2029 67.3152 18.5516 67.6367 18.0089C67.9582 17.4662 68.3869 17.032 68.9228 16.7064C69.4586 16.3808 69.9945 16.0551 70.7447 15.9466C71.3877 15.7295 72.1379 15.7295 72.8881 15.7295H86.1775C87.8922 15.7295 89.2855 16.0551 90.3572 16.5978C91.4289 17.2491 91.9648 18.226 91.9648 19.6371H73.5312V23.1105H86.0703C86.8205 23.1105 87.5707 23.219 88.2138 23.3275C88.964 23.4361 89.4998 23.6532 90.0357 23.9788C90.5715 24.3044 91.0002 24.6301 91.3218 25.1728C91.6433 25.607 91.8576 26.2582 91.8576 26.8009V30.4914C91.9648 31.7939 91.4289 32.7708 90.3572 33.4221Z" fill="#120F1A"/>
<path d="M102.252 34.2905C101.502 34.2905 100.859 34.182 100.108 33.9649C99.4654 33.7478 98.9296 33.5307 98.3937 33.2051C97.8579 32.8795 97.5363 32.4453 97.2148 32.0111C96.8933 31.577 96.7861 31.0342 96.7861 30.383V15.8381H102.895V34.3991H102.252V34.2905Z" fill="#120F1A"/>
<path d="M132.369 30.6002C132.369 31.2514 132.262 31.7941 131.94 32.2283C131.619 32.6625 131.297 33.0967 130.761 33.4223C130.226 33.7479 129.69 33.965 129.047 34.0736C128.404 34.1821 127.653 34.2906 126.903 34.2906H113.4C112.649 34.2906 111.899 34.1821 111.256 33.965C110.613 33.7479 109.97 33.5308 109.541 33.2052C109.006 32.8796 108.684 32.4454 108.363 32.0112C108.041 31.5771 107.934 31.0343 107.934 30.4916V19.6373C107.934 19.0945 108.041 18.5518 108.363 18.1176C108.684 17.6835 109.006 17.2493 109.541 16.9237C110.077 16.598 110.613 16.381 111.256 16.1639C111.899 15.9468 112.649 15.9468 113.4 15.9468H126.903C128.511 15.9468 129.904 16.2724 130.869 16.9237C131.94 17.5749 132.369 18.5518 132.369 19.7458V30.6002ZM126.26 19.6373H113.935V30.4916H126.26V19.6373Z" fill="#120F1A"/>
<path d="M158.088 34.182C157.766 34.182 157.338 34.182 156.909 34.182C156.48 34.182 155.945 34.0734 155.409 33.9649C154.873 33.8564 154.337 33.6393 153.801 33.4222C153.265 33.2051 152.729 32.7709 152.301 32.3368L145.763 26.1498L143.298 23.8704V34.2905H137.189V15.8381H138.476C138.797 15.8381 139.226 15.8381 139.654 15.8381C140.19 15.8381 140.619 15.9467 141.155 16.1638C141.691 16.2723 142.227 16.4894 142.762 16.7065C143.298 16.9236 143.834 17.3577 144.263 17.7919L150.693 23.9789C150.693 23.9789 150.907 24.0874 151.122 24.3045C151.336 24.5216 151.658 24.8472 152.086 25.1729C152.515 25.4985 152.837 25.8241 153.158 26.1498V19.5286C153.158 18.2261 153.694 17.2492 154.766 16.7065C155.837 16.1638 157.123 15.8381 158.838 15.8381H159.374V34.2905H158.088V34.182Z" fill="#120F1A"/>
<path d="M226.895 32.2282C226.573 32.7709 226.145 33.0966 225.716 33.4222C225.18 33.7478 224.644 33.9649 224.001 34.0734C223.358 34.182 222.608 34.2905 221.858 34.2905H214.356C213.605 34.2905 212.855 34.182 212.212 34.0734C211.569 33.8564 210.926 33.6393 210.39 33.3136C209.854 32.988 209.426 32.5538 209.211 32.1197C208.89 31.6855 208.783 31.0342 208.783 30.383V15.8381H209.319C211.033 15.8381 212.319 16.1638 213.391 16.815C214.356 17.4663 214.892 18.4432 214.892 19.7457V30.6001H227.645C227.324 31.1428 227.216 31.794 226.895 32.2282Z" fill="#120F1A"/>
<path d="M248.756 34.2905V27.018H236.431V29.9487C236.431 30.8171 236.324 31.5769 236.002 32.011C235.681 32.5538 235.359 32.8794 234.716 33.3136C234.18 33.6392 233.537 33.8563 232.894 34.0734C232.144 34.2905 231.394 34.399 230.644 34.399H230.215V19.8541C230.215 19.0943 230.322 18.5516 230.644 18.0089C230.965 17.4662 231.394 17.032 231.822 16.7064C232.358 16.3808 232.894 16.1637 233.644 15.9466C234.287 15.7295 235.038 15.7295 235.788 15.7295H254.864V34.2905H248.756ZM248.756 19.6371H236.431V23.1105H248.756V19.6371Z" fill="#120F1A"/>
<path d="M284.338 29.6232C284.338 30.4915 284.124 31.2513 283.802 31.9026C283.481 32.5538 283.052 32.988 282.409 33.3136C281.873 33.6393 281.23 33.8564 280.48 34.0734C279.73 34.182 278.98 34.2905 278.122 34.2905H259.796V15.8381H278.23C280.159 15.8381 281.659 16.1638 282.731 16.815C283.802 17.4663 284.338 18.2261 284.338 19.203V19.7457C284.338 20.2884 284.231 20.7226 283.91 21.2653C283.588 21.808 283.159 22.2422 282.624 22.5678C281.873 23.002 280.909 23.2191 279.837 23.3276C280.373 23.4362 280.909 23.5447 281.338 23.6533C281.873 23.7618 282.302 23.9789 282.624 24.3045C283.159 24.6302 283.588 24.9558 283.91 25.4985C284.231 25.9327 284.338 26.4754 284.338 27.0181V29.6232ZM278.23 19.6372H265.905V23.1106H278.23V19.6372ZM265.905 27.0181V30.4915H278.23V27.0181H265.905Z" fill="#120F1A"/>
<path d="M312.31 33.4221C311.238 34.0734 309.845 34.399 308.023 34.399H295.055C294.305 34.399 293.555 34.2905 292.912 34.1819C292.269 34.0734 291.626 33.7477 291.09 33.4221C290.554 33.0965 290.125 32.6623 289.804 32.2281C289.482 31.7939 289.268 31.2512 289.268 30.6H307.809V27.018H294.734C293.983 27.018 293.34 26.9095 292.697 26.8009C292.054 26.5839 291.411 26.3668 290.875 26.0411C290.34 25.7155 289.911 25.2813 289.589 24.8472C289.268 24.413 289.161 23.7617 289.161 23.1105V19.9627C289.161 19.2029 289.268 18.5516 289.589 18.0089C289.911 17.4662 290.34 17.032 290.875 16.7064C291.411 16.3808 291.947 16.0551 292.697 15.9466C293.34 15.7295 294.091 15.7295 294.841 15.7295H308.13C309.845 15.7295 311.238 16.0551 312.31 16.5978C313.381 17.2491 313.917 18.226 313.917 19.6371H295.484V23.1105H308.023C308.773 23.1105 309.523 23.219 310.166 23.3275C310.917 23.4361 311.452 23.6532 311.988 23.9788C312.524 24.3044 312.953 24.6301 313.274 25.1728C313.596 25.607 313.81 26.2582 313.81 26.8009V30.4914C313.917 31.7939 313.381 32.7708 312.31 33.4221Z" fill="#120F1A"/>
<path d="M204.278 15.5126C205.136 14.8614 205.671 13.7759 205.671 12.5819C205.671 10.5196 203.957 8.78291 201.92 8.78291C200.956 8.78291 200.098 9.21709 199.455 9.75981C198.92 9.65126 198.384 9.65126 197.741 9.65126C196.026 9.65126 194.097 9.97689 191.953 10.5196C190.346 4.65826 187.666 0.967773 184.451 0.967773C181.236 0.967773 178.557 4.65826 176.949 10.5196C174.806 9.97689 172.877 9.65126 171.162 9.65126C167.411 9.65126 165.803 11.0623 165.053 12.2563C164.41 13.3417 164.303 14.6443 164.732 16.1639C164.089 16.8151 163.767 17.6835 163.767 18.6604C163.767 20.7227 165.482 22.4594 167.518 22.4594C167.84 22.4594 168.161 22.4594 168.375 22.3509C168.697 22.785 169.126 23.1107 169.447 23.5448C165.268 27.8866 163.446 32.1198 165.053 34.9419C165.696 36.1359 167.304 37.547 171.162 37.547C172.877 37.547 174.806 37.2213 176.949 36.6786C177.914 40.2606 179.307 43.0827 181.022 44.7108C181.129 46.6646 182.737 48.1842 184.773 48.1842C186.809 48.1842 188.524 46.4475 188.524 44.3852C188.524 44.2767 188.524 44.1681 188.524 44.0596C189.917 42.4314 191.096 39.8264 192.061 36.6786C194.204 37.2213 196.133 37.547 197.848 37.547C201.599 37.547 203.206 36.1359 203.957 34.9419C205.564 32.1198 203.742 27.9951 199.563 23.6534C202.242 20.7227 203.957 17.9006 204.278 15.5126ZM190.989 16.9237C190.346 16.4895 189.703 16.0553 188.953 15.7297C188.31 15.2955 187.559 14.9699 186.916 14.6443C188.095 14.1015 189.274 13.6674 190.346 13.3417C190.667 14.3186 190.882 15.6212 190.989 16.9237ZM193.454 21.2654C194.526 22.0252 195.383 22.8936 196.24 23.6534C195.383 24.4132 194.418 25.2815 193.454 26.0413C193.454 25.2815 193.454 24.5217 193.454 23.6534C193.561 22.785 193.561 22.0252 193.454 21.2654ZM191.418 23.6534C191.418 25.0645 191.418 26.367 191.31 27.6695C190.239 28.4293 189.167 29.0806 187.988 29.8404C186.809 30.4916 185.63 31.1429 184.559 31.6856C183.38 31.1429 182.201 30.4916 181.129 29.8404C179.95 29.1891 178.878 28.4293 177.807 27.778C177.699 26.4755 177.699 25.173 177.699 23.7619C177.699 22.3509 177.699 21.0483 177.807 19.7458C178.878 18.986 179.95 18.3347 181.129 17.5749C182.308 16.9237 183.487 16.2724 184.559 15.7297C185.737 16.2724 186.916 16.9237 187.988 17.5749C189.167 18.2262 190.239 18.986 191.31 19.7458C191.31 20.9398 191.418 22.2423 191.418 23.6534ZM190.346 34.0736C189.274 33.7479 188.095 33.3138 186.916 32.771C187.559 32.4454 188.31 32.0112 188.953 31.6856C189.596 31.2514 190.346 30.9258 190.989 30.4916C190.882 31.6856 190.667 32.8796 190.346 34.0736ZM177.914 30.3831C178.557 30.8173 179.2 31.2514 179.95 31.5771C180.593 32.0112 181.343 32.3369 181.986 32.6625C180.807 33.2052 179.629 33.6394 178.557 33.965C178.235 32.8796 178.021 31.6856 177.914 30.3831ZM175.449 25.9328C174.484 25.173 173.52 24.4132 172.662 23.5448C173.52 22.785 174.484 21.9167 175.449 21.1569C175.449 21.9167 175.449 22.6765 175.449 23.5448C175.342 24.4132 175.342 25.173 175.449 25.9328ZM178.557 13.2332C179.629 13.5588 180.807 13.993 181.986 14.5357C181.343 14.8614 180.593 15.2955 179.95 15.6212C179.307 16.0553 178.557 16.381 177.914 16.8151C178.021 15.6212 178.235 14.3186 178.557 13.2332ZM184.451 3.13865C186.38 3.13865 188.524 6.17787 189.917 11.1709C188.202 11.7136 186.38 12.4734 184.451 13.3417C182.629 12.4734 180.807 11.7136 178.986 11.1709C180.379 6.17787 182.522 3.13865 184.451 3.13865ZM167.518 14.9699C167.197 14.9699 166.982 14.9699 166.661 15.0784C166.554 14.4272 166.661 13.7759 166.875 13.3417C167.411 12.3649 168.911 11.8221 171.162 11.8221C172.662 11.8221 174.484 12.1478 176.413 12.5819C175.985 14.4272 175.77 16.381 175.556 18.4433C173.841 19.6373 172.341 20.8313 170.948 22.1338C170.733 21.8081 170.412 21.5911 170.197 21.2654C170.84 20.6142 171.162 19.7458 171.162 18.7689C171.269 16.7066 169.554 14.9699 167.518 14.9699ZM171.162 35.3761C169.019 35.3761 167.518 34.8334 166.875 33.8565C165.911 32.1198 167.411 28.7549 170.948 25.0645C172.341 26.367 173.841 27.561 175.449 28.7549C175.663 30.8173 175.878 32.771 176.306 34.6163C174.484 35.159 172.77 35.3761 171.162 35.3761ZM187.452 41.8887C186.809 41.1289 185.845 40.6947 184.773 40.6947C183.487 40.6947 182.415 41.346 181.772 42.3229C180.807 40.9118 179.843 38.8495 179.093 36.2444C180.807 35.7017 182.629 34.9419 184.559 34.0736C186.38 34.9419 188.202 35.7017 190.024 36.2444C189.167 38.5239 188.417 40.4776 187.452 41.8887ZM202.028 33.8565C201.492 34.8334 199.991 35.3761 197.741 35.3761C196.24 35.3761 194.418 35.0505 192.489 34.6163C192.918 32.771 193.132 30.8173 193.347 28.7549C195.061 27.561 196.562 26.367 197.955 25.0645C201.385 28.8635 202.992 32.1198 202.028 33.8565ZM193.347 18.4433C193.132 16.381 192.918 14.4272 192.489 12.5819C194.418 12.0392 196.24 11.8221 197.741 11.8221C197.955 11.8221 198.169 11.8221 198.277 11.8221C198.277 12.0392 198.169 12.2563 198.169 12.5819C198.169 14.6443 199.777 16.2724 201.813 16.381C201.17 18.0091 199.777 20.0714 197.741 22.1338C196.562 20.8313 194.954 19.6373 193.347 18.4433Z" fill="#120F1A"/>
<circle cx="167.416" cy="18.3706" r="2.24706" fill="#F26531"/>
<circle cx="184.721" cy="44.0422" r="2.24706" fill="#F26531"/>
<circle cx="201.942" cy="12.1665" r="2.24706" fill="#F26531"/>
</svg>`;

  themebtn.innerHTML = `Dark Mode`;
}

let theme = `Dark`;

function changemode() {
  if (theme == `Light`) {
    theme = `Dark`;
  } else if (theme == `Dark`) {
    theme = `Light`;
  }
}

themebtn.addEventListener(`click`, function () {
  if (theme == `Dark`) {
    lightmode();
  }

  if (theme == `Light`) {
    Darkmode();
  }

  changemode();
});
