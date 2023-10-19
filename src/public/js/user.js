let userform = document.querySelector(".user_form");

const sendForm = async (e) => {
  e.preventDefault();
  let userinfo = Object.fromEntries(new FormData(userform));
  let response = await fetch(`/api/session/${e.target.id}`, {
    method: "POST",
    body: JSON.stringify(userinfo),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  });
  let message = await response.json();
  if (message?.success) {
    userform.reset();
    alert(message.success);
    setTimeout(() => window.location.href = "/products", 500);
  } else {
    alert(message.error);
  }
};

userform.addEventListener("submit", sendForm);
