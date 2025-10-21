const BASE_URL = "http://localhost:4000";

const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const nickName = document.getElementById("nickName");
const studentId = document.getElementById("studentId");
const ticketId = document.getElementById("ticketId");

const consoleEl = document.getElementById("console");

async function buyTicket(count) {
  try {
    const { data: res } = await axios({
      method: "post",
      url: `${BASE_URL}/ticket/generate-ticket/a3a6f02e907a11eeb9d10242ac120002/ac30e150907a11eeb9d10242ac120002`,
      data: {
        firstName: firstName.value,
        lastName: lastName.value,
        studentId: studentId.value,
        nickName: nickName.value,
        ticketCount: count,
      },
    });

    const tickets = res.data.ticketIds.join(" - ");
    consoleEl.innerText = "Tickets:  " + tickets;
  } catch (err) {
    console.log(err);
  }
}

async function invalidateTicket() {
  try {
    const { data: res } = await axios({
      method: "put",
      url: `${BASE_URL}/ticket/invalidate-ticket/a3a6f02e907a11eeb9d10242ac120002/ac30e150907a11eeb9d10242ac120002`,
      data: {
        ticketId: ticketId.value,
      },
    });

    consoleEl.innerText = res.message;
  } catch (err) {
    console.log(err);
  }
}
