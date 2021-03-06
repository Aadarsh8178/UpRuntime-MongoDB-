/*
 * Frontend Logic for application
 *
 */

// Container for frontend application
var app = {};

// Config
app.config = {
  sessionToken: false,
  sessionPhone: false,
};
app.checkListTimer = null;
// AJAX Client (for RESTful API)
app.client = {};

// Interface for making API calls
app.client.request = function (
  headers,
  path,
  method,
  queryStringObject,
  payload,
  callback
) {
  // Set defaults
  headers = typeof headers == "object" && headers !== null ? headers : {};
  path = typeof path == "string" ? path : "/";
  method =
    typeof method == "string" &&
    ["POST", "GET", "PUT", "DELETE"].indexOf(method.toUpperCase()) > -1
      ? method.toUpperCase()
      : "GET";
  queryStringObject =
    typeof queryStringObject == "object" && queryStringObject !== null
      ? queryStringObject
      : {};
  payload = typeof payload == "object" && payload !== null ? payload : {};
  callback = typeof callback == "function" ? callback : false;

  // For each query string parameter sent, add it to the path
  var requestUrl = path + "?";
  var counter = 0;
  for (var queryKey in queryStringObject) {
    if (queryStringObject.hasOwnProperty(queryKey)) {
      counter++;
      // If at least one query string parameter has already been added, preprend new ones with an ampersand
      if (counter > 1) {
        requestUrl += "&";
      }
      // Add the key and value
      requestUrl += queryKey + "=" + queryStringObject[queryKey];
    }
  }

  // Form the http request as a JSON type
  var xhr = new XMLHttpRequest();
  xhr.open(method, requestUrl, true);
  xhr.setRequestHeader("Content-type", "application/json");

  // For each header sent, add it to the request
  for (var headerKey in headers) {
    if (headers.hasOwnProperty(headerKey)) {
      xhr.setRequestHeader(headerKey, headers[headerKey]);
    }
  }

  // If there is a current session token set, add that as a header

  if (app.config.sessionToken) {
    xhr.setRequestHeader("token", app.config.sessionToken);
    xhr.setRequestHeader("phone", app.config.sessionPhone);
  }
  // When the request comes back, handle the response
  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      var statusCode = xhr.status;
      var responseReturned = xhr.responseText;

      // Callback if requested
      if (callback) {
        try {
          var parsedResponse = JSON.parse(responseReturned);
          callback(statusCode, parsedResponse);
        } catch (e) {
          callback(statusCode, false);
        }
      }
    }
  };

  // Send the payload as JSON
  var payloadString = JSON.stringify(payload);
  xhr.send(payloadString);
};

// Bind the logout button
app.bindLogoutButton = function () {
  document
    .getElementById("logoutButton")
    .addEventListener("click", function (e) {
      // Stop it from redirecting anywhere
      e.preventDefault();

      // Log the user out
      app.logUserOut();
    });
};

// Log the user out then redirect them
app.logUserOut = function (redirectUser) {
  // Set redirectUser to default to true
  redirectUser = typeof redirectUser == "boolean" ? redirectUser : true;

  // Get the current token id
  var tokenId =
    typeof app.config.sessionToken == "string"
      ? app.config.sessionToken
      : false;

  // Send the current token to the tokens endpoint to delete it
  var queryStringObject = {
    id: tokenId,
  };
  app.client.request(
    undefined,
    "api/tokens",
    "DELETE",
    queryStringObject,
    undefined,
    function (statusCode, responsePayload) {
      // Set the app.config token as false
      app.setSessionToken(false, false);
      // Send the user to the logged out page
      if (redirectUser) {
        window.location = "/session/deleted";
      }
    }
  );
};

