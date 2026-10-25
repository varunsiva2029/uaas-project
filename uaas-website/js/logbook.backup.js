/* UAAS Engineering Desk - Log Book add-on */
(function () {
  "use strict";

  var COLUMNS = [
    ["REC. DATE", "rec_date"],
    ["MONTH", "month"],
    ["CUSTOMER NAME", "customer_name"],
    ["MATERIAL DETAILS", "material_details"],
    ["MODEL NUMBER", "model_number"],
    ["SERIAL NUMBER", "serial_number"],
    ["QUOTATION NUMBER", "quotation_number"],
    ["INVOICE NUMBER", "invoice_number"],
    ["PAYMENT", "payment"],
    ["PAYMENT REC. AMOUNT", "payment_rec_amount"],
    ["PAYMENT REC. DATE", "payment_rec_date"]
  ];

  function node(tag, className, text) {
    var item = document.createElement(tag);
    if (className) item.className = className;
    if (text !== undefined && text !== null) item.textContent = text;
    return item;
  }

  function localDateValue() {
    var date = new Date();
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 10);
  }

  function staffApi(path, options) {
    options = options || {};

    if (!window.sb || !window.sb.auth) {
      return Promise.reject(new Error("Staff sign-in is unavailable. Reload the page and sign in again."));
    }

    return window.sb.auth.getSession().then(function (sessionResponse) {
      if (sessionResponse.error) throw sessionResponse.error;
      var session = sessionResponse.data && sessionResponse.data.session;
      if (!session || !session.access_token) {
        throw new Error("Your session has expired. Sign in to the Engineering Desk again.");
      }

      window.sbUser = session;
      var headers = Object.assign({}, options.headers || {}, {
        Authorization: "Bearer " + session.access_token
      });
      if (options.body) headers["Content-Type"] = "application/json";

      var apiBase = window.UAAS_API_BASE;
      if (!apiBase) throw new Error("The UAAS API address is not configured.");

      return fetch(apiBase + path, Object.assign({}, options, { headers: headers }));
    }).then(async function (response) {
      var raw = await response.text();
      var data = null;
      if (raw) {
        try {
          data = JSON.parse(raw);
        } catch (_) {
          data = { message: raw };
        }
      }
      if (!response.ok) {
        var serverMessage = data && (data.detail || data.message || data.title);
        if (response.status === 401 || response.status === 403) {
          throw new Error("Access denied. Confirm this signed-in account is listed in the uaas_staff table.");
        }
        throw new Error(serverMessage || ("Log Book request failed (HTTP " + response.status + ")."));
      }
      return data;
    });
  }

  function addField(parent, labelText, name, type, options) {
    options = options || {};
    var label = node("label", "logbook-field");
    label.appendChild(node("span", "", labelText));

    var control = type === "textarea" ? node("textarea", "") : node("input", "");
    if (type !== "textarea") control.type = type || "text";
    control.name = name;
    if (options.placeholder) control.placeholder = options.placeholder;
    if (options.required) control.required = true;
    if (options.min !== undefined) control.min = String(options.min);
    if (options.step !== undefined) control.step = String(options.step);
    if (options.rows) control.rows = options.rows;
    label.appendChild(control);
    parent.appendChild(label);
    return control;
  }

  window.renderUAASLogbook = function (container) {
    var shell = node("div", "logbook-shell");
    shell.appendChild(node("h2", "", "Engineering Log Book"));
    shell.appendChild(node("p", "logbook-intro", "Record equipment and materials received from customers. The month is generated automatically from the received date."));

    var entryCard = node("div", "logbook-card");
    entryCard.appendChild(node("h3", "", "Add New Entry"));
    var form = node("form", "logbook-form");
    var fields = node("div", "logbook-fields");

    var recDate = addField(fields, "REC. DATE *", "recDate", "date", { required: true });
    recDate.value = localDateValue();

    var customerName = addField(fields, "CUSTOMER NAME *", "customerName", "text", { required: true, placeholder: "Customer / company name" });
    var materialDetails = addField(fields, "MATERIAL DETAILS *", "materialDetails", "textarea", { required: true, placeholder: "Equipment, component and quantity", rows: 3 });
    var modelNumber = addField(fields, "MODEL NUMBER", "modelNumber", "text", { placeholder: "Model / part number" });
    var serialNumber = addField(fields, "SERIAL NUMBER", "serialNumber", "text", { placeholder: "Equipment serial number" });
    var quotationNumber = addField(fields, "QUOTATION NUMBER", "quotationNumber", "text", { placeholder: "Quotation reference" });
    var invoiceNumber = addField(fields, "INVOICE NUMBER", "invoiceNumber", "text", { placeholder: "Invoice reference" });
    var payment = addField(fields, "PAYMENT", "payment", "text", { placeholder: "e.g. Pending, Partial, Paid" });
    var paymentRecAmount = addField(fields, "PAYMENT REC. AMOUNT", "paymentRecAmount", "number", { min: 0, step: "0.01", placeholder: "Amount received" });
    var paymentRecDate = addField(fields, "PAYMENT REC. DATE", "paymentRecDate", "date", {});

    form.appendChild(fields);
    var formActions = node("div", "logbook-actions");
    var saveButton = node("button", "btn", "Save Log Book Entry");
    saveButton.type = "submit";
    var resetButton = node("button", "btn o", "Clear Form");
    resetButton.type = "reset";
    formActions.append(saveButton, resetButton);
    form.appendChild(formActions);
    var saveMessage = node("p", "logbook-message", "");
    form.appendChild(saveMessage);
    entryCard.appendChild(form);
    shell.appendChild(entryCard);

    var recordsCard = node("div", "logbook-card logbook-records-card");
    var recordsHeader = node("div", "logbook-records-header");
    recordsHeader.appendChild(node("h3", "", "Log Book Records"));
    var refreshButton = node("button", "btn o", "Refresh");
    refreshButton.type = "button";
    recordsHeader.appendChild(refreshButton);
    recordsCard.appendChild(recordsHeader);

    var search = node("input", "logbook-search");
    search.type = "search";
    search.placeholder = "Search customer, material, model, serial, quotation or invoice...";
    search.setAttribute("aria-label", "Search logbook records");
    recordsCard.appendChild(search);

    var listMessage = node("p", "logbook-message", "Loading entries...");
    recordsCard.appendChild(listMessage);
    var tableWrap = node("div", "logbook-table-wrap");
    var table = node("table", "logbook-table");
    var thead = node("thead", "");
    var headerRow = node("tr", "");
    COLUMNS.forEach(function (column) {
      headerRow.appendChild(node("th", "", column[0]));
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    var tbody = node("tbody", "");
    table.appendChild(tbody);
    tableWrap.appendChild(table);
    recordsCard.appendChild(tableWrap);
    shell.appendChild(recordsCard);
    container.appendChild(shell);

    var entries = [];

    function drawRows() {
      tbody.textContent = "";
      var term = search.value.trim().toLowerCase();
      var visibleEntries = entries.filter(function (entry) {
        if (!term) return true;
        return COLUMNS.some(function (column) {
          return String(entry[column[1]] == null ? "" : entry[column[1]]).toLowerCase().indexOf(term) !== -1;
        });
      });

      if (!visibleEntries.length) {
        var row = node("tr", "");
        var cell = node("td", "logbook-empty", entries.length ? "No records match your search." : "No Log Book records yet.");
        cell.colSpan = COLUMNS.length;
        row.appendChild(cell);
        tbody.appendChild(row);
        return;
      }

      visibleEntries.forEach(function (entry) {
        var row = node("tr", "");
        COLUMNS.forEach(function (column) {
          var value = entry[column[1]];
          if (column[1] === "payment_rec_amount" && value !== null && value !== undefined && value !== "") {
            value = Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          }
          row.appendChild(node("td", "", value === null || value === undefined || value === "" ? "—" : String(value)));
        });
        tbody.appendChild(row);
      });
    }

    function loadEntries() {
      listMessage.textContent = "Loading entries...";
      refreshButton.disabled = true;
      staffApi("/api/logbook", { method: "GET" })
        .then(function (data) {
          entries = Array.isArray(data) ? data : [];
          listMessage.textContent = entries.length + " record(s) loaded.";
          drawRows();
        })
        .catch(function (error) {
          console.error("UAAS Log Book load failed:", error);
          listMessage.textContent = error.message || "Could not load the Log Book. Check that the API is running and your account has staff access.";
          entries = [];
          drawRows();
        })
        .finally(function () {
          refreshButton.disabled = false;
        });
    }

    search.addEventListener("input", drawRows);
    refreshButton.addEventListener("click", loadEntries);
    resetButton.addEventListener("click", function () {
      saveMessage.textContent = "";
      window.setTimeout(function () { recDate.value = localDateValue(); }, 0);
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      saveMessage.textContent = "";

      var amountText = paymentRecAmount.value.trim();
      var amount = amountText === "" ? null : Number(amountText);
      if (amount !== null && (!Number.isFinite(amount) || amount < 0)) {
        saveMessage.textContent = "Payment received amount must be zero or greater.";
        return;
      }

      var payload = {
        recDate: recDate.value,
        customerName: customerName.value.trim(),
        materialDetails: materialDetails.value.trim(),
        modelNumber: modelNumber.value.trim() || null,
        serialNumber: serialNumber.value.trim() || null,
        quotationNumber: quotationNumber.value.trim() || null,
        invoiceNumber: invoiceNumber.value.trim() || null,
        payment: payment.value.trim() || null,
        paymentRecAmount: amount,
        paymentRecDate: paymentRecDate.value || null
      };

      saveButton.disabled = true;
      saveButton.textContent = "Saving...";
      staffApi("/api/logbook", {
        method: "POST",
        body: JSON.stringify(payload)
      })
        .then(function () {
          saveMessage.textContent = "Log Book entry saved successfully.";
          form.reset();
          recDate.value = localDateValue();
          loadEntries();
        })
        .catch(function (error) {
          console.error("UAAS Log Book save failed:", error);
          saveMessage.textContent = error.message || "Could not save the entry. Check that the API is running and your account has staff access.";
        })
        .finally(function () {
          saveButton.disabled = false;
          saveButton.textContent = "Save Log Book Entry";
        });
    });

    loadEntries();
  };
})();