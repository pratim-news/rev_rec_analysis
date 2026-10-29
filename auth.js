(function () {
  var USER = "nc";
  var PASS_SHA256 = "9453cae088686aa3d7f341d3265e2f574a76d9f1bd262fb255c21c0d5d1e2dca";
  var KEY = "revrec_auth";

  function unlock() {
    try { sessionStorage.setItem(KEY, "1"); } catch (e) {}
    document.documentElement.classList.remove("locked");
    var gate = document.getElementById("login-gate");
    if (gate) gate.remove();
  }

  function sha256(text) {
    var data = new TextEncoder().encode(text);
    return crypto.subtle.digest("SHA-256", data).then(function (buf) {
      return Array.from(new Uint8Array(buf)).map(function (b) {
        return b.toString(16).padStart(2, "0");
      }).join("");
    });
  }

  function showGate() {
    if (document.getElementById("login-gate")) return;
    var gate = document.createElement("div");
    gate.id = "login-gate";
    gate.innerHTML =
      '<form>' +
        '<h1>NCA earned revenue</h1>' +
        '<p>Sign in to open these pages.</p>' +
        '<label for="login-user">User</label>' +
        '<input id="login-user" name="user" autocomplete="username" required>' +
        '<label for="login-pass">Password</label>' +
        '<input id="login-pass" name="pass" type="password" autocomplete="current-password" required>' +
        '<p class="err" role="alert"></p>' +
        '<button type="submit">Continue</button>' +
      '</form>';
    document.body.appendChild(gate);
    var form = gate.querySelector("form");
    var err = gate.querySelector(".err");
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var user = form.user.value.trim();
      var pass = form.pass.value;
      sha256(pass).then(function (hash) {
        if (user === USER && hash === PASS_SHA256) unlock();
        else {
          err.textContent = "Those details were not recognised.";
          form.pass.value = "";
          form.pass.focus();
        }
      }).catch(function () {
        err.textContent = "Sign-in needs a secure browser page.";
      });
    });
    form.user.focus();
  }

  function start() {
    var ok = false;
    try { ok = sessionStorage.getItem(KEY) === "1"; } catch (e) {}
    if (ok) {
      document.documentElement.classList.remove("locked");
      return;
    }
    document.documentElement.classList.add("locked");
    showGate();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