// Bind the forms
app.bindForms = function () {
  if (document.querySelector("form")) {
    var allForms = document.querySelectorAll("form");
    for (var i = 0; i < allForms.length; i++) {
      allForms[i].addEventListener("submit", function (e) {
        // Stop it from submitting
        e.preventDefault();
        var formId = this.id;
        var path = this.action;
        var method = this.method.toUpperCase();
        // Hide the error message (if it's currently shown due to a previous error)
        document.querySelector("#" + formId + " .formError").style.display =
          "none";

        // Hide the success message (if it's currently shown due to a previous error)
        if (document.querySelector("#" + formId + " .formSuccess")) {
          document.querySelector("#" + formId + " .formSuccess").style.display =
            "none";
        }
        // Turn the inputs into a payload
        var payload = {};
        var elements = this.elements;
        for (var i = 0; i < elements.length; i++) {
          if (elements[i].type !== "submit") {
            // Determine class of element and set value accordingly
            var classOfElement =
              typeof elements[i].classList.value == "string" &&
              elements[i].classList.value.length > 0
                ? elements[i].classList.value
                : "";
            var valueOfElement =
              elements[i].type == "checkbox" &&
              classOfElement.indexOf("multiselect") == -1
                ? elements[i].checked
                : classOfElement.indexOf("intval") == -1
                ? elements[i].value
                : parseInt(elements[i].value);
            var elementIsChecked = elements[i].checked;
            // Override the method of the form if the input's name is _method
            var nameOfElement = elements[i].name;
            if (nameOfElement == "_method") {
              method = valueOfElement;
            } else {
              // Create an payload field named "method" if the elements name is actually httpmethod
              if (nameOfElement == "httpmethod") {
                nameOfElement = "method";
              }
              // Create an payload field named "id" if the elements name is actually uid
              if (nameOfElement == "uid") {
                nameOfElement = "id";
              }
              // If the element has the class "multiselect" add its value(s) as array elements
              if (classOfElement.indexOf("multiselect") > -1) {
                if (elementIsChecked) {
                  payload[nameOfElement] =
                    typeof payload[nameOfElement] == "object" &&
                    payload[nameOfElement] instanceof Array
                      ? payload[nameOfElement]
                      : [];
                  payload[nameOfElement].push(valueOfElement);
                }
              } else {
                payload[nameOfElement] = valueOfElement;
              }
            }
          }
        }

        // If the method is DELETE, the payload should be a queryStringObject instead
        var queryStringObject = method == "DELETE" ? payload : {};
        // Call the API
        app.client.request(
          undefined,
          path,
          method,
          queryStringObject,
          payload,
          function (statusCode, responsePayload) {
            // Display an error on the form if needed
            if (statusCode !== 200) {
              if (statusCode == 403) {
                // log the user out
                // app.logUserOut();
              } else {
                // Try to get the error from the api, or set a default error message
                var error =
                  typeof responsePayload.Error == "string"
                    ? responsePayload.Error
                    : "An error has occured, please try again";

                // Set the formError field with the error text
                document.querySelector(
                  "#" + formId + " .formError"
                ).innerHTML = error;

                // Show (unhide) the form error field on the form
                document.querySelector(
                  "#" + formId + " .formError"
                ).style.display = "block";
              }
            } else {
              // If successful, send to form response processor
              app.formResponseProcessor(formId, payload, responsePayload);
            }
          }
        );
      });
    }
  }
};

// Form response processor
app.formResponseProcessor = function (formId, requestPayload, responsePayload) {
  // If account creation was successful, try to immediately log the user in
  if (formId == "accountCreate") {
    // Take the phone and password, and use it to log the user in
    const newPayload = {
      phone: requestPayload.phone,
      password: requestPayload.password,
    };
    app.client.request(
      undefined,
      "api/tokens",
      "POST",
      undefined,
      newPayload,
      function (newStatusCode, newResponsePayload) {
        // Display an error on the form if needed
        if (newStatusCode !== 200) {
          // Set the formError field with the error text
          document.querySelector("#" + formId + " .formError").innerHTML =
            "Sorry, an error has occured. Please try again.";

          // Show (unhide) the form error field on the form
          document.querySelector("#" + formId + " .formError").style.display =
            "block";
        } else {
          // If successful, set the token and redirect the user
          app.setSessionToken(newResponsePayload.token, newPayload.phone);
          window.location = "/checks/all";
        }
      }
    );
  }
  // If login was successful, set the token in localstorage and redirect the user
  if (formId == "sessionCreate") {
    app.setSessionToken(responsePayload.token, requestPayload.phone);
    window.location = "/checks/all";
  }

  // If forms saved successfully and they have success messages, show them
  var formsWithSuccessMessages = [
    "accountEdit1",
    "accountEdit2",
    "checksEdit1",
  ];
  if (formsWithSuccessMessages.indexOf(formId) > -1) {
    document.querySelector("#" + formId + " .formSuccess").style.display =
      "block";
  }

  // If the user just deleted their account, redirect them to the account-delete page
  if (formId == "accountEdit3") {
    app.logUserOut(true);
    app.setSessionToken(false, false);
    window.location = "/account/deleted";
  }

  // If the user just created a new check successfully, redirect back to the dashboard
  if (formId == "checksCreate") {
    window.location = "/checks/all";
  }

  // If the user just deleted a check, redirect them to the dashboard
  if (formId == "checksEdit2") {
    window.location = "/checks/all";
  }
};

