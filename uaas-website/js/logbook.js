 /*UAAS Engineering Desk - Log Book add-on with edit/delete support */
(function () {
  "use strict";

  var COLUMNS = [
    ["REC. DATE", "rec_date"],
    ["MONTH", "month"],
    ["CUSTOMER NAME", "customer_name"],
    ["MATERIAL DETAILS", "material_details"],
    ["MODEL NUMBER", "model_number"],
    ["SERIAL NUMBER", "serial_number"],
    ["PART NUMBER", "part_number"],
    ["QUOTATION NUMBER", "quotation_number"],
    ["FAILURE ANALYSIS", "failure_analysis"],
    ["INVOICE NUMBER", "invoice_number"],
    ["PAYMENT", "payment"],
    ["PAYMENT REC. AMOUNT", "payment_rec_amount"],
    ["PAYMENT REC. DATE", "payment_rec_date"],
    ["COURIER COMPANY", "courier_company"],
    ["COURIER TRACKING / AWB NO.", "courier_tracking_number"],
    ["COURIER DISPATCH DATE", "courier_dispatch_date"],
    ["STATUS", "courier_status"]
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

  function loadSheetJs() {
    if (window.XLSX) return Promise.resolve(window.XLSX);
    return new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src = "https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js";
      script.async = true;
      script.onload = function () {
        if (window.XLSX) resolve(window.XLSX);
        else reject(new Error("The Excel library loaded but was not available."));
      };
      script.onerror = function () {
        reject(new Error("Could not load the Excel export library. Check your internet connection and try again."));
      };
      document.head.appendChild(script);
    });
  }

  function safeExcelText(value) {
    var textValue = value == null ? "" : String(value);
    // Avoid spreadsheet formula interpretation for text values supplied by users.
    if (/^[\s]*[=+@]/.test(textValue)) return "'" + textValue;
    if (/^[\s]*-/.test(textValue)) return "'" + textValue;
    return textValue;
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
    var modelNumber = addField(fields, "MODEL NUMBER", "modelNumber", "text", { placeholder: "Equipment model number" });
    var serialNumber = addField(fields, "SERIAL NUMBER", "serialNumber", "text", { placeholder: "Equipment serial number" });
    var partNumber = addField(fields, "PART NUMBER", "partNumber", "text", { placeholder: "Part number" });
    var quotationNumber = addField(fields, "QUOTATION NUMBER", "quotationNumber", "text", { placeholder: "Quotation reference" });
    var failureAnalysis = addField(fields, "FAILURE ANALYSIS", "failureAnalysis", "textarea", { placeholder: "Inspection findings / failure details", rows: 3 });
    var invoiceNumber = addField(fields, "INVOICE NUMBER", "invoiceNumber", "text", { placeholder: "Invoice reference" });
    var payment = addField(fields, "PAYMENT", "payment", "text", { placeholder: "e.g. Pending, Partial, Paid" });
    var paymentRecAmount = addField(fields, "PAYMENT REC. AMOUNT", "paymentRecAmount", "number", { min: 0, step: "0.01", placeholder: "Amount received" });
    var paymentRecDate = addField(fields, "PAYMENT REC. DATE", "paymentRecDate", "date", {});

    // Courier fields are intentionally placed at the end of the form.
    var courierCompany = addField(fields, "COURIER COMPANY", "courierCompany", "text", { placeholder: "Courier service name" });
    var courierTrackingNumber = addField(fields, "COURIER TRACKING / AWB NO.", "courierTrackingNumber", "text", { placeholder: "Tracking or AWB number" });
    var courierDispatchDate = addField(fields, "COURIER DISPATCH DATE", "courierDispatchDate", "date", {});
    var courierStatus = addField(fields, "STATUS", "courierStatus", "text", { placeholder: "e.g. Pending, Dispatched, Delivered" });

    form.appendChild(fields);
    var formActions = node("div", "logbook-actions");
    var saveButton = node("button", "btn", "Save Log Book Entry");
    saveButton.type = "submit";
    var resetButton = node("button", "btn o", "Clear Form");
    resetButton.type = "button";
    var cancelEditButton = node("button", "btn o logbook-cancel-edit", "Cancel Edit");
    cancelEditButton.type = "button";
    cancelEditButton.hidden = true;
    formActions.append(saveButton, resetButton, cancelEditButton);
    form.appendChild(formActions);
    var saveMessage = node("p", "logbook-message", "");
    form.appendChild(saveMessage);
    entryCard.appendChild(form);
    shell.appendChild(entryCard);

    var recordsCard = node("div", "logbook-card logbook-records-card");
    var recordsHeader = node("div", "logbook-records-header");
    recordsHeader.appendChild(node("h3", "", "Log Book Records"));
    var headerActions = node("div", "logbook-header-actions");
    headerActions.style.display = "flex";
    headerActions.style.alignItems = "center";
    headerActions.style.gap = ".65rem";
    headerActions.style.flexWrap = "wrap";
    var exportButton = node("button", "btn", "Download Excel");
    exportButton.type = "button";
    var refreshButton = node("button", "btn o", "Refresh");
    refreshButton.type = "button";
    headerActions.append(exportButton, refreshButton);
    recordsHeader.appendChild(headerActions);
    recordsCard.appendChild(recordsHeader);

    // Excel export date range. The selected REC. DATE boundaries are inclusive.
    var exportRange = node("div", "logbook-export-range");
    exportRange.style.display = "flex";
    exportRange.style.alignItems = "flex-end";
    exportRange.style.flexWrap = "wrap";
    exportRange.style.gap = "1rem";
    exportRange.style.margin = "1rem 0";
    exportRange.style.padding = ".9rem";
    exportRange.style.border = "1px solid var(--line, #263752)";
    exportRange.style.borderRadius = "4px";
    exportRange.style.background = "rgba(255,255,255,.02)";

    var exportFromDate = addField(exportRange, "FROM DATE (REC. DATE)", "exportFromDate", "date", {});
    var exportToDate = addField(exportRange, "TO DATE (REC. DATE)", "exportToDate", "date", {});
    [exportFromDate, exportToDate].forEach(function (input) {
      input.style.minWidth = "190px";
      input.style.padding = ".7rem";
    });
    exportRange.querySelectorAll(".logbook-field").forEach(function (field) {
      field.style.flex = "1 1 190px";
      field.style.maxWidth = "260px";
    });
    var exportRangeHint = node("p", "logbook-message", "Excel downloads only records whose REC. DATE falls between these dates, including both selected dates.");
    exportRangeHint.style.flex = "1 1 100%";
    exportRangeHint.style.margin = "0";
    exportRange.appendChild(exportRangeHint);
    recordsCard.appendChild(exportRange);

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
    headerRow.appendChild(node("th", "logbook-action-heading", "ACTIONS"));
    thead.appendChild(headerRow);
    table.appendChild(thead);
    var tbody = node("tbody", "");
    table.appendChild(tbody);
    tableWrap.appendChild(table);
    recordsCard.appendChild(tableWrap);
    shell.appendChild(recordsCard);
    container.appendChild(shell);

    var entries = [];
    var editingEntryId = null;

    function clearEditor(message) {
      editingEntryId = null;
      form.reset();
      recDate.value = localDateValue();
      saveButton.textContent = "Save Log Book Entry";
      cancelEditButton.hidden = true;
      saveMessage.textContent = message || "";
    }

    function beginEdit(entry) {
      if (!entry || !entry.id) {
        alert("This record has no ID and cannot be edited.");
        return;
      }

      editingEntryId = entry.id;
      recDate.value = entry.rec_date || localDateValue();
      customerName.value = entry.customer_name || "";
      materialDetails.value = entry.material_details || "";
      modelNumber.value = entry.model_number || "";
      serialNumber.value = entry.serial_number || "";
      partNumber.value = entry.part_number || "";
      quotationNumber.value = entry.quotation_number || "";
      failureAnalysis.value = entry.failure_analysis || "";
      invoiceNumber.value = entry.invoice_number || "";
      payment.value = entry.payment || "";
      paymentRecAmount.value = entry.payment_rec_amount == null ? "" : String(entry.payment_rec_amount);
      paymentRecDate.value = entry.payment_rec_date || "";
      courierCompany.value = entry.courier_company || "";
      courierTrackingNumber.value = entry.courier_tracking_number || "";
      courierDispatchDate.value = entry.courier_dispatch_date || "";
      courierStatus.value = entry.courier_status || "";

      saveButton.textContent = "Save Changes";
      cancelEditButton.hidden = false;
      saveMessage.textContent = "Editing record. Save Changes to update it, or choose Cancel Edit.";
      entryCard.scrollIntoView({ behavior: "smooth", block: "start" });
    }

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
        var emptyRow = node("tr", "");
        var emptyCell = node("td", "logbook-empty", entries.length ? "No records match your search." : "No Log Book records yet.");
        emptyCell.colSpan = COLUMNS.length + 1;
        emptyRow.appendChild(emptyCell);
        tbody.appendChild(emptyRow);
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

        var actionCell = node("td", "logbook-action-cell");
        var editButton = node("button", "btn o logbook-edit-btn", "Edit");
        editButton.type = "button";
        editButton.addEventListener("click", function () {
          beginEdit(entry);
        });

        var deleteButton = node("button", "btn o logbook-delete-btn", "Delete");
        deleteButton.type = "button";
        deleteButton.addEventListener("click", function () {
          if (!entry.id) {
            alert("This record has no ID and cannot be deleted.");
            return;
          }

          var confirmed = window.confirm(
            "Permanently delete this Log Book record for '" +
            (entry.customer_name || "unnamed customer") +
            "'? This action cannot be undone."
          );
          if (!confirmed) return;

          deleteButton.disabled = true;
          deleteButton.textContent = "Deleting...";
          editButton.disabled = true;

          staffApi("/api/logbook/" + encodeURIComponent(entry.id), { method: "DELETE" })
            .then(function () {
              entries = entries.filter(function (item) {
                return item.id !== entry.id;
              });
              if (editingEntryId === entry.id) clearEditor("The record being edited was deleted.");
              listMessage.textContent = "Record deleted successfully. " + entries.length + " record(s) loaded.";
              drawRows();
            })
            .catch(function (error) {
              console.error("Log Book deletion failed:", error);
              alert(error.message || "Could not delete the record. Please try again.");
              deleteButton.disabled = false;
              deleteButton.textContent = "Delete";
              editButton.disabled = false;
            });
        });

        actionCell.append(editButton, deleteButton);
        row.appendChild(actionCell);
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

    exportButton.addEventListener("click", function () {
      if (!entries.length) {
        listMessage.textContent = "There are no Log Book records to export.";
        return;
      }

      var fromDateValue = exportFromDate.value;
      var toDateValue = exportToDate.value;
      if (!fromDateValue || !toDateValue) {
        listMessage.textContent = "Please select both From Date and To Date for the Excel export.";
        return;
      }
      if (fromDateValue > toDateValue) {
        listMessage.textContent = "From Date cannot be later than To Date.";
        return;
      }

      // ISO yyyy-mm-dd strings sort chronologically; both endpoints are included.
      var exportEntries = entries.filter(function (entry) {
        var receivedDate = String(entry.rec_date || "").slice(0, 10);
        return receivedDate && receivedDate >= fromDateValue && receivedDate <= toDateValue;
      });

      if (!exportEntries.length) {
        listMessage.textContent = "No records found for REC. DATE from " + fromDateValue + " to " + toDateValue + ".";
        return;
      }

      exportButton.disabled = true;
      var originalText = exportButton.textContent;
      exportButton.textContent = "Preparing Excel...";

      loadSheetJs().then(function (XLSX) {
        var rows = [COLUMNS.map(function (column) { return column[0]; })];
        exportEntries.forEach(function (entry) {
          rows.push(COLUMNS.map(function (column) {
            var value = entry[column[1]];
            if (column[1] === "payment_rec_amount" && value !== null && value !== undefined && value !== "") {
              var numberValue = Number(value);
              return Number.isFinite(numberValue) ? numberValue : safeExcelText(value);
            }
            return safeExcelText(value);
          }));
        });

        var worksheet = XLSX.utils.aoa_to_sheet(rows);
        worksheet["!cols"] = COLUMNS.map(function (column, index) {
          var maxLength = column[0].length;
          rows.slice(1).forEach(function (row) {
            maxLength = Math.max(maxLength, String(row[index] == null ? "" : row[index]).length);
          });
          return { wch: Math.min(Math.max(maxLength + 2, 12), 36) };
        });
        worksheet["!autofilter"] = { ref: worksheet["!ref"] };

        var workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Log Book");
        XLSX.writeFile(
          workbook,
          "UAAS_Log_Book_" + fromDateValue + "_to_" + toDateValue + ".xlsx"
        );
        listMessage.textContent = "Excel file downloaded with " + exportEntries.length +
          " record(s) for REC. DATE from " + fromDateValue + " to " + toDateValue + ".";
      }).catch(function (error) {
        console.error("UAAS Log Book Excel export failed:", error);
        listMessage.textContent = error.message || "Could not export the Excel file.";
      }).finally(function () {
        exportButton.disabled = false;
        exportButton.textContent = originalText;
      });
    });

    search.addEventListener("input", drawRows);
    refreshButton.addEventListener("click", loadEntries);
    resetButton.addEventListener("click", function () {
      clearEditor("");
    });
    cancelEditButton.addEventListener("click", function () {
      clearEditor("Edit cancelled.");
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
        partNumber: partNumber.value.trim() || null,
        quotationNumber: quotationNumber.value.trim() || null,
        failureAnalysis: failureAnalysis.value.trim() || null,
        invoiceNumber: invoiceNumber.value.trim() || null,
        payment: payment.value.trim() || null,
        paymentRecAmount: amount,
        paymentRecDate: paymentRecDate.value || null,
        courierCompany: courierCompany.value.trim() || null,
        courierTrackingNumber: courierTrackingNumber.value.trim() || null,
        courierDispatchDate: courierDispatchDate.value || null,
        courierStatus: courierStatus.value.trim() || null
      };

      if (!payload.customerName || !payload.materialDetails) {
        saveMessage.textContent = "Customer name and material details are required.";
        return;
      }

      var idBeingEdited = editingEntryId;
      var isEditing = Boolean(idBeingEdited);
      saveButton.disabled = true;
      resetButton.disabled = true;
      cancelEditButton.disabled = true;
      saveButton.textContent = isEditing ? "Saving Changes..." : "Saving...";

      var endpoint = isEditing
        ? "/api/logbook/" + encodeURIComponent(idBeingEdited)
        : "/api/logbook";
      var method = isEditing ? "PUT" : "POST";

      staffApi(endpoint, {
        method: method,
        body: JSON.stringify(payload)
      })
        .then(function () {
          clearEditor(isEditing ? "Log Book entry updated successfully." : "Log Book entry saved successfully.");
          loadEntries();
        })
        .catch(function (error) {
          console.error(isEditing ? "UAAS Log Book update failed:" : "UAAS Log Book save failed:", error);
          saveMessage.textContent = error.message || (isEditing ? "Could not update the entry." : "Could not save the entry.") + " Check that the API is running and your account has staff access.";
        })
        .finally(function () {
          saveButton.disabled = false;
          resetButton.disabled = false;
          cancelEditButton.disabled = false;
          saveButton.textContent = editingEntryId ? "Save Changes" : "Save Log Book Entry";
        });
    });

    loadEntries();
  };
})();