// Get the session token from localstorage and set it in the app.config object
app.getSessionToken = function () {
  var tokenString = localStorage.getItem("token");
  var phone = localStorage.getItem("phone");
  if (typeof tokenString == "string" && typeof phone === "string") {
    try {
      var token = JSON.parse(tokenString);
      var phone = JSON.parse(phone);
      app.config.sessionToken = token;
      app.config.sessionPhone = phone;
      if (typeof token === "string") {
        app.setLoggedInClass(true);
        // window.location = "/checks/all";
      } else {
        app.setLoggedInClass(false);
      }
    } catch (e) {
      app.config.sessionToken = false;
      app.config.sessionPhone = false;
      app.setLoggedInClass(false);
    }
  }
};

// Set (or remove) the loggedIn class from the body
app.setLoggedInClass = function (add) {
  var target = document.querySelector("body");
  if (add) {
    target.classList.add("loggedIn");
  } else {
    target.classList.remove("loggedIn");
  }
};

// Set the session token in the app.config object as well as localstorage
app.setSessionToken = function (token, phone) {
  app.config.sessionToken = token;
  app.config.sessionPhone = phone;
  var tokenString = JSON.stringify(token);
  var phone = JSON.stringify(phone);
  localStorage.setItem("token", tokenString);
  localStorage.setItem("phone", phone);

  if (typeof token === "string") {
    app.setLoggedInClass(true);
  } else {
    app.setLoggedInClass(false);
  }
};

// Renew the token
// app.renewToken = function (callback) {
//   var currentToken =
//     typeof app.config.sessionToken == "object"
//       ? app.config.sessionToken
//       : false;
//   if (currentToken) {
//     // Update the token with a new expiration
//     var payload = {
//       id: currentToken.id,
//       extend: true,
//     };
//     app.client.request(
//       undefined,
//       "api/tokens",
//       "PUT",
//       undefined,
//       payload,
//       function (statusCode, responsePayload) {
//         // Display an error on the form if needed
//         if (statusCode == 200) {
//           // Get the new token details
//           var queryStringObject = { id: currentToken.id };
//           app.client.request(
//             undefined,
//             "api/tokens",
//             "GET",
//             queryStringObject,
//             undefined,
//             function (statusCode, responsePayload) {
//               // Display an error on the form if needed
//               if (statusCode == 200) {
//                 app.setSessionToken(responsePayload);
//                 callback(false);
//               } else {
//                 app.setSessionToken(false);
//                 callback(true);
//               }
//             }
//           );
//         } else {
//           app.setSessionToken(false);
//           callback(true);
//         }
//       }
//     );
//   } else {
//     app.setSessionToken(false);
//     callback(true);
//   }
// };

// Load data on the page
app.loadDataOnPage = function () {
  // Get the current page from the body class
  var bodyClasses = document.querySelector("body").classList;
  var primaryClass = typeof bodyClasses[0] == "string" ? bodyClasses[0] : false;

  // Logic for account settings page
  if (primaryClass == "accountEdit") {
    app.loadAccountEditPage();
  }

  // Logic for dashboard page
  if (primaryClass == "checksList") {
    app.loadChecksListPage();
    if (app.checkListTimer) {
      clearInterval(app.checkListTimer);
    }
    app.checkListTimer = setInterval(() => app.loadChecksListPage(), 1000 * 5);
  }

  // Logic for check details page
  if (primaryClass == "checksEdit") {
    app.loadChecksEditPage();
  }
};

// Load the account edit page specifically
app.loadAccountEditPage = function () {
  // Get the phone number from the current token, or log the user out if none is there
  if (app.config.sessionPhone && app.config.sessionToken) {
    // Fetch the user data
    app.client.request(
      undefined,
      "api/users",
      "GET",
      undefined,
      undefined,
      function (statusCode, responsePayload) {
        if (statusCode == 200) {
          // Put the data into the forms as values where needed
          document.querySelector("#accountEdit1 .firstNameInput").value =
            responsePayload.firstName;
          document.querySelector("#accountEdit1 .lastNameInput").value =
            responsePayload.lastName;
          document.querySelector("#accountEdit1 .displayPhoneInput").value =
            responsePayload.phone;

          // Put the hidden phone field into both forms
          var hiddenPhoneInputs = document.querySelectorAll(
            "input.hiddenPhoneNumberInput"
          );
          for (var i = 0; i < hiddenPhoneInputs.length; i++) {
            hiddenPhoneInputs[i].value = responsePayload.phone;
          }
        } else {
          // If the request comes back as something other than 200, log the user our (on the assumption that the api is temporarily down or the users token is bad)
          app.logUserOut();
        }
      }
    );
  } else {
    app.logUserOut();
  }
};

// Load the dashboard page specifically
app.loadChecksListPage = function () {
  // Get the phone number from the current token, or log the user out if none is there
  var phone =
    typeof app.config.sessionPhone === "string"
      ? app.config.sessionPhone
      : false;
  var token =
    typeof app.config.sessionToken === "string"
      ? app.config.sessionToken
      : false;
  if (phone && token) {
    // Fetch the user data
    app.client.request(
      undefined,
      "api/checks/all",
      "GET",
      undefined,
      undefined,
      (statusCode, responsePayload) => {
        if (statusCode === 200 && responsePayload.length > 0) {
          const checks = responsePayload;
          var table = document.getElementById("checksListTable");
          var headers = `<tr>
            <th>Method</th>
            <th>Protocol</th>
            <th>URL</th>
            <th>State</th>
            <th>Details</th>
          </tr>`;
          var tableRows = "";
          checks.forEach((checkData) => {
            tableRows =
              tableRows +
              `<tr>
              <td>${checkData.method.toUpperCase()}</td>
              <td>${checkData.protocol + "://"}</td>
              <td>${checkData.url}</td>
              <td>${
                typeof checkData.state == "string" ? checkData.state : "unknown"
              }</td>
              <td><a href="/checks/edit?id=${
                checkData._id
              }">View / Edit / Delete</a></td>
            </tr>`;
          });
          table.innerHTML = headers + tableRows;
          if (checks.length < 5) {
            // Show the createCheck CTA
            document.getElementById("createCheckCTA").style.display = "block";
          }
        } else if (statusCode === 200) {
          // Show 'you have no checks' message
          document.getElementById("noChecksMessage").style.display =
            "table-row";

          // Show the createCheck CTA
          document.getElementById("createCheckCTA").style.display = "block";
        } else {
          console.log("error fetching check data");
        }
      }
    );
  } else {
    // If the request comes back as something other than 200, log the user our (on the assumption that the api is temporarily down or the users token is bad)
    app.logUserOut();
  }
};

// Load the checks edit page specifically
app.loadChecksEditPage = function () {
  // Get the check id from the query string, if none is found then redirect back to dashboard
  var id =
    typeof window.location.href.split("=")[1] == "string" &&
    window.location.href.split("=")[1].length > 0
      ? window.location.href.split("=")[1]
      : false;
  if (id) {
    // Fetch the check data
    var queryStringObject = {
      id: id,
    };
    app.client.request(
      undefined,
      "api/checks",
      "GET",
      queryStringObject,
      undefined,
      function (statusCode, responsePayload) {
        if (statusCode == 200) {
          // Put the hidden id field into both forms
          var hiddenIdInputs = document.querySelectorAll("input.hiddenIdInput");
          for (var i = 0; i < hiddenIdInputs.length; i++) {
            hiddenIdInputs[i].value = responsePayload._id;
          }
          // Put the data into the top form as values where needed

          document.querySelector("#checksEdit1 .displayIdInput").value =
            responsePayload._id;
          document.querySelector("#checksEdit1 .displayStateInput").value =
            responsePayload.state;
          document.querySelector("#checksEdit1 .protocolInput").value =
            responsePayload.protocol;
          document.querySelector("#checksEdit1 .urlInput").value =
            responsePayload.url;
          document.querySelector("#checksEdit1 .methodInput").value =
            responsePayload.method;
          document.querySelector("#checksEdit1 .timeoutInput").value =
            responsePayload.timeoutSeconds;
          var successCodeCheckboxes = document.querySelectorAll(
            "#checksEdit1 input.successCodesInput"
          );
          for (var i = 0; i < successCodeCheckboxes.length; i++) {
            if (
              responsePayload.successCodes.indexOf(
                parseInt(successCodeCheckboxes[i].value)
              ) > -1
            ) {
              successCodeCheckboxes[i].checked = true;
            }
          }
        } else {
          // If the request comes back as something other than 200, redirect back to dashboard
          window.location = "/checks/all";
        }
      }
    );
  } else {
    window.location = "/checks/all";
  }
};

// Loop to renew token often
// app.tokenRenewalLoop = function () {
//   setInterval(function () {
//     app.renewToken(function (err) {
//       if (!err) {
//         console.log("Token renewed successfully @ " + Date.now());
//       }
//     });
//   }, 1000 * 60);
// };

// Init (bootstrapping)
app.init = function () {
  // Bind all form submissions
  app.bindForms();

  // Bind logout logout button
  app.bindLogoutButton();

  // Get the token from localstorage
  app.getSessionToken();

  // Renew token
  // app.tokenRenewalLoop();

  // Load data on page
  app.loadDataOnPage();
};

// Call the init processes after the window loads
window.onload = function () {
  app.init();
  if (
    window.location.pathname === "/" &&
    app.config.sessionToken &&
    app.config.sessionPhone
  ) {
    window.location = "/checks/all";
  }
};
//Removing setInterval call on checkList
// window.onunload = function () {
//   if (app.checkListTimer) {
//     clearInterval(app.checkListTimer);
//   }
// };